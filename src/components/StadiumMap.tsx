import {
  Zone,
  getCrowdColor,
  getZoneStatus,
} from "@/lib/stadium-data";
import { SimUser } from "@/lib/user-simulation";
import { useMemo, useCallback } from "react";

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

export default function StadiumMap({
  zones,
  path,
  selectedZone,
  onZoneClick,
  isPredicted,
  emergencyMode,
  simUsers = [],
}: StadiumMapProps) {
  const zoneMap = useMemo(
    () => new Map(zones.map((z) => [z.id, z])),
    [zones]
  );

  const pathSegments = useMemo(() => {
    const segments: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }[] = [];

    for (let i = 0; i < path.length - 1; i++) {
      const a = zoneMap.get(path[i]);
      const b = zoneMap.get(path[i + 1]);

      if (a && b) {
        segments.push({
          x1: a.x + a.width / 2,
          y1: a.y + a.height / 2,
          x2: b.x + b.width / 2,
          y2: b.y + b.height / 2,
        });
      }
    }

    return segments;
  }, [path, zoneMap]);

  const renderedUsers = useMemo(() => {
    if (simUsers.length <= 150) return simUsers;
    return simUsers.filter((_, i) => i % 3 === 0);
  }, [simUsers]);

  // ♿ accessibility-safe click handler
  const handleZoneSelect = useCallback(
    (zoneId: string, isField: boolean) => {
      if (!isField) onZoneClick(zoneId);
    },
    [onZoneClick]
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-border bg-muted/30"
      role="application"
      aria-label="Stadium crowd navigation map"
    >
      {/* LIVE INDICATOR */}
      <div className="absolute top-2 right-2 z-10 text-xs bg-black/50 px-2 py-1 rounded text-white">
        🔴 LIVE Stadium System
      </div>

      {isPredicted && (
        <div className="absolute top-2 left-2 z-10 bg-accent/20 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-md border border-accent/30">
          🔮 Predicted View
        </div>
      )}

      <svg
        viewBox="0 0 800 500"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive stadium zone map"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stadium outline */}
        <ellipse
          cx="400"
          cy="250"
          rx="360"
          ry="230"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="8 4"
        />

        {/* Zones */}
        {zones.map((zone) => {
          const isField = zone.id === "field";
          const isOnPath = path.includes(zone.id);
          const isSelected = zone.id === selectedZone;
          const status = getZoneStatus(zone.crowd);

          const crowdColor = isField
            ? "hsl(var(--muted))"
            : getCrowdColor(zone.crowd);

          const isEmergency = emergencyMode && zone.crowd > 65;

          return (
            <g
              key={zone.id}
              tabIndex={isField ? -1 : 0}
              role="button"
              aria-label={zone.ariaLabel || zone.name}
              onClick={() => handleZoneSelect(zone.id, isField)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleZoneSelect(zone.id, isField);
                }
              }}
              className={isField ? "" : "cursor-pointer focus:outline-none"}
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx={6}
                fill={isField ? "hsl(142, 40%, 20%)" : crowdColor}
                fillOpacity={isPredicted ? 0.15 : isField ? 0.4 : 0.25}
                stroke={
                  status === "critical"
                    ? "hsl(var(--destructive))"
                    : status === "warning"
                    ? "orange"
                    : isSelected
                    ? "hsl(var(--primary))"
                    : isOnPath
                    ? "hsl(var(--accent))"
                    : crowdColor
                }
                strokeWidth={
                  isEmergency ? 3 : isSelected ? 3 : isOnPath ? 2.5 : 1.5
                }
                strokeDasharray={isPredicted ? "4 2" : undefined}
                className={`transition-all duration-300 ${
                  isEmergency ? "animate-pulse" : ""
                }`}
              />

              {!isField && (
                <>
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 - 4}
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {typeIcons[zone.type]} {zone.name}
                  </text>

                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 12}
                    textAnchor="middle"
                    fill={crowdColor}
                    fontSize="10"
                    fontWeight="700"
                  >
                    {Math.round(zone.crowd)}%
                  </text>

                  {/* ♿ accessibility status */}
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 24}
                    textAnchor="middle"
                    fontSize="8"
                    fill="hsl(var(--muted-foreground))"
                  >
                    {status}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Users */}
        {renderedUsers.map((u) => (
          <circle
            key={u.id}
            cx={u.x}
            cy={u.y}
            r="2"
            fill="hsl(var(--primary))"
            opacity="0.5"
          />
        ))}

        {/* Path */}
        {pathSegments.map((seg, i) => (
          <line
            key={i}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={
              emergencyMode
                ? "hsl(var(--destructive))"
                : "hsl(var(--accent))"
            }
            strokeWidth={emergencyMode ? 4 : 3}
            strokeDasharray="6 3"
            className="animate-pulse"
            filter={emergencyMode ? "url(#glow)" : undefined}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-3 text-xs">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
}
