import { Alert } from "@/lib/stadium-data";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

interface AlertsPanelProps {
  alerts: Alert[];
}

const severityConfig = {
  info: { icon: Info, classes: "border-accent/30 bg-accent/5 text-accent" },
  warning: { icon: AlertTriangle, classes: "border-warning/30 bg-warning/5 text-warning" },
  danger: { icon: ShieldAlert, classes: "border-destructive/30 bg-destructive/5 text-destructive" },
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="glass rounded-lg p-4 space-y-2 animate-fade-in">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" /> Live Alerts
      </h3>
      {alerts.length === 0 ? (
        <p className="text-xs text-muted-foreground">No alerts right now ✓</p>
      ) : (
        alerts.map(alert => {
          const cfg = severityConfig[alert.severity];
          const Icon = cfg.icon;
          return (
            <div key={alert.id} className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${cfg.classes}`}>
              <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{alert.message}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
