import type { JSX } from "react";
import { validateRegex, explainRegex } from "@/components/RegexTester/RegexTester.utils";
import type { ExplainNode, ExplainPanelProps } from "@/components/RegexTester/RegexTester.types";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
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
  if (validateRegex(state.pattern, state.flags)) return <></>;
  if (state.pattern.length === 0) return <></>;

  const tree = explainRegex(state.pattern, state.flags);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Explanation</PanelTitle>
        </PanelHeader>
        <PanelBody>{tree.length === 0 ? <EmptyState>Nothing to explain.</EmptyState> : <ExplainTree nodes={tree} />}</PanelBody>
      </Panel>
    </>
  );
}

ExplainPanel.displayName = "ExplainPanel";
