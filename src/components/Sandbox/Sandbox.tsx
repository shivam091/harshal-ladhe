import { JSX } from "react";
import SandboxClient from "@/components/Sandbox/SandboxClient";
import { getSandbox } from "@/lib/sandbox/sandbox";
import { getSandboxBySlug } from "@/data/sandboxes";
import type { SandboxProps } from "@/interfaces/sandbox";
import type { SandboxFiles } from "@/types/sandbox";
import { SandboxWrapper } from "@/components/Sandbox/Sandbox.styles";

// Server-side entry: resolves `slug` to meta/files, then hands off to SandboxClient for anything requiring the browser.
export default function Sandbox({ slug, ...props }: SandboxProps): JSX.Element {
  const meta = getSandboxBySlug(slug);

  let files: SandboxFiles | undefined;
  try {
    files = meta ? getSandbox(slug) : undefined;
  } catch {
    files = undefined;
  }

  if (!meta || !files) {
    return (
      <>
        <SandboxWrapper>
          <p style={{ padding: "1rem", marginBlock: "-0.125rem", backgroundColor: "var(--color-bg-danger-muted)", color: "var(--color-fg-danger)" }}>
            Sandbox <code>{slug}</code> not found.
          </p>
        </SandboxWrapper>
      </>
    );
  }

  return (
    <>
      <SandboxClient meta={meta} files={files} {...props} />
    </>
  );
}

Sandbox.displayName = "Sandbox";
