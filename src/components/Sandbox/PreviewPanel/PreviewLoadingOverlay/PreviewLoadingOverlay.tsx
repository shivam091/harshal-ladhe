"use client";

import { JSX } from "react";
import type { PreviewLoadingOverlayProps } from "@/interfaces/sandbox";
import Overlay from "@/components/Overlay";
import {
  Spinner,
  Message
} from "@/components/Sandbox/PreviewPanel/PreviewLoadingOverlay/PreviewLoadingOverlay.styles";

/*
  Replaces Sandpack's built-in LoadingOverlay, same reason as PreviewErrorOverlay — that UI only
  renders for clients SandpackProvider registers, and the preview client deliberately isn't.
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
