import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemePicker } from "./ThemePicker";
import { LayoutPicker } from "./LayoutPicker";
import { DistancePicker } from "./DistancePicker";
import { LabelModePicker } from "./LabelModePicker";
import type { PosterConfig } from "@/features/poster/types";

type Props = {
  config: PosterConfig;
  onChange: (config: PosterConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
  fullWidth?: boolean;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-medium text-zinc-400">{children}</p>;
}

export function ConfigSidebar({
  config,
  onChange,
  onGenerate,
  isLoading,
  fullWidth,
}: Props) {
  const set = <K extends keyof PosterConfig>(key: K, val: PosterConfig[K]) =>
    onChange({ ...config, [key]: val });

  const canGenerate =
    config.city.trim() !== "" && config.country.trim() !== "" && !isLoading;

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-white/7 bg-[#0e0e16] ${
        fullWidth ? "w-full" : "w-[420px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-white/7 px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/8">
          <MapPin className="h-3.5 w-3.5 text-zinc-300" strokeWidth={1.75} />
        </div>
        <span className="text-sm font-semibold text-zinc-200 tracking-tight">
          CityMap Poster
        </span>
      </div>

      {/* Scrollable config area */}
      <ScrollArea className="flex-1">
        <div className="space-y-5 px-5 py-5">
          {/* Location */}
          <div>
            <SectionLabel>Location</SectionLabel>
            <div className="space-y-2">
              <div>
                <Label className="mb-1.5 block text-xs text-zinc-500">
                  City
                </Label>
                <Input
                  placeholder="Enter the city name"
                  value={config.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="border-white/8 bg-white/4 text-zinc-100 text-sm placeholder:text-zinc-600 focus-visible:ring-white/20 h-9 rounded-lg"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs text-zinc-500">
                  Country
                </Label>
                <Input
                  placeholder="Enter the country name"
                  value={config.country}
                  onChange={(e) => set("country", e.target.value)}
                  className="border-white/8 bg-white/4 text-zinc-100 text-sm placeholder:text-zinc-600 focus-visible:ring-white/20 h-9 rounded-lg"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Theme */}
          <div>
            <SectionLabel>Theme</SectionLabel>
            <ThemePicker
              value={config.theme}
              onChange={(v) => set("theme", v)}
            />
          </div>

          <Separator className="bg-white/5" />

          {/* Layout */}
          <div>
            <SectionLabel>Layout</SectionLabel>
            <LayoutPicker
              value={config.layout}
              onChange={(v) => set("layout", v)}
            />
          </div>

          <Separator className="bg-white/5" />

          {/* Distance */}
          <div>
            <SectionLabel>Map Radius</SectionLabel>
            <DistancePicker
              value={config.distance}
              onChange={(v) => set("distance", v)}
            />
          </div>

          <Separator className="bg-white/5" />

          {/* Label mode */}
          <div>
            <SectionLabel>Label</SectionLabel>
            <LabelModePicker
              value={config.label_mode}
              onChange={(v) => set("label_mode", v)}
            />
          </div>
        </div>
      </ScrollArea>

      {/* Generate button */}
      <div className="border-t border-white/7 p-4">
        <Button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="w-full h-10 bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all rounded-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Poster"
          )}
        </Button>
        {(!config.city.trim() || !config.country.trim()) && !isLoading ? (
          <p className="mt-2 text-center text-[11px] text-zinc-600">
            Enter a city and country to continue
          </p>
        ) : null}
      </div>
    </aside>
  );
}
