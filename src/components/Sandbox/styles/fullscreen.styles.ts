/*
  Strips the card chrome and fills the viewport while browser-fullscreened (see FullscreenToggle /
  SandboxUIContext's toggleFullscreen). `:fullscreen` is the standards path; `-webkit-full-screen`
  covers older Safari, which doesn't recognize the unprefixed pseudo-class.
*/
export const fullscreenCss = `
  &:fullscreen,
  &:-webkit-full-screen {
    margin-block: 0;
    border: none;
    border-radius: 0;
    inline-size: 100dvw;
    block-size: 100dvh;
    background: var(--color-bg-default);
    display: flex;
    flex-direction: column;
  }

  /*
    Sandpack's own .sp-wrapper sits between this element and SandpackLayout as a plain
    display:block/height:auto div, which breaks the percentage-height chain down to it — flexing
    it gives SandpackLayout (via sandpackLayoutStyle in SandboxClient.tsx) a real height to fill.
  */
  &:fullscreen .sp-wrapper,
  &:-webkit-full-screen .sp-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-block-size: 0;
    overflow: hidden;
  }
`;
