export type Theme = {
  name: string;
  filename: string; // matches JSON file on disk e.g. "midnight_blue"
  description: string;
  bg: string;
  text: string;
  gradient_color: string;
  water: string;
  parks: string;
  road_motorway: string;
  road_primary: string;
  road_secondary: string;
  road_tertiary: string;
  road_residential: string;
  road_default: string;
};

export type Layout = "pc" | "mobile" | "a4";
export type LabelMode = "city" | "coords" | "none";

export type PosterConfig = {
  city: string;
  country: string;
  theme: string; // sent to API — uses theme.filename
  distance: number;
  label_mode: LabelMode;
  layout: Layout;
};

export type PosterResult = {
  status: string;
  filename: string;
  download_url: string;
};

export const THEMES: Theme[] = [
  {
    name: "Autumn",
    filename: "autumn",
    description: "Burnt oranges, deep reds, golden yellows - seasonal warmth",
    bg: "#FBF7F0",
    text: "#8B4513",
    gradient_color: "#FBF7F0",
    water: "#D8CFC0",
    parks: "#E8E0D0",
    road_motorway: "#8B2500",
    road_primary: "#B8450A",
    road_secondary: "#CC7A30",
    road_tertiary: "#D9A050",
    road_residential: "#E8C888",
    road_default: "#CC7A30",
  },
  {
    name: "Blueprint",
    filename: "blueprint",
    description:
      "Classic architectural blueprint - technical drawing aesthetic",
    bg: "#1A3A5C",
    text: "#E8F4FF",
    gradient_color: "#1A3A5C",
    water: "#0F2840",
    parks: "#1E4570",
    road_motorway: "#E8F4FF",
    road_primary: "#C5DCF0",
    road_secondary: "#9FC5E8",
    road_tertiary: "#7BAED4",
    road_residential: "#5A96C0",
    road_default: "#7BAED4",
  },
  {
    name: "Contrast Zones",
    filename: "contrast_zones",
    description:
      "Strong contrast showing urban density - darker in center, lighter at edges",
    bg: "#FFFFFF",
    text: "#000000",
    gradient_color: "#FFFFFF",
    water: "#B0B0B0",
    parks: "#ECECEC",
    road_motorway: "#000000",
    road_primary: "#0F0F0F",
    road_secondary: "#252525",
    road_tertiary: "#404040",
    road_residential: "#5A5A5A",
    road_default: "#404040",
  },
  {
    name: "Midnight Blue",
    filename: "midnight_blue",
    description:
      "Deep navy background with gold/copper roads - luxury atlas aesthetic",
    bg: "#0A1628",
    text: "#D4AF37",
    gradient_color: "#0A1628",
    water: "#061020",
    parks: "#0F2235",
    road_motorway: "#D4AF37",
    road_primary: "#C9A227",
    road_secondary: "#A8893A",
    road_tertiary: "#8B7355",
    road_residential: "#6B5B4F",
    road_default: "#8B7355",
  },
  {
    name: "Neon Cyberpunk",
    filename: "neon_cyberpunk",
    description:
      "Dark background with electric pink/cyan - bold night city vibes",
    bg: "#0D0D1A",
    text: "#00FFFF",
    gradient_color: "#0D0D1A",
    water: "#0A0A15",
    parks: "#151525",
    road_motorway: "#FF00FF",
    road_primary: "#00FFFF",
    road_secondary: "#00C8C8",
    road_tertiary: "#0098A0",
    road_residential: "#006870",
    road_default: "#0098A0",
  },
  {
    name: "Warm Beige",
    filename: "warm_beige",
    description:
      "Earthy warm neutrals with sepia tones - vintage map aesthetic",
    bg: "#F5F0E8",
    text: "#6B5B4F",
    gradient_color: "#F5F0E8",
    water: "#DDD5C8",
    parks: "#E8E4D8",
    road_motorway: "#8B7355",
    road_primary: "#A08B70",
    road_secondary: "#B5A48E",
    road_tertiary: "#C9BBAA",
    road_residential: "#D9CFC2",
    road_default: "#C9BBAA",
  },
];

export const LAYOUTS = [
  {
    id: "pc" as Layout,
    label: "Desktop",
    description: "1920 × 1080",
    aspectRatio: "16/9",
    icon: "Monitor",
  },
  {
    id: "mobile" as Layout,
    label: "Mobile",
    description: "1080 × 1920",
    aspectRatio: "9/16",
    icon: "Smartphone",
  },
  {
    id: "a4" as Layout,
    label: "A4 Print",
    description: "2480 × 3508",
    aspectRatio: "1/1.414",
    icon: "FileImage",
  },
];

export const LABEL_MODES = [
  { id: "city" as LabelMode, label: "City Name", icon: "Type" },
  { id: "coords" as LabelMode, label: "Coordinates", icon: "Crosshair" },
  { id: "none" as LabelMode, label: "None", icon: "EyeOff" },
];

export const DISTANCES = [
  { value: 5000, label: "5 km", description: "Street level" },
  { value: 10000, label: "10 km", description: "Neighbourhood" },
  { value: 20000, label: "20 km", description: "City view" },
  { value: 40000, label: "40 km", description: "Metro area" },
  { value: 80000, label: "80 km", description: "Regional" },
];
