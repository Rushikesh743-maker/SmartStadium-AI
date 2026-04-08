import { useState } from "react";
import { Zone, findPath } from "@/lib/stadium-data";
import { Button } from "@/components/ui/button";
import { Navigation, Route } from "lucide-react";

interface NavigationPanelProps {
  zones: Zone[];
  onPathChange: (path: string[]) => void;
}

export default function NavigationPanel({ zones, onPathChange }: NavigationPanelProps) {
  const [source, setSource] = useState("");
  const [dest, setDest] = useState("");
  const [mode, setMode] = useState<"shortest" | "least-crowded">("shortest");
  const [pathInfo, setPathInfo] = useState<string[]>([]);

  const navigableZones = zones.filter(z => z.id !== "field");

  const calculate = () => {
    if (!source || !dest || source === dest) return;
    const path = findPath(zones, source, dest, mode === "least-crowded");
    setPathInfo(path);
    onPathChange(path);
  };

  const clear = () => {
    setPathInfo([]);
    onPathChange([]);
    setSource("");
    setDest("");
  };

  return (
    <div className="glass rounded-lg p-4 space-y-3 animate-fade-in">
      <h3 className="font-semibold flex items-center gap-2 text-sm">
        <Navigation className="w-4 h-4 text-primary" /> Smart Navigation
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <select value={source} onChange={e => setSource(e.target.value)}
          className="bg-muted rounded-md px-3 py-2 text-xs border border-border focus:ring-1 focus:ring-primary outline-none">
          <option value="">From…</option>
          {navigableZones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
        <select value={dest} onChange={e => setDest(e.target.value)}
          className="bg-muted rounded-md px-3 py-2 text-xs border border-border focus:ring-1 focus:ring-primary outline-none">
          <option value="">To…</option>
          {navigableZones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setMode("shortest")}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === "shortest" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
          Shortest
        </button>
        <button onClick={() => setMode("least-crowded")}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === "least-crowded" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
          Least Crowded
        </button>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 text-xs" onClick={calculate}>
          <Route className="w-3 h-3" /> Find Route
        </Button>
        {pathInfo.length > 0 && (
          <Button size="sm" variant="outline" className="text-xs" onClick={clear}>Clear</Button>
        )}
      </div>

      {pathInfo.length > 0 && (
        <div className="text-xs space-y-1 bg-muted/50 rounded-md p-2">
          <span className="text-muted-foreground">Route ({pathInfo.length - 1} steps):</span>
          <div className="flex flex-wrap gap-1">
            {pathInfo.map((id, i) => {
              const z = zones.find(z => z.id === id);
              return (
                <span key={id} className="flex items-center gap-1">
                  <span className="bg-secondary px-1.5 py-0.5 rounded text-foreground">{z?.name ?? id}</span>
                  {i < pathInfo.length - 1 && <span className="text-accent">→</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
