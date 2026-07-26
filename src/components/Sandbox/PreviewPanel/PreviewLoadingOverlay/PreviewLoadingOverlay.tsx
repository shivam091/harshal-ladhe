"use client";

import type { JSX } from "react";
import type { PreviewLoadingOverlayProps } from "@/components/Sandbox/PreviewPanel/PreviewLoadingOverlay/PreviewLoadingOverlay.types";
import Overlay from "@/components/Overlay";
import {
  Spinner,
  Message
} from "@/components/Sandbox/PreviewPanel/PreviewLoadingOverlay/PreviewLoadingOverlay.styles";

/*
  Replaces Sandpack's built-in LoadingOverlay, which only renders for clients SandpackProvider
  registers — and the preview client deliberately isn't one.
*/
export default function PreviewLoadingOverlay({ isLoading, message }: PreviewLoadingOverlayProps): JSX.Element | null {
  if (!isLoading) return null;

  return (
    <>
      <Overlay role="status">
        <Spinner />
        <Message>{message ?? "Starting sandbox…"}</Message>
      </Overlay>
    </>
  );
}

PreviewLoadingOverlay.displayName = "PreviewLoadingOverlay";
