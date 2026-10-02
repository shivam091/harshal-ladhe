import { createContentLookup, type ContentEntry } from "@/data/content";

// Aliased so snippet code reads in its own terms while sharing the common content shape.
export type Snippet = ContentEntry;

/*
  Each entry needs a matching app/(site)/(internal)/(snippet)/snippet/<slug>/page.mdx.
  Dates are deliberately absent — they come from git history at build time.
  Keep it oldest-first (append new snippets), since prev/next nav follows array order.
*/
export const snippets: Snippet[] = [
  {
    slug: "deep-freeze-objects",
    title: "Deep Freeze Objects in JavaScript",
    excerpt: "Recursively lock every object level for true immutability",
    description: "Lock objects and their children immutably — prevent accidental mutations and enforce deep immutability in strict mode.",
    category: ["JavaScript"],
    tags: ["javascript", "Object.freeze", "deep-freeze", "immutability", "secure-coding", "strict-mode"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/deep-freeze-objects/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Promotional digital graphic showing the phrase ‘JavaScript deepFreeze()’ with code-themed visuals and design elements aligned to the left."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication" }
    ]
  },
  {
    slug: "encapsulation-closure",
    title: "Encapsulation with Closures",
    excerpt: "Encapsulate private variables using JavaScript closure patterns.",
    description: "Master the functional approach to data encapsulation in JavaScript by leveraging lexical scoping to create immutable private variables.",
    category: ["JavaScript"],
    tags: ["javascript", "closures", "encapsulation", "design-patterns", "functional-programming", "private-state", "clean-code", "factory-pattern"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-closure/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Cover image illustrating private state encapsulation in JavaScript using closures, symbolized by a shield protecting internal variables."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "encapsulation-private-class-fields",
    title: "Encapsulation with Private Class Fields",
    excerpt: "Use native #private syntax to protect class properties in JavaScript.",
    description: "Implement native engine-level privacy in your OOP structures using ES2022+ private class fields and memory-efficient prototype methods.",
    category: ["JavaScript"],
    tags: ["javascript", "oop", "encapsulation", "classes", "clean-code"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/encapsulation-private-class-fields/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Representation of a JavaScript Class with a locked vault icon for private fields."
    },
    changelog: [
      { date: "2026-07-12", change: "Initial publication." }
    ]
  },
  {
    slug: "use-pointer-position",
    title: "`usePointerPosition`: Track Cursor & Touch Position in React",
    excerpt: "Track pointer position across mouse, touch, and pen input.",
    description: "Build a usePointerPosition hook using the Pointer Events API to track pointer coordinates in React state — one listener covers mouse, touch, and stylus input, with a useMousePosition alias for drop-in compatibility.",
    category: ["React"],
    tags: ["react", "hooks", "custom-hooks", "usePointerPosition", "useMousePosition", "pointer-events", "typescript"],
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/use-pointer-position/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Neon-styled illustration of the React usePointerPosition hook tracking cursor and touch coordinates across mouse, touch, and pen input, with viewport and element-relative pointer tracking examples."
    },
    changelog: [
      { date: "2026-09-23", change: "Initial publication." }
    ]
  },
  {
    slug: "git-fix-dates",
    title: "`git fix-dates`: Restore Commit Dates After a Rebase",
    excerpt: "Reset committer dates to author dates, then safely force-push.",
    description: "A production-ready git fix-dates command that resets every commit's committer date to its author date after a rebase or amend — preserving merges and committer identity — then force-pushes with a pinned lease so nobody else's work is lost.",
    category: ["Git"],
    tags: ["git", "git-commands", "rebase", "commit-dates", "force-with-lease", "filter-branch", "bash", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-fix-dates/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Terminal-styled illustration of the git fix-dates command aligning each commit's committer date with its author date on a Git commit graph before a safe force-push."
    },
    changelog: [
      { date: "2026-10-02", change: "Initial publication." }
    ]
  },
  {
    slug: "git-absorb",
    title: "`git absorb`: Automatic Fixup Commits for Review Feedback",
    excerpt: "Fold staged fixes into the right earlier commits automatically.",
    description: "Use git absorb to turn staged review fixes into fixup! commits aimed at the exact commits they belong to, then autosquash them in one step — with the flags and config that make it part of an everyday Git workflow.",
    category: ["Git"],
    tags: ["git", "git-commands", "git-absorb", "fixup", "autosquash", "rebase", "code-review", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-absorb/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Terminal-styled illustration of git absorb routing staged changes into fixup commits that target earlier commits on a Git branch."
    },
    changelog: [
      { date: "2026-10-02", change: "Initial publication." }
    ]
  },
  {
    slug: "git-sync",
    title: "`git sync`: Update Your Branch from `main` in One Command",
    excerpt: "Fetch, fast-forward main, and rebase your branch onto it.",
    description: "A production-ready git sync command that fetches, fast-forwards the local default branch without checking it out, then rebases or merges the current branch onto it — with autostash, worktree safety, clear conflict guidance, and a printed undo command.",
    category: ["Git"],
    tags: ["git", "git-commands", "rebase", "merge", "autostash", "worktrees", "bash", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-sync/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Terminal-styled illustration of git sync fetching the remote, fast-forwarding main, and rebasing a feature branch onto the latest commit."
    },
    changelog: [
      { date: "2026-10-02", change: "Initial publication." }
    ]
  },
  {
    slug: "git-prune-branches",
    title: "`git prune-branches`: Delete Merged and Squash-Merged Branches",
    excerpt: "Safely delete local branches that have already landed.",
    description: "A production-ready git prune-branches command that deletes local branches merged into the default branch — including GitHub squash merges that git branch --merged misses — while protecting worktree checkouts and unmerged work, and printing a restore command for each deletion.",
    category: ["Git"],
    tags: ["git", "git-commands", "branches", "squash-merge", "git-cherry", "cleanup", "bash", "cli"],
    link: {
      label: "Read the full post: Advanced Git: Rebasing, Internals, and Real-World Workflows",
      href: "/post/git/advanced-git-techniques-and-workflows"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-prune-branches/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Terminal-styled illustration of git prune-branches removing merged and squash-merged feature branches while keeping main and active work."
    },
    changelog: [
      { date: "2026-10-02", change: "Initial publication." }
    ]
  },
  {
    slug: "git-aliases",
    title: "Git Aliases Worth Adding to Your `~/.gitconfig`",
    excerpt: "Tested Git aliases for history, undo, fixups, and searching.",
    description: "A curated, tested set of Git aliases for everyday work — compact status and graph logs, safe undo and unstage, one-step fixup commits, WIP parking, safe force-pushes, and quick ways to find branches, commits, and contributors.",
    category: ["Git"],
    tags: ["git", "git-aliases", "gitconfig", "productivity", "fixup", "force-with-lease", "cli"],
    link: {
      label: "Read the full post: Git Basics: A Beginner's Guide to Version Control",
      href: "/post/git/git-basics-for-beginners"
    },
    image: {
      path: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/goodies/snippets/git-aliases/cover.png",
      width: 1536,
      height: 1024,
      type: "image/png",
      alt: "Terminal-styled illustration of a ~/.gitconfig alias block with short Git commands expanding into their full versions."
    },
    changelog: [
      { date: "2026-10-02", change: "Initial publication." }
    ]
  }
];

// Array-order based rather than git-dated so the lookups stay client-safe — git can't be read in the browser.
export const { getBySlug: getSnippetBySlug, getNavigation: getSnippetNavigation } = createContentLookup(snippets);
