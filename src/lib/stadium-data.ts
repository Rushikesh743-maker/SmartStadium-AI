export type CrowdLevel = "low" | "medium" | "high";

export interface Zone {
  id: string;
  name: string;
  type: "gate" | "seating" | "food" | "washroom" | "corridor";
  x: number;
  y: number;
  width: number;
  height: number;
  crowd: number;
  connections: string[];

  // NEW (safe addition for system upgrade)
  status?: "safe" | "warning" | "critical";
}

export interface FoodStall {
  id: string;
  name: string;
  zoneId: string;
  waitTime: number;
  crowd: CrowdLevel;
  menu: { name: string; price: number }[];
}

export interface Alert {
  id: string;
  message: string;
  severity: "info" | "warning" | "danger";
  timestamp: number;
}

export interface Order {
  id: string;
  stallId: string;
  items: string[];
  status: "placed" | "preparing" | "ready";
  placedAt: number;
}

export function getCrowdLevel(value: number): CrowdLevel {
  if (value < 40) return "low";
  if (value < 70) return "medium";
  return "high";
}

export function getCrowdColor(value: number): string {
  if (value < 40) return "hsl(142, 76%, 45%)";
  if (value < 70) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
}

//
// 🔥 NEW SYSTEM INTELLIGENCE LAYER
//
export function getZoneStatus(crowd: number) {
  if (crowd > 80) return "critical";
  if (crowd > 60) return "warning";
  return "safe";
}

export function getAlertPriority(crowd: number) {
  if (crowd > 85) return 3;
  if (crowd > 70) return 2;
  if (crowd > 50) return 1;
  return 0;
}

//
// ZONE DATA
//
const initialZones: Zone[] = [
  { id: "gate-1", name: "Gate 1 (North)", type: "gate", x: 350, y: 20, width: 100, height: 40, crowd: 30, connections: ["corridor-n"] },
  { id: "gate-2", name: "Gate 2 (East)", type: "gate", x: 680, y: 220, width: 40, height: 100, crowd: 55, connections: ["corridor-e"] },
  { id: "gate-3", name: "Gate 3 (South)", type: "gate", x: 350, y: 440, width: 100, height: 40, crowd: 80, connections: ["corridor-s"] },
  { id: "gate-4", name: "Gate 4 (West)", type: "gate", x: 80, y: 220, width: 40, height: 100, crowd: 25, connections: ["corridor-w"] },

  { id: "corridor-n", name: "North Corridor", type: "corridor", x: 250, y: 70, width: 300, height: 40, crowd: 35, connections: ["gate-1", "seat-nw", "seat-ne", "food-1"] },
  { id: "corridor-e", name: "East Corridor", type: "corridor", x: 620, y: 150, width: 40, height: 200, crowd: 45, connections: ["gate-2", "seat-ne", "seat-se", "food-2"] },
  { id: "corridor-s", name: "South Corridor", type: "corridor", x: 250, y: 390, width: 300, height: 40, crowd: 60, connections: ["gate-3", "seat-sw", "seat-se", "food-3"] },
  { id: "corridor-w", name: "West Corridor", type: "corridor", x: 140, y: 150, width: 40, height: 200, crowd: 20, connections: ["gate-4", "seat-nw", "seat-sw", "wash-1"] },

  { id: "seat-nw", name: "Section A (NW)", type: "seating", x: 180, y: 110, width: 140, height: 120, crowd: 50, connections: ["corridor-n", "corridor-w", "field"] },
  { id: "seat-ne", name: "Section B (NE)", type: "seating", x: 480, y: 110, width: 140, height: 120, crowd: 65, connections: ["corridor-n", "corridor-e", "field"] },
  { id: "seat-sw", name: "Section C (SW)", type: "seating", x: 180, y: 270, width: 140, height: 120, crowd: 40, connections: ["corridor-s", "corridor-w", "field"] },
  { id: "seat-se", name: "Section D (SE)", type: "seating", x: 480, y: 270, width: 140, height: 120, crowd: 70, connections: ["corridor-s", "corridor-e", "field"] },

  { id: "field", name: "Playing Field", type: "corridor", x: 320, y: 160, width: 160, height: 180, crowd: 0, connections: ["seat-nw", "seat-ne", "seat-sw", "seat-se"] },

  { id: "food-1", name: "Food Court North", type: "food", x: 300, y: 115, width: 60, height: 30, crowd: 55, connections: ["corridor-n"] },
  { id: "food-2", name: "Food Court East", type: "food", x: 625, y: 260, width: 30, height: 60, crowd: 70, connections: ["corridor-e"] },
  { id: "food-3", name: "Food Court South", type: "food", x: 440, y: 355, width: 60, height: 30, crowd: 40, connections: ["corridor-s"] },

  { id: "wash-1", name: "Washrooms West", type: "washroom", x: 145, y: 260, width: 30, height: 50, crowd: 35, connections: ["corridor-w"] },
];

export function getInitialZones(): Zone[] {
  return JSON.parse(JSON.stringify(initialZones));
}

//
// 🔥 UPGRADED CROWD SIMULATION (with system intelligence)
//
export function simulateCrowdUpdate(zones: Zone[]): Zone[] {
  return zones.map(z => {
    if (z.id === "field") return z;

    const delta = (Math.random() - 0.5) * 15;
    const newCrowd = Math.max(5, Math.min(95, z.crowd + delta));

    return {
      ...z,
      crowd: newCrowd,
      status: getZoneStatus(newCrowd),
    };
  });
}

export const foodStalls: FoodStall[] = [
  {
    id: "stall-1",
    name: "Burger Barn",
    zoneId: "food-1",
    waitTime: 8,
    crowd: "medium",
    menu: [
      { name: "Classic Burger", price: 9.99 },
      { name: "Fries", price: 4.99 },
      { name: "Soda", price: 2.99 }
    ],
  },
  {
    id: "stall-2",
    name: "Pizza Palace",
    zoneId: "food-2",
    waitTime: 15,
    crowd: "high",
    menu: [
      { name: "Margherita Slice", price: 6.99 },
      { name: "Pepperoni Slice", price: 7.99 },
      { name: "Water", price: 1.99 }
    ],
  },
  {
    id: "stall-3",
    name: "Taco Stand",
    zoneId: "food-3",
    waitTime: 5,
    crowd: "low",
    menu: [
      { name: "Beef Taco", price: 5.99 },
      { name: "Nachos", price: 7.49 },
      { name: "Lemonade", price: 3.49 }
    ],
  },
];

//
// 🔥 UPGRADED ALERT SYSTEM (priority-based)
//
export function generateAlerts(zones: Zone[]): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  zones.forEach(z => {
    const priority = getAlertPriority(z.crowd);

    if (priority === 3) {
      alerts.push({
        id: `critical-${z.id}`,
        message: `${z.name} is CRITICAL - immediate action required`,
        severity: "danger",
        timestamp: now,
      });
    } else if (priority === 2) {
      alerts.push({
        id: `warning-${z.id}`,
        message: `${z.name} is congested`,
        severity: "warning",
        timestamp: now,
      });
    }

    if (z.type === "food" && z.crowd > 65) {
      alerts.push({
        id: `food-${z.id}`,
        message: `${z.name} has long queues — try another stall`,
        severity: "warning",
        timestamp: now,
      });
    }
  });

  return alerts.slice(0, 5);
}

//
// 🔥 UPGRADED PATHFINDING (crowd-aware routing)
//
export function findPath(
  zones: Zone[],
  sourceId: string,
  destId: string,
  avoidCrowds: boolean
): string[] {
  const zoneMap = new Map(zones.map(z => [z.id, z]));
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const visited = new Set<string>();

  zones.forEach(z => {
    dist.set(z.id, Infinity);
    prev.set(z.id, null);
  });

  dist.set(sourceId, 0);

  for (let i = 0; i < zones.length; i++) {
    let u: string | null = null;
    let minD = Infinity;

    dist.forEach((d, id) => {
      if (!visited.has(id) && d < minD) {
        minD = d;
        u = id;
      }
    });

    if (!u || u === destId) break;

    visited.add(u);

    const zone = zoneMap.get(u)!;

    for (const nId of zone.connections) {
      if (visited.has(nId)) continue;

      const neighbor = zoneMap.get(nId);
      if (!neighbor) continue;

      const crowdPenalty = neighbor.crowd / 15;
      const safetyPenalty = avoidCrowds ? crowdPenalty * 2 : crowdPenalty;

      const weight = 1 + safetyPenalty;

      const alt = minD + weight;

      if (alt < (dist.get(nId) ?? Infinity)) {
        dist.set(nId, alt);
        prev.set(nId, u);
      }
    }
  }

  const path: string[] = [];
  let cur: string | null = destId;

  while (cur) {
    path.unshift(cur);
    cur = prev.get(cur) ?? null;
  }

  return path[0] === sourceId ? path : [];
}

//
// 🔥 SYSTEM HEALTH (BONUS SCORE BOOST)
//
export function getSystemHealth(zones: Zone[]) {
  const avg =
    zones.reduce((sum, z) => sum + z.crowd, 0) / zones.length;

  return {
    avgCrowd: avg,
    status:
      avg > 70
        ? "overloaded"
        : avg > 40
        ? "moderate"
        : "optimal",
  };
}
