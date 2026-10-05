import type { EventLoopBlock, EventLoopBlockKind, EventLoopPresetMeta } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Positional builder so each preset below reads like an outline of the program rather than a wall of object literals.
function block(id: string, kind: EventLoopBlockKind, text: string, delayMs: number, branches: EventLoopBlock[][] = []): EventLoopBlock {
  return { id, kind, text, delayMs, branches };
}

// A bare console.log — the most common block by far, so it gets its own shorthand.
function log(id: string, text: string): EventLoopBlock {
  return block(id, "log", text, 0);
}

/*
  Curated starting programs — each one isolates a single event-loop rule people routinely get
  wrong, in the same order the "Mastering Asynchronous JavaScript" post builds up to them. Every
  preset's console order has been checked against Node running the generated source (rAF aside,
  since Node has no render step).
*/
export const eventLoopPresets: EventLoopPresetMeta[] = [
  {
    slug: "classic-quiz",
    name: "The classic quiz",
    summary: "log, setTimeout 0, Promise.then, log — why the promise wins.",
    program: [
      log("cq-1", "script start"),
      block("cq-2", "timeout", "", 0, [[log("cq-3", "setTimeout")]]),
      block("cq-4", "promise", "", 0, [[log("cq-5", "promise 1")], [log("cq-6", "promise 2")]]),
      log("cq-7", "script end")
    ]
  },
  {
    slug: "microtask-starvation",
    name: "Microtask starvation",
    summary: "Microtasks queuing microtasks hold a 0 ms timer back.",
    program: [
      block("ms-1", "timeout", "", 0, [[log("ms-2", "timeout finally runs")]]),
      block("ms-3", "microtask", "", 0, [
        [
          log("ms-4", "microtask 1"),
          block("ms-5", "microtask", "", 0, [
            [log("ms-6", "microtask 2"), block("ms-7", "microtask", "", 0, [[log("ms-8", "microtask 3")]])]
          ])
        ]
      ]),
      log("ms-9", "sync done")
    ]
  },
  {
    slug: "async-await",
    name: "async/await ordering",
    summary: "An async function runs synchronously until its first await.",
    program: [
      log("aa-1", "script start"),
      block("aa-2", "async", "main", 0, [[log("aa-3", "inside main")], [log("aa-4", "after await")]]),
      block("aa-5", "promise", "", 0, [[log("aa-6", "then callback")]]),
      log("aa-7", "script end")
    ]
  },
  {
    slug: "timer-delays",
    name: "Timers and fakeFetch",
    summary: "Delays decide order, not the order setTimeout was called.",
    program: [
      block("td-1", "timeout", "", 300, [[log("td-2", "300 ms timer")]]),
      block("td-3", "timeout", "", 100, [
        [log("td-4", "100 ms timer"), block("td-5", "timeout", "", 0, [[log("td-6", "0 ms timer set at 100 ms")]])]
      ]),
      block("td-7", "fetch", "/api/user", 200, [[log("td-8", "user loaded")]]),
      block("td-9", "timeout", "", 0, [[log("td-10", "0 ms timer")]])
    ]
  },
  {
    slug: "raf-vs-timeout",
    name: "rAF vs setTimeout",
    summary: "requestAnimationFrame waits for the next frame, not the next task.",
    program: [
      log("rt-1", "start"),
      block("rt-2", "raf", "", 0, [[log("rt-3", "rAF callback"), block("rt-4", "promise", "", 0, [[log("rt-5", "microtask inside rAF")]])]]),
      block("rt-6", "timeout", "", 0, [[log("rt-7", "timeout 0 ms")]]),
      block("rt-8", "timeout", "", 50, [[log("rt-9", "timeout 50 ms")]]),
      log("rt-10", "end")
    ]
  },
  {
    slug: "microtask-in-timeout",
    name: "Microtask inside a timeout",
    summary: "Microtasks drain between tasks, even between two timers.",
    program: [
      block("mt-1", "timeout", "", 0, [[log("mt-2", "timeout A"), block("mt-3", "promise", "", 0, [[log("mt-4", "microtask from A")]])]]),
      block("mt-5", "timeout", "", 0, [[log("mt-6", "timeout B")]]),
      log("mt-7", "sync")
    ]
  },
  {
    slug: "await-a-delay",
    name: "Awaiting a delay",
    summary: "await on a slow promise lets timers and the caller go first.",
    program: [
      block("ad-1", "async", "loadUser", 120, [[log("ad-2", "loading…")], [log("ad-3", "loaded")]]),
      block("ad-4", "timeout", "", 50, [[log("ad-5", "50 ms timer")]]),
      log("ad-6", "caller carries on")
    ]
  }
];
