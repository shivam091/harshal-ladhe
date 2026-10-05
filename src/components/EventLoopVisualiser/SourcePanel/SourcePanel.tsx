"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import { buildSourceLines, lineRefKey, sourceLinesToText } from "@/utils/event-loop-source";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { SectionCard, PanelTitle } from "@/components/EventLoopVisualiser/EventLoopVisualiser.styles";
import { CodeScroller, CodeList, CodeLine, Token } from "@/components/EventLoopVisualiser/SourcePanel/SourcePanel.styles";
import type { SourcePanelProps } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Two spaces per level, matching sourceLinesToText — so what's shown and what's copied are byte-for-byte identical.
const INDENT = "  ";

/*
  The program as real JavaScript, rendered line by line from the generator's own tokens rather than
  through Shiki — the active line has to be addressable per step, and Shiki's HTML gives no stable
  hook back to the block a line came from.
*/
export default function SourcePanel({ program, activeLine }: SourcePanelProps): JSX.Element {
  const [copyTrigger, setCopyTrigger] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lines = useMemo(() => buildSourceLines(program), [program]);
  const code = useMemo(() => sourceLinesToText(lines), [lines]);
  const activeKey = activeLine ? lineRefKey(activeLine) : null;
  const activeIndex = activeKey ? lines.findIndex((line) => line.ref !== null && lineRefKey(line.ref) === activeKey) : -1;

  // Scrolls only the listing's own box (never scrollIntoView, which would also yank the whole page) so the lit line stays visible during playback.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || activeIndex < 0) return;
    const line = scroller.querySelectorAll<HTMLElement>("[data-line]")[activeIndex];
    if (!line) return;
    const top = line.offsetTop;
    const bottom = top + line.offsetHeight;
    if (top < scroller.scrollTop || bottom > scroller.scrollTop + scroller.clientHeight) {
      scroller.scrollTop = top - scroller.clientHeight / 3;
    }
  }, [activeIndex]);

  return (
    <>
      <SectionCard>
        <PanelTitle>Source</PanelTitle>
        <CodeBlockWrapper>
          <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
          <Pre data-has-copy-button>
            <CodeScroller ref={scrollerRef} tabIndex={0} role="region" aria-label="Generated JavaScript source">
              <CodeList>
                <code>
                  {lines.map((line, index) => (
                    <CodeLine key={index} data-line data-active={index === activeIndex ? "true" : undefined} aria-current={index === activeIndex ? "step" : undefined}>
                      {line.tokens.length === 0 ? " " : INDENT.repeat(line.indent)}
                      {line.tokens.map((token, tokenIndex) => (
                        <Token key={tokenIndex} data-type={token.type}>
                          {token.text}
                        </Token>
                      ))}
                    </CodeLine>
                  ))}
                </code>
              </CodeList>
            </CodeScroller>
          </Pre>
          <Shimmer trigger={copyTrigger} />
        </CodeBlockWrapper>
      </SectionCard>
    </>
  );
}

SourcePanel.displayName = "SourcePanel";
