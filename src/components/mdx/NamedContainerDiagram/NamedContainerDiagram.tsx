import type { JSX } from "react";
import { LEVELS } from "@/components/mdx/NamedContainerDiagram/NamedContainerDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/NamedContainerDiagram/NamedContainerDiagram.styles";

/*
  Static SVG diagram of `@container` name resolution across 3 nested containers. An unnamed
  `@container` query always resolves against the NEAREST ancestor container (the dashed arrow, to
  `.parent`) — reaching further out to `.grandparent` instead requires naming it and querying that
  name directly (the solid arrow), which is the one fact this diagram exists to make unmissable.
*/
export default function NamedContainerDiagram(): JSX.Element {
  const [grandparent, parent, child] = LEVELS;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 330" role="img" aria-labelledby="named-container-diagram-title named-container-diagram-desc">
          <title id="named-container-diagram-title">named container query resolution diagram</title>
          <desc id="named-container-diagram-desc">
            Three nested containers: grandparent, named layout-grid; parent, named component-wrapper;
            and child. A dashed arrow shows an unnamed @container query resolving to the nearest
            ancestor, the parent. A solid arrow shows @container layout-grid skipping past the parent
            to resolve against the named grandparent instead.
          </desc>

          <defs>
            <marker id="named-container-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="named-container-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-accent)" />
            </marker>
          </defs>

          {/* Grandparent — named `layout-grid`, the target of the "named" arrow below. */}
          <rect x={grandparent.x} y={grandparent.y} width={grandparent.w} height={grandparent.h} rx={12} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} />
          <text x={grandparent.x + 10} y={grandparent.y + 22} fontSize={13} fontWeight={600} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
            {grandparent.label}
          </text>
          <text x={grandparent.x + 10} y={grandparent.y + 38} fontSize={10.5} fill="var(--color-fg-accent)">{grandparent.tag}</text>

          {/* Parent — named `component-wrapper`, the nearest ancestor and the target of the "unnamed" arrow. */}
          <rect x={parent.x} y={parent.y} width={parent.w} height={parent.h} rx={12} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1.5} />
          <text x={parent.x + 10} y={parent.y + 22} fontSize={13} fontWeight={600} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
            {parent.label}
          </text>
          <text x={parent.x + 10} y={parent.y + 38} fontSize={10.5} fill="var(--color-fg-muted)">{parent.tag}</text>

          {/* Child — the element writing the two @container queries the arrows illustrate. */}
          <rect x={child.x} y={child.y} width={child.w} height={child.h} rx={8} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={child.x + child.w / 2} y={child.y + child.h / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={600} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
            {child.label}
          </text>

          {/* Unnamed @container — resolves to the nearest ancestor (.parent), dashed and muted. */}
          <path d="M 200 190 Q 140 130 108 72" fill="none" stroke="var(--color-fg-muted)" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#named-container-arrow-muted)" />

          {/* Named @container layout-grid — skips .parent to resolve against .grandparent, solid and accented. */}
          <path d="M 244 190 Q 340 96 372 34" fill="none" stroke="var(--color-fg-accent)" strokeWidth={2} markerEnd="url(#named-container-arrow-accent)" />

          <g transform="translate(20, 296)">
            <line x1={0} y1={-4} x2={24} y2={-4} stroke="var(--color-fg-muted)" strokeWidth={2} strokeDasharray="5 4" />
            <text x={32} y={0} fontSize={11.5} fill="var(--color-fg-muted)">@container (…) — unnamed, resolves to the nearest ancestor</text>
          </g>
          <g transform="translate(20, 316)">
            <line x1={0} y1={-4} x2={24} y2={-4} stroke="var(--color-fg-accent)" strokeWidth={2} />
            <text x={32} y={0} fontSize={11.5} fill="var(--color-fg-default)">@container layout-grid (…) — named, skips the nearer one</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

NamedContainerDiagram.displayName = "NamedContainerDiagram";
