import type { JSX } from "react";
import {
  BOX_X, BOX_W, BOX_H, BOX_OFFSET, ROWS
} from "@/components/mdx/GitShareFormatsDiagram/GitShareFormatsDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitShareFormatsDiagram/GitShareFormatsDiagram.styles";

/*
  Static SVG comparison of the tutorial's three ways to move work without a remote: what leaves the sending
  repository, the file that travels, and what the receiving side ends up with — the point being that only
  a bundle delivers the very same commits, patches recreate them, and an archive carries no commits at all.
*/
export default function GitShareFormatsDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 400 300" role="img" aria-labelledby="git-share-formats-diagram-title">
          <title id="git-share-formats-diagram-title">
            Diagram comparing three ways to share Git work without a remote. git format-patch turns commits A, B
            and C into three .patch files, and git am recreates them as new commits A&apos;, B&apos; and C&apos;
            with the same author, date and message but new SHAs. git bundle create packs A, B and C into
            repo.bundle, and git clone or git pull delivers the same commits with the same SHAs and refs. git
            archive turns C into app-1.2.0.zip, which unpacks to files only, with no .git directory and no history.
          </title>

          <defs>
            <marker id="git-share-formats-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {ROWS.map((row) => {
            const top = row.y + BOX_OFFSET;
            const middle = top + BOX_H / 2;
            const labels = [row.from, row.file, row.to];

            return (
              <g key={row.label}>
                <text x={10} y={row.y} fontSize={11} fill="var(--color-fg-default)">{row.label}</text>

                {BOX_X.map((x, index) => {
                  const isResult = index === 2;
                  const accent = isResult && row.sameShas;

                  return (
                    <g key={`${row.label}-${x}`}>
                      <rect
                        x={x} y={top} width={BOX_W} height={BOX_H} rx={6}
                        fill={accent ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
                        stroke={accent ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
                        strokeWidth={1.5}
                        strokeDasharray={index === 1 ? "4 3" : undefined}
                      />
                      <text x={x + BOX_W / 2} y={middle + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
                        {labels[index]}
                      </text>
                    </g>
                  );
                })}

                <line x1={BOX_X[0] + BOX_W + 2} y1={middle} x2={BOX_X[1] - 4} y2={middle} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#git-share-formats-arrow)" />
                <line x1={BOX_X[1] + BOX_W + 2} y1={middle} x2={BOX_X[2] - 4} y2={middle} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#git-share-formats-arrow)" />

                <text x={10} y={top + BOX_H + 18} fontSize={10} fill="var(--color-fg-muted)">{row.note}</text>
              </g>
            );
          })}

          {/* Legend — separates the travelling file from the commits at each end, and flags the only exact copy. */}
          <g fontSize={10}>
            <rect x={10} y={272} width={14} height={10} rx={2} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={30} y={281} fill="var(--color-fg-default)">travelling file</text>

            <rect x={180} y={272} width={14} height={10} rx={2} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
            <text x={200} y={281} fill="var(--color-fg-default)">identical commits</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GitShareFormatsDiagram.displayName = "GitShareFormatsDiagram";
