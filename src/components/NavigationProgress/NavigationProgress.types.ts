// Lifecycle of a single navigation: idle (nothing happening) → loading (bar trickling) → done (fading out).
export type State = "idle" | "loading" | "done";

// Which visual style the centred loader renders as — see `@/components/NavigationProgress/loaders`.
export type LoaderKind =
  | "rings"
  | "logo"
  | "dots"
  | "blob"
  | "wave"
  | "typewriter"
  | "bounce"
  | "burst";

// Props for NavigationProgress.
export interface NavigationProgressProps {
  // Which loader visual to render while a navigation is in flight. Defaults to "dots".
  loader?: LoaderKind;
  // Whether to render the centred loader overlay at all. Defaults to false — the top progress
  // bar (Track/Bar/Orb) always renders regardless, since this only gates the extra overlay.
  overlay?: boolean;
  // Whether to render the frosted pill behind the loader. Defaults to true.
  backdrop?: boolean;
}

// Props every loader component receives from NavigationProgress.
export interface LoaderProps {
  state: State;
  // 0-100 — available for loaders that show real progress rather than a loop.
  progress: number;
  // Whether this loader should render its frosted backdrop.
  backdrop: boolean;
}
