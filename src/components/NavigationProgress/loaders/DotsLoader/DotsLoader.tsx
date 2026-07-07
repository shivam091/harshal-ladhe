import type { JSX } from "react";
import type { LoaderProps } from "@/components/NavigationProgress/NavigationProgress.types";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import {
  OrbitSvg,
  OrbitGuide,
  OuterOrbitGroup,
  MiddleOrbitGroup,
  InnerOrbitGroup,
  OuterDot,
  MiddleDot,
  InnerDot
} from "@/components/NavigationProgress/loaders/DotsLoader/DotsLoader.styles";

// Each dot has its own pivot so the orbits can differ in speed and direction.
export default function DotsLoader({ state, backdrop }: LoaderProps): JSX.Element {
  const done = state === "done";

  return (
    <>
      {backdrop && <Backdrop />}
      <OrbitSvg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <OrbitGuide cx="40" cy="40" r="34" />
        <OrbitGuide cx="40" cy="40" r="25" />
        <OrbitGuide cx="40" cy="40" r="16" />

        <OuterOrbitGroup data-state={done ? "done" : undefined}>
          <OuterDot cx="40" cy="6" r="4.5" data-state={done ? "done" : undefined} />
        </OuterOrbitGroup>

        <MiddleOrbitGroup data-state={done ? "done" : undefined}>
          <MiddleDot cx="40" cy="15" r="4" data-state={done ? "done" : undefined} />
        </MiddleOrbitGroup>

        <InnerOrbitGroup data-state={done ? "done" : undefined}>
          <InnerDot cx="40" cy="24" r="3.5" data-state={done ? "done" : undefined} />
        </InnerOrbitGroup>
      </OrbitSvg>
    </>
  );
}

DotsLoader.displayName = "DotsLoader";
