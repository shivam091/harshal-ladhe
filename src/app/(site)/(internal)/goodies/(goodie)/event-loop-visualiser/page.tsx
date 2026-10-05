import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import EventLoopVisualiser from "@/components/EventLoopVisualiser";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Shared by the page metadata and share previews — the visible <h1> comes from the goodies registry via the segment layout.
const TITLE = "Event Loop Visualiser";
// Search/share-preview summary; mirrors the goodies registry blurb.
const DESCRIPTION =
  "Signal-box event loop visualiser — build a script from setTimeout, Promise.then, queueMicrotask, async/await, fakeFetch, and requestAnimationFrame blocks, then step through the call stack, Web APIs, microtask and task queues, render step, and console line by line.";

// Standard goodie metadata — no cover image yet, so the shared default share card is used.
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/event-loop-visualiser"
});

/*
  Static server component wrapper — EventLoopVisualiser itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather
  than opting this whole route out of static rendering.
*/
export default function EventLoopVisualiserPage(): JSX.Element {
  return (
    <>
      <p>
        &ldquo;Why does the promise log before the 0&nbsp;ms timeout?&rdquo; is the question every
        explanation of the event loop eventually has to answer, and it&apos;s far easier to see than
        to read about. This visualiser runs a small program one step at a time and lays the runtime
        out like a railway signal box: the call stack, the Web APIs holding timers, the microtask
        and task queues as sidings, the render step, and the console as a departure board — with a
        turntable showing which stage of the loop is active and the source line being executed lit
        up beside it.
      </p>
      <p>
        Programs are built from blocks rather than typed as free-form code, so the simulation can
        follow the real HTML event-loop rules honestly: run a task to completion, drain every
        microtask (including the ones queued while draining), take a render opportunity if a frame
        is due, then pick the next task. Each step comes with a one-sentence explanation of why it
        happened, and the generated JavaScript is real, runnable code — the preset programs produce
        the same console order in Node. It&apos;s the hands-on companion to{" "}
        <Link href="/post/javascript/mastering-async-javascript">
          Mastering Asynchronous JavaScript: Callbacks, Promises, and Async/Await
        </Link>
        .
      </p>
      <p>
        Start from a preset — the classic quiz, microtask starvation, async/await ordering, timers
        with different delays, rAF against setTimeout — or turn on &ldquo;Guess first&rdquo; to put
        the logged lines in order yourself before the run reveals the answer. Edits can be undone,
        the program autosaves locally, and a permalink shares the exact script.
      </p>

      <Suspense fallback={<p>Loading the event loop visualiser…</p>}>
        <EventLoopVisualiser />
      </Suspense>
    </>
  );
}
