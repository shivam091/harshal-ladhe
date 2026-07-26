"use client";

import type { JSX } from "react";
import Button from "@/components/Button";
import type { PreviewErrorOverlayProps } from "@/components/Sandbox/PreviewPanel/PreviewErrorOverlay/PreviewErrorOverlay.types";
import Overlay from "@/components/Overlay";
import {
  Title,
  Message,
  Location
} from "@/components/Sandbox/PreviewPanel/PreviewErrorOverlay/PreviewErrorOverlay.styles";

/*
  Replaces Sandpack's built-in error overlay. error/onRestart come from the custom preview client,
  which is deliberately unregistered with SandpackProvider so showErrorScreen: false can disable
  Sandpack's own unstyleable, cross-origin error screen.
*/
export default function PreviewErrorOverlay({ error, onRestart }: PreviewErrorOverlayProps): JSX.Element | null {
  if (!error) return null;

  const location = error.path
    ? `${error.path}${error.line ? `:${error.line}${error.column ? `:${error.column}` : ""}` : ""}`
    : null;

  return (
    <>
      <Overlay role="alert" tone="danger" align="start">
        <Title>Something went wrong</Title>
        <Message>{error.message}</Message>
        {location && <Location>{location}</Location>}
        <Button intent="danger" size="sm" onClick={onRestart}>
          Restart
        </Button>
      </Overlay>
    </>
  );
}

PreviewErrorOverlay.displayName = "PreviewErrorOverlay";
