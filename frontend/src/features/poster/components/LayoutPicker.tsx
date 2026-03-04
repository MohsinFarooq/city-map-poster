import { Monitor, Smartphone, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAYOUTS, type Layout } from "@/features/poster/types";

const ICON_MAP = {
  Monitor,
  Smartphone,
  FileImage,
};

type Props = {
  value: Layout;
  onChange: (value: Layout) => void;
};

export function LayoutPicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-2.5 w-full">
      {LAYOUTS.map((layout) => {
        const selected = value === layout.id;
        const Icon = ICON_MAP[layout.icon as keyof typeof ICON_MAP];

        return (
          <button
            key={layout.id}
            onClick={() => onChange(layout.id)}
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-xl border p-3.5 transition-all cursor-pointer duration-150",
              selected
                ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                : "border-white/7 bg-white/2 text-zinc-500 hover:border-white/15 hover:text-zinc-400"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.5} />
            <div className="text-center">
              <div
                className={cn(
                  "text-xs font-semibold",
                  selected ? "text-blue-400" : "text-zinc-400"
                )}
              >
                {layout.label}
              </div>
              <div className="mt-0.5 text-[10px] text-zinc-600">
                {layout.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
