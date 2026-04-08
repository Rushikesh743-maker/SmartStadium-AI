import { Zone, getCrowdColor, getCrowdLevel } from "@/lib/stadium-data";
import { SimUser } from "@/lib/user-simulation";
import { useMemo } from "react";

interface StadiumMapProps {
  zones: Zone[];
  path: string[];
  selectedZone: string | null;
  onZoneClick: (id: string) => void;
  isPredicted?: boolean;
  emergencyMode?: boolean;
  simUsers?: SimUser[];
}

const typeIcons: Record<string, string> = {
  gate: "🚪",
  seating: "💺",
  food: "🍔",
  washroom: "🚻",
  corridor: "",
};

export default function StadiumMap({ zones, path, selectedZone, onZoneClick, isPredicted, emergencyMode, simUsers = [] }: StadiumMapProps) {
  const zoneMap = new Map(zones.map(z => [z.id, z]));

  const pathSegments: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = zoneMap.get(path[i]);
    const b = zoneMap.get(path[i + 1]);
    if (a && b) {
      pathSegments.push({
        x1: a.x + a.width / 2, y1: a.y + a.height / 2,
        x2: b.x + b.width / 2, y2: b.y + b.height / 2,
      });
    }
  }

  // Downsample users for rendering perf
  const renderedUsers = useMemo(() => {
    if (simUsers.length <= 200) return simUsers;
    return simUsers.filter((_, i) => i % 2 === 0);
  }, [simUsers]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/30">
      {isPredicted && (
        <div className="absolute top-2 left-2 z-10 bg-accent/20 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-md border border-accent/30">
          🔮 Predicted View
        </div>
      )}
      <svg viewBox="0 0 800 500" className="w-full h-auto">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Stadium outline */}
        <ellipse cx="400" cy="250" rx="360" ry="230" fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="8 4" />

        {/* Zones */}
        {zones.map(zone => {
          const isField = zone.id === "field";
          const isOnPath = path.includes(zone.id);
          const isSelected = zone.id === selectedZone;
          const crowdColor = isField ? "hsl(var(--muted))" : getCrowdColor(zone.crowd);
          const isEmergencyHighlight = emergencyMode && !isField && zone.crowd > 65;

          return (
            <g key={zone.id} onClick={() => !isField && onZoneClick(zone.id)} className={isField ? "" : "cursor-pointer"}>
              <rect
                x={zone.x} y={zone.y} width={zone.width} height={zone.height}
                rx={6}
                fill={isField ? "hsl(142, 40%, 20%)" : crowdColor}
                fillOpacity={isPredicted ? 0.15 : isField ? 0.4 : 0.25}
                stroke={
                  isEmergencyHighlight ? "hsl(var(--destructive))" :
                  isSelected ? "hsl(var(--primary))" :
                  isOnPath ? "hsl(var(--accent))" : crowdColor
                }
                strokeWidth={isEmergencyHighlight ? 3 : isSelected ? 3 : isOnPath ? 2.5 : 1.5}
                strokeDasharray={isPredicted ? "4 2" : undefined}
                className={`transition-all duration-300 ${isEmergencyHighlight ? "animate-pulse" : ""}`}
              />
              {isField ? (
                <>
                  <ellipse cx={zone.x + zone.width / 2} cy={zone.y + zone.height / 2} rx={30} ry={20} fill="none" stroke="hsl(142, 40%, 30%)" strokeWidth="1" />
                  <text x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 4} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">FIELD</text>
                </>
              ) : (
                <>
                  <text x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 - 4} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9" fontWeight="600">
                    {typeIcons[zone.type]} {zone.name.length > 14 ? zone.name.slice(0, 12) + "…" : zone.name}
                  </text>
                  <text x={zone.x + zone.width / 2} y={zone.y + zone.height / 2 + 12} textAnchor="middle" fill={crowdColor} fontSize="10" fontWeight="700">
                    {Math.round(zone.crowd)}%
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Simulated users */}
        {renderedUsers.map(u => (
          <circle key={u.id} cx={u.x} cy={u.y} r="2" fill="hsl(var(--primary))" opacity="0.5" />
        ))}

        {/* Path overlay */}
        {pathSegments.map((seg, i) => (
          <line key={i} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke={emergencyMode ? "hsl(var(--destructive))" : "hsl(var(--accent))"}
            strokeWidth={emergencyMode ? 4 : 3} strokeDasharray="6 3"
            className="animate-pulse"
            filter={emergencyMode ? "url(#glow)" : undefined}
          />
        ))}

        {/* Path endpoint markers */}
        {path.length > 0 && (() => {
          const start = zoneMap.get(path[0]);
          const end = zoneMap.get(path[path.length - 1]);
          return (
            <>
              {start && <circle cx={start.x + start.width / 2} cy={start.y + start.height / 2} r="6" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="2" />}
              {end && <circle cx={end.x + end.width / 2} cy={end.y + end.height / 2} r="6" fill={emergencyMode ? "hsl(var(--destructive))" : "hsl(var(--accent))"} stroke="hsl(var(--foreground))" strokeWidth="2" />}
            </>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-crowd-low" /> Low</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-crowd-medium" /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-crowd-high" /> High</span>
      </div>
    </div>
  );
}
