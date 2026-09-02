import type { JSX } from "react";
import { runRegex } from "@/utils/regex-match";
import type { MatchListProps } from "@/interfaces/regex-tester";
import { SectionCard, PanelTitle } from "@/components/RegexTester/RegexTester.styles";
import { List, MatchCard, MatchHeader, MatchIndex, GroupList, GroupItem, EmptyState } from "@/components/RegexTester/MatchList/MatchList.styles";

// Every match as its own card — full match text plus every capture group, numbered groups first (by their fixed left-to-right position) then named ones (a named group is ALSO one of the numbered groups, so its value is intentionally listed twice: once by position, once by name — mirroring how `match[2]` and `match.groups.year` can both refer to the same capture in real code).
export default function MatchList({ state }: MatchListProps): JSX.Element {
  const result = runRegex(state.pattern, state.flags, state.testString);
  if (!result.valid) return <></>;

  return (
    <>
      <SectionCard>
        <PanelTitle>Matches</PanelTitle>
        {result.matches.length === 0 ? (
          <EmptyState>No matches yet.</EmptyState>
        ) : (
          <List>
            {result.matches.map((m, i) => (
              <MatchCard key={`${m.index}-${i}`}>
                <MatchHeader>
                  <MatchIndex>#{i + 1} at index {m.index}: </MatchIndex>&quot;{m.match}&quot;
                </MatchHeader>
                {(m.numberedGroups.length > 0 || m.namedGroups.length > 0) && (
                  <GroupList>
                    {m.numberedGroups.map((value, gi) => (
                      <GroupItem key={`n-${gi}`}>Group {gi + 1}: {value === undefined ? "(not captured)" : `"${value}"`}</GroupItem>
                    ))}
                    {m.namedGroups.map((group) => (
                      <GroupItem key={group.name}>{group.name}: {group.value === undefined ? "(not captured)" : `"${group.value}"`}</GroupItem>
                    ))}
                  </GroupList>
                )}
              </MatchCard>
            ))}
          </List>
        )}
      </SectionCard>
    </>
  );
}

MatchList.displayName = "MatchList";
