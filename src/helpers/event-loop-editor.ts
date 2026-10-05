import { eventLoopPresets } from "@/data/event-loop-presets";
import type { EventLoopConsoleLine, EventLoopSpeed, EventLoopBlock, EventLoopBlockKind, EventLoopEditorState, EventLoopInsertTarget, EventLoopPresetMeta, EventLoopShareableState } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Deep enough for a `.then` inside a timeout inside an async function, shallow enough that the editor's indentation stays readable on a phone.
export const MAX_BLOCK_DEPTH = 5;

// Generous for teaching programs, but small enough that a pasted permalink can't make the simulator or editor crawl.
const MAX_BLOCKS = 80;

// Upper bound for any delay — the virtual clock doesn't care, but the editor's number input and the lamp readouts stay sensible.
export const MAX_DELAY_MS = 10000;

// Longest log text/name kept — long enough for a sentence, short enough to fit on a rail car.
const MAX_TEXT_LENGTH = 60;

// The closed set the sanitiser accepts — anything else in a shared link is dropped rather than trusted.
const BLOCK_KINDS: EventLoopBlockKind[] = ["log", "timeout", "microtask", "promise", "fetch", "async", "raf"];

// Human labels for the add-block menu and each block's badge, in the order the menu lists them.
export const BLOCK_KIND_LABELS: Record<EventLoopBlockKind, string> = {
  log: "console.log",
  timeout: "setTimeout",
  promise: "Promise.then",
  microtask: "queueMicrotask",
  async: "async / await",
  fetch: "fakeFetch",
  raf: "requestAnimationFrame"
};

// Milliseconds per step — 1× is slow enough to read each explanation, 4× for watching the overall shape of a run.
export const EVENT_LOOP_SPEEDS: EventLoopSpeed[] = [
  { label: "0.5×", intervalMs: 2400 },
  { label: "1×", intervalMs: 1400 },
  { label: "2×", intervalMs: 700 },
  { label: "4×", intervalMs: 300 }
];

// Random rather than sequential so blocks added after loading a permalink or preset can never collide with ids already in the tree.
export function createBlockId(): string {
  return `blk-${Math.random().toString(36).slice(2, 9)}`;
}

// How many callback bodies a kind owns — the one rule that keeps `branches` well-formed for every primitive.
function defaultBranchCount(kind: EventLoopBlockKind): number {
  if (kind === "log") return 0;
  if (kind === "async") return 2;
  return 1;
}

// A fresh block with sensible starter values, so a newly added block already reads as plausible code.
export function createBlock(kind: EventLoopBlockKind): EventLoopBlock {
  const text = kind === "log" ? "hello" : kind === "async" ? "run" : kind === "fetch" ? "/api/data" : "";
  const delayMs = kind === "timeout" ? 0 : kind === "fetch" ? 200 : 0;
  return { id: createBlockId(), kind, text, delayMs, branches: Array.from({ length: defaultBranchCount(kind) }, () => []) };
}

// Callback-body headings for the editor — named the way the generated source reads, so the editor and code view describe the same thing.
export function branchLabels(block: EventLoopBlock): string[] {
  if (block.kind === "async") return ["Before await", "After await"];
  if (block.kind === "promise" || block.kind === "fetch") return block.branches.map((_, index) => `.then #${index + 1}`);
  return block.branches.map(() => "Callback");
}

// Gives every block in a tree new ids — applying the same preset twice must never produce two blocks sharing an id.
function cloneWithFreshIds(program: EventLoopBlock[]): EventLoopBlock[] {
  return program.map((block) => ({ ...block, id: createBlockId(), branches: block.branches.map(cloneWithFreshIds) }));
}

// Uses the classic quiz's own static ids rather than fresh random ones, so the server render and the client's hydration render produce identical markup.
export function createDefaultEditorState(): EventLoopEditorState {
  return { program: eventLoopPresets[0].program };
}

// Today the whole state is shareable; routed through here anyway so a future UI-only field can't leak into permalinks by accident.
export function toShareableState(state: EventLoopEditorState): EventLoopShareableState {
  return { program: state.program };
}

// Total block count across the tree — what MAX_BLOCKS is measured against.
export function countBlocks(program: EventLoopBlock[]): number {
  return program.reduce((total, block) => total + 1 + block.branches.reduce((sum, branch) => sum + countBlocks(branch), 0), 0);
}

/*
  Validates anything decoded from a permalink or localStorage into a well-formed program — wrong
  kinds, missing fields, oversized text, runaway nesting, and duplicate ids are all repaired or
  dropped, because the simulator and editor both assume a clean tree.
*/
export function sanitizeProgram(value: unknown): EventLoopBlock[] | null {
  const seen = new Set<string>();
  let budget = MAX_BLOCKS;

  // Depth-first so the block budget is spent in reading order — a truncated program keeps its opening lines, not random fragments.
  function walk(list: unknown, depth: number): EventLoopBlock[] {
    if (!Array.isArray(list) || depth > MAX_BLOCK_DEPTH) return [];
    const result: EventLoopBlock[] = [];
    for (const raw of list) {
      if (budget <= 0 || typeof raw !== "object" || raw === null) continue;
      const candidate = raw as Partial<EventLoopBlock>;
      if (!candidate.kind || !BLOCK_KINDS.includes(candidate.kind)) continue;
      budget -= 1;
      let id = typeof candidate.id === "string" && candidate.id ? candidate.id.slice(0, 40) : createBlockId();
      if (seen.has(id)) id = createBlockId();
      seen.add(id);
      const rawBranches = Array.isArray(candidate.branches) ? candidate.branches : [];
      const wanted = candidate.kind === "promise" || candidate.kind === "fetch" ? Math.min(Math.max(rawBranches.length, 1), 6) : defaultBranchCount(candidate.kind);
      result.push({
        id,
        kind: candidate.kind,
        text: typeof candidate.text === "string" ? candidate.text.slice(0, MAX_TEXT_LENGTH) : "",
        delayMs: clampDelay(Number(candidate.delayMs)),
        branches: Array.from({ length: wanted }, (_, index) => walk(rawBranches[index], depth + 1))
      });
    }
    return result;
  }

  if (typeof value !== "object" || value === null) return null;
  const program = (value as Partial<EventLoopShareableState>).program;
  if (!Array.isArray(program)) return null;
  return walk(program, 1);
}

// Delays are whole milliseconds within a sane range — NaN from a cleared input becomes 0 rather than poisoning the virtual clock.
export function clampDelay(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_DELAY_MS, Math.max(0, Math.round(value)));
}

// Immutable recursive edit — every mutation below is "find this block, swap in a new one", so they all share this one walker.
function mapBlock(program: EventLoopBlock[], id: string, transform: (block: EventLoopBlock) => EventLoopBlock): EventLoopBlock[] {
  return program.map((block) => (block.id === id ? transform(block) : { ...block, branches: block.branches.map((branch) => mapBlock(branch, id, transform)) }));
}

// Applies `transform` to the sibling list that directly contains `id` — removal and reordering both act on the parent list, not the block.
function mapParentList(program: EventLoopBlock[], id: string, transform: (list: EventLoopBlock[]) => EventLoopBlock[]): EventLoopBlock[] {
  if (program.some((block) => block.id === id)) return transform(program);
  return program.map((block) => ({ ...block, branches: block.branches.map((branch) => mapParentList(branch, id, transform)) }));
}

// Text and delay are re-clamped here too, so a live keystroke can never push the tree outside what sanitizeProgram would accept.
export function updateBlock(state: EventLoopEditorState, id: string, patch: Partial<Pick<EventLoopBlock, "text" | "delayMs">>): EventLoopEditorState {
  const clean = { ...patch };
  if (clean.text !== undefined) clean.text = clean.text.slice(0, MAX_TEXT_LENGTH);
  if (clean.delayMs !== undefined) clean.delayMs = clampDelay(clean.delayMs);
  return { program: mapBlock(state.program, id, (block) => ({ ...block, ...clean })) };
}

// Appends a new block to the chosen body — silently refuses past MAX_BLOCKS so a share link can always be decoded back in full.
export function insertBlock(state: EventLoopEditorState, target: EventLoopInsertTarget, kind: EventLoopBlockKind): EventLoopEditorState {
  if (countBlocks(state.program) >= MAX_BLOCKS) return state;
  const fresh = createBlock(kind);
  if (target.parentId === null) return { program: [...state.program, fresh] };
  return {
    program: mapBlock(state.program, target.parentId, (block) => ({
      ...block,
      branches: block.branches.map((branch, index) => (index === target.branchIndex ? [...branch, fresh] : branch))
    }))
  };
}

// Removing a block takes its nested callbacks with it — the same thing deleting those lines of source would do.
export function removeBlock(state: EventLoopEditorState, id: string): EventLoopEditorState {
  return { program: mapParentList(state.program, id, (list) => list.filter((block) => block.id !== id)) };
}

// Swaps a block with its neighbour within the same body — reordering never changes nesting, which keeps the move predictable from the keyboard.
export function moveBlock(state: EventLoopEditorState, id: string, direction: -1 | 1): EventLoopEditorState {
  return {
    program: mapParentList(state.program, id, (list) => {
      const index = list.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    })
  };
}

// Chains another `.then` — capped at six, beyond which a chain stops illustrating anything new.
export function addThen(state: EventLoopEditorState, id: string): EventLoopEditorState {
  return { program: mapBlock(state.program, id, (block) => (block.branches.length >= 6 ? block : { ...block, branches: [...block.branches, []] })) };
}

// Drops the last `.then` but always keeps one, since a promise block with no callback has nothing to show.
export function removeThen(state: EventLoopEditorState, id: string): EventLoopEditorState {
  return { program: mapBlock(state.program, id, (block) => (block.branches.length <= 1 ? block : { ...block, branches: block.branches.slice(0, -1) })) };
}

// Fresh ids every time, so applying a preset and then adding blocks can never clash with ids from an earlier copy.
export function applyPreset(preset: EventLoopPresetMeta): EventLoopEditorState {
  return { program: cloneWithFreshIds(preset.program) };
}

// Reset means "back to the classic quiz" — the one program every explanation of the event loop starts from.
export function resetProgram(): EventLoopEditorState {
  return createDefaultEditorState();
}

// Cheap deterministic string hash — enough to scramble the prediction pool identically on server and client without Math.random.
function hashText(text: string): number {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) | 0;
  return hash;
}

/*
  The prediction pool: the real console lines in a scrambled but stable order. If the scramble
  happens to land on the true order it's rotated by one, so the pool never hands over the answer.
*/
export function shufflePredictionPool(answer: EventLoopConsoleLine[]): EventLoopConsoleLine[] {
  const shuffled = [...answer].sort((a, b) => hashText(a.text + a.id) - hashText(b.text + b.id));
  const sameOrder = shuffled.every((line, index) => line.text === answer[index].text);
  return sameOrder && shuffled.length > 1 ? [...shuffled.slice(1), shuffled[0]] : shuffled;
}
