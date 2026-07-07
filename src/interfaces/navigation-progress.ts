import type { State, LoaderKind } from "@/types/navigation-progress";

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
  // 0-100 — most loaders ignore this; WaveLoader ties its fill level to it directly.
  progress: number;
  // Whether this loader should render its backdrop (see NavigationProgressProps.backdrop).
  backdrop: boolean;
}
