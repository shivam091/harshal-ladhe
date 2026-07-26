import { FILE_TYPE_ICONS } from "@/components/Sandbox/Sandbox.helpers";

/*
  Per-file-type icons on tabs/explorer rows — Sandpack has no icon prop, so keyed off the filename in each button's
  title attribute (see Sandbox.helpers.ts).
*/
export const fileIconsCss = `
  .sp-tab-button[title$=".ts"],
  .sp-tab-button[title$=".tsx"],
  .sp-tab-button[title$=".js"],
  .sp-tab-button[title$=".jsx"],
  .sp-tab-button[title$=".css"],
  .sp-tab-button[title$=".scss"],
  .sp-tab-button[title$=".html"],
  .sp-tab-button[title$=".json"],
  .sp-explorer[title$=".ts"],
  .sp-explorer[title$=".tsx"],
  .sp-explorer[title$=".js"],
  .sp-explorer[title$=".jsx"],
  .sp-explorer[title$=".css"],
  .sp-explorer[title$=".scss"],
  .sp-explorer[title$=".html"],
  .sp-explorer[title$=".json"] {
    gap: var(--size-xs);
  }

  .sp-tab-button[title$=".ts"]::before,
  .sp-tab-button[title$=".tsx"]::before,
  .sp-tab-button[title$=".js"]::before,
  .sp-tab-button[title$=".jsx"]::before,
  .sp-tab-button[title$=".css"]::before,
  .sp-tab-button[title$=".scss"]::before,
  .sp-tab-button[title$=".html"]::before,
  .sp-tab-button[title$=".json"]::before,
  .sp-explorer[title$=".ts"]::before,
  .sp-explorer[title$=".tsx"]::before,
  .sp-explorer[title$=".js"]::before,
  .sp-explorer[title$=".jsx"]::before,
  .sp-explorer[title$=".css"]::before,
  .sp-explorer[title$=".scss"]::before,
  .sp-explorer[title$=".html"]::before,
  .sp-explorer[title$=".json"]::before {
    content: "";
    inline-size: 14px;
    block-size: 14px;
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  /* Explorer rows also render Sandpack's own generic file glyph before the label — hide it wherever a typed icon is supplied instead. */
  .sp-explorer[title$=".ts"] svg,
  .sp-explorer[title$=".tsx"] svg,
  .sp-explorer[title$=".js"] svg,
  .sp-explorer[title$=".jsx"] svg,
  .sp-explorer[title$=".css"] svg,
  .sp-explorer[title$=".scss"] svg,
  .sp-explorer[title$=".html"] svg,
  .sp-explorer[title$=".json"] svg {
    display: none;
  }

  .sp-tab-button[title$=".ts"]::before,
  .sp-explorer[title$=".ts"]::before {
    background-image: url("${FILE_TYPE_ICONS.ts}");
  }
  .sp-tab-button[title$=".tsx"]::before,
  .sp-explorer[title$=".tsx"]::before {
    background-image: url("${FILE_TYPE_ICONS.tsx}");
  }
  .sp-tab-button[title$=".js"]::before,
  .sp-explorer[title$=".js"]::before {
    background-image: url("${FILE_TYPE_ICONS.js}");
  }
  .sp-tab-button[title$=".jsx"]::before,
  .sp-explorer[title$=".jsx"]::before {
    background-image: url("${FILE_TYPE_ICONS.jsx}");
  }
  .sp-tab-button[title$=".css"]::before,
  .sp-explorer[title$=".css"]::before {
    background-image: url("${FILE_TYPE_ICONS.css}");
  }
  .sp-tab-button[title$=".scss"]::before,
  .sp-explorer[title$=".scss"]::before {
    background-image: url("${FILE_TYPE_ICONS.scss}");
  }
  .sp-tab-button[title$=".html"]::before,
  .sp-explorer[title$=".html"]::before {
    background-image: url("${FILE_TYPE_ICONS.html}");
  }
  .sp-tab-button[title$=".json"]::before,
  .sp-explorer[title$=".json"]::before {
    background-image: url("${FILE_TYPE_ICONS.json}");
  }
`;
