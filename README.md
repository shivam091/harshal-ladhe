# Harshal V. LADHE — Personal Site

Personal portfolio and technical blog for Harshal V. LADHE — software engineer, freelancer, and open-source contributor. Built with the Next.js App Router, hand-rolled animations, and a theming system that respects user preference (system / light / dark / soft-dark).

**Live:** [harshal-ladhe.vercel.app](https://harshal-ladhe.vercel.app)

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, MDX)
- **UI:** [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Linaria](https://linaria.dev) (zero-runtime CSS-in-JS) for component-scoped styles, via [`next-with-linaria`](https://github.com/dlehmhus/next-with-linaria); Sass (7-1 architecture) for global design tokens, themes, and keyframe animations
- **Animation:** [`@react-spring/web`](https://react-spring.dev), [`motion`](https://motion.dev), [`Typed.js`](https://github.com/mattboldt/typed.js) for the hero role typewriter
- **Accessible primitives:** [Radix UI](https://www.radix-ui.com) (dropdown menu, collapsible, tooltip)
- **Search:** [Fuse.js](https://fusejs.io) client-side fuzzy search over posts, snippets, and series — indexed once at module load, queried locally with no backend round-trip (`SearchModal`)
- **Content:** MDX pages with a custom remark plugin that reads each page's last-modified date from git history; syntax highlighting via [Shiki](https://shiki.style)
- **Backend:** Next.js Route Handlers (`src/app/api`) backed by [MongoDB](https://www.mongodb.com) for the contact form and page-view counter, with [Google reCAPTCHA v3](https://www.google.com/recaptcha/about/) spam protection on the contact form

## Getting Started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

### Scripts

| Command         | Description                              |
|-----------------|-------------------------------------------|
| `npm run dev`   | Start the dev server (Turbopack)          |
| `npm run build` | Production build                          |
| `npm run start` | Serve the production build                |
| `npm run lint`  | Run ESLint                                 |

## Project Structure

```
src/
├── app/          # Routes (App Router) — grouped into (site)/(home) and (site)/(internal)
    ├── api/      # Holds route handlers (contact form, page-view counter)
├── components/   # UI components, one folder per component
├── config/       # Site-wide metadata and page name/title registry (src/config/site.ts, page-names.ts)
├── constants/    # Literal values — design tokens, spring presets, theme palettes (themes/), fake-data word lists
├── context/      # React context providers (theme, sound, etc.)
├── data/         # Static content data — navigation links, social links, stack, FAQs, copyright text
├── helpers/      # Small composed functions built on constants/utils for one feature (e.g. fake-data generators)
├── hooks/        # Custom hooks (boop animations, mouse position, touch, reduced motion)
├── icons/        # SVG icon registry (icons.tsx) and complex one-off animated icons (hamburger toggle, RSS feed) that own their spring/boop state
├── lib/          # Build-time and server-only integrations — MongoDB client, remark/rehype (Shiki) plugins, git-dates
├── styles/       # Global Sass tokens and partials (7-1 architecture)
└── utils/        # Framework-agnostic, general-purpose helper functions (dates, strings, color, random, objects)
```

## Architecture Notes

- **Island architecture:** most components render as zero-JS server components; only the parts that genuinely need the browser (theme switching, nav highlighting, the mobile drawer, pointer-driven effects) declare `"use client"`, kept as narrow as possible.
- **Styling split:** each component owns a colocated `*.styles.ts` file (Linaria `css`/`styled`, extracted to static CSS at build time — no runtime style injection). Design tokens, theme variables (light/dark/soft-dark), breakpoints, and shared `@keyframes` live once in `src/styles` (a 7-1-style Sass structure) and are consumed from component styles as CSS custom properties or bare keyframe names.
- **Theming:** `ThemeContext` persists the chosen scheme to `localStorage` and reacts live to OS-level `prefers-color-scheme` changes when "system" is selected.
- **Reduced motion:** animation hooks (`useBoop`, `useTransformBoop`) check `prefers-reduced-motion` and skip the animated transform entirely rather than just speeding it up.
- **Git-dated content:** MDX pages don't hardcode a "last updated" date — a custom remark plugin (`src/lib/remark-git-dates.mjs`) reads it from git at build time. Vercel's build checkout has no `origin` remote configured, so `git fetch --unshallow` (the previous workaround, removed) always fails there; the project instead sets `VERCEL_DEEP_CLONE=true` in Vercel's Environment Variables settings so the initial checkout itself is a full clone.
- **Types:** no centralized `interfaces/`/`types/` folder — each component owns a colocated `*.types.ts` file for its prop interfaces and any component-scoped type aliases, alongside its `*.styles.ts`. Non-component code (hooks, data modules, route handlers, etc.) declares its own interfaces/types directly in the file that uses them.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushing to `main` triggers a production build.
