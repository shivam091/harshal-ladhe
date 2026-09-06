import type { ServerClientCapabilityRow } from "@/components/mdx/ServerClientComponentDiagram/ServerClientComponentDiagram.types";

// Vertical space allotted to each capability row.
export const ROW_H = 34;

// x position of the Server Component check/cross icon column.
export const SERVER_COL_X = 60;

// x position of the Client Component check/cross icon column.
export const CLIENT_COL_X = 500;

// x position where capability labels start (left-anchored).
export const LABEL_X = 110;

// y position of the header row's text baseline.
export const HEADER_Y = 32;

// y position of the rule under the header.
export const HEADER_RULE_Y = 44;

// y position of the first capability row's icon/label baseline.
export const FIRST_ROW_Y = 76;

/*
  The capabilities that most concretely distinguish a Server Component from a Client Component —
  ordered so the client-only interactivity traits come first, then the server-only traits, then the
  one line (shipping JS) that summarizes the whole tradeoff. This is the diagram the whole "two kinds
  of components in one tree" mental model hangs on: reading down either icon column shows that the
  split isn't arbitrary — it's drawn exactly at "does this need to run in the browser?"
*/
export const SERVER_CLIENT_CAPABILITIES: ServerClientCapabilityRow[] = [
  { label: "useState / useReducer", server: false, client: true },
  { label: "useEffect / useLayoutEffect", server: false, client: true },
  { label: "onClick / onChange handlers", server: false, client: true },
  { label: "Browser APIs (window, localStorage)", server: false, client: true },
  { label: "Top-level async/await", server: true, client: false },
  { label: "Direct backend access (DB, fs, secrets)", server: true, client: false },
  { label: "Re-renders after the initial load", server: false, client: true },
  { label: "Ships its own JS to the browser", server: false, client: true }
];
