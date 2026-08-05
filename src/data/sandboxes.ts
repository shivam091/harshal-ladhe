// Static metadata for one runnable sandbox example — resolved server-side from its slug.
export interface SandboxMeta {
  slug: string;
  title: string;
  description: string;
  template: "react-ts" | "react" | "vanilla-ts" | "vanilla";
  entry: string;
  /*
    Absolute file paths (matching keys in the sandbox's file tree, e.g. "/shared/utils.ts") locked
    to view-only — the same readOnly mechanism as the whole-sandbox SandboxProps.readOnly flag
    (blocked CodeMirror edits, disabled Format for that file, a "Read-only" badge, a lock badge on
    its tab), just scoped to these specific files instead of the entire sandbox. Optional; omit for none.
  */
  readOnlyFiles?: string[];
}

/*
  Registry of every sandbox. Each entry has matching code files read from disk at
  /sandboxes/<slug>/ (see src/lib/sandbox-examples.ts). `entry` sets which file opens as the
  active tab. This drives any sandbox listing and the Sandbox component's metadata lookup.

  Declare newest-first.
*/
export const sandboxes: SandboxMeta[] = [
  {
    slug: "holy-grail-layout",
    title: "Holy Grail Layout",
    description: "Header, two sidebars, main content, and footer — CSS Grid template areas with a responsive mobile stack.",
    template: "vanilla",
    entry: "/index.html"
  },
  {
    slug: "todo-list",
    title: "Todo List",
    description: "Add, toggle, and remove todos — TypeScript generics, useState with arrays.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "counter-app",
    title: "React Counter",
    description: "Increment, decrement, and reset a counter — useState fundamentals.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "async-retry-exponential-backoff",
    title: "Exponential Backoff Retry",
    description: "Simulates a flaky API call retried with doubling, capped delays — watch each attempt in the console.",
    template: "react-ts",
    entry: "/App.tsx"
  },
  {
    slug: "exponential-backoff-with-jitter",
    title: "Jitter vs. No Jitter",
    description: "Six concurrent clients retry a failing request — toggle Full Jitter to see retries scatter instead of stacking.",
    template: "react-ts",
    entry: "/App.tsx"
  }
];

// Looks up a sandbox's registry entry by slug.
export function getSandboxBySlug(slug: string): SandboxMeta | undefined {
  return sandboxes.find((s) => s.slug === slug);
}
