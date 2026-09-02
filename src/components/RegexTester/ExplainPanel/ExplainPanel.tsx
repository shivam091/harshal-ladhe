import type { JSX } from "react";
import { runRegex } from "@/utils/regex-match";
import { explainRegex } from "@/utils/regex-explain";
import type { ExplainNode } from "@/interfaces/regex-tester";
import type { ExplainPanelProps } from "@/interfaces/regex-tester";
import { SectionCard, PanelTitle } from "@/components/RegexTester/RegexTester.styles";
import { Tree, Node, Token, Description, EmptyState } from "@/components/RegexTester/ExplainPanel/ExplainPanel.styles";

// Recurses over the explain tree — a group's own node renders its token/description, then its children (the group's inner breakdown, or an alternation's branches) render one level deeper via the exact same component.
function ExplainTree({ nodes }: { nodes: ExplainNode[] }): JSX.Element {
  return (
    <Tree>
      {nodes.map((node) => (
        <Node key={node.id}>
          {node.token && <Token>{node.token}</Token>}
          <Description>{node.description}</Description>
          {node.children && <ExplainTree nodes={node.children} />}
        </Node>
      ))}
    </Tree>
  );
}

// A plain-English, piece-by-piece breakdown of the pattern — built from the same parse the pattern itself already passed validation with, so this only ever runs against a syntactically valid regex.
export default function ExplainPanel({ state }: ExplainPanelProps): JSX.Element {
  const result = runRegex(state.pattern, state.flags, "");
  if (!result.valid) return <></>;
  if (state.pattern.length === 0) return <></>;

  const tree = explainRegex(state.pattern, state.flags);

  return (
    <>
      <SectionCard>
        <PanelTitle>Explain</PanelTitle>
        {tree.length === 0 ? <EmptyState>Nothing to explain.</EmptyState> : <ExplainTree nodes={tree} />}
      </SectionCard>
    </>
  );
}

ExplainPanel.displayName = "ExplainPanel";
