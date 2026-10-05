import { toIdentifier } from "@/utils/event-loop-source";
import type {
  EventLoopBlock,
  EventLoopCar,
  EventLoopConsoleLine,
  EventLoopLineRef,
  EventLoopPhase,
  EventLoopSimulation,
  EventLoopSnapshot,
  EventLoopWebApi
} from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Hard ceiling on recorded steps — the block model can't loop forever, but a deeply nested program could still produce more steps than anyone would scrub through.
const MAX_STEPS = 600;

// One frame at 60 Hz, rounded — the browser's render opportunities land on these boundaries of the virtual clock.
const FRAME_MS = 16;

// What a queued car will do once it reaches the call stack — kept off the car itself so snapshots stay plain, serialisable data.
interface Job {
  frame: string;
  body: EventLoopBlock[];
  lineRef: EventLoopLineRef | null;
  startExplanation: string;
  // Runs after the body returns — how a `.then` chain queues its next callback, or a resolved promise queues its reactions.
  after?: () => void;
}

// A pending Web API plus the bookkeeping the snapshot doesn't need: enqueue order for tie-breaking equal due times, and what to queue when it fires.
interface PendingWebApi extends EventLoopWebApi {
  seq: number;
  fire: () => void;
}

// Thrown to unwind the whole run once the step cap is hit — simpler than threading a "stop" flag through every recursive call.
class StepLimitReached extends Error {}

/*
  Deterministic event-loop interpreter for the block model. It never evaluates real JavaScript —
  it follows the HTML event-loop processing model directly: run one task to completion, drain the
  microtask queue completely (including microtasks queued while draining), take a render
  opportunity if a frame is due and rAF callbacks are waiting, then move due timers onto the task
  queue (ordered by due time, then by the order they were set) and pick the next task. Await
  continuations and `.then` reactions are microtasks; fakeFetch/wait resolve from a timer task,
  exactly as the generated helper source does. Tasks take zero virtual time, so only timer delays
  and frame boundaries advance the clock.
*/
export function simulateEventLoop(program: EventLoopBlock[]): EventLoopSimulation {
  let seq = 0;
  let clock = 0;
  let nextFrameAt = FRAME_MS;
  let phase: EventLoopPhase = "task";
  const stack: EventLoopCar[] = [];
  const webApis: PendingWebApi[] = [];
  const microtasks: EventLoopCar[] = [];
  const macrotasks: EventLoopCar[] = [];
  const rafCallbacks: EventLoopCar[] = [];
  const consoleLines: EventLoopConsoleLine[] = [];
  const jobs = new Map<string, Job>();
  const snapshots: EventLoopSnapshot[] = [];

  // Sequential ids keep every run byte-for-byte identical, which matters for SSR hydration and for stable React keys across re-renders.
  function nextId(prefix: string): string {
    seq += 1;
    return `${prefix}-${seq}`;
  }

  // Freezes the current runtime into a snapshot — arrays are copied, but the cars inside are never mutated once created, so a shallow copy is enough.
  function record(activeLine: EventLoopLineRef | null, explanation: string) {
    if (snapshots.length >= MAX_STEPS) throw new StepLimitReached();
    snapshots.push({
      stack: [...stack],
      webApis: webApis.map(({ id, label, blockId, kind, dueAtMs }) => ({ id, label, blockId, kind, dueAtMs })),
      microtasks: [...microtasks],
      macrotasks: [...macrotasks],
      rafCallbacks: [...rafCallbacks],
      console: [...consoleLines],
      activeLine,
      phase,
      clockMs: clock,
      explanation
    });
  }

  // Every queue entry goes through here so its car and its job are always registered together.
  function enqueue(queue: EventLoopCar[], label: string, blockId: string | null, job: Job) {
    const car = { id: nextId("car"), label, blockId };
    jobs.set(car.id, job);
    queue.push(car);
  }

  // Short-lived frame for a synchronous API call (console.log, setTimeout…) — shown on the stack for the one step that explains it.
  function withFrame(label: string, blockId: string, run: () => void) {
    stack.push({ id: nextId("frame"), label, blockId });
    run();
    stack.pop();
  }

  // Due time is fixed at call time (clock + delay), and the shared sequence counter preserves call order for timers that fall due together.
  function addWebApi(kind: PendingWebApi["kind"], label: string, blockId: string, delayMs: number, fire: () => void) {
    const id = nextId("api");
    webApis.push({ id, kind, label, blockId, dueAtMs: clock + delayMs, seq, fire });
  }

  // Queues `.then` callback `index` of a chain — called once the promise ahead of it has settled, which is the whole reason a chain runs one link per microtask.
  function queueThen(block: EventLoopBlock, index: number) {
    const ordinal = index + 1;
    const label = block.kind === "fetch" ? `.then #${ordinal} (${block.text})` : `.then #${ordinal}`;
    enqueue(microtasks, label, block.id, {
      frame: `.then callback #${ordinal}`,
      body: block.branches[index] ?? [],
      lineRef: { blockId: block.id, role: `then-${index}` },
      startExplanation: `.then callback #${ordinal} reaches the front of the microtask queue, so it moves onto the call stack ahead of any waiting task.`,
      after:
        index + 1 < block.branches.length
          ? () => {
              queueThen(block, index + 1);
              record(
                { blockId: block.id, role: `then-${index + 1}` },
                `Callback #${ordinal} has returned, which resolves the promise it produced — so callback #${ordinal + 1} only now joins the microtask queue.`
              );
            }
          : undefined
    });
  }

  // Queues the remainder of an async function's body — an await continuation is always a microtask, never a task.
  function queueContinuation(block: EventLoopBlock, name: string) {
    enqueue(microtasks, `${name}() resume`, block.id, {
      frame: `${name}() (resumed)`,
      body: block.branches[1] ?? [],
      lineRef: { blockId: block.id, role: "await" },
      startExplanation: `${name}() picks up straight after its await — the rest of its body runs as this microtask.`
    });
  }

  // Executes one block synchronously on the current call stack — the switch mirrors emitBlock's, one case per primitive.
  function runBlock(block: EventLoopBlock) {
    const call = { blockId: block.id, role: "call" };
    switch (block.kind) {
      case "log":
        withFrame(`console.log(${JSON.stringify(block.text)})`, block.id, () => {
          consoleLines.push({ id: nextId("out"), text: block.text });
          record(call, `console.log prints “${block.text}” immediately, because synchronous code always runs to completion before anything queued can start.`);
        });
        return;
      case "timeout": {
        const ms = Math.max(0, block.delayMs);
        withFrame(`setTimeout(…, ${ms})`, block.id, () => {
          addWebApi("timer", `setTimeout ${ms} ms`, block.id, ms, () =>
            enqueue(macrotasks, `setTimeout ${ms} ms`, block.id, {
              frame: `setTimeout callback (${ms} ms)`,
              body: block.branches[0] ?? [],
              lineRef: call,
              startExplanation: `The ${ms} ms timer callback is the oldest task in the queue, so the loop moves it onto the empty call stack.`
            })
          );
          record(
            call,
            ms === 0
              ? "setTimeout hands its callback to the timer Web API — even at 0 ms it can only ever run in a later task, never the current one."
              : `setTimeout hands its callback to the timer Web API, which holds it for ${ms} ms before it may join the task queue.`
          );
        });
        return;
      }
      case "microtask":
        withFrame("queueMicrotask(…)", block.id, () => {
          enqueue(microtasks, "queueMicrotask", block.id, {
            frame: "queueMicrotask callback",
            body: block.branches[0] ?? [],
            lineRef: call,
            startExplanation: "The queueMicrotask callback is next in the microtask queue, so it runs before any task or render step."
          });
          record(call, "queueMicrotask puts its callback straight onto the microtask queue, which drains the moment the call stack empties.");
        });
        return;
      case "raf":
        withFrame("requestAnimationFrame(…)", block.id, () => {
          enqueue(rafCallbacks, "rAF callback", block.id, {
            frame: "rAF callback",
            body: block.branches[0] ?? [],
            lineRef: call,
            startExplanation: "The requestAnimationFrame callback runs inside the render step, so anything it changes lands in this very frame."
          });
          record(call, "requestAnimationFrame parks its callback until the browser's next render opportunity, just before it paints a frame.");
        });
        return;
      case "promise":
        withFrame("Promise.resolve().then(…)", block.id, () => {
          if (block.branches.length > 0) queueThen(block, 0);
          record(
            call,
            block.branches.length > 1
              ? "Promise.resolve() is already settled, so its first .then callback is queued as a microtask straight away — the later ones wait for the link before them."
              : "Promise.resolve() is already settled, so its .then callback is queued as a microtask straight away."
          );
        });
        return;
      case "fetch": {
        const ms = Math.max(0, block.delayMs);
        withFrame(`fakeFetch(${JSON.stringify(block.text)})`, block.id, () => {
          addWebApi("fetch", `fakeFetch ${block.text}`, block.id, ms, () =>
            enqueue(macrotasks, `resolve ${block.text}`, block.id, {
              frame: "resolve(url)",
              body: [],
              lineRef: call,
              startExplanation: `The fakeFetch timer for ${block.text} fires as a task and resolves its promise.`,
              after: () => {
                if (block.branches.length === 0) return;
                queueThen(block, 0);
                record({ blockId: block.id, role: "then-0" }, "Resolving the promise is what queues its first .then callback — as a microtask, to run before the next task.");
              }
            })
          );
          record(call, `fakeFetch starts a timer-backed request; none of its .then callbacks can be queued until the promise resolves ${ms} ms from now.`);
        });
        return;
      }
      case "async": {
        const name = toIdentifier(block.text);
        const ms = Math.max(0, block.delayMs);
        stack.push({ id: nextId("frame"), label: `${name}()`, blockId: block.id });
        record(call, `Calling ${name}() runs its body synchronously, right up to the first await — async doesn't make the start of a function asynchronous.`);
        runBody(block.branches[0] ?? []);
        const awaitLine = { blockId: block.id, role: "await" };
        if (ms === 0) {
          queueContinuation(block, name);
          record(awaitLine, `await pauses ${name}() and queues the rest of its body as a microtask, so control returns to the caller first.`);
        } else {
          addWebApi("timer", `wait(${ms}) for ${name}()`, block.id, ms, () =>
            enqueue(macrotasks, `resolve wait(${ms})`, block.id, {
              frame: "resolve()",
              body: [],
              lineRef: awaitLine,
              startExplanation: `The ${ms} ms timer behind wait() fires as a task and resolves the promise ${name}() is awaiting.`,
              after: () => {
                queueContinuation(block, name);
                record(awaitLine, `With its promise resolved, ${name}()'s continuation joins the microtask queue rather than running on the spot.`);
              }
            })
          );
          record(awaitLine, `await pauses ${name}() until wait(${ms}) resolves, and the caller carries on in the meantime.`);
        }
        stack.pop();
        return;
      }
    }
  }

  // A callback body is just a list of statements run in order — the recursion point for nested blocks.
  function runBody(body: EventLoopBlock[]) {
    body.forEach(runBlock);
  }

  // Moves a queued car onto the stack and runs it to completion — the same routine for tasks, microtasks, and rAF callbacks, because once on the stack they behave identically.
  function runJob(car: EventLoopCar) {
    const job = jobs.get(car.id);
    if (!job) return;
    stack.push({ id: nextId("frame"), label: job.frame, blockId: car.blockId });
    record(job.lineRef, job.startExplanation);
    runBody(job.body);
    job.after?.();
    stack.pop();
  }

  // Microtask checkpoint: keeps going until the queue is truly empty, which is exactly how a microtask that queues another can starve tasks and rendering.
  function drainMicrotasks() {
    if (microtasks.length === 0) return;
    const resumePhase = phase;
    phase = "microtask";
    while (microtasks.length > 0) {
      const car = microtasks.shift();
      if (car) runJob(car);
    }
    record(null, "The microtask queue is finally empty, so the event loop is free to move on to rendering or the next task.");
    phase = resumePhase;
  }

  // The rendering step — only callbacks already queued when it starts run now; any rAF they request waits for the following frame.
  function renderFrame() {
    phase = "render";
    record(null, `A render opportunity arrives at ${clock} ms: the browser runs the requestAnimationFrame callbacks queued so far, then paints.`);
    const batch = rafCallbacks.splice(0, rafCallbacks.length);
    batch.forEach((car) => {
      runJob(car);
      drainMicrotasks();
    });
    nextFrameAt = (Math.floor(clock / FRAME_MS) + 1) * FRAME_MS;
    record(null, "The frame is painted; any requestAnimationFrame callback queued during it has to wait for the next frame.");
  }

  // Timers whose delay has elapsed hand their callbacks to the task queue — earliest due first, ties broken by the order setTimeout was called.
  function fireDueTimers() {
    const due = webApis.filter((api) => api.dueAtMs <= clock).sort((a, b) => a.dueAtMs - b.dueAtMs || a.seq - b.seq);
    due.forEach((api) => {
      webApis.splice(webApis.indexOf(api), 1);
      api.fire();
      record(
        { blockId: api.blockId ?? "", role: "call" },
        api.kind === "fetch"
          ? `The simulated network wait for ${api.label.replace("fakeFetch ", "")} is over, so the task that resolves its promise joins the task queue.`
          : `The ${api.label} delay has elapsed, so the Web API moves its callback onto the task queue — it still has to wait its turn.`
      );
    });
  }

  let truncated = false;
  try {
    enqueue(macrotasks, "Run script", null, {
      frame: "(global script)",
      body: program,
      lineRef: null,
      startExplanation: "The script runs as the first task, so every top-level line executes before any callback gets a turn."
    });
    record(null, "The whole script is queued as the very first task; no other work exists yet.");

    for (;;) {
      fireDueTimers();
      const task = macrotasks.shift();
      if (task) {
        phase = "task";
        runJob(task);
        if (microtasks.length > 0) record(null, "The task has finished and the call stack is empty, so the loop must drain every microtask before doing anything else.");
        drainMicrotasks();
        if (rafCallbacks.length > 0 && clock >= nextFrameAt) renderFrame();
        continue;
      }

      const nextTimerAt = webApis.length > 0 ? Math.min(...webApis.map((api) => api.dueAtMs)) : Infinity;
      const nextRenderAt = rafCallbacks.length > 0 ? Math.max(nextFrameAt, clock) : Infinity;
      if (nextTimerAt === Infinity && nextRenderAt === Infinity) break;

      phase = "idle";
      if (nextRenderAt < nextTimerAt) {
        if (nextRenderAt > clock) {
          clock = nextRenderAt;
          record(null, `Nothing is ready to run, so the loop idles until the next frame is due at ${clock} ms.`);
        }
        renderFrame();
      } else if (nextTimerAt > clock) {
        clock = nextTimerAt;
        record(null, `Nothing is ready to run, so the loop idles until the virtual clock reaches ${clock} ms and the next Web API finishes.`);
      }
    }

    phase = "idle";
    record(null, "Every queue is empty and no Web APIs are pending, so the program has finished.");
  } catch (error) {
    if (!(error instanceof StepLimitReached)) throw error;
    truncated = true;
  }

  return { snapshots, truncated };
}
