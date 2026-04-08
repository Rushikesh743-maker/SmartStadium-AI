import { useState, useEffect, useCallback, useRef } from "react";
import {
  Zone, Order, Alert, FoodStall,
  getInitialZones, simulateCrowdUpdate, foodStalls as initialFoodStalls,
  generateAlerts, findPath, getCrowdLevel,
} from "@/lib/stadium-data";
import { recordCrowdSnapshot, predictCrowd } from "@/lib/crowd-prediction";
import { SimUser, createSimUsers, moveUsers, computeUserDensity } from "@/lib/user-simulation";
import StadiumMap from "@/components/StadiumMap";
import NavigationPanel from "@/components/NavigationPanel";
import FoodOrderPanel from "@/components/FoodOrderPanel";
import AlertsPanel from "@/components/AlertsPanel";
import DashboardHeader from "@/components/DashboardHeader";
import VoiceAssistant from "@/components/VoiceAssistant";
import PersonalizationPanel, { UserPreference } from "@/components/PersonalizationPanel";
import EmergencyBanner from "@/components/EmergencyBanner";
import { Lightbulb, Eye, EyeOff, Users } from "lucide-react";

export default function Index() {
  const [zones, setZones] = useState<Zone[]>(getInitialZones);
  const [path, setPath] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stalls, setStalls] = useState<FoodStall[]>(initialFoodStalls);
  const [tick, setTick] = useState(0);

  // New states
  const [showPredicted, setShowPredicted] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [preference, setPreference] = useState<UserPreference>("avoid-crowds");
  const [simUsers, setSimUsers] = useState<SimUser[]>([]);
  const [showUsers, setShowUsers] = useState(true);
  const zonesRef = useRef(zones);
  zonesRef.current = zones;

  // Initialize sim users once
  useEffect(() => {
    setSimUsers(createSimUsers(getInitialZones(), 150));
  }, []);

  // Move users every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setSimUsers(prev => moveUsers(prev, zonesRef.current));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Crowd updates every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => {
        const updated = simulateCrowdUpdate(prev);

        // Blend in user density
        const density = computeUserDensity(simUsers, updated);
        const blended = updated.map(z => {
          const userCount = density.get(z.id) || 0;
          const userInfluence = Math.min(20, userCount * 0.5);
          return { ...z, crowd: Math.max(5, Math.min(95, z.crowd + userInfluence * 0.3)) };
        });

        recordCrowdSnapshot(blended);
        setAlerts(generateAlerts(blended));
        setStalls(s => s.map(stall => {
          const zone = blended.find(z => z.id === stall.zoneId);
          return zone ? { ...stall, crowd: getCrowdLevel(zone.crowd), waitTime: Math.max(2, Math.round(zone.crowd / 8)) } : stall;
        }));
        return blended;
      });
      setTick(t => t + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, [simUsers]);

  // Order status progression
  useEffect(() => {
    if (orders.length === 0) return;
    const timeout = setTimeout(() => {
      setOrders(prev => prev.map(o => {
        if (o.status === "placed") return { ...o, status: "preparing" };
        if (o.status === "preparing") return { ...o, status: "ready" };
        return o;
      }));
    }, 8000);
    return () => clearTimeout(timeout);
  }, [orders, tick]);

  // Emergency mode auto-path
  useEffect(() => {
    if (!emergencyMode) return;
    // Find safest exit from current location
    const currentZone = "seat-nw";
    const gates = zones.filter(z => z.type === "gate");
    const safest = [...gates].sort((a, b) => a.crowd - b.crowd)[0];
    if (safest) {
      const safePath = findPath(zones, currentZone, safest.id, true);
      setPath(safePath);
    }
  }, [emergencyMode, zones]);

  const placeOrder = useCallback((stallId: string, items: string[]) => {
    const order: Order = {
      id: `order-${Date.now()}`, stallId, items, status: "placed", placedAt: Date.now(),
    };
    setOrders(prev => [order, ...prev]);
  }, []);

  // Voice command handler
  const handleVoiceCommand = useCallback((cmd: string) => {
    if (cmd.includes("least crowded gate") || cmd.includes("safest gate")) {
      const gate = [...zones].filter(z => z.type === "gate").sort((a, b) => a.crowd - b.crowd)[0];
      if (gate) {
        const p = findPath(zones, "seat-nw", gate.id, true);
        setPath(p);
      }
    } else if (cmd.includes("fastest food") || cmd.includes("quick food")) {
      const stall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];
      if (stall) {
        const p = findPath(zones, "seat-nw", stall.zoneId, false);
        setPath(p);
      }
    } else if (cmd.includes("exit") || cmd.includes("navigate to exit")) {
      const gate = [...zones].filter(z => z.type === "gate").sort((a, b) => a.crowd - b.crowd)[0];
      if (gate) {
        const p = findPath(zones, "seat-nw", gate.id, true);
        setPath(p);
      }
    }
  }, [zones, stalls]);

  const currentLocation = zones.find(z => z.id === "seat-nw")?.name ?? "Section A (NW)";

  const displayZones = showPredicted ? predictCrowd(zones) : zones;

  // Smart recommendations based on preference
  const leastCrowdedGate = [...zones].filter(z => z.type === "gate").sort((a, b) => a.crowd - b.crowd)[0];
  const leastCrowdedStall = [...stalls].sort((a, b) => a.waitTime - b.waitTime)[0];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <DashboardHeader
          currentLocation={currentLocation}
          isLive={true}
          emergencyMode={emergencyMode}
          onToggleEmergency={() => {
            setEmergencyMode(prev => {
              if (prev) setPath([]);
              return !prev;
            });
          }}
        />

        {emergencyMode && <EmergencyBanner />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-8 mt-2">
          {/* Main map area */}
          <div className="lg:col-span-2 space-y-3">
            {/* Map controls bar */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPredicted(p => !p)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors border ${
                  showPredicted
                    ? "bg-accent/20 text-accent border-accent/30"
                    : "bg-muted text-muted-foreground border-border hover:bg-secondary"
                }`}
              >
                {showPredicted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPredicted ? "Predicted View" : "Current View"}
              </button>
              <button
                onClick={() => setShowUsers(u => !u)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors border ${
                  showUsers
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground border-border hover:bg-secondary"
                }`}
              >
                <Users className="w-3 h-3" />
                {simUsers.length} Users {showUsers ? "ON" : "OFF"}
              </button>
            </div>

            <StadiumMap
              zones={displayZones}
              path={path}
              selectedZone={selectedZone}
              onZoneClick={setSelectedZone}
              isPredicted={showPredicted}
              emergencyMode={emergencyMode}
              simUsers={showUsers ? simUsers : []}
            />

            {/* Recommendations bar */}
            <div className="glass rounded-lg p-3 flex flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-primary font-medium">
                <Lightbulb className="w-3.5 h-3.5" /> Recommendations
              </span>
              {leastCrowdedGate && (
                <span className="bg-success/10 text-success px-2 py-1 rounded-md">
                  Best gate: {leastCrowdedGate.name} ({Math.round(leastCrowdedGate.crowd)}%)
                </span>
              )}
              {leastCrowdedStall && (
                <span className="bg-success/10 text-success px-2 py-1 rounded-md">
                  Fastest food: {leastCrowdedStall.name} (~{leastCrowdedStall.waitTime} min)
                </span>
              )}
              {preference === "avoid-crowds" && (
                <span className="bg-accent/10 text-accent px-2 py-1 rounded-md">
                  Mode: Avoiding crowds
                </span>
              )}
            </div>
          </div>

          {/* Sidebar panels */}
          <div className="space-y-3">
            <PersonalizationPanel preference={preference} onChange={setPreference} />
            <VoiceAssistant onCommand={handleVoiceCommand} />
            <NavigationPanel zones={zones} onPathChange={setPath} />
            <FoodOrderPanel stalls={stalls} orders={orders} onPlaceOrder={placeOrder} />
            <AlertsPanel alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}
