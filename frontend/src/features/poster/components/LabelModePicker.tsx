import { Type, Crosshair, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { LABEL_MODES, type LabelMode } from "@/features/poster/types";

const ICON_MAP = { Type, Crosshair, EyeOff };

type Props = {
  value: LabelMode;
  onChange: (value: LabelMode) => void;
};

export function LabelModePicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-2.5 w-full">
      {LABEL_MODES.map((mode) => {
        const selected = value === mode.id;
        const Icon = ICON_MAP[mode.icon as keyof typeof ICON_MAP];

        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-xl border py-2.5 px-3 text-xs font-medium transition-all duration-150",
              selected
                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                : "border-white/7 bg-white/2 text-zinc-500 hover:border-white/15 hover:text-zinc-400"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
