import { useState, useEffect } from "react";
import { MapPin, Settings, Image } from "lucide-react";
import { ConfigSidebar } from "@/features/poster/components/ConfigSidebar";
import { PreviewPanel } from "@/features/poster/components/PreviewPanel";
import { usePosterGeneration } from "@/features/poster/hooks/userPosterGeneration";
import type { PosterConfig } from "@/features/poster/types";

const DEFAULT_CONFIG: PosterConfig = {
  city: "",
  country: "",
  theme: "midnight_blue",
  distance: 20000,
  label_mode: "city",
  layout: "pc",
};

type Tab = "config" | "preview";

export default function App() {
  const [config, setConfig] = useState<PosterConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const { status, result, error, step, generate, reset, download } =
    usePosterGeneration();

  useEffect(() => {
    if (status === "loading" || status === "success") {
      setTimeout(() => setActiveTab("preview"), 0);
    }
  }, [status]);

  const handleReset = () => {
    reset();
    setActiveTab("config");
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#08080e] md:flex-row">
      {/* Desktop (md+): side by side */}
      <div className="hidden md:flex md:h-full md:w-full">
        <ConfigSidebar
          config={config}
          onChange={setConfig}
          onGenerate={() => generate(config)}
          isLoading={status === "loading"}
        />
        <PreviewPanel
          config={config}
          status={status}
          result={result}
          error={error}
          step={step}
          onDownload={download}
          onReset={handleReset}
        />
      </div>

      {/* Mobile (<md): tab switcher */}
      <div className="flex h-full flex-col md:hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/7 bg-[#0c0c14] px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <MapPin className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">CityMap Poster</h1>
            <p className="text-[10px] text-zinc-500">
              Generate stunning city art
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-white/7 bg-[#0c0c14]">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all ${
              activeTab === "config"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Configure
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`relative flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all ${
              activeTab === "preview"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <Image className="h-3.5 w-3.5" />
            Preview
            {status === "success" && activeTab !== "preview" && (
              <span className="absolute right-8 top-2.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
            {status === "loading" && (
              <span className="absolute right-8 top-2.5 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "config" ? (
            <ConfigSidebar
              config={config}
              onChange={setConfig}
              onGenerate={() => generate(config)}
              isLoading={status === "loading"}
              fullWidth
            />
          ) : (
            <PreviewPanel
              config={config}
              status={status}
              result={result}
              error={error}
              step={step}
              onDownload={download}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
