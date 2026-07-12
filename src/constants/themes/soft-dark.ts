/*
  Soft-dark theme color tokens (lower-contrast dark variant).

  `SOFT_DARK_COLORS_RAW` — source tuples in `[H, S, L]` / `[H, S, L, alpha]` form.
  `SOFT_DARK_COLORS`     — processed `ColorMap` (`--color-*` → `hsl(...)` strings).
  `SOFT_DARK_COLORS_CSS` — serialised declaration block, injected into
                           `[data-theme="soft-dark"]` by `app/layout.tsx`.
*/
import type { ColorMapRaw } from "@/utils/color";
import { createStyleObject, createCssString } from "@/utils/color";

export const SOFT_DARK_COLORS_RAW: ColorMapRaw = {
  // Backgrounds
  colorBgDefault:            [212, 18,  16],
  colorBgMuted:              [218, 17,  18],
  colorBgNeutralEmphasis:    [215, 8,   43],
  colorBgNeutralMuted:       [215, 8,   43,  0.2],
  colorBgDisabled:           [217, 18,  20],
  colorBgTransparent:        [0,   0,   0,   0],
  colorBgAccentEmphasis:     [216, 61,  49],
  colorBgAccentMuted:        [215, 75,  57,  0.102],
  colorBgSuccessEmphasis:    [124, 41,  35],
  colorBgSuccessMuted:       [123, 36,  43,  0.149],
  colorBgDangerEmphasis:     [2,   57,  50],
  colorBgDangerMuted:        [3,   75,  60,  0.102],
  colorBgAttentionEmphasis:  [22,  67,  41],
  colorBgAttentionMuted:     [24,  65,  49,  0.1],

  // Foregrounds
  colorFgDefault:            [216, 19,  85],
  colorFgMuted:              [214, 8,   60],
  colorFgNeutral:            [214, 8,   60],
  colorFgOnEmphasis:         [210, 67,  96],
  colorFgLink:               [214, 76,  59],
  colorFgLinkHover:          [205, 100, 31],
  colorFgLinkVisited:        [275, 100, 25],
  colorFgLinkFocus:          [205, 100, 31],
  colorFgDisabled:           [215, 8,   43],
  colorFgWhite:              [210, 32,  85],
  colorFgAccent:             [214, 76,  59],
  colorFgAccentMuted:        [210, 100, 82],
  colorFgSuccess:            [122, 33,  51],
  colorFgDanger:             [3,   75,  60],
  colorFgAttention:          [24,  65,  49],
  colorFgHeading:            [333, 100, 55],

  // Borders
  colorBorderDefault:              [214, 12,  27],
  colorBorderMuted:                [214, 12,  27,  0.702],
  colorBorderNeutralMuted:         [214, 12,  27,  0.702],
  colorBorderDisabled:             [215, 8,   43,  0.102],
  colorBorderTransparent:          [0,   0,   0,   0],
  colorBorderAccentEmphasis:       [216, 61,  49],
  colorBorderAccentMuted:          [215, 75,  57,  0.4],
  colorBorderSuccessEmphasis:      [124, 41,  35],
  colorBorderSuccessMuted:         [123, 36,  43,  0.4],
  colorBorderDangerEmphasis:       [2,   57,  50],
  colorBorderDangerMuted:          [3,   75,  60,  0.4],
  colorBorderAttentionEmphasis:    [22,  67,  41],
  colorBorderAttentionMuted:       [24,  65,  49,  0.4],

  // Outline
  colorOutlineFocus:               [216, 61,  49],

  // Controls
  colorBgControl:                        [217, 18,  20],
  colorBgControlHover:                   [215, 17,  22],
  colorFgControl:                        [216, 19,  85],
  colorBorderControl:                    [214, 12,  27],
  colorBgControlDisabled:                [217, 18,  20],
  colorFgControlDisabled:                [215, 8,   43],
  colorBorderControlDisabled:            [215, 8,   43,  0.102],
  colorBgControlActive:                  [214, 12,  27],
  colorBgControlTransparent:             [0,   0,   0,   0],
  colorBorderControlTransparent:         [0,   0,   0,   0],
  colorBgControlTransparentHover:        [215, 8,   43,  0.149],
  colorBorderControlTransparentHover:    [0,   0,   0,   0],
  colorBgControlTransparentActive:       [215, 8,   43,  0.2],
  colorBorderControlTransparentActive:   [0,   0,   0,   0],

  // Overlay
  colorBgOverlay:              [217, 18,  20],
  colorBorderOverlay:          [214, 12,  27,  0.702],

  // Code syntax
  colorCodeSyntaxComment:      [211, 11,  51],
  colorCodeSyntaxErrorText:    [3,   85,  68],
  colorCodeSyntaxErrorBg:      [359, 66,  29,  0.2],
  colorCodeSyntaxKeyword:      [3,   85,  68],
  colorCodeSyntaxNamespace:    [258, 72,  75],
  colorCodeSyntaxNumber:       [210, 100, 71],
  colorCodeSyntaxString:       [207, 100, 79],
  colorCodeSyntaxName:         [120, 52,  56],
  colorCodeSyntaxBuiltin:      [32,  92,  64],
  colorCodeSyntaxDecorator:    [276, 73,  86],
  colorCodeSyntaxEntity:       [38,  59,  66],
  colorCodeSyntaxFunction:     [210, 100, 71],
  colorCodeSyntaxTag:          [120, 52,  56],
  colorCodeSyntaxSymbol:       [32,  92,  64],
  colorCodeSyntaxSubtle:       [214, 11,  30],
  colorCodeSyntaxHeading:      [210, 32,  85],
  colorCodeSyntaxInsertedBg:   [137, 92,  11],
  colorCodeSyntaxInsertedText: [120, 52,  56],
  colorCodeSyntaxDeletedBg:    [359, 66,  29,  0.2],
  colorCodeSyntaxDeletedText:  [3,   85,  68],
  colorCodeSyntaxChangedText:  [42,  92,  64],
  colorCodeSyntaxOutput:       [211, 11,  51],
  colorCodeSyntaxMeta:         [211, 17,  70],

  // Selection
  colorBgSelection:            [220, 25,  24],
  colorFgSelection:            [216, 19,  85],

  // Scrollbar
  colorBgScrollbar:            [215, 19,  15],
  colorBgScrollbarThumb:       [220, 21,  30],
  colorBgScrollbarThumbHover:  [220, 20,  38],

  // Retro counter
  colorBgRetroCounter:                  [220, 23, 13],
  colorRetroCounterSegmentActive:       [209, 18, 70],
  colorRetroCounterSegmentInactive:     [220, 25, 24],

  // Sky / clouds
  colorBgCloud100:             [212, 18,  16],
  colorBgCloud300:             [212, 22,  20],
  colorBgCloud400:             [213, 25,  24],
  colorBgCloud500:             [213, 28,  28],
  colorBgSkyFrom:              [212, 28,  18],
  colorBgSkyTo:                [200, 45,  30],
  colorBgSkySubtle:            [210, 28,  22],
  colorBgSkyBottom:            [212, 20,  14,  0.5],

  // Box shadows (literal CSS strings, passed through verbatim)
  boxShadowFloatingLegacy: "0px 6px 12px -3px hsl(210 67% 1% / 0.4), 0px 6px 18px 0px hsl(210 67% 1% / 0.4)",
  boxShadowFloatingSm:     "0px 0px 0px 1px hsl(217 12% 27%), 0px 6px 12px -3px hsl(210 67% 1% / 0.4), 0px 6px 18px 0px hsl(210 67% 1% / 0.4)",
  boxShadowXs:             "0 0 2px 0 hsl(0 0% 100% / 0.04)",
  boxShadowSm:             "0 0 4px 0 hsl(0 0% 100% / 0.06)",
  boxShadowMd:             "0 0 8px 1px hsl(0 0% 100% / 0.08)",
  boxShadowLg:             "0 0 12px 2px hsl(0 0% 100% / 0.12)",
  boxShadowXl:             "0 0 20px 4px hsl(0 0% 100% / 0.15)",
  boxShadowXxl:            "0 0 35px 6px hsl(0 0% 100% / 0.2)",

  // Text shadows
  textShadowContrastSoft:  "0 1px 1px hsl(0 0% 100% / 0.1)"
};

export const SOFT_DARK_COLORS     = createStyleObject(SOFT_DARK_COLORS_RAW);
export const SOFT_DARK_COLORS_CSS = createCssString(SOFT_DARK_COLORS);
