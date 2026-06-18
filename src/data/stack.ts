import type {ComponentType } from "react";

import IconNextjs from "@/icons/logos/IconNextjs";
import IconReact from "@/icons/logos/IconReact";
import IconTypeScript from "@/icons/logos/IconTypeScript";
import IconMdx from "@/icons/logos/IconMdx";
import IconLinaria from "@/icons/logos/IconLinaria";
import IconScss from "@/icons/logos/IconScss";
import IconFramerMotion from "@/icons/logos/IconFramerMotion";
import IconReactSpring from "@/icons/logos/IconReactSpring";
import IconShiki from "@/icons/logos/IconShiki";
import IconSandpack from "@/icons/logos/IconSandpack";
import IconVercel from "@/icons/logos/IconVercel";
import IconMongoDB from "@/icons/logos/IconMongoDB";

// Shape of a single technology entry displayed in the CoreStack grid.
export interface StackItem {
  name: string;
  version: string;
  description: string;
  href: string;
  // Inline SVG logo component for this technology.
  logoComponent: ComponentType<{ size?: number; isBooped?: boolean }>;
}

// Technologies powering this blog, rendered as clickable cards on the "How Did I Build My Blog" page.
export const stack: StackItem[] = [
  {
    name: "Next.js",
    version: "16",
    description: "The React framework for the web. Handles routing, rendering, bundling, and image optimisation out of the box.",
    href: "https://nextjs.org",
    logoComponent: IconNextjs
  },
  {
    name: "React",
    version: "19",
    description: "The UI library everything is built on. Server Components, hooks, and a component model that scales from a single button to the whole page.",
    href: "https://react.dev",
    logoComponent: IconReact
  },
  {
    name: "TypeScript",
    version: "5",
    description: "Static types across every file. Catches mistakes at compile time and makes refactoring fearless.",
    href: "https://www.typescriptlang.org",
    logoComponent: IconTypeScript
  },
  {
    name: "MDX",
    version: "3",
    description: "Markdown with superpowers. Every blog post is an MDX file — full React component support right inside prose.",
    href: "https://mdxjs.com",
    logoComponent: IconMdx
  },
  {
    name: "Linaria",
    version: "8",
    description: "Zero-runtime CSS-in-JS. Compiles styled components to plain CSS modules at build time — no style injection, no hydration cost.",
    href: "https://linaria.dev",
    logoComponent: IconLinaria
  },
  {
    name: "SCSS",
    version: "1",
    description: "Sass modules for global typography, animation keyframes, and design abstractions that live outside the component tree.",
    href: "https://sass-lang.com",
    logoComponent: IconScss
  },
  {
    name: "Framer Motion",
    version: "12",
    description: "Physics-based animations for layout transitions, hover effects, and the mobile navigation drawer.",
    href: "https://www.framer.com/motion",
    logoComponent: IconFramerMotion
  },
  {
    name: "React Spring",
    version: "10",
    description: "Spring-physics animation library. Powers the booping icons and hover micro-interactions with natural, interruptible motion instead of fixed-duration easing.",
    href: "https://www.react-spring.dev",
    logoComponent: IconReactSpring
  },
  {
    name: "Shiki",
    version: "4",
    description: "Syntax highlighter powering every code block. Uses real TextMate grammars and VS Code themes to colour code at build time — no client-side highlighting.",
    href: "https://shiki.style",
    logoComponent: IconShiki
  },
  {
    name: "Sandpack",
    version: "2",
    description: "Live, in-browser code playgrounds from CodeSandbox. Lets readers run and edit interactive React examples right inside a post.",
    href: "https://sandpack.codesandbox.io",
    logoComponent: IconSandpack
  },
  {
    name: "Vercel",
    version: "",
    description: "Deployment and hosting. Zero-config builds, automatic preview URLs per branch, and a global CDN.",
    href: "https://vercel.com",
    logoComponent: IconVercel
  },
  {
    name: "MongoDB",
    version: "8",
    description: "Document database for flexible, schema-less data storage. Used for persisting dynamic content with a JSON-native query model.",
    href: "https://www.mongodb.com",
    logoComponent: IconMongoDB
  }
];
