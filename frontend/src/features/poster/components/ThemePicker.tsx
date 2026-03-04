import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { THEMES } from "@/features/poster/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function ThemePicker({ value, onChange }: Props) {
  const selected = THEMES.find((t) => t.filename === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full border-white/8 bg-white/3 h-9 text-sm text-zinc-100 focus:ring-blue-500/40">
        <SelectValue>
          {selected && (
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1">
                {[
                  selected.bg,
                  selected.road_primary,
                  selected.road_secondary,
                ].map((color, i) => (
                  <div
                    key={i}
                    className="h-3.5 w-3.5 rounded-sm border border-white/10"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <span>{selected.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="border-white/10 bg-[#13131f] text-sm">
        {THEMES.map((theme) => (
          <SelectItem
            key={theme.filename}
            value={theme.filename}
            className="cursor-pointer focus:bg-white/6 focus:text-white"
          >
            <div className="flex items-center gap-2.5 py-0.5">
              <div className="flex gap-1 shrink-0">
                {[theme.bg, theme.road_primary, theme.road_secondary].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="h-3.5 w-3.5 rounded-sm border border-white/10"
                      style={{ background: color }}
                    />
                  )
                )}
              </div>
              <div>
                <p className="font-medium text-zinc-200">{theme.name}</p>
                <p className="text-[10px] text-zinc-500">{theme.description}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
