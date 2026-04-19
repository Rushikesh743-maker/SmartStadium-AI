import { MapPin, Wifi, Sun, Moon, ShieldAlert } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface DashboardHeaderProps {
  currentLocation: string;
  isLive: boolean;
  emergencyMode: boolean;
  onToggleEmergency: () => void;
}

export default function DashboardHeader({
  currentLocation,
  isLive,
  emergencyMode,
  onToggleEmergency
}: DashboardHeaderProps) {

  const { theme, toggle } = useTheme();

  // 🔥 NEW: system health state
  const [systemStatus, setSystemStatus] = useState<"optimal" | "moderate" | "overloaded">("optimal");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "zones"), (snap) => {
      const zones = snap.docs.map(d => d.data() as any);

      const avg =
        zones.reduce((sum, z) => sum + (z.crowdLevel || z.crowd || 0), 0) /
        (zones.length || 1);

      if (avg > 70) setSystemStatus("overloaded");
      else if (avg > 40) setSystemStatus("moderate");
      else setSystemStatus("optimal");
    });

    return () => unsub();
  }, []);

  return (
    <header className="flex items-center justify-between py-4 px-1">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-gradient">SmartStadium</span>{" "}
          <span className="text-foreground font-light">AI</span>
        </h1>

        <p className="text-xs text-muted-foreground mt-0.5">
          Intelligent venue experience
        </p>

        {/* 🧠 NEW: system intelligence badge */}
        <p className="text-[10px] mt-1">
          System Status:{" "}
          <span
            className={
              systemStatus === "optimal"
                ? "text-green-500"
                : systemStatus === "moderate"
                ? "text-yellow-500"
                : "text-red-500"
            }
          >
            {systemStatus.toUpperCase()}
          </span>
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{currentLocation}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Wifi className={`w-3.5 h-3.5 ${isLive ? "text-green-500" : "text-red-500"}`} />
          <span className={isLive ? "text-green-500" : "text-red-500"}>
            {isLive ? "Live" : "Offline"}
          </span>
        </div>

        {/* Emergency */}
        <Button
          size="sm"
          variant={emergencyMode ? "destructive" : "outline"}
          className="text-xs h-7 px-2"
          onClick={onToggleEmergency}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {emergencyMode ? "Exit Emergency" : "Emergency"}
        </Button>

        {/* Theme */}
        <button
          onClick={toggle}
          className="p-1.5 rounded-md border border-border bg-muted hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-400" />
          )}
        </button>
      </div>
    </header>
  );
}
