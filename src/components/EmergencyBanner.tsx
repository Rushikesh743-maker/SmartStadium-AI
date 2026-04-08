import { ShieldAlert } from "lucide-react";

export default function EmergencyBanner() {
  return (
    <div className="bg-destructive/20 border border-destructive/50 rounded-lg px-4 py-2.5 flex items-center gap-2 animate-pulse">
      <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
      <span className="text-sm font-semibold text-destructive">
        🚨 Emergency detected: Please follow highlighted safe route to nearest exit
      </span>
    </div>
  );
}
