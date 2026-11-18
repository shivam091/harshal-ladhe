import type { CSSProperties, JSX } from "react";
import { tapeColorForMatch } from "@/components/RegexTester/regex-match-colors";
import type { MatchListProps } from "@/components/RegexTester/RegexTester.types";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import { List, MatchCard, MatchHeader, MatchIndex, TagRow, StickyNote, StickyNoteLabel, StickyNoteValue, EmptyState } from "@/components/RegexTester/MatchList/MatchList.styles";

// A handful of alternating tilt angles so neighboring sticky notes don't all lean the same direction — cycled by a group's position within its match, not randomized, so the layout stays stable across re-renders.
const TILTS = ["-2deg", "1.75deg", "-1.25deg", "2.25deg", "-1.75deg"];

/*
  Flagship flourish #2: every match's capture groups rendered as small rotated sticky-note tags
  (numbered groups first, by their fixed left-to-right position, then named ones) rather than a
  plain bullet list — laid out like marginalia jotted next to the marked-up match itself. A named
  group is ALSO one of the numbered groups, so its value is intentionally shown twice: once by
  position, once by name — mirroring how `match[2]` and `match.groups.year` can both refer to the
  same capture in real code. Each match's notes borrow that match's own tape color from
  MatchHighlight so the two flourishes read as one system.
*/
export default function MatchList({ result }: MatchListProps): JSX.Element {
  if (!result.valid || result.timedOut) return <></>;

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Captures</PanelTitle>
        </PanelHeader>
        <PanelBody>
          {result.matches.length === 0 ? (
            <EmptyState>No matches yet.</EmptyState>
          ) : (
            <List>
              {result.matches.map((m, i) => {
                const color = tapeColorForMatch(i);
                let tiltCursor = 0;
                return (
                  <MatchCard key={`${m.index}-${i}`} style={{ "--match-color": color } as CSSProperties}>
                    <MatchHeader>
                      <MatchIndex>
                        #{i + 1} at index {m.index}:{" "}
                      </MatchIndex>
                      &quot;{m.match}&quot;
                    </MatchHeader>
                    {(m.numberedGroups.length > 0 || m.namedGroups.length > 0) && (
                      <TagRow>
                        {m.numberedGroups.map((value, gi) => {
                          const tilt = TILTS[tiltCursor++ % TILTS.length];
                          return (
                            <StickyNote key={`n-${gi}`} style={{ "--note-color": color, "--note-tilt": tilt } as CSSProperties}>
                              <StickyNoteLabel>Group {gi + 1}</StickyNoteLabel>
                              <StickyNoteValue>{value === undefined ? "(not captured)" : `"${value}"`}</StickyNoteValue>
                            </StickyNote>
                          );
                        })}
                        {m.namedGroups.map((group) => {
                          const tilt = TILTS[tiltCursor++ % TILTS.length];
                          return (
                            <StickyNote key={group.name} style={{ "--note-color": color, "--note-tilt": tilt } as CSSProperties}>
                              <StickyNoteLabel>{group.name}</StickyNoteLabel>
                              <StickyNoteValue>{group.value === undefined ? "(not captured)" : `"${group.value}"`}</StickyNoteValue>
                            </StickyNote>
                          );
                        })}
                      </TagRow>
                    )}
                  </MatchCard>
                );
              })}
            </List>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

MatchList.displayName = "MatchList";
