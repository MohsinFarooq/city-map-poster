import { Download, RotateCcw, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  THEMES,
  LAYOUTS,
  type PosterConfig,
  type PosterResult,
} from "@/features/poster/types";
import { getPosterImageUrl } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

type Props = {
  config: PosterConfig;
  status: Status;
  result: PosterResult | null;
  error: string;
  step: string;
  onDownload: () => void;
  onReset: () => void;
};

export function PreviewPanel({
  config,
  status,
  result,
  error,
  step,
  onDownload,
  onReset,
}: Props) {
  const theme = THEMES.find((t) => t.filename === config.theme) ?? THEMES[0];
  const layout = LAYOUTS.find((l) => l.id === config.layout) ?? LAYOUTS[0];

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#08080e] p-10">
      {status === "idle" && (
        <IdlePlaceholder config={config} theme={theme} layout={layout} />
      )}
      {status === "loading" && (
        <LoadingState city={config.city} theme={theme} step={step} />
      )}
      {status === "success" && result && (
        <SuccessState
          result={result}
          layout={layout}
          onDownload={onDownload}
          onReset={onReset}
        />
      )}
      {status === "error" && <ErrorState error={error} onReset={onReset} />}
    </div>
  );
}

// ---- Idle placeholder ----

function IdlePlaceholder({
  config,
  theme,
  layout,
}: {
  config: PosterConfig;
  theme: (typeof THEMES)[0];
  layout: (typeof LAYOUTS)[0];
}) {
  const hasCity = config.city.trim() !== "";
  const hasCountry = config.country.trim() !== "";
  const isReady = hasCity && hasCountry;

  const posterW = layout.id === "pc" ? 480 : layout.id === "a4" ? 300 : 220;
  const posterH =
    layout.id === "pc"
      ? 270
      : layout.id === "a4"
      ? Math.round(300 * 1.414)
      : Math.round(220 * (16 / 9));

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Layout label badge */}
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className="bg-white/6 text-zinc-400 border-white/10 text-[10px] px-2.5 whitespace-nowrap"
        >
          {layout.label} · {layout.description}
        </Badge>
      </div>
      {/* Poster frame */}
      <div className="relative" style={{ width: posterW, height: posterH }}>
        {/* Background */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/10 shadow-2xl shadow-black/70 overflow-hidden"
          style={{ background: theme.bg }}
        >
          {/* Top gradient */}
          <div
            className="absolute inset-x-0 top-0 h-1/3"
            style={{
              background: `linear-gradient(to bottom, ${theme.gradient_color} 0%, transparent 100%)`,
            }}
          />
          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{
              background: `linear-gradient(to top, ${theme.gradient_color} 0%, transparent 100%)`,
            }}
          />

          {/* Dotted grid pattern */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.12 }}
          >
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.2" fill={theme.road_default} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Concentric circle decorations */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[120, 90, 60, 35].map((r, i) => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: r * 2,
                  height: r * 2,
                  borderColor: theme.road_default,
                  opacity: 0.08 + i * 0.04,
                }}
              />
            ))}
            {/* Center pin */}
            <div
              className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2"
              style={{
                borderColor: theme.road_primary,
                background: `${theme.bg}cc`,
              }}
            >
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: theme.road_primary }}
              />
            </div>
          </div>

          {/* City label or placeholder */}
          <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-1">
            {config.label_mode !== "none" && (
              <>
                <div
                  className="h-px w-16 opacity-30"
                  style={{ background: theme.text }}
                />
                <p
                  className="font-bold tracking-[0.25em] uppercase"
                  style={{
                    color: theme.text,
                    fontSize: layout.id === "pc" ? 18 : 13,
                    opacity: hasCity ? 1 : 0.25,
                  }}
                >
                  {hasCity ? config.city : "YOUR CITY"}
                </p>
                {config.label_mode === "coords" && (
                  <p
                    className="font-mono tracking-wider"
                    style={{
                      color: theme.text,
                      fontSize: layout.id === "pc" ? 10 : 8,
                      opacity: 0.5,
                    }}
                  >
                    00.0000° N / 00.0000° E
                  </p>
                )}
                <div
                  className="h-px w-16 opacity-30"
                  style={{ background: theme.text }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA text */}
      <div className="flex flex-col items-center gap-2 text-center">
        {isReady ? (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Ready to generate
            </div>
            <p className="text-xs text-zinc-600">
              {config.city}, {config.country} · {theme.name} theme
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
              <MapPin className="h-3.5 w-3.5" />
              Enter a city to get started
            </div>
            <p className="text-xs text-zinc-700">
              Your poster preview will appear here
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ---- Loading state ----

function LoadingState({
  city,
  theme,
  step,
}: {
  city: string;
  theme: (typeof THEMES)[0];
  step: string;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="relative flex h-52 w-80 items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60"
        style={{ background: theme.bg }}
      >
        {/* Dot grid */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.1 }}
        >
          <defs>
            <pattern
              id="dots-load"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill={theme.road_default} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-load)" />
        </svg>

        {/* Concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[100, 72, 48].map((r, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: r * 2,
                height: r * 2,
                borderColor: theme.road_default,
                opacity: 0.1 + i * 0.05,
              }}
            />
          ))}
        </div>

        {/* Gradients */}
        <div
          className="absolute inset-x-0 top-0 h-1/3"
          style={{
            background: `linear-gradient(to bottom, ${theme.gradient_color} 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: `linear-gradient(to top, ${theme.gradient_color} 0%, transparent 100%)`,
          }}
        />

        {/* Pulse ring */}
        <div className="relative z-10 flex items-center justify-center">
          <div
            className="absolute h-14 w-14 animate-ping rounded-full opacity-20"
            style={{ background: theme.road_primary }}
          />
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-full border-2"
            style={{
              borderColor: theme.road_primary,
              background: `${theme.bg}cc`,
            }}
          >
            <MapPin
              className="h-4 w-4 animate-bounce"
              style={{ color: theme.road_primary }}
            />
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-500"
              style={{
                animation: `dotbounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-zinc-300">
          {city && <span style={{ color: theme.road_primary }}>{city} </span>}—{" "}
          {step}
        </p>
        <p className="text-xs text-zinc-600">
          Fetching map data · This may take 30–60 seconds
        </p>
      </div>

      <style>{`
        @keyframes dotbounce {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ---- Success state ----

function SuccessState({
  result,
  layout,
  onDownload,
  onReset,
}: {
  result: PosterResult;
  layout: (typeof LAYOUTS)[0];
  onDownload: () => void;
  onReset: () => void;
}) {
  const imageUrl = getPosterImageUrl(result.download_url);

  const imgStyle: React.CSSProperties = {
    maxHeight: layout.id === "mobile" ? "560px" : "420px",
    maxWidth:
      layout.id === "pc" ? "680px" : layout.id === "a4" ? "360px" : "240px",
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center gap-2">
        <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px]">
          ✓ Ready
        </Badge>
      </div>

      <div
        className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/70 w-full"
        style={imgStyle}
      >
        <img
          src={imageUrl}
          alt="Generated city map poster"
          className="block w-full h-full object-contain"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onDownload}
          className="bg-white text-zinc-900 font-semibold hover:bg-zinc-100 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Download Poster
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="border-white/10 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-300 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          New Poster
        </Button>
      </div>
    </div>
  );
}

// ---- Error state ----

function ErrorState({
  error,
  onReset,
}: {
  error: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
        <span className="text-2xl">⚠️</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-red-400">Generation failed</p>
        <p className="mt-1.5 max-w-xs text-xs text-zinc-500">{error}</p>
      </div>
      <Button
        variant="outline"
        onClick={onReset}
        className="border-white/10 bg-transparent text-zinc-400 hover:bg-white/5"
      >
        <RotateCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
