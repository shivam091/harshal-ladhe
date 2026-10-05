"use client";

import { useState } from "react";
import type { JSX } from "react";
import TabList from "@/components/OpenGraphPreview/TabList/TabList";
import PinnedCard from "@/components/OpenGraphPreview/PinnedCard/PinnedCard";
import XPreview from "@/components/OpenGraphPreview/PlatformPreviews/XPreview";
import LinkedInPreview from "@/components/OpenGraphPreview/PlatformPreviews/LinkedInPreview";
import SlackPreview from "@/components/OpenGraphPreview/PlatformPreviews/SlackPreview";
import FacebookPreview from "@/components/OpenGraphPreview/PlatformPreviews/FacebookPreview";
import DiscordPreview from "@/components/OpenGraphPreview/PlatformPreviews/DiscordPreview";
import IMessagePreview from "@/components/OpenGraphPreview/PlatformPreviews/IMessagePreview";
import GooglePreview from "@/components/OpenGraphPreview/PlatformPreviews/GooglePreview";
import { BoardSection, BoardTabs, BoardGrid } from "@/components/OpenGraphPreview/PreviewBoard/PreviewBoard.styles";
import type { PlatformPreviewProps, PreviewBoardProps, PreviewPlatform, SurfaceMode, TabItem } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Every platform with its card component and a fixed tilt — fixed, not Math.random(), so the server render and the hydrated client agree on every angle.
const PLATFORMS: ReadonlyArray<{ id: PreviewPlatform; label: string; tilt: number; Preview: (props: PlatformPreviewProps) => JSX.Element }> = [
  { id: "x", label: "X", tilt: -1.4, Preview: XPreview },
  { id: "linkedin", label: "LinkedIn", tilt: 1.1, Preview: LinkedInPreview },
  { id: "slack", label: "Slack", tilt: -0.6, Preview: SlackPreview },
  { id: "facebook", label: "Facebook", tilt: 1.6, Preview: FacebookPreview },
  { id: "discord", label: "Discord", tilt: -1.8, Preview: DiscordPreview },
  { id: "imessage", label: "iMessage", tilt: 0.8, Preview: IMessagePreview },
  { id: "google", label: "Google", tilt: -0.9, Preview: GooglePreview }
];

// "All" is a tab of its own so the comparison board and the single, larger card are one click apart.
type BoardTab = "all" | PreviewPlatform;

// The tab row's entries, derived from PLATFORMS so a new platform can't be added to one list and forgotten in the other.
const TABS: ReadonlyArray<TabItem<BoardTab>> = [{ id: "all", label: "All" }, ...PLATFORMS.map(({ id, label }) => ({ id, label }))];

// Each surface starts in the mode its platform defaults to — light almost everywhere, dark for Discord.
const INITIAL_MODES: Record<PreviewPlatform, SurfaceMode> = {
  x: "light",
  linkedin: "light",
  slack: "light",
  facebook: "light",
  discord: "dark",
  imessage: "light",
  google: "light"
};

// Tab and per-card modes are view preferences, not content — local state, so toggling a card's mode never lands in undo history or the permalink.
export default function PreviewBoard({ data }: PreviewBoardProps): JSX.Element {
  const [tab, setTab] = useState<BoardTab>("all");
  const [modes, setModes] = useState(INITIAL_MODES);
  const visible = tab === "all" ? PLATFORMS : PLATFORMS.filter((platform) => platform.id === tab);

  return (
    <>
      <BoardSection aria-label="Share previews">
        <BoardTabs>
          <TabList label="Preview platform" idPrefix="open-graph-board" tabs={TABS} selected={tab} onSelect={setTab} />
        </BoardTabs>
        <BoardGrid
          id={`open-graph-board-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`open-graph-board-tab-${tab}`}
          data-single={tab === "all" ? undefined : "true"}
        >
          {visible.map(({ id, label, tilt, Preview }) => (
            <PinnedCard
              key={id}
              label={label}
              tilt={tab === "all" ? tilt : 0}
              mode={modes[id]}
              onModeChange={(mode) => setModes((current) => ({ ...current, [id]: mode }))}
            >
              <Preview data={data} />
            </PinnedCard>
          ))}
        </BoardGrid>
      </BoardSection>
    </>
  );
}

PreviewBoard.displayName = "PreviewBoard";
