import type { ComponentType } from "react";
import type { LoaderKind } from "@/components/NavigationProgress/NavigationProgress.types";
import type { LoaderProps } from "@/components/NavigationProgress/NavigationProgress.types";
import RingsLoader from "@/components/NavigationProgress/loaders/RingsLoader";
import LogoLoader from "@/components/NavigationProgress/loaders/LogoLoader";
import DotsLoader from "@/components/NavigationProgress/loaders/DotsLoader";
import BlobLoader from "@/components/NavigationProgress/loaders/BlobLoader";
import WaveLoader from "@/components/NavigationProgress/loaders/WaveLoader";
import TypewriterLoader from "@/components/NavigationProgress/loaders/TypewriterLoader";
import BounceLoader from "@/components/NavigationProgress/loaders/BounceLoader";
import BurstLoader from "@/components/NavigationProgress/loaders/BurstLoader";

// Typed by LoaderKind so every loader option is guaranteed a component.
export const LOADERS: Record<LoaderKind, ComponentType<LoaderProps>> = {
  rings: RingsLoader,
  logo: LogoLoader,
  dots: DotsLoader,
  blob: BlobLoader,
  wave: WaveLoader,
  typewriter: TypewriterLoader,
  bounce: BounceLoader,
  burst: BurstLoader
};
