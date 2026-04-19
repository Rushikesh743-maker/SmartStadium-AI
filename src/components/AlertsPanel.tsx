import { Alert } from "@/lib/stadium-data";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { sanitizeText } from "@/lib/utils";

interface AlertsPanelProps {
  alerts?: Alert[];
}

const severityConfig = {
  info: { icon: Info, classes: "border-accent/30 bg-accent/5 text-accent" },
  warning: { icon: AlertTriangle, classes: "border-warning/30 bg-warning/5 text-warning" },
  danger: { icon: ShieldAlert, classes: "border-destructive/30 bg-destructive/5 text-destructive" },
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const [liveAlerts, setLiveAlerts] = useState<Alert[]>(alerts || []);

  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(
      collection(db, "alerts"),
      (snapshot) => {
        try {
          const data: Alert[] = snapshot.docs
            .map((doc) => {
              const d = doc.data();

              // ✅ basic validation (security upgrade)
              if (!d?.message || !d?.severity || !d?.timestamp) return null;

              return {
                id: doc.id,
                message: String(d.message),
                severity: d.severity,
                timestamp: Number(d.timestamp),
              } as Alert;
            })
            .filter(Boolean) as Alert[];

          data.sort((a, b) => b.timestamp - a.timestamp);

          setLiveAlerts(data.slice(0, 5));
        } catch (err) {
          console.error("Alerts parsing error:", err);
        }
      },
      (error) => {
        console.error("Firestore listener error:", error);
      }
    );

    return () => unsub();
  }, []);

  return (
    <div
      className="glass rounded-lg p-4 space-y-2 animate-fade-in"
      aria-live="polite"
    >
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" />
        Live Alerts
      </h3>

      {liveAlerts.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          🔵 System stable — no active alerts
        </p>
      ) : (
        liveAlerts.map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.info;
          const Icon = cfg.icon;

          return (
            <div
              key={alert.id}
              className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${cfg.classes}`}
            >
              <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{sanitizeText(alert.message)}</span>
            </div>
          );
        })
      )}
    </div>
  );
}
