import type { ReactNode, SVGProps } from "react";

// Shape of every entry in the icons registry — viewBox required; svgProps overrides defaults; children is the SVG markup.
export type IconDefinition = {
  viewBox: string;
  svgProps?: SVGProps<SVGSVGElement>;
  children: ReactNode;
};

// Shared props for spring-animated icons whose only interaction is a boop.
export interface IconBoopProps {
  size?: number;
  // When provided, the parent controls the boop state; omit to let the icon boop itself on hover.
  isBooped?: boolean;
}

// Shape of the analytics data attributes read by useAnalytics from any tracked element in the DOM.
export type AnalyticsEvent = {
  // GA4 event name sent as the first argument to gtag("event", ...).
  event: string;
  // Human-readable label describing the specific element that was interacted with.
  label: string;
  // Logical grouping for the event, e.g. "social", "footer", "nav".
  category: string;
};

// Central icon registry mapping name → definition; drives the Icon component and all createIcon-based named exports.
export const icons = {
  adjust: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M12 2C6.579 2 2 6.58 2 12s4.579 10 10 10 10-4.58 10-10S17.421 2 12 2zm0 17V5c3.829 0 7 3.169 7 7 0 3.828-3.171 7-7 7z" />
      </>
    )
  },
  alertOctagon: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    )
  },
  archive: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M16 12.18c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1Z" />
        <path
          fillRule="evenodd"
          d="M20.36 9.43A2.233 2.233 0 0 0 22 7.28c0-.43-.05-.94-.14-1.5a2.885 2.885 0 0 0-2.47-2.4C18.12 3.21 15.8 3 12 3s-6.11.21-7.39.38a2.886 2.886 0 0 0-2.47 2.39C2.05 6.33 2 6.84 2 7.27c0 1.022.69 1.886 1.63 2.148V13c0 2.02.06 3.82.17 5.35a3.072 3.072 0 0 0 2.85 2.84c1.529.11 3.317.17 5.345.17 2.028 0 3.826-.06 5.345-.17a3.064 3.064 0 0 0 2.85-2.84c.08-1.04.17-2.81.17-5.35V9.43ZM4.23 7.5C4.1 7.5 4 7.39 4 7.27c0-.32.04-.72.11-1.17h.03c.06-.4.35-.68.76-.74C6.11 5.2 8.34 5 12.02 5s5.91.2 7.12.36c.4.06.69.34.76.74.07.45.11.85.11 1.17 0 .13-.11.23-.23.23H4.23Zm1.41 2V13c0 1.94.06 3.74.17 5.2.04.56.44.96 1 1 1.01.08 2.73.17 5.2.17s4.18-.09 5.2-.17c.56-.04.96-.44 1-1 .08-1.01.17-2.72.17-5.2V9.5H5.64Z"
          clipRule="evenodd"
        />
      </>
    )
  },
  arrowDown: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="5 12 12 19 19 12" />
      </>
    )
  },
  arrowRight: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="5" y1="12" x2="18" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    )
  },
  arrowUp: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </>
    )
  },
  // An asymmetric closed curve — each corner a visibly different radius — standing in for a "blob"/squircle shape rather than a uniform rounded square, which would read as just another card icon. Used by the Border Radius Generator goodie card.
  blob: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M3 9 C3 5 5 3 9 3 L17 3 C20 3 21 5 21 8 L21 18 C21 21 19 21 15 21 L6 21 C4 21 3 19 3 16 Z" />
      </>
    )
  },
  book: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="3" y="2" width="18" height="22" rx="2" />
        <line x1="1" y1="7" x2="5" y2="7" />
        <line x1="1" y1="11" x2="5" y2="11" />
        <line x1="1" y1="15" x2="5" y2="15" />
        <line x1="1" y1="19" x2="5" y2="19" />
        <line x1="9" y1="9" x2="14.5" y2="9" />
        <line x1="9" y1="13" x2="16" y2="13" />
        <line x1="9" y1="17" x2="14" y2="17" />
      </>
    )
  },
  bookOpen: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </>
    )
  },
  // Two overlapping squares, the back one filled at low opacity — reads as "a shape casting a shadow", used for the Box Shadow Generator goodie card and its Console-family icon.
  boxShadow: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="7" y="7" width="14" height="14" rx="2" fill="currentColor" stroke="none" opacity="0.35" />
        <rect x="3" y="3" width="14" height="14" rx="2" />
      </>
    )
  },
  bulb: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="m12 3c-3.585 0-6.5 2.9225-6.5 6.5385 0 2.2826 1.162 4.2913 2.9248 5.4615h7.1504c1.7628-1.1702 2.9248-3.1789 2.9248-5.4615 0-3.6159-2.915-6.5385-6.5-6.5385zm2.8653 14h-5.7306v1h5.7306v-1zm-1.1329 3h-3.4648c0.3458 0.5978 0.9921 1 1.7324 1s1.3866-0.4022 1.7324-1zm-5.6064 0c0.44403 1.7252 2.0101 3 3.874 3s3.43-1.2748 3.874-3c0.5483-0.0047 0.9913-0.4506 0.9913-1v-2.4593c2.1969-1.5431 3.6347-4.1045 3.6347-7.0022 0-4.7108-3.8008-8.5385-8.5-8.5385-4.6992 0-8.5 3.8276-8.5 8.5385 0 2.8977 1.4378 5.4591 3.6347 7.0022v2.4593c0 0.5494 0.44301 0.9953 0.99128 1z"
          clipRule="evenodd"
        />
      </>
    )
  },
  calendar: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M7.38 2.041a2.101 2.101 0 0 0-1.336.83c-.271.366-.372.643-.461 1.256l-.021.145-.33.027c-1.048.087-1.9.548-2.448 1.32-.495.698-.575 1.124-.704 3.729-.141 2.873-.054 8.133.163 9.763.166 1.251 1.111 2.311 2.322 2.605 1.193.29 8.654.397 12.81.184 1.862-.096 2.12-.136 2.704-.423.797-.39 1.438-1.182 1.636-2.019.258-1.086.386-6.851.226-10.11-.127-2.574-.217-3.047-.7-3.723-.556-.781-1.403-1.239-2.453-1.326l-.329-.027-.021-.145c-.09-.613-.19-.89-.461-1.256-.349-.472-.803-.74-1.413-.836-.41-.064-1.183-.023-1.514.081-.734.231-1.323.915-1.453 1.689l-.05.297h-3.073l-.05-.297c-.13-.774-.717-1.456-1.454-1.69-.301-.095-1.231-.138-1.59-.074Zm1.048 2.057c.054.082.06.234.05 1.04-.007.657-.025.956-.058.99-.028.027-.18.047-.372.05-.482.002-.46.051-.475-1.059-.016-1.156-.031-1.117.453-1.117.313 0 .343.007.402.096Zm7.969.001c.054.083.062.23.05 1.02-.015 1.11.008 1.061-.475 1.058-.192-.002-.343-.022-.371-.05-.033-.033-.051-.332-.059-.99-.015-1.178-.032-1.135.452-1.135.315 0 .344.007.403.097Zm3.558 5.41c.097 2.442.084 6.05-.077 8.387-.034.474-.072.93-.086 1.013-.06.365-.437.77-.809.867-.16.043-.994.102-2.328.166-1.42.067-6.136.092-7.868.04-2.737-.08-3.675-.146-3.936-.28-.412-.21-.585-.485-.647-1.03-.204-1.8-.258-6.102-.132-9.172 1.92 0 13.928.009 15.883.009Z"
          clipRule="evenodd"
        />
      </>
    )
  },
  candy: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M10 7v10.9" />
        <path d="M14 6.1V17" />
        <path d="M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4" />
        <path d="M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07" />
        <path d="M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4" />
      </>
    )
  },
  check: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    )
  },
  checkCircle: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="8 12.5 11 15.5 16 9.5" />
      </>
    )
  },
  chevronDown: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="6 10 12 16 18 10" />
      </>
    )
  },
  chevronLeft: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="15 18 9 12 15 6" />
      </>
    )
  },
  chevronRight: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="9 18 15 12 9 6" />
      </>
    )
  },
  circleFill: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <circle cx="12" cy="12" r="12" />
      </>
    )
  },
  circleSlash: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="22" y1="2" x2="2" y2="22" />
      </>
    )
  },
  clipboard: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </>
    )
  },
  clipboardCheck: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </>
    )
  },
  clock: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M12 6a1 1 0 0 1 1 1v5a1 1 0 0 1-.293.707l-3.5 3.5a1 1 0 0 1-1.414-1.414L11 11.586V7a1 1 0 0 1 1-1z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
          clipRule="evenodd"
        />
      </>
    )
  },
  // A clock face (circle + hour/minute hands) with a small looping-arrow badge at the lower right — the clock reads as "schedule," the loop as "recurring," together reading as a cron/repeating-timer glyph rather than a plain clock.
  cron: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="11" cy="11" r="8" />
        <path d="M11 6.5 L11 11 L14 13" />
        <path d="M16.5 16.5 A4 4 0 1 1 19.8 13.7" />
        <path d="M19.8 11.5 L19.8 13.7 L17.6 13.4" />
      </>
    )
  },
  // Two angled slashes (regex literal delimiters) flanking a dot and a small asterisk burst — reads as "/.*/ ", the most recognizable regex shorthand there is.
  regex: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M7 3 L4 21" />
        <path d="M20 3 L17 21" />
        <circle cx="9.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
        <path d="M13 10.5 L13 15.5 M10.8 11.75 L15.2 14.25 M15.2 11.75 L10.8 14.25" />
      </>
    )
  },
  undo: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="9 14 4 9 9 4" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      </>
    )
  },
  redo: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="15 14 20 9 15 4" />
        <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
      </>
    )
  },
  close: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </>
    )
  },
  code: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M16.001 3.19a1 1 0 0 1 1.047-.951l.314.016.063.003c.69.036 1.311.068 1.823.169.57.113 1.095.327 1.547.778.451.452.665.976.778 1.547.101.511.133 1.132.17 1.822l.002.063c.174 3.341.174 7.385 0 10.726l-.003.063c-.036.69-.068 1.31-.169 1.822-.113.57-.327 1.095-.778 1.546-.452.452-.976.666-1.547.779-.511.101-1.132.133-1.822.169l-.063.003a110.84 110.84 0 0 1-10.726 0l-.063-.003c-.69-.036-1.31-.068-1.822-.17-.57-.112-1.095-.326-1.546-.777-.452-.452-.666-.977-.779-1.547-.101-.512-.133-1.133-.169-1.823l-.003-.063a102.21 102.21 0 0 1-.125-4.353 1 1 0 0 1 2-.018c.012 1.478.053 2.932.122 4.267.04.774.067 1.248.137 1.601.062.31.139.43.23.521.093.092.212.17.522.23.353.07.826.098 1.6.138 3.272.17 7.246.17 10.519 0 .773-.04 1.247-.067 1.6-.137.31-.062.429-.139.52-.23.093-.093.17-.212.231-.522.07-.353.097-.826.137-1.6.17-3.272.17-7.246 0-10.519-.04-.773-.067-1.247-.137-1.6-.061-.31-.138-.429-.23-.52-.092-.092-.212-.17-.521-.231-.354-.07-.828-.097-1.601-.137l-.307-.015a1 1 0 0 1-.95-1.047Z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M6.707 1.293a1 1 0 0 1 0 1.414L4.121 5.293c-.353.353-.545.549-.662.701A.838.838 0 0 0 3.455 6a.838.838 0 0 0 .004.006c.117.152.31.348.662.701l2.586 2.586a1 1 0 0 1-1.414 1.414L2.707 8.121l-.038-.038c-.3-.3-.592-.591-.8-.864-.234-.307-.455-.705-.455-1.219 0-.514.22-.912.455-1.219.208-.273.5-.564.8-.864l.038-.038 2.586-2.586a1 1 0 0 1 1.414 0Zm2.586 0a1 1 0 0 1 1.414 0l2.586 2.586.039.038c.3.3.59.591.799.864.234.307.455.705.455 1.219 0 .514-.22.912-.455 1.219-.208.273-.5.564-.8.864l-.038.038-2.586 2.586a1 1 0 0 1-1.414-1.414l2.586-2.586c.353-.353.546-.549.662-.701L12.545 6l-.004-.006c-.117-.152-.309-.348-.662-.701L9.293 2.707a1 1 0 0 1 0-1.414Z"
          clipRule="evenodd"
        />
      </>
    )
  },
  codeBlock: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="6 8 2 12 6 16" />
        <line x1="10" y1="18" x2="14" y2="6" />
        <polyline points="18 8 22 12 18 16" />
      </>
    )
  },
  colorMix: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <circle cx="9" cy="12" r="7" opacity="0.6" />
        <circle cx="15" cy="12" r="7" opacity="0.6" />
      </>
    )
  },
  // Three overlapping rounded chips fanned like a hand of paint swatches — ColorPaletteGenerator's own nameplate glyph and goodies-grid icon.
  colorPalette: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="4" y="5" width="10" height="14" rx="2" transform="rotate(-12 9 12)" />
        <rect x="7" y="5" width="10" height="14" rx="2" transform="rotate(6 12 12)" />
        <rect x="10" y="5" width="10" height="14" rx="2" />
      </>
    )
  },
  // Two side-by-side panes — SplitDiffViewToggle's glyph for the Diff tab's split (old | new) layout.
  columns: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="3" y="4" width="7" height="16" rx="1" />
        <rect x="14" y="4" width="7" height="16" rx="1" />
      </>
    )
  },
  deviceDesktop: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M19,3H5A3,3,0,0,0,2,6v8a3,3,0,0,0,3,3h6v2H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H13V17h6a3,3,0,0,0,3-3V6A3,3,0,0,0,19,3Zm1,11a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1Z" />
      </>
    )
  },
  diamonds: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polygon points="12,2 15.5,5.5 12,9 8.5,5.5" />
        <polygon points="2,12 5.5,8.5 9,12 5.5,15.5" />
        <polygon points="22,12 18.5,8.5 15,12 18.5,15.5" />
        <polygon points="12,22 8.5,18.5 12,15 15.5,18.5" />
      </>
    )
  },
  // Two overlapping rounded rects — the standard "duplicate" glyph, distinct from `clipboard` (which reads as "copy to clipboard," not "duplicate this item").
  duplicate: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    )
  },
  easingCurve: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M3 3 L3 21 L21 21" />
        <path d="M4 19 C 9 19, 8 5, 20 5" />
        <circle cx="9" cy="19" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="15" cy="5" r="1.4" fill="currentColor" stroke="none" />
      </>
    )
  },
  emojiSad: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M8.36,15.33a1,1,0,0,0-.13,1.4,1,1,0,0,0,1.41.13,3.76,3.76,0,0,1,4.72,0,1,1,0,0,0,.64.23,1,1,0,0,0,.64-1.76A5.81,5.81,0,0,0,8.36,15.33Zm.85-4.79a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41,3.08,3.08,0,0,0-4.24,0,1,1,0,1,0,1.41,1.41A1,1,0,0,1,9.21,10.54ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM17.62,9.13a3.08,3.08,0,0,0-4.24,0,1,1,0,0,0,1.41,1.41,1,1,0,0,1,1.42,0,1,1,0,0,0,1.41,0A1,1,0,0,0,17.62,9.13Z" />
      </>
    )
  },
  envelope: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" ry="2" />
        <polyline points="4 7 12 14 20 7" />
      </>
    )
  },
  externalLink: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="10" y1="14" x2="21" y2="3" />
        <polyline points="14 3 21 3 21 10" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </>
    )
  },
  exclamationTriangle: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M12,16a1,1,0,1,0,1,1A1,1,0,0,0,12,16Zm10.67,1.47-8.05-14a3,3,0,0,0-5.24,0l-8,14A3,3,0,0,0,3.94,22H20.06a3,3,0,0,0,2.61-4.53Zm-1.73,2a1,1,0,0,1-.88.51H3.94a1,1,0,0,1-.88-.51,1,1,0,0,1,0-1l8-14a1,1,0,0,1,1.78,0l8.05,14A1,1,0,0,1,20.94,19.49ZM12,8a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V9A1,1,0,0,0,12,8Z" />
      </>
    )
  },
  facebook: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z" />
      </>
    )
  },
  file: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M4 5C4 3.34315 5.34315 2 7 2H14.1716C14.9672 2 15.7303 2.31607 16.2929 2.87868L19.1213 5.70711C19.6839 6.26972 20 7.03278 20 7.82843V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V5ZM7 4C6.44772 4 6 4.44772 6 5V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7.82843C18 7.56321 17.8946 7.30886 17.7071 7.12132L14.8787 4.29289C14.6911 4.10536 14.4368 4 14.1716 4H7ZM8 10C8 9.44772 8.44772 9 9 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10ZM8 14C8 13.4477 8.44772 13 9 13H13C13.5523 13 14 13.4477 14 14C14 14.5523 13.5523 15 13 15H9C8.44772 15 8 14.5523 8 14Z"
          clipRule="evenodd"
        />
      </>
    )
  },
  flat: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="5 12 12 12 19 12" />
      </>
    )
  },
  fluidType: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M6 19 L18 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 3" />
        <text x="2" y="21" fontSize="9" fontWeight="800">
          A
        </text>
        <text x="11" y="15" fontSize="17" fontWeight="800">
          A
        </text>
      </>
    )
  },
  folder: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M2.625 1.5 A2.625 2.625 0 0 0 0 4.125 V19.875 C0 21.324 1.176 22.5 2.625 22.5 H21.375 A2.625 2.625 0 0 0 24 19.875 V7.125 A2.625 2.625 0 0 0 21.375 4.5 H11.25 A0.375 0.375 0 0 1 10.95 4.35 L9.6 2.55 C9.105 1.89 8.325 1.5 7.5 1.5 H2.625 Z" />
      </>
    )
  },
  folderOpen: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M0.7695 2.2695 A2.625 2.625 0 0 1 2.625 1.5 H7.875 C8.7 1.5 9.48 1.89 9.975 2.55 L11.325 4.35 A0.375 0.375 0 0 0 11.625 4.5 H19.5 A1.5 1.5 0 0 1 21 6 V6.75 H4.125 A1.125 1.125 0 0 0 4.125 9 H22.092 A1.5 1.5 0 0 1 23.583 10.6755 L22.5 19.875 A2.625 2.625 0 0 1 19.875 22.5 H2.625 A2.625 2.625 0 0 1 0 19.875 V4.125 C0 3.429 0.276 2.76 0.7695 2.2695 Z" />
      </>
    )
  },
  foldUp: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M11.735 2.516L7.39 6.86A.375 .375 0 0 0 7.656 7.5H10.875v4.854a1.125 1.125 0 1 0 2.25 0V7.5h3.219a.375 .375 0 0 0 .265-.64L12.265 2.516a.375 .375 0 0 0-.531 0ZM20.625 16.5a1.125 1.125 0 0 0 0 2.25h.75a1.125 1.125 0 0 0 0-2.25h-.75Zm-5.625 1.125a1.125 1.125 0 0 1 1.125-1.125h.75a1.125 1.125 0 0 1 0 2.25h-.75a1.125 1.125 0 0 1-1.125-1.125ZM11.625 16.5a1.125 1.125 0 0 0 0 2.25h.75a1.125 1.125 0 0 0 0-2.25h-.75ZM6 17.625a1.125 1.125 0 0 1 1.125-1.125h.75a1.125 1.125 0 0 1 0 2.25h-.75a1.125 1.125 0 0 1-1.125-1.125ZM2.625 16.5a1.125 1.125 0 0 0 0 2.25h.75a1.125 1.125 0 0 0 0-2.25h-.75Z" />
      </>
    )
  },
  foldDown: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M12.265 21.485l4.344-4.344a.375 .375 0 0 0-.265-.641H13.125V11.646a1.125 1.125 0 1 0-2.25 0V16.5H7.656a.375 .375 0 0 0-.265 .64l4.344 4.344a.375 .375 0 0 0 .531 0ZM3.375 7.5a1.125 1.125 0 0 0 0-2.25h-.75a1.125 1.125 0 0 0 0 2.25h.75ZM9 6.375a1.125 1.125 0 0 1-1.125 1.125h-.75a1.125 1.125 0 0 1 0-2.25h.75a1.125 1.125 0 0 1 1.125 1.125ZM12.375 7.5a1.125 1.125 0 0 0 0-2.25h-.75a1.125 1.125 0 0 0 0 2.25h.75ZM18 6.375a1.125 1.125 0 0 1-1.125 1.125h-.75a1.125 1.125 0 0 1 0-2.25h.75a1.125 1.125 0 0 1 1.125 1.125Zm3.375 1.125a1.125 1.125 0 0 0 0-2.25h-.75a1.125 1.125 0 0 0 0 2.25h.75Z" />
      </>
    )
  },
  unfold: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M12.265 1.016l4.344 4.343a.375 .375 0 0 1-.265 .641H13.125v1.875a1.125 1.125 0 0 1-2.25 0V6H7.656a.375 .375 0 0 1-.265-.64L11.735 1.016a.375 .375 0 0 1 .531 0ZM10.875 16.125a1.125 1.125 0 0 1 2.25 0V18h3.219a.375 .375 0 0 1 .265 .64l-4.343 4.344a.375 .375 0 0 1-.531 0l-4.344-4.344A.375 .375 0 0 1 7.656 18H10.875v-1.875Zm-7.5-3a1.125 1.125 0 0 0 0-2.25h-.75a1.125 1.125 0 0 0 0 2.25h.75ZM9 12a1.125 1.125 0 0 1-1.125 1.125h-.75a1.125 1.125 0 0 1 0-2.25h.75A1.125 1.125 0 0 1 9 12Zm3.375 1.125a1.125 1.125 0 0 0 0-2.25h-.75a1.125 1.125 0 0 0 0 2.25h.75ZM18 12a1.125 1.125 0 0 1-1.125 1.125h-.75a1.125 1.125 0 0 1 0-2.25h.75A1.125 1.125 0 0 1 18 12Zm3.375 1.125a1.125 1.125 0 0 0 0-2.25h-.75a1.125 1.125 0 0 0 0 2.25h.75Z" />
      </>
    )
  },
  /*
    Two overlapping rounded rects at different opacities plus a bordered inner rect — a plain panel
    behind a taller, more transparent one, with a sharp-edged frame standing in for the pane of glass
    a backdrop-filter's translucent panel actually is. Used by the Filter & Backdrop Generator goodie
    card.
  */
  frostedPanel: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <rect x="1" y="1" width="22" height="22" rx="3" opacity="0.25" />
        <rect x="10" y="1" width="13" height="22" rx="3" opacity="0.4" />
        <rect x="5" y="7" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
      </>
    )
  },
  /*
    Four side-by-side (non-overlapping) bands at decreasing opacity inside a rounded frame — a
    currentColor-only stand-in for a gradient swatch, since the icon registry has no per-icon color
    stops of its own. Bands must not overlap: stacking same-colored rects on top of each other
    composites back to one solid color regardless of opacity, which is what an earlier overlapping
    version of this icon did (rendered as a plain filled square).
  */
  gradient: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="2" y="4" width="20" height="16" />
        <rect x="2" y="4" width="5" height="16" fill="currentColor" stroke="none" opacity="1" />
        <rect x="7" y="4" width="5" height="16" fill="currentColor" stroke="none" opacity="0.7" />
        <rect x="12" y="4" width="5" height="16" fill="currentColor" stroke="none" opacity="0.4" />
        <rect x="17" y="4" width="5" height="16" fill="currentColor" stroke="none" opacity="0.15" />
      </>
    )
  },
  github: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z" />
      </>
    )
  },
  // A bordered square divided by one vertical and one horizontal rule into an uneven grid — reads as "arrangeable tracks/cells" rather than a plain uniform 2x2 grid. Used by the Layout Playground goodie card.
  gridLayout: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="3" y1="14" x2="21" y2="14" />
      </>
    )
  },
  hamburger: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="3" y1="5" x2="21" y2="5" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="19" x2="21" y2="19" />
      </>
    )
  },
  hash: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </>
    )
  },
  history: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M6.25 9.542C7.258 6.893 9.85 5 12.9 5c3.933 0 7.1 3.146 7.1 7s-3.167 7-7.1 7a7.115 7.115 0 0 1-6.153-3.505 1 1 0 1 0-1.726 1.01A9.115 9.115 0 0 0 12.9 21c5.014 0 9.1-4.018 9.1-9s-4.086-9-9.1-9C8.628 3 5.03 5.917 4.058 9.862l-.355-.351a1 1 0 0 0-1.406 1.423l1.8 1.777a1 1 0 0 0 1.332.067L7.629 11A1 1 0 1 0 6.37 9.444l-.12.098zM14 8a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1h3a1 1 0 1 0 0-2h-2V8z"
          clipRule="evenodd"
        />
      </>
    )
  },
  indentGuides: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="4" y1="4" x2="4" y2="20" strokeDasharray="2 2" />
        <line x1="10" y1="8" x2="10" y2="20" strokeDasharray="2 2" />
        <line x1="16" y1="12" x2="16" y2="20" strokeDasharray="2 2" />
        <line x1="4" y1="4" x2="8" y2="4" />
        <line x1="10" y1="8" x2="14" y2="8" />
        <line x1="16" y1="12" x2="20" y2="12" />
      </>
    )
  },
  home: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M11.293 2.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1-1.414 1.414L20 12.414V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4h-2v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7.586l-.293.293a1 1 0 0 1-1.414-1.414l9-9zM6 10.414V19h3v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4h3v-8.586l-6-6-6 6z"
          clipRule="evenodd"
        />
      </>
    )
  },
  infoCircle: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M9.5 11a1 1 0 0 1 1-1H12a1 1 0 0 1 1 1v4h1a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2h1v-3h-.5a1 1 0 0 1-1-1ZM12 9a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 12 9Z" />
        <path
          fillRule="evenodd"
          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm10-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
          clipRule="evenodd"
        />
      </>
    )
  },
  instagram: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    )
  },
  jsonToTs: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M5 3 C 3 3, 3 5, 3 7 C 3 9, 2 9, 2 10 C 2 11, 3 11, 3 12 C 3 14, 3 16, 5 16" transform="translate(0 3)" />
        <path d="M19 3 C 21 3, 21 5, 21 7 C 21 9, 22 9, 22 10 C 22 11, 21 11, 21 12 C 21 14, 21 16, 19 16" transform="translate(0 3)" />
        <path d="M9 12 L15 12 M9 12 L11 10 M9 12 L11 14 M15 12 L13 10 M15 12 L13 14" />
      </>
    )
  },
  keyframes: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M2 12 L22 12" />
        <path d="M5 9 L8 12 L5 15 L2 12 Z" />
        <path d="M12 9 L15 12 L12 15 L9 12 Z" />
        <path d="M19 9 L22 12 L19 15 L16 12 Z" />
        <path d="M15.5 4 L15.5 20" strokeWidth={1.5} />
        <path d="M14 4 L17 4" />
      </>
    )
  },
  keyboard: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M6.21,13.29a.93.93,0,0,0-.33-.21,1,1,0,0,0-.76,0,.9.9,0,0,0-.54.54,1,1,0,1,0,1.84,0A1,1,0,0,0,6.21,13.29ZM13.5,11h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm-4,0h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2Zm-3-2h-1a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2ZM20,5H4A3,3,0,0,0,1,8v8a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V8A3,3,0,0,0,20,5Zm1,11a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V8A1,1,0,0,1,4,7H20a1,1,0,0,1,1,1Zm-6-3H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Zm3.5-4h-1a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm.71,4.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,.93.93,0,0,0-.33.21,1,1,0,0,0-.21.33A1,1,0,1,0,19.5,14a.84.84,0,0,0-.08-.38A1,1,0,0,0,19.21,13.29Z" />
      </>
    )
  },
  link: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M10,17.55,8.23,19.27a2.47,2.47,0,0,1-3.5-3.5l4.54-4.55a2.46,2.46,0,0,1,3.39-.09l.12.1a1,1,0,0,0,1.4-1.43A2.75,2.75,0,0,0,14,9.59a4.46,4.46,0,0,0-6.09.22L3.31,14.36a4.48,4.48,0,0,0,6.33,6.33L11.37,19A1,1,0,0,0,10,17.55ZM20.69,3.31a4.49,4.49,0,0,0-6.33,0L12.63,5A1,1,0,0,0,14,6.45l1.73-1.72a2.47,2.47,0,0,1,3.5,3.5l-4.54,4.55a2.46,2.46,0,0,1-3.39.09l-.12-.1a1,1,0,0,0-1.4,1.43,2.75,2.75,0,0,0,.23.21,4.47,4.47,0,0,0,6.09-.22l4.55-4.55A4.49,4.49,0,0,0,20.69,3.31Z" />
      </>
    )
  },
  linkedin: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z" />
      </>
    )
  },
  list: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <circle cx="5" cy="6" r="1.5" />
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="5" cy="18" r="1.5" />
        <rect x="9" y="5.4" width="11" height="1.5" rx="0.6" />
        <rect x="9" y="11.4" width="11" height="1.5" rx="0.6" />
        <rect x="9" y="17.4" width="11" height="1.5" rx="0.6" />
      </>
    )
  },
  loader: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </>
    )
  },
  magicWand: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
        <path d="m14 7 3 3" />
        <path d="M5 6v4" />
        <path d="M19 14v4" />
        <path d="M10 2v2" />
        <path d="M7 8H3" />
        <path d="M21 16h-4" />
        <path d="M11 3H9" />
      </>
    )
  },
  minus: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="6" y1="12" x2="18" y2="12" />
      </>
    )
  },
  moon: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M10.719 2.082c-2.572 2.028-4.719 5.212-4.719 9.918 0 4.569 1.938 7.798 4.548 9.895-4.829-.705-8.548-4.874-8.548-9.895 0-5.08 3.808-9.288 8.719-9.918zm1.281-2.082c-6.617 0-12 5.383-12 12s5.383 12 12 12c1.894 0 3.87-.333 5.37-1.179-3.453-.613-9.37-3.367-9.37-10.821 0-7.555 6.422-10.317 9.37-10.821-1.74-.682-3.476-1.179-5.37-1.179zm0 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001z" />
      </>
    )
  },
  penTool: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M4 19 C 4 12, 10 8, 15 8" />
        <circle cx="4" cy="19" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="8" r="1.5" fill="currentColor" stroke="none" />
        <path d="M15 8 L20 4" />
        <circle cx="20" cy="4" r="1.5" />
      </>
    )
  },
  pilcrow: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M13 4v16" />
        <path d="M17 4v16" />
        <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" />
      </>
    )
  },
  play: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <polygon points="6 4 20 12 6 20 6 4" />
      </>
    )
  },
  plus: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "currentColor",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="6" y1="12" x2="18" y2="12" />
        <line x1="12" y1="18" x2="12" y2="6" />
      </>
    )
  },
  refresh: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </>
    )
  },
  rss: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M4 11 A 9 9 0 0 1 13 20" />
        <path d="M4 4 A 16 16 0 0 1 20 20" />
        <circle cx="5" cy="19" r="1" fill="currentColor" />
      </>
    )
  },
  search: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path
          fillRule="evenodd"
          d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM2 10.5a8.5 8.5 0 1 1 17 0 8.5 8.5 0 0 1-17 0Z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M19.496 15.63c.591.477 1.207.997 1.757 1.592 1.093 1.182.87 2.78-.141 3.798-.474.476-1.087.838-1.781.93-.72.097-1.447-.112-2.05-.643-.623-.55-1.159-1.181-1.642-1.785a75.275 75.275 0 0 1-.448-.568c-.32-.407-.621-.79-.944-1.16l1.506-1.316c.359.41.712.861 1.048 1.288.136.174.27.344.4.506.466.582.914 1.104 1.403 1.535.174.153.324.18.463.161.165-.022.393-.123.626-.358.376-.378.347-.754.092-1.03-.448-.484-.97-.93-1.544-1.393l-.475-.379a35.454 35.454 0 0 1-1.287-1.055l1.316-1.506c.377.33.766.638 1.177.965l.524.418Z"
          clipRule="evenodd"
        />
      </>
    )
  },
  speaker: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M11 4.702 A0.705 0.705 0 0 0 9.797 4.204 L6.413 7.587 A1.4 1.4 0 0 1 5.416 8 L3 8 A1 1 0 0 0 2 9 L2 15 A1 1 0 0 0 3 16 L5.416 16 A1.4 1.4 0 0 1 6.413 16.413 L9.796 19.797 A0.705 0.705 0 0 0 11 19.298 Z" />
        <path d="M16 9 A5 5 0 0 1 16 15" />
        <path d="M19 18 A9 9 0 0 0 19 6" />
      </>
    )
  },
  sun: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="12" cy="12" r="4.5" />
        <line x1="12" y1="1" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="23" />
        <line x1="1" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="23" y2="12" />
        <line x1="4" y1="4" x2="6" y2="6" />
        <line x1="18" y1="6" x2="20" y2="4" />
        <line x1="4" y1="20" x2="6" y2="18" />
        <line x1="18" y1="18" x2="20" y2="20" />
      </>
    )
  },
  sunDim: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "#000",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="5" y1="5" x2="6" y2="6" />
        <line x1="18" y1="6" x2="19" y2="5" />
        <line x1="5" y1="19" x2="6" y2="18" />
        <line x1="18" y1="18" x2="19" y2="19" />
      </>
    )
  },
  // Two opposing curved arrows — a generic swap/exchange glyph, used here for ContrastControls' foreground/background swap action.
  svgToReact: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="5.5" cy="7" r="3" />
        <path d="M2.5 20 L5.5 14.5 L8.5 20 Z" />
        <path d="M14 8 L11 12 L14 16" />
        <path d="M18 7 L16 17" />
        <path d="M19.5 8 L22.5 12 L19.5 16" />
      </>
    )
  },
  swap: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M4 8 H17 M17 8 L13 4 M17 8 L13 12" />
        <path d="M20 16 H7 M7 16 L11 12 M7 16 L11 20" />
      </>
    )
  },
  tag: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polygon points="11 21,3 13,13 3,21 3,21 11" />
        <circle cx="16" cy="8" r="0.5" />
      </>
    )
  },
  telegram: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-2.98846.01069.00848.00683-.059s4.885-4.44751,5.084-4.637c.20147-.189.135-.23.135-.23.01147-.23053-.36152,0-.36152,0L8.16632,13.299l-2.69549-.918s-.414-.1485-.453-.475c-.041-.324.46649-.5.46649-.5l10.717-4.25751s.881-.39252.881.25751Z" />
      </>
    )
  },
  // A bold "A" with an offset silhouette behind it — the same "cast shadow behind the real shape" language as the boxShadow icon, applied to a glyph instead of a card, so the two read as related but distinct effects.
  textEffects: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <text x="7" y="19" fontSize="20" fontWeight="800" opacity="0.35">
          A
        </text>
        <text x="4" y="16" fontSize="20" fontWeight="800">
          A
        </text>
      </>
    )
  },
  textSize: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M4 19 8.5 5 13 19" />
        <path d="M5.5 14h6" />
        <path d="M15 19 18 11 21 19" />
        <path d="M16 16.5h4" />
      </>
    )
  },
  textSizeDecrease: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M3 19 8 5 13 19" />
        <path d="M4.8 14h6.4" />
        <path d="M15 17h6" />
      </>
    )
  },
  textSizeIncrease: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M3 19 8 5 13 19" />
        <path d="M4.8 14h6.4" />
        <path d="M15 17h6" />
        <path d="M18 14v6" />
      </>
    )
  },
  trash: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    )
  },
  triangle: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M12 3 L21 20 L3 20 Z" />
      </>
    )
  },
  unitConverter: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <circle cx="8" cy="12" r="5" />
        <circle cx="8" cy="12" r="1.5" />
        <path d="M8 17 H21 V13 H13" />
        <path d="M16 17 V15.5" />
        <path d="M19 17 V15.5" />
      </>
    )
  },
  twitter: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" />
      </>
    )
  },
  whatsapp: {
    viewBox: "0 0 24 24",
    children: (
      <>
        <path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.2-.5-.5-1-1.1-1.4-1.7-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4.1-.1.1-.3 0-.4-.1-.1-.6-1.3-.8-1.8-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3-.6.6-.9 1.3-.9 2.1.1.9.4 1.8 1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2.9.4 1.4.5.5.2 1 .2 1.6.1.7-.1 1.3-.6 1.7-1.2.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2 5.5 0 9.9-4.4 9.9-9.9.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4" />
      </>
    )
  },
  wrapText: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M20 14v2a2 2 0 0 1-2 2h-3" />
        <path d="M17 20l-2-2 2-2" />
      </>
    )
  },
  minimap: {
    viewBox: "0 0 24 24",
    svgProps: {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="17" y1="4" x2="17" y2="20" />
        <line x1="6" y1="8" x2="13" y2="8" />
        <line x1="6" y1="11" x2="15" y2="11" />
        <line x1="6" y1="14" x2="11" y2="14" />
        <line x1="6" y1="17" x2="14" y2="17" />
        <line x1="19" y1="8" x2="20" y2="8" />
        <line x1="19" y1="11" x2="20" y2="11" />
        <line x1="19" y1="14" x2="20" y2="14" />
      </>
    )
  },
  waveDivider: {
    viewBox: "0 0 100 50",
    svgProps: {
      fill: "none",
      height: "50",
      width: "100",
      stroke: "hsl(333deg 100% 55%)",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    },
    children: (
      <>
        <path d="M 0,25 Q 5,30 10,25 Q 15,20 20,25 Q 25,30 30,25 Q 35,20 40,25 Q 45,30 50,25 Q 55,20 60,25 Q 65,30 70,25 Q 75,20 80,25 Q 85,30 90,25" />
      </>
    )
  }
} satisfies Record<string, IconDefinition>;

// Union of every valid icon key — derived automatically from the registry so it stays in sync.
export type IconName = keyof typeof icons;
