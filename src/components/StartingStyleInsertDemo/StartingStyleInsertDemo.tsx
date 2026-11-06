"use client";

import { useRef, useState, type JSX } from "react";
import Button from "@/components/Button";
import VisuallyHidden from "@/components/VisuallyHidden";
import { PlusIcon, RefreshIcon, CloseIcon } from "@/components/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  Wrapper,
  Columns,
  ColumnTitle,
  CardList,
  AnimatedCard,
  PlainCard,
  RenderCount,
  Controls,
  ToggleLabel,
  Note,
} from "@/components/StartingStyleInsertDemo/StartingStyleInsertDemo.styles";

// Enough cards to show that only the newest one animates, without the columns growing past a screenful.
const MAX_CARDS = 4;

// Inserts the same card into two lists that differ only in @starting-style, so the entrance is the one variable.
export default function StartingStyleInsertDemo(): JSX.Element {
  const [cardIds, setCardIds] = useState<number[]>([]);
  const [renderCount, setRenderCount] = useState(1);
  const [isTransformTransitioned, setIsTransformTransitioned] = useState(true);
  const nextIdRef = useRef(1);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Stable ids keep existing cards as the same DOM nodes, so only the newly inserted one gets a first style.
  function handleInsert() {
    const id = nextIdRef.current++;
    setCardIds((ids) => [...ids, id].slice(-MAX_CARDS));
  }

  return (
    <>
      <Wrapper>
        <Columns>
          <div>
            <ColumnTitle>With @starting-style</ColumnTitle>
            <CardList aria-label="Cards with @starting-style">
              {cardIds.map((id) => (
                <AnimatedCard key={id} data-opacity-only={!isTransformTransitioned || undefined}>
                  Card #{id}
                  <RenderCount>render {renderCount}</RenderCount>
                </AnimatedCard>
              ))}
            </CardList>
          </div>
          <div>
            <ColumnTitle>Without @starting-style</ColumnTitle>
            <CardList aria-label="Cards without @starting-style">
              {cardIds.map((id) => (
                <PlainCard key={id}>
                  Card #{id}
                  <RenderCount>render {renderCount}</RenderCount>
                </PlainCard>
              ))}
            </CardList>
          </div>
        </Columns>
        <VisuallyHidden>
          Visual demo: each inserted card fades and rises into place in the left column, and appears instantly in the right column.
        </VisuallyHidden>

        <Controls>
          <Button type="button" size="sm" variant="soft" intent="accent" iconLeft={<PlusIcon size={14} />} onClick={handleInsert}>
            Insert card
          </Button>
          <Button type="button" size="sm" variant="ghost" iconLeft={<RefreshIcon size={14} />} onClick={() => setRenderCount((count) => count + 1)} disabled={cardIds.length === 0}>
            Re-render
          </Button>
          <Button type="button" size="sm" variant="ghost" iconLeft={<CloseIcon size={14} />} onClick={() => setCardIds([])} disabled={cardIds.length === 0}>
            Clear
          </Button>
          <ToggleLabel>
            <input
              type="checkbox"
              checked={isTransformTransitioned}
              onChange={(event) => setIsTransformTransitioned(event.target.checked)}
            />
            List <code>transform</code> in <code>transition</code>
          </ToggleLabel>
        </Controls>

        {prefersReducedMotion && (
          <Note>Your system asks for reduced motion, so both columns insert instantly — the same fallback the post recommends shipping.</Note>
        )}
      </Wrapper>
    </>
  );
}

StartingStyleInsertDemo.displayName = "StartingStyleInsertDemo";
