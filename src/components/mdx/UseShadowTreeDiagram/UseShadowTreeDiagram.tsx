import type { JSX } from "react";
import { BOX_RADIUS, DEFINITION, DEFINITION_ROW_HEIGHT, INSTANCES, INSTANCE_BOX, SHADOW_BOX, SHADOW_ROWS } from "@/components/mdx/UseShadowTreeDiagram/UseShadowTreeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/UseShadowTreeDiagram/UseShadowTreeDiagram.styles";

// Point on the definition box's right edge where the "cloned" arrows leave, kept central so both arrows fan out evenly.
const CLONE_ORIGIN_X = DEFINITION.x + DEFINITION.width;

/*
  Static diagram of the use-element shadow tree: one symbol definition cloned into two independent shadow trees, one
  per use. Exists to correct the most common mental model of use — the use element doesn't "override" the original;
  inheritable properties flow from the use down into its clone, and only fill the gaps the original left unset. A
  value set explicitly on the original always wins, which is why the circle stays tomato in both instances.
*/
export default function UseShadowTreeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 420" role="img" aria-labelledby="use-shadow-tree-diagram-title use-shadow-tree-diagram-desc">
          <title id="use-shadow-tree-diagram-title">How use clones a symbol into a shadow tree</title>
          <desc id="use-shadow-tree-diagram-desc">
            On the left, a symbol with id icon contains a path with no fill and a circle with fill tomato. Arrows labelled
            cloned lead to two use elements on the right, one with fill gold and one with fill teal. Each use holds its own
            dashed shadow tree. Inside the first, the path resolves to gold, inherited from the use, and the circle stays
            tomato. Inside the second, the path resolves to teal and the circle again stays tomato. A callout explains that
            properties inherit from the use into the clone, but anything set explicitly on the original wins.
          </desc>

          <defs>
            <marker id="use-shadow-tree-diagram-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="use-shadow-tree-diagram-inherit-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-border-success-emphasis)" />
            </marker>
          </defs>

          {/* Column headings. */}
          <text x={DEFINITION.x + DEFINITION.width / 2} y={100} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Definition (written once)</text>
          <text x={INSTANCE_BOX.x + INSTANCE_BOX.width / 2} y={44} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Instances (one shadow tree each)</text>

          {/* The symbol definition — one inheriting child, one explicitly-filled child. */}
          <rect x={DEFINITION.x} y={DEFINITION.y} width={DEFINITION.width} height={DEFINITION.height} rx={BOX_RADIUS} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={DEFINITION.x + 16} y={DEFINITION.y + 26} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{DEFINITION.header}</text>
          {DEFINITION.rows.map((row) => (
            <g key={row.code}>
              <rect x={DEFINITION.x + 16} y={row.y} width={DEFINITION.width - 32} height={DEFINITION_ROW_HEIGHT} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-muted)" strokeWidth={1} />
              <text x={DEFINITION.x + 26} y={row.y + 18} fontSize={12} fill="var(--color-fg-default)">{row.code}</text>
              <text x={DEFINITION.x + 26} y={row.y + 34} fontSize={10.5} fill="var(--color-fg-muted)">{row.note}</text>
            </g>
          ))}

          {/* Each use instance: its own attributes on top, its own dashed shadow tree of resolved values underneath. */}
          {INSTANCES.map((instance) => {
            const shadowTop = instance.y + SHADOW_BOX.dy;
            const shadowCenterY = shadowTop + SHADOW_BOX.height / 2;
            const inheritedY = instance.y + SHADOW_ROWS.inheritedDy;
            const explicitY = instance.y + SHADOW_ROWS.explicitDy;
            const pillRight = INSTANCE_BOX.x + SHADOW_ROWS.dx + SHADOW_ROWS.width;

            return (
              <g key={instance.fill}>
                {/* Arrow: the definition being cloned into this instance's shadow tree. */}
                <line x1={CLONE_ORIGIN_X} y1={200} x2={INSTANCE_BOX.x + SHADOW_BOX.dx - 4} y2={shadowCenterY} stroke="var(--color-fg-muted)" strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#use-shadow-tree-diagram-arrow)" />

                {/* The use element itself. */}
                <rect x={INSTANCE_BOX.x} y={instance.y} width={INSTANCE_BOX.width} height={INSTANCE_BOX.height} rx={BOX_RADIUS} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <text x={INSTANCE_BOX.x + 16} y={instance.y + 22} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{`<use href="#icon" fill="${instance.fill}" />`}</text>

                {/* Its shadow tree — dashed, because it's a clone the document's selectors can't reach into. */}
                <rect x={INSTANCE_BOX.x + SHADOW_BOX.dx} y={shadowTop} width={SHADOW_BOX.width} height={SHADOW_BOX.height} rx={8} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />
                <text x={INSTANCE_BOX.x + SHADOW_BOX.dx + 8} y={shadowTop + 13} fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">shadow tree</text>

                {/* Inherited value: the path picks up this use's fill. */}
                <rect x={INSTANCE_BOX.x + SHADOW_ROWS.dx} y={inheritedY} width={SHADOW_ROWS.width} height={SHADOW_ROWS.height} rx={6} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1} />
                <text x={INSTANCE_BOX.x + SHADOW_ROWS.dx + 10} y={inheritedY + 15} fontSize={11} fill="var(--color-fg-default)">{`path: ${instance.fill} (inherited)`}</text>

                {/* Arrow: inheritance flowing from the use's own fill down into the cloned path. */}
                <path d={`M${pillRight + 14},${instance.y + 28} L${pillRight + 14},${inheritedY + 11} L${pillRight + 4},${inheritedY + 11}`} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} markerEnd="url(#use-shadow-tree-diagram-inherit-arrow)" />

                {/* Explicit value: the circle keeps the original's own fill no matter what the use says. */}
                <rect x={INSTANCE_BOX.x + SHADOW_ROWS.dx} y={explicitY} width={SHADOW_ROWS.width} height={SHADOW_ROWS.height} rx={6} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1} />
                <text x={INSTANCE_BOX.x + SHADOW_ROWS.dx + 10} y={explicitY + 15} fontSize={11} fill="var(--color-fg-default)">circle: tomato (explicit wins)</text>
              </g>
            );
          })}

          {/* Labels on the clone arrows. */}
          <text x={300} y={158} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">cloned</text>
          <text x={300} y={254} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">cloned</text>

          {/* Callout: the rule the whole diagram illustrates. */}
          <rect x={20} y={356} width={620} height={50} rx={BOX_RADIUS} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} />
          <text x={330} y={377} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">Inheritable properties (fill, stroke, color, custom properties) flow from &lt;use&gt; into its clone.</text>
          <text x={330} y={395} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--color-fg-default)">Anything set explicitly on the original element wins — the &lt;use&gt; can&apos;t override it.</text>
        </Svg>
      </Wrapper>
    </>
  );
}

UseShadowTreeDiagram.displayName = "UseShadowTreeDiagram";
