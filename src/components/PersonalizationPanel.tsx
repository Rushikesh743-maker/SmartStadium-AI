import { Settings2 } from "lucide-react";

export type UserPreference = "fastest-entry" | "avoid-crowds" | "quick-food";

interface PersonalizationPanelProps {
  preference: UserPreference;
  onChange: (pref: UserPreference) => void;
}

const options: { value: UserPreference; label: string; emoji: string }[] = [
  { value: "fastest-entry", label: "Fastest Entry", emoji: "🏃" },
  { value: "avoid-crowds", label: "Avoid Crowds", emoji: "🧘" },
  { value: "quick-food", label: "Quick Food", emoji: "🍕" },
];

export default function PersonalizationPanel({ preference, onChange }: PersonalizationPanelProps) {
  return (
    <div className="glass rounded-lg p-3 space-y-2 animate-fade-in">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-primary" /> My Preferences
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
              preference === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
