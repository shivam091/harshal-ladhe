import type { JSX } from "react";
import type { LoaderProps } from "@/interfaces/navigation-progress";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { LogoSvg, LogoPath } from "@/components/NavigationProgress/loaders/LogoLoader/LogoLoader.styles";
import { MONOGRAM_PATH } from "@/components/NavigationProgress/loaders/LogoLoader/LogoLoader.helpers";

/*
 * "H" monogram drawn as a single continuous pen stroke, looping through a draw-in/erase cycle
 * while loading, then snapping to fully-drawn with a small pop on completion.
 */
export default function LogoLoader({ state, backdrop }: LoaderProps): JSX.Element {
  const done = state === "done";

  return (
    <>
      {backdrop && <Backdrop />}
      <LogoSvg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" data-state={done ? "done" : undefined}>
        <LogoPath d={MONOGRAM_PATH} data-state={done ? "done" : undefined} />
      </LogoSvg>
    </>
  );
}

LogoLoader.displayName = "LogoLoader";
