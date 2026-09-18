import type { TrianglePresetMeta } from "@/interfaces/triangle";

/*
  Curated real-world uses — deliberately spanning both techniques and both shapes so loading a
  preset doubles as a tour of what each mode is actually for: the border trick for a plain pointer
  (tooltip, speech bubble), clip-path for anything needing a concave chevron notch (breadcrumbs,
  ribbon banners, slider arrows) that the border trick simply cannot produce.
*/
export const trianglePresets: TrianglePresetMeta[] = [
  { slug: "css-triangle-up", name: "Classic CSS Triangle", technique: "border", direction: "up", shape: "triangle", width: 80, height: 80, notch: 25, color: "#6366f1", pageColor: "#f8fafc" },
  { slug: "tooltip-pointer", name: "Tooltip Pointer", technique: "border", direction: "down", shape: "triangle", width: 24, height: 12, notch: 25, color: "#0f172a", pageColor: "#f1f5f9" },
  { slug: "speech-bubble-tail", name: "Speech Bubble Tail", technique: "border", direction: "left", shape: "triangle", width: 20, height: 24, notch: 25, color: "#ffffff", pageColor: "#e2e8f0" },
  { slug: "media-play-icon", name: "Media Play Icon", technique: "clip-path", direction: "right", shape: "triangle", width: 60, height: 70, notch: 25, color: "#18181b", pageColor: "#fafafa" },
  { slug: "breadcrumb-chevron", name: "Breadcrumb Chevron", technique: "clip-path", direction: "right", shape: "chevron", width: 28, height: 60, notch: 35, color: "#94a3b8", pageColor: "#f8fafc" },
  { slug: "slider-arrow", name: "Carousel Arrow", technique: "clip-path", direction: "left", shape: "chevron", width: 40, height: 80, notch: 20, color: "#f97316", pageColor: "#1c1917" },
  { slug: "ribbon-banner", name: "Ribbon Banner End", technique: "clip-path", direction: "right", shape: "chevron", width: 50, height: 100, notch: 40, color: "#dc2626", pageColor: "#fff1f2" },
  { slug: "dropdown-caret", name: "Dropdown Caret", technique: "clip-path", direction: "down", shape: "triangle", width: 40, height: 24, notch: 25, color: "#334155", pageColor: "#f8fafc" }
];
