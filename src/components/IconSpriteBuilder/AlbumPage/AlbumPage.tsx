"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import { FieldWrapper, FieldLabel, ColorInput, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { buildSprite } from "@/components/IconSpriteBuilder/IconSpriteBuilder.utils";
import StampMount from "@/components/IconSpriteBuilder/StampMount/StampMount";
import { AlbumLeaf, PanelTitle, PaperButton } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import { AlbumHeader, ViewControls, SpriteHost, StampGrid, EmptyPage } from "@/components/IconSpriteBuilder/AlbumPage/AlbumPage.styles";
import type { AlbumPageProps, SpriteIcon } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// A deep ink blue none of the presets use, so the moment an icon follows currentColor the change is unmistakable.
const DEFAULT_TINT = "#1d4ed8";

// Large enough to see a 24-unit icon's detail, small enough that a full set fits a page without scrolling.
const DEFAULT_SIZE = 40;

/*
  The album leaf: every icon in a perforated mount, each drawn by a real <use> pointing into a
  live copy of the generated sprite — so what you see is what the output will render. That copy
  is built with a per-instance id prefix, so its symbols can't clash with anything else on the
  page. Size and tint are viewing aids only, kept out of the undo stack.
*/
export default function AlbumPage({ state, result, actions }: AlbumPageProps): JSX.Element {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [announcement, setAnnouncement] = useState("");
  const gridRef = useRef<HTMLOListElement>(null);
  const prefix = `isb${useId().replace(/[^A-Za-z0-9]/g, "")}-`;
  const preview = useMemo(() => buildSprite(state.icons, state.options.currentColor, { idPrefix: prefix }), [state.icons, state.options.currentColor, prefix]);

  // Keeps keyboard focus on the same button after a move, since the stamp it belongs to has just changed place; falls back to its twin at either end of the album.
  function handleMove(icon: SpriteIcon, delta: number) {
    const index = state.icons.findIndex((candidate) => candidate.key === icon.key);
    const target = Math.min(state.icons.length - 1, Math.max(0, index + delta));
    if (target === index) return;
    actions.moveIcon(icon.key, delta);
    setAnnouncement(`Moved ${result.icons[index]?.id ?? icon.id} to position ${target + 1} of ${state.icons.length}.`);
    requestAnimationFrame(() => {
      const direction = delta < 0 ? "earlier" : "later";
      const other = delta < 0 ? "later" : "earlier";
      const grid = gridRef.current;
      const same = grid?.querySelector<HTMLButtonElement>(`[data-move="${icon.key}-${direction}"]`);
      (same && !same.disabled ? same : grid?.querySelector<HTMLButtonElement>(`[data-move="${icon.key}-${other}"]`))?.focus();
    });
  }

  // After a removal, focus moves to the album itself rather than being lost to the document body.
  function handleRemove(icon: SpriteIcon) {
    const index = state.icons.findIndex((candidate) => candidate.key === icon.key);
    actions.removeIcon(icon.key);
    setAnnouncement(`Removed ${result.icons[index]?.id ?? icon.id} from the album.`);
    gridRef.current?.focus();
  }

  return (
    <>
      <AlbumLeaf aria-labelledby="icon-sprite-album-title">
        <AlbumHeader>
          <PanelTitle id="icon-sprite-album-title" data-plate="Pl. V">
            The album · {state.icons.length} {state.icons.length === 1 ? "stamp" : "stamps"}
          </PanelTitle>
          <ViewControls>
            <FieldWrapper>
              <FieldLabel htmlFor="icon-sprite-size">Size · {size}px</FieldLabel>
              <RangeInput id="icon-sprite-size" type="range" min={16} max={96} value={size} onChange={(event) => setSize(event.target.valueAsNumber)} />
            </FieldWrapper>
            <FieldWrapper>
              <FieldLabel htmlFor="icon-sprite-tint">Ink colour (currentColor)</FieldLabel>
              <ColorInput id="icon-sprite-tint" type="color" value={tint} onChange={(event) => setTint(event.target.value)} />
            </FieldWrapper>
            {state.icons.length > 0 && (
              <PaperButton type="button" onClick={actions.clearAlbum}>
                Clear album
              </PaperButton>
            )}
          </ViewControls>
        </AlbumHeader>

        {/* Sanitised, self-serialised markup — scripts, handlers and unsafe URLs are stripped before it gets here. */}
        <SpriteHost aria-hidden="true" dangerouslySetInnerHTML={{ __html: preview.sprite }} />

        {state.icons.length === 0 ? (
          <EmptyPage>This page is empty — mount some icons from the acquisitions desk or a starter set.</EmptyPage>
        ) : (
          <StampGrid ref={gridRef} tabIndex={-1} aria-label="Mounted icons, in sprite order">
            {state.icons.map((icon, index) => (
              <StampMount
                key={icon.key}
                icon={icon}
                processed={preview.icons[index]}
                index={index}
                count={state.icons.length}
                previewPrefix={prefix}
                size={size}
                tint={tint}
                actions={actions}
                onMove={handleMove}
                onRemove={handleRemove}
              />
            ))}
          </StampGrid>
        )}
        <VisuallyHidden as="p" role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden>
      </AlbumLeaf>
    </>
  );
}

AlbumPage.displayName = "AlbumPage";
