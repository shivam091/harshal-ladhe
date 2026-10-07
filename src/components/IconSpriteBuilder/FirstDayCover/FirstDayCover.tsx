"use client";

import { useRef, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { ArrowDownIcon } from "@/components/Icon";
import CodeSlip from "@/components/IconSpriteBuilder/CodeSlip/CodeSlip";
import { buildSnippet, downloadFile, formatBytes } from "@/components/IconSpriteBuilder/IconSpriteBuilder.utils";
import { GiltButton, HintText } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import {
  Envelope,
  EnvelopeFace,
  CoverHeader,
  Cachet,
  Postmark,
  Postage,
  TabList,
  Tab,
  TabPanel,
  PanelActions,
  SnippetCaption
} from "@/components/IconSpriteBuilder/FirstDayCover/FirstDayCover.styles";
import type { CoverTab, FirstDayCoverProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// The four outputs in reading order — the sprite first, since every snippet depends on it being on the page.
const TABS: Array<{ id: CoverTab; label: string }> = [
  { id: "sprite", label: "Sprite" },
  { id: "html", label: "HTML <use>" },
  { id: "react", label: "React <use>" },
  { id: "external", label: "External file" }
];

// What each snippet tab needs the reader to know before copying — chiefly where the sprite has to live for the reference to resolve.
const TAB_HINTS: Record<Exclude<CoverTab, "sprite">, string> = {
  html: "Inline the sprite once (just inside <body> is usual), then drop these anywhere on the same page.",
  react: "Render the sprite once near your app root; JSX takes plain href, so no xlink is needed.",
  external: "References the sprite as a separate cached file. It must be served from the same origin — browsers refuse cross-origin <use>."
};

/*
  The first-day cover: the finished sprite with a download, and every icon's <use> snippet in
  three flavours, behind an accessible tab strip (arrow keys, Home and End move between tabs).
  The postage box compares the separate source files with the one combined sprite.
*/
export default function FirstDayCover({ state, result }: FirstDayCoverProps): JSX.Element {
  const [tab, setTab] = useState<CoverTab>("sprite");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const validIcons = result.icons.filter((icon) => !icon.error);
  const delta = result.separateBytes > 0 ? Math.round(((result.spriteBytes - result.separateBytes) / result.separateBytes) * 100) : 0;

  // Roving focus across the tabs, following the WAI-ARIA tabs pattern with automatic activation.
  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <>
      <Envelope aria-labelledby="icon-sprite-cover-title">
        <EnvelopeFace>
          <CoverHeader>
            <Cachet>
              <h3 id="icon-sprite-cover-title">First-day cover</h3>
              <HintText>The finished sprite and its &lt;use&gt; references.</HintText>
            </Cachet>
            <Postmark aria-hidden="true">
              First day
              <br />
              of issue
              <br />
              {result.validCount} sym.
            </Postmark>
            <Postage role="group" aria-label="Byte comparison">
              <span>
                {result.validCount} {result.validCount === 1 ? "file" : "files"} · {formatBytes(result.separateBytes)}
              </span>
              <span>
                1 sprite · {formatBytes(result.spriteBytes)}
              </span>
              {result.separateBytes > 0 && (
                <strong>
                  {delta > 0 ? "+" : ""}
                  {delta}% · {result.validCount} → 1 request
                </strong>
              )}
            </Postage>
          </CoverHeader>

          <TabList role="tablist" aria-label="Output">
            {TABS.map((entry, index) => (
              <Tab
                key={entry.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`icon-sprite-tab-${entry.id}`}
                type="button"
                role="tab"
                aria-selected={tab === entry.id}
                aria-controls="icon-sprite-tabpanel"
                tabIndex={tab === entry.id ? 0 : -1}
                onClick={() => setTab(entry.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {entry.label}
              </Tab>
            ))}
          </TabList>

          <TabPanel id="icon-sprite-tabpanel" role="tabpanel" aria-labelledby={`icon-sprite-tab-${tab}`}>
            {validIcons.length === 0 ? (
              <HintText>Mount at least one readable icon to issue a sprite.</HintText>
            ) : tab === "sprite" ? (
              <>
                <PanelActions>
                  <HintText>Inline this once per page, or save it as a file for the external form.</HintText>
                  <GiltButton type="button" onClick={() => downloadFile("sprite.svg", result.sprite)}>
                    <ArrowDownIcon size={14} />
                    Download sprite.svg
                  </GiltButton>
                </PanelActions>
                <CodeSlip code={result.sprite} language="html" label="Generated sprite.svg" />
              </>
            ) : (
              <>
                <HintText>{TAB_HINTS[tab]}</HintText>
                {validIcons.map((icon) => (
                  <div key={icon.key}>
                    <SnippetCaption>#{icon.id}</SnippetCaption>
                    <CodeSlip code={buildSnippet(icon, tab, state.options.spritePath)} language={tab === "react" ? "tsx" : "html"} label={`${icon.id} snippet`} />
                  </div>
                ))}
              </>
            )}
          </TabPanel>
        </EnvelopeFace>
      </Envelope>
    </>
  );
}

FirstDayCover.displayName = "FirstDayCover";
