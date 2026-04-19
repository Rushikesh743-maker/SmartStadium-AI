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

              // 🔐 SECURITY: strict validation
              if (
                typeof d?.message !== "string" ||
                typeof d?.severity !== "string" ||
                typeof d?.timestamp !== "number"
              ) {
                return null;
              }

              return {
                id: doc.id,
                message: d.message,
                severity: d.severity as Alert["severity"],
                timestamp: d.timestamp,
              };
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
    <section
      className="glass rounded-lg p-4 space-y-2 animate-fade-in"
      aria-live="polite"
      aria-label="Live system alerts"
    >
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" aria-hidden="true" />
        Live Alerts
      </h3>

      {liveAlerts.length === 0 ? (
        <p className="text-xs text-muted-foreground" role="status">
          🔵 System stable — no active alerts
        </p>
      ) : (
        <ul className="space-y-2">
          {liveAlerts.map((alert) => {
            const cfg = severityConfig[alert.severity] || severityConfig.info;
            const Icon = cfg.icon;

            return (
              <li
                key={alert.id}
                className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${cfg.classes}`}
                role="alert"
              >
                <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{sanitizeText(alert.message)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
