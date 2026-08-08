import type { SandboxMeta } from "@/interfaces/sandbox";

/*
  Registry of every sandbox. Each entry has matching code files read from disk at
  /sandboxes/<slug>/ (see src/lib/sandbox-examples.ts). `entry` sets which file opens as the
  active tab. This drives any sandbox listing and the Sandbox component's metadata lookup.

  Declare newest-first.
*/
export const sandboxes: SandboxMeta[] = [
  {
    slug: "css-transitions-guide",
    title: "CSS Transitions Playground",
    description: "Tune duration, delay, and timing function (preset, cubic-bezier, or steps) live against a transform + background-color transition.",
    template: "vanilla",
    entry: "/index.html"
  },
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
