import type { JSX } from "react";
import BlockNode from "@/components/EventLoopVisualiser/BlockNode/BlockNode";
import AddBlockControl from "@/components/EventLoopVisualiser/AddBlockControl/AddBlockControl";
import { NodeList } from "@/components/EventLoopVisualiser/BlockNode/BlockNode.styles";
import { SectionCard, PanelTitle, PanelNote } from "@/components/EventLoopVisualiser/EventLoopVisualiser.styles";
import type { BlockEditorProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Top level of the program tree — the script body itself, with an add control at the end like every nested callback body has.
export default function BlockEditor({ program, actions }: BlockEditorProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Program</PanelTitle>
        <PanelNote>Compose the script from blocks; callbacks nest inside the block that schedules them.</PanelNote>
        {program.length > 0 && (
          <NodeList aria-label="Script blocks">
            {program.map((block, index) => (
              <BlockNode key={block.id} block={block} index={index} siblingCount={program.length} depth={1} actions={actions} />
            ))}
          </NodeList>
        )}
        <AddBlockControl target={{ parentId: null, branchIndex: 0 }} depth={1} actions={actions} />
      </SectionCard>
    </>
  );
}

BlockEditor.displayName = "BlockEditor";
