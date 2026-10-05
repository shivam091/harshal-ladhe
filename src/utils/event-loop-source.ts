import type { EventLoopBlock, EventLoopLineRef, EventLoopSourceLine, EventLoopToken, EventLoopTokenType } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Two spaces per nesting level — matches the indentation every other generated snippet on the site uses.
const INDENT = "  ";

// Fallback for an async function whose name was cleared or typed as something JavaScript wouldn't accept — the generated source must always be runnable.
const FALLBACK_FUNCTION_NAME = "task";

// Function names come from free-text input, so anything that isn't a valid identifier is stripped rather than emitted as broken code.
export function toIdentifier(text: string): string {
  const cleaned = text.replace(/[^A-Za-z0-9_$]/g, "");
  if (!cleaned) return FALLBACK_FUNCTION_NAME;
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned;
}

// Token constructor — tiny, but keeps every line builder below reading like the code it emits.
function tok(text: string, type: EventLoopTokenType = "plain"): EventLoopToken {
  return { text, type };
}

// JSON.stringify gives a correctly escaped double-quoted literal, so any log text the user types stays valid JavaScript.
function str(text: string): EventLoopToken {
  return tok(JSON.stringify(text), "string");
}

// Delays are whole, non-negative milliseconds — mirrors how the editor clamps them, so source and simulation never disagree.
function num(value: number): EventLoopToken {
  return tok(String(Math.max(0, Math.round(value))), "number");
}

// Helpers the generated program leans on — defined once at the top only when a block actually needs them, so a plain quiz program stays free of noise.
const FAKE_FETCH_HELPER: EventLoopToken[] = [
  tok("const", "keyword"),
  tok(" "),
  tok("fakeFetch", "function"),
  tok(" = (url, ms) => "),
  tok("new", "keyword"),
  tok(" "),
  tok("Promise", "function"),
  tok("((resolve) => "),
  tok("setTimeout", "function"),
  tok("(() => "),
  tok("resolve", "function"),
  tok("(url), ms));")
];

// The awaited-delay helper for async blocks — a timer-backed promise, so `await wait(ms)` behaves exactly as the simulator models it.
const WAIT_HELPER: EventLoopToken[] = [
  tok("const", "keyword"),
  tok(" "),
  tok("wait", "function"),
  tok(" = (ms) => "),
  tok("new", "keyword"),
  tok(" "),
  tok("Promise", "function"),
  tok("((resolve) => "),
  tok("setTimeout", "function"),
  tok("(resolve, ms));")
];

// Line accumulator — one closure rather than threading an array through every recursive call.
function createEmitter() {
  const lines: EventLoopSourceLine[] = [];
  return {
    lines,
    emit(indent: number, tokens: EventLoopToken[], ref: EventLoopLineRef | null = null) {
      lines.push({ indent, tokens, ref });
    }
  };
}

// Named so the recursive emit helpers can share the accumulator's type without restating it.
type Emitter = ReturnType<typeof createEmitter>;

// Recursively walks the tree so the helper lines are only emitted when something in the program truly calls them.
function usesKind(program: EventLoopBlock[], predicate: (block: EventLoopBlock) => boolean): boolean {
  return program.some((block) => predicate(block) || block.branches.some((branch) => usesKind(branch, predicate)));
}

/*
  Shared shape for every single-callback API (setTimeout, queueMicrotask, requestAnimationFrame):
  an empty body collapses to `() => {}` on the call line itself, so a freshly added block reads as
  tidy code rather than an open brace with nothing inside.
*/
function emitCallbackCall(out: Emitter, block: EventLoopBlock, indent: number, callee: string, trailing: EventLoopToken[]) {
  const body = block.branches[0] ?? [];
  const head = [tok(callee, "function"), tok("(() => {")];
  if (body.length === 0) {
    out.emit(indent, [...head, tok("}"), ...trailing, tok(");")], { blockId: block.id, role: "call" });
    return;
  }
  out.emit(indent, head, { blockId: block.id, role: "call" });
  emitBody(out, body, indent + 1);
  out.emit(indent, [tok("}"), ...trailing, tok(");")], { blockId: block.id, role: "close" });
}

// A `.then` chain shared by Promise.resolve() and fakeFetch — each callback gets its own role so the simulator can light the exact `.then` currently running.
function emitThenChain(out: Emitter, block: EventLoopBlock, indent: number, head: EventLoopToken[]) {
  out.emit(indent, head, { blockId: block.id, role: "call" });
  block.branches.forEach((body, index) => {
    const last = index === block.branches.length - 1;
    const end = last ? ");" : ")";
    const thenHead = [tok("."), tok("then", "function"), tok("(() => {")];
    if (body.length === 0) {
      out.emit(indent + 1, [...thenHead, tok("}" + end)], { blockId: block.id, role: `then-${index}` });
      return;
    }
    out.emit(indent + 1, thenHead, { blockId: block.id, role: `then-${index}` });
    emitBody(out, body, indent + 2);
    out.emit(indent + 1, [tok("}" + end)], { blockId: block.id, role: `then-close-${index}` });
  });
}

// One block → its source lines. A switch over the closed kind set keeps every primitive's exact syntax in one place.
function emitBlock(out: Emitter, block: EventLoopBlock, indent: number) {
  switch (block.kind) {
    case "log":
      out.emit(indent, [tok("console"), tok("."), tok("log", "function"), tok("("), str(block.text), tok(");")], { blockId: block.id, role: "call" });
      return;
    case "timeout":
      emitCallbackCall(out, block, indent, "setTimeout", [tok(", "), num(block.delayMs)]);
      return;
    case "microtask":
      emitCallbackCall(out, block, indent, "queueMicrotask", []);
      return;
    case "raf":
      emitCallbackCall(out, block, indent, "requestAnimationFrame", []);
      return;
    case "promise":
      emitThenChain(out, block, indent, [tok("Promise", "function"), tok("."), tok("resolve", "function"), tok("()")]);
      return;
    case "fetch":
      emitThenChain(out, block, indent, [tok("fakeFetch", "function"), tok("("), str(block.text), tok(", "), num(block.delayMs), tok(")")]);
      return;
    case "async": {
      const name = toIdentifier(block.text);
      const awaited = block.delayMs > 0 ? [tok("wait", "function"), tok("("), num(block.delayMs), tok(")")] : [tok("null", "keyword")];
      out.emit(indent, [tok("async", "keyword"), tok(" "), tok("function", "keyword"), tok(" "), tok(name, "function"), tok("() {")], { blockId: block.id, role: "declare" });
      emitBody(out, block.branches[0] ?? [], indent + 1);
      out.emit(indent + 1, [tok("await", "keyword"), tok(" "), ...awaited, tok(";")], { blockId: block.id, role: "await" });
      emitBody(out, block.branches[1] ?? [], indent + 1);
      out.emit(indent, [tok("}")], { blockId: block.id, role: "close" });
      out.emit(indent, [tok(name, "function"), tok("();")], { blockId: block.id, role: "call" });
      return;
    }
  }
}

// Emits a list of sibling blocks at one indentation level — the recursion point every callback body re-enters.
function emitBody(out: Emitter, body: EventLoopBlock[], indent: number) {
  body.forEach((block) => emitBlock(out, block, indent));
}

/*
  Compiles the block tree into real, runnable JavaScript, line by line with tokens already
  classified — generated rather than parsed, so highlighting can never drift from what was emitted,
  and every line remembers which block it came from for active-line lighting.
*/
export function buildSourceLines(program: EventLoopBlock[]): EventLoopSourceLine[] {
  const out = createEmitter();
  const needsFetch = usesKind(program, (block) => block.kind === "fetch");
  const needsWait = usesKind(program, (block) => block.kind === "async" && block.delayMs > 0);
  if (needsFetch) out.emit(0, FAKE_FETCH_HELPER);
  if (needsWait) out.emit(0, WAIT_HELPER);
  if (needsFetch || needsWait) out.emit(0, []);
  if (program.length === 0) out.emit(0, [tok("// Add a block to start building the script.", "comment")]);
  emitBody(out, program, 0);
  return out.lines;
}

// Plain-text form for the copy button and for running the program in a real engine.
export function sourceLinesToText(lines: EventLoopSourceLine[]): string {
  return lines.map((line) => (line.tokens.length ? INDENT.repeat(line.indent) + line.tokens.map((t) => t.text).join("") : "")).join("\n");
}

// Key for looking a line up from a snapshot's activeLine — a string so a plain Map lookup suffices.
export function lineRefKey(ref: EventLoopLineRef): string {
  return `${ref.blockId}:${ref.role}`;
}
