import { MapPin, Wifi, Sun, Moon, ShieldAlert } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  currentLocation: string;
  isLive: boolean;
  emergencyMode: boolean;
  onToggleEmergency: () => void;
}

export default function DashboardHeader({ currentLocation, isLive, emergencyMode, onToggleEmergency }: DashboardHeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="flex items-center justify-between py-4 px-1">
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-gradient">SmartStadium</span>{" "}
          <span className="text-foreground font-light">AI</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Intelligent venue experience</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{currentLocation}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Wifi className={`w-3.5 h-3.5 ${isLive ? "text-success" : "text-destructive"}`} />
          <span className={isLive ? "text-success" : "text-destructive"}>{isLive ? "Live" : "Offline"}</span>
        </div>
        <Button
          size="sm"
          variant={emergencyMode ? "destructive" : "outline"}
          className="text-xs h-7 px-2"
          onClick={onToggleEmergency}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {emergencyMode ? "Exit Emergency" : "Emergency"}
        </Button>
        <button
          onClick={toggle}
          className="p-1.5 rounded-md border border-border bg-muted hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-accent" />}
        </button>
      </div>
    </header>
  );
}
