import type { ReactNode } from "react";

// `twitter:card` values this tool models — "" means the tag is absent, which is a real state an imported <head> can be in (and one the audit should flag) rather than something to silently default away.
export type TwitterCardType = "summary" | "summary_large_image" | "";

// The `og:type` values worth offering for a typical page — "" again means "not set", so a pasted <head> missing the tag round-trips faithfully into the audit.
export type OpenGraphType = "website" | "article" | "product" | "profile" | "";

/*
  Every piece of share metadata the form edits. Kept as flat strings (not parsed URLs or colour
  objects) so a half-typed value never has to be rejected mid-edit — validity is the audit's job,
  not the input's.
*/
export interface OpenGraphFields {
  title: string;
  description: string;
  // Canonical page URL — doubles as `og:url`, since publishing two different values is a mistake rather than a feature.
  url: string;
  siteName: string;
  imageUrl: string;
  imageAlt: string;
  twitterCard: TwitterCardType;
  ogType: OpenGraphType;
  themeColor: string;
  faviconUrl: string;
  author: string;
  // The `twitter:site` handle, with or without the leading "@" — normalised only at export time.
  twitterHandle: string;
}

// Nothing UI-only lives in the undo stack — the uploaded local image deliberately sits outside it (see LocalImage), so the editor state IS the field set.
export type OpenGraphEditorState = OpenGraphFields;

// Same shape as the editor state; a separate name so the serialise/autosave boundary reads explicitly at each call site.
export type OpenGraphShareableState = OpenGraphFields;

// A file picked from disk, previewed via an object URL — never written into the permalink or autosave, since a blob: URL is meaningless outside this tab and a data URL would bloat both.
export interface LocalImage {
  url: string;
  name: string;
}

// Result of loading the effective image into an off-screen Image() — the only way to learn its real pixel size on a static site with no server to inspect it.
export type ImageMeasurement =
  | { status: "none" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "loaded"; width: number; height: number };

// Each preview surface's own colour scheme, toggled independently of the site theme because platforms are viewed in either mode regardless of how this page is set.
export type SurfaceMode = "light" | "dark";

// Platforms with a recreated preview — names only, no logos, so the cards stay brand-neutral approximations.
export type PreviewPlatform = "x" | "linkedin" | "slack" | "facebook" | "discord" | "imessage" | "google";

/*
  The fields as a preview card actually needs them: the effective image (local upload wins over the
  URL field), a display hostname and breadcrumb pre-derived from the canonical URL, and fallbacks
  already applied — so every platform card renders from one consistent interpretation instead of
  each re-deriving it slightly differently.
*/
export interface PreviewData {
  title: string;
  description: string;
  siteName: string;
  host: string;
  breadcrumb: string;
  imageSrc: string;
  imageAlt: string;
  isLargeImage: boolean;
  accentColour: string;
  faviconSrc: string;
  handle: string;
}

// Three verdicts, not a score — a share preview either works, works with a caveat, or visibly breaks.
export type AuditStatus = "pass" | "warn" | "fail";

// One audit rule's verdict — `message` is a full British English sentence so the panel can render it as-is.
export interface AuditCheck {
  id: string;
  label: string;
  status: AuditStatus;
  message: string;
}

// What the <head> importer recovered, plus how many recognised tags it matched — zero is how the UI tells "nothing useful pasted" apart from "pasted a page with empty values".
export interface HeadImportResult {
  fields: OpenGraphFields;
  matchedCount: number;
}

// A named, complete field set — complete so applying one never leaves stale values from the previous page behind.
export interface OpenGraphPresetMeta {
  slug: string;
  name: string;
  blurb: string;
  fields: OpenGraphFields;
}

// Every mutation OpenGraphPreview exposes to its children, bundled into one object — mirrors every other goodie's own *Actions style so subcomponents never touch the undo stack directly.
export interface OpenGraphActions {
  setField: <K extends keyof OpenGraphFields>(key: K, value: OpenGraphFields[K]) => void;
  commitField: <K extends keyof OpenGraphFields>(key: K, value: OpenGraphFields[K]) => void;
  commitDrag: () => void;
  importFields: (fields: OpenGraphFields) => void;
  applyPreset: (preset: OpenGraphPresetMeta) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetPreview: () => void;
}

// The local image travels as a prop beside the state, not inside it, so it stays out of undo history and the permalink.
export interface MetadataFormProps {
  state: OpenGraphEditorState;
  actions: OpenGraphActions;
  localImage: LocalImage | null;
  onLocalImageChange: (file: File | null) => void;
}

// Import only ever produces a whole field set, so the importer needs nothing but the actions.
export interface HeadImportProps {
  actions: OpenGraphActions;
}

// The board renders from pre-derived PreviewData so every card agrees on fallbacks.
export interface PreviewBoardProps {
  data: PreviewData;
}

// Shared by every platform card — the surface mode is applied by the PinnedCard around it, not by the card itself.
export interface PlatformPreviewProps {
  data: PreviewData;
}

// The pinboard frame around one platform card, owning that surface's light/dark switch.
export interface PinnedCardProps {
  label: string;
  // Degrees of tilt — passed in rather than randomised inside, so server and client render the same angle.
  tilt: number;
  mode: SurfaceMode;
  onModeChange: (mode: SurfaceMode) => void;
  children: ReactNode;
}

// The audit needs the measured image as well as the fields, since dimensions can't be known from a URL string.
export interface AuditPanelProps {
  state: OpenGraphEditorState;
  localImage: LocalImage | null;
  measurement: ImageMeasurement;
}

// Measured dimensions feed og:image:width/height, and the local image triggers the "host it first" note.
export interface ExportPanelProps {
  state: OpenGraphEditorState;
  localImage: LocalImage | null;
  measurement: ImageMeasurement;
}

// Presets only ever apply, so the gallery needs nothing but the actions.
export interface PresetGalleryProps {
  actions: OpenGraphActions;
}

// The permalink is derived from the shareable state alone — the local image is excluded by construction.
export interface ShareControlsProps {
  state: OpenGraphEditorState;
}

// One tab's id and visible label, generic over the id union so selection stays type-checked.
export interface TabItem<T extends string> {
  id: T;
  label: string;
}

// Generic so the preview and export tab rows share one keyboard-operable implementation.
export interface TabListProps<T extends string> {
  label: string;
  // Prefix for each tab's/panel's id, so two tab lists on one page never collide.
  idPrefix: string;
  tabs: ReadonlyArray<TabItem<T>>;
  selected: T;
  onSelect: (id: T) => void;
}

// Platform aspect ratios worth modelling — 1.91:1 for every large card, 1:1 for summary thumbnails.
export type PreviewImageAspect = "large" | "square";

// An image slot that crops like the platforms do and shows a neutral placeholder when there's no image or it fails.
export interface PreviewImageProps {
  src: string;
  alt: string;
  aspect: PreviewImageAspect;
  // Optional overlay content (X's title chip on a large card) laid over the image's bottom edge.
  children?: ReactNode;
}

// The favicon is decorative beside the visible site name, so it only needs a src.
export interface SiteFaviconProps {
  src: string;
}
