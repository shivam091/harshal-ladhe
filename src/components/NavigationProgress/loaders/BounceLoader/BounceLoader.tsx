import type { JSX } from "react";
import type { LoaderProps } from "@/interfaces/navigation-progress";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { BounceRow, FirstDot, SecondDot, ThirdDot } from "@/components/NavigationProgress/loaders/BounceLoader/BounceLoader.styles";

// Three squash-and-stretch dots, staggered — a springier take on the classic loading ellipsis.
export default function BounceLoader({ state, backdrop }: LoaderProps): JSX.Element {
  const done = state === "done";

  return (
    <>
      {backdrop && <Backdrop />}
      <BounceRow>
        <FirstDot data-state={done ? "done" : undefined} />
        <SecondDot data-state={done ? "done" : undefined} />
        <ThirdDot data-state={done ? "done" : undefined} />
      </BounceRow>
    </>
  );
}

BounceLoader.displayName = "BounceLoader";
