import type { JSX } from "react";
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@/components/Icon";
import { BLOCK_KIND_LABELS, MAX_DELAY_MS, branchLabels } from "@/helpers/event-loop-editor";
import AddBlockControl from "@/components/EventLoopVisualiser/AddBlockControl/AddBlockControl";
import {
  Node,
  NodeHeader,
  KindBadge,
  Field,
  TextInput,
  NodeTools,
  ToolButton,
  Branch,
  BranchLabel,
  NodeList,
  ChainButton,
  ChainRow
} from "@/components/EventLoopVisualiser/BlockNode/BlockNode.styles";
import type { BlockNodeProps, EventLoopBlockKind } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// What the single text field means for each kind — `null` for kinds with no free text, so the field isn't rendered at all.
const TEXT_FIELD_LABELS: Record<EventLoopBlockKind, string | null> = {
  log: "Message",
  async: "Name",
  fetch: "URL",
  timeout: null,
  microtask: null,
  promise: null,
  raf: null
};

// Same idea for the delay field — and the async label says outright that 0 means `await null`, since that's the one non-obvious mapping.
const DELAY_FIELD_LABELS: Record<EventLoopBlockKind, string | null> = {
  timeout: "Delay ms",
  fetch: "Latency ms",
  async: "Await ms (0 = null)",
  log: null,
  microtask: null,
  promise: null,
  raf: null
};

/*
  One editable block plus its nested callback bodies, recursing into itself for each child. Field
  edits go through updateBlock (live) and commitEdit on blur, so typing a word is one undo step
  rather than one per keystroke.
*/
export default function BlockNode({ block, index, siblingCount, depth, actions }: BlockNodeProps): JSX.Element {
  const kindLabel = BLOCK_KIND_LABELS[block.kind];
  const textLabel = TEXT_FIELD_LABELS[block.kind];
  const delayLabel = DELAY_FIELD_LABELS[block.kind];
  const labels = branchLabels(block);
  const isChain = block.kind === "promise" || block.kind === "fetch";

  return (
    <>
      <Node data-kind={block.kind}>
        <NodeHeader>
          <KindBadge>{kindLabel}</KindBadge>
          {textLabel && (
            <Field>
              {textLabel}
              <TextInput
                type="text"
                value={block.text}
                maxLength={60}
                onChange={(event) => actions.updateBlock(block.id, { text: event.target.value })}
                onBlur={actions.commitEdit}
              />
            </Field>
          )}
          {delayLabel && (
            <Field>
              {delayLabel}
              <TextInput
                type="number"
                min={0}
                max={MAX_DELAY_MS}
                step={10}
                value={block.delayMs}
                onChange={(event) => actions.updateBlock(block.id, { delayMs: event.target.valueAsNumber })}
                onBlur={actions.commitEdit}
              />
            </Field>
          )}
          <NodeTools>
            <ToolButton type="button" onClick={() => actions.moveBlock(block.id, -1)} disabled={index === 0} aria-label={`Move ${kindLabel} block up`}>
              <ArrowUpIcon size={14} aria-hidden="true" />
            </ToolButton>
            <ToolButton type="button" onClick={() => actions.moveBlock(block.id, 1)} disabled={index === siblingCount - 1} aria-label={`Move ${kindLabel} block down`}>
              <ArrowDownIcon size={14} aria-hidden="true" />
            </ToolButton>
            <ToolButton type="button" onClick={() => actions.removeBlock(block.id)} aria-label={`Remove ${kindLabel} block`}>
              <TrashIcon size={14} aria-hidden="true" />
            </ToolButton>
          </NodeTools>
        </NodeHeader>

        {block.branches.map((body, branchIndex) => (
          <Branch key={branchIndex}>
            <BranchLabel>{labels[branchIndex]}</BranchLabel>
            {body.length > 0 && (
              <NodeList>
                {body.map((child, childIndex) => (
                  <BlockNode key={child.id} block={child} index={childIndex} siblingCount={body.length} depth={depth + 1} actions={actions} />
                ))}
              </NodeList>
            )}
            <AddBlockControl target={{ parentId: block.id, branchIndex }} depth={depth + 1} actions={actions} />
          </Branch>
        ))}

        {isChain && (
          <ChainRow>
            <ChainButton type="button" onClick={() => actions.addThen(block.id)} disabled={block.branches.length >= 6}>
              + .then
            </ChainButton>
            <ChainButton type="button" onClick={() => actions.removeThen(block.id)} disabled={block.branches.length <= 1}>
              − last .then
            </ChainButton>
          </ChainRow>
        )}
      </Node>
    </>
  );
}

BlockNode.displayName = "BlockNode";
