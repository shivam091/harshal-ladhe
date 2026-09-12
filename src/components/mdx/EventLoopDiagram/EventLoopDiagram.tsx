import type { JSX } from "react";
import {
  BOX_W, BOX_H, BOX_X,
  CALL_STACK_Y, WEB_APIS_Y,
  QUEUES_CONTAINER_X, QUEUES_CONTAINER_Y, QUEUES_CONTAINER_W, QUEUES_CONTAINER_H,
  QUEUE_ROW_W, QUEUE_ROW_H, MICROTASK_Y, MACROTASK_Y,
  EVENT_LOOP_Y, FLOW_CENTER_X,
  CALL_STACK_RIGHT_X, LOOP_OUT_X, CALL_STACK_MID_Y, EVENT_LOOP_MID_Y,
  LEGEND_Y, LEGEND_ROW_GAP
} from "@/components/mdx/EventLoopDiagram/EventLoopDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/EventLoopDiagram/EventLoopDiagram.styles";

/*
  Static SVG diagram of the JavaScript runtime's single-column flow: Call Stack hands async work to
  Web APIs, which deliver results into the Microtask or Macrotask queue, and the Event Loop drains
  those queues back onto the Call Stack once it's empty. The Microtask row is drawn in the accent
  colour used for "runs first" throughout this post's diagrams, so the priority reads at a glance
  before the surrounding prose spells it out.
*/
export default function EventLoopDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 340 494" role="img" aria-labelledby="event-loop-diagram-title event-loop-diagram-desc">
          <title id="event-loop-diagram-title">JavaScript event loop diagram</title>
          <desc id="event-loop-diagram-desc">
            A vertical flow: Call Stack hands work to Web APIs, which deliver results into a Task
            Queues box split into a Microtask row and a Macrotask row. The Event Loop checks those
            queues and loops back up to push the next callback onto the Call Stack once it&rsquo;s empty.
            The Microtask row is highlighted to show it always drains first.
          </desc>

          <defs>
            <marker id="event-loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* Call Stack — where synchronous code actually executes. */}
          <rect x={BOX_X} y={CALL_STACK_Y} width={BOX_W} height={BOX_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={2} />
          <text x={BOX_X + BOX_W / 2} y={CALL_STACK_Y + BOX_H / 2 - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">Call Stack</text>
          <text x={BOX_X + BOX_W / 2} y={CALL_STACK_Y + BOX_H / 2 + 14} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">executes JS code</text>

          {/* Arrow 1 — Call Stack offloads an async operation to a Web API. */}
          <line x1={FLOW_CENTER_X} y1={CALL_STACK_Y + BOX_H} x2={FLOW_CENTER_X} y2={WEB_APIS_Y} stroke="var(--color-fg-muted)" strokeWidth={1.75} markerEnd="url(#event-loop-arrow)" />
          <text x={FLOW_CENTER_X + 8} y={(CALL_STACK_Y + BOX_H + WEB_APIS_Y) / 2 + 4} fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">offloads work</text>

          {/* Web APIs — fetch, setTimeout, and DOM events run here, outside the Call Stack. */}
          <rect x={BOX_X} y={WEB_APIS_Y} width={BOX_W} height={BOX_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={2} />
          <text x={BOX_X + BOX_W / 2} y={WEB_APIS_Y + BOX_H / 2 - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">Web APIs</text>
          <text x={BOX_X + BOX_W / 2} y={WEB_APIS_Y + BOX_H / 2 + 14} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">fetch, setTimeout, DOM</text>

          {/* Arrow 2 — a Web API finishes and its result is queued. */}
          <line x1={FLOW_CENTER_X} y1={WEB_APIS_Y + BOX_H} x2={FLOW_CENTER_X} y2={QUEUES_CONTAINER_Y} stroke="var(--color-fg-muted)" strokeWidth={1.75} markerEnd="url(#event-loop-arrow)" />
          <text x={FLOW_CENTER_X + 8} y={(WEB_APIS_Y + BOX_H + QUEUES_CONTAINER_Y) / 2 + 4} fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">result ready</text>

          {/* Task Queues — the outer container grouping the Microtask and Macrotask rows. */}
          <rect x={QUEUES_CONTAINER_X} y={QUEUES_CONTAINER_Y} width={QUEUES_CONTAINER_W} height={QUEUES_CONTAINER_H} rx={8} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} strokeDasharray="4 3" />
          <text x={QUEUES_CONTAINER_X + QUEUES_CONTAINER_W / 2} y={QUEUES_CONTAINER_Y + 15} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="var(--color-fg-muted)">Task Queues</text>

          {/* Microtask Queue — accent-coloured to show it always drains completely before the next macrotask. */}
          <rect x={BOX_X} y={MICROTASK_Y} width={QUEUE_ROW_W} height={QUEUE_ROW_H} rx={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={2} />
          <text x={BOX_X + QUEUE_ROW_W / 2} y={MICROTASK_Y + QUEUE_ROW_H / 2 - 3} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--color-fg-default)">Microtask Queue</text>
          <text x={BOX_X + QUEUE_ROW_W / 2} y={MICROTASK_Y + QUEUE_ROW_H / 2 + 12} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">Promises, queueMicrotask</text>

          {/* Macrotask Queue — one task is pulled from here per event loop tick, after every microtask has run. */}
          <rect x={BOX_X} y={MACROTASK_Y} width={QUEUE_ROW_W} height={QUEUE_ROW_H} rx={6} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={2} />
          <text x={BOX_X + QUEUE_ROW_W / 2} y={MACROTASK_Y + QUEUE_ROW_H / 2 - 3} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="var(--color-fg-default)">Macrotask Queue</text>
          <text x={BOX_X + QUEUE_ROW_W / 2} y={MACROTASK_Y + QUEUE_ROW_H / 2 + 12} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">setTimeout, events</text>

          {/* Arrow 3 — the Event Loop checks whether the Call Stack is empty and pulls from the queues. */}
          <line x1={FLOW_CENTER_X} y1={QUEUES_CONTAINER_Y + QUEUES_CONTAINER_H} x2={FLOW_CENTER_X} y2={EVENT_LOOP_Y} stroke="var(--color-fg-muted)" strokeWidth={1.75} markerEnd="url(#event-loop-arrow)" />
          <text x={FLOW_CENTER_X + 8} y={(QUEUES_CONTAINER_Y + QUEUES_CONTAINER_H + EVENT_LOOP_Y) / 2 + 4} fontSize={9.5} fontStyle="italic" fill="var(--color-fg-muted)">stack empty?</text>

          {/* Event Loop — the coordinator: checks the Call Stack, then loops a callback back onto it. */}
          <rect x={BOX_X} y={EVENT_LOOP_Y} width={BOX_W} height={BOX_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={2} />
          <text x={BOX_X + BOX_W / 2} y={EVENT_LOOP_Y + BOX_H / 2 - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-fg-default)">Event Loop</text>
          <text x={BOX_X + BOX_W / 2} y={EVENT_LOOP_Y + BOX_H / 2 + 14} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">moves tasks to the stack</text>

          {/* Loop-back arrow — an L-shaped path bulging right, clear of every box, that pushes the next callback onto the Call Stack once it's empty. */}
          <path
            d={`M${CALL_STACK_RIGHT_X},${EVENT_LOOP_MID_Y} L${LOOP_OUT_X},${EVENT_LOOP_MID_Y} L${LOOP_OUT_X},${CALL_STACK_MID_Y} L${CALL_STACK_RIGHT_X},${CALL_STACK_MID_Y}`}
            fill="none" stroke="var(--color-fg-accent)" strokeWidth={1.75} markerEnd="url(#event-loop-arrow)"
          />
          <text
            x={LOOP_OUT_X + 8} y={(EVENT_LOOP_MID_Y + CALL_STACK_MID_Y) / 2 + 4} fontSize={9.5} fontStyle="italic" fill="var(--color-fg-accent)"
            transform={`rotate(-90, ${LOOP_OUT_X + 8}, ${(EVENT_LOOP_MID_Y + CALL_STACK_MID_Y) / 2 + 4})`}
          >
            pushes next callback
          </text>

          {/* Legend — restates both colours used above: accent means "drains first", success/green means "runs one at a time, after". */}
          <g fontSize={10}>
            <rect x={BOX_X} y={LEGEND_Y} width={13} height={13} rx={3} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={BOX_X + 19} y={LEGEND_Y + 11} fill="var(--color-fg-default)">Microtask Queue — runs first, drains completely</text>

            <rect x={BOX_X} y={LEGEND_Y + LEGEND_ROW_GAP} width={13} height={13} rx={3} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={BOX_X + 19} y={LEGEND_Y + LEGEND_ROW_GAP + 11} fill="var(--color-fg-default)">Macrotask Queue — runs one, after microtasks drain</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

EventLoopDiagram.displayName = "EventLoopDiagram";
