import type { JSX, CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { LoaderProps } from "@/interfaces/navigation-progress";
import { 
  PHRASES, 
  DONE_MESSAGE, 
  PHRASE_INTERVAL_MS 
} from "@/components/NavigationProgress/loaders/TypewriterLoader/TypewriterLoader.helpers";
import {
  TypewriterBackdrop,
  TypewriterWrapper,
  TypewriterText
} from "@/components/NavigationProgress/loaders/TypewriterLoader/TypewriterLoader.styles";

// Cycles a short, playful phrase with a typing effect while loading; freezes on a done message.
export default function TypewriterLoader({ state, backdrop }: LoaderProps): JSX.Element {
  const [index, setIndex] = useState(0);
  const done = state === "done";

  useEffect(() => {
    if (done) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % PHRASES.length);
    }, PHRASE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [done]);

  const text = done ? DONE_MESSAGE : PHRASES[index];

  return (
    <>
      {backdrop && <TypewriterBackdrop />}
      <TypewriterWrapper>
        <TypewriterText
          key={done ? "done" : index}
          data-state={done ? "done" : undefined}
          style={{ "--chars": text.length } as CSSProperties}
        >
          {text}
        </TypewriterText>
      </TypewriterWrapper>
    </>
  );
}

TypewriterLoader.displayName = "TypewriterLoader";
