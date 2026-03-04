import { cn } from "@/lib/utils";
import { DISTANCES } from "@/features/poster/types";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function DistancePicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {DISTANCES.map((d) => {
        const selected = value === d.value;
        return (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            className={cn(
              "flex flex-col items-center cursor-pointer rounded-lg border px-3.5 py-2.5 transition-all duration-150",
              selected
                ? "border-blue-500/50 bg-blue-500/10"
                : "border-white/7 bg-white/2 hover:border-white/15"
            )}
          >
            <span
              className={cn(
                "text-sm font-bold",
                selected ? "text-blue-400" : "text-zinc-400"
              )}
            >
              {d.label}
            </span>
            <span className="mt-0.5 text-[10px] text-zinc-600">
              {d.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
