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
