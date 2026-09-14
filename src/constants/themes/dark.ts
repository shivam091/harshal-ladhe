/*
  Dark theme color tokens.

  Authored as raw HSL tuples so hues stay easy to compare and tweak across themes, then
  serialised to plain CSS so switching themes is just a data-theme swap with no runtime styling.
*/
import type {ColorMapRaw } from "@/utils/color";
import { createStyleObject, createCssString } from "@/utils/color";

export const DARK_COLORS_RAW: ColorMapRaw = {
  // Backgrounds
  colorBgDefault:            [210, 15,  6],
  colorBgMuted:              [213, 20,  10],
  colorBgNeutralMuted:       [213, 8,   43,  0.25],
  colorBgNeutralEmphasis:    [213, 8,   43],
  colorBgDisabled:           [213, 15,  14],
  colorBgTransparent:        [0,   0,   0,   0],
  colorBgAccentEmphasis:     [213, 80,  54],
  colorBgAccentMuted:        [213, 90,  60,  0.15],
  colorBgSuccessEmphasis:    [140, 55,  38],
  colorBgSuccessMuted:       [140, 50,  40,  0.15],
  colorBgDangerEmphasis:     [2,   70,  50],
  colorBgDangerMuted:        [2,   85,  62,  0.1],
  colorBgAttentionEmphasis:  [21,  73,  43],
  colorBgAttentionMuted:     [23,  71,  51,  0.1],

  // Foregrounds
  colorFgDefault:            [210, 10,  90],
  colorFgMuted:              [210, 12,  60],
  colorFgNeutral:            [215, 8,   60],
  colorFgOnEmphasis:         [0,   0,   100],
  colorFgLink:               [213, 85,  60],
  colorFgLinkHover:          [210, 100, 35],
  colorFgLinkVisited:        [275, 100, 25],
  colorFgLinkFocus:          [210, 100, 35],
  colorFgDisabled:           [213, 8,   48],
  colorFgWhite:              [0,   0,   100],
  colorFgAccent:             [213, 85,  60],
  colorFgAccentMuted:        [199, 42,  78],
  colorFgSuccess:            [140, 45,  48],
  colorFgDanger:             [2,   85,  62],
  colorFgAttention:          [23,  71,  51],
  colorFgHeading:            [333, 100, 55],

  // Borders
  colorBorderDefault:              [213, 12,  24],
  colorBorderMuted:                [213, 12,  24,  0.7],
  colorBorderNeutralMuted:         [213, 12,  24,  0.7],
  colorBorderDisabled:             [213, 8,   43,  0.1],
  colorBorderTransparent:          [0,   0,   0,   0],
  colorBorderAccentEmphasis:       [213, 80,  54],
  colorBorderAccentMuted:          [213, 90,  60,  0.4],
  colorBorderSuccessEmphasis:      [140, 55,  38],
  colorBorderSuccessMuted:         [140, 50,  40,  0.4],
  colorBorderDangerEmphasis:       [2,   70,  50],
  colorBorderDangerMuted:          [2,   85,  62,  0.4],
  colorBorderAttentionEmphasis:    [21,  73,  43],
  colorBorderAttentionMuted:       [23,  71,  51,  0.4],

  // Outline
  colorOutlineFocus:               [213, 80,  54],

  // Controls
  colorBgControl:                        [213, 18,  15],
  colorBgControlHover:                   [219, 17,  18],
  colorFgControl:                        [210, 10,  90],
  colorBorderControl:                    [213, 12,  24],
  colorBgControlDisabled:                [213, 15,  14],
  colorFgControlDisabled:                [213, 8,   48],
  colorBorderControlDisabled:            [213, 8,   43,  0.1],
  colorBgControlActive:                  [217, 17,  19],
  colorBgControlTransparent:             [0,   0,   0,   0],
  colorBorderControlTransparent:         [0,   0,   0,   0],
  colorBgControlTransparentHover:        [213, 8,   43,  0.2],
  colorBorderControlTransparentHover:    [0,   0,   0,   0],
  colorBgControlTransparentActive:       [213, 8,   43,  0.25],
  colorBorderControlTransparentActive:   [0,   0,   0,   0],

  // Overlay
  colorBgOverlay:              [210, 30,  4],
  colorBorderOverlay:          [213, 12,  24,  0.7],

  // Code syntax
  colorCodeSyntaxComment:      [211, 11,  56],
  colorCodeSyntaxErrorText:    [3,   85,  70],
  colorCodeSyntaxErrorBg:      [359, 66,  35,  0.2],
  colorCodeSyntaxKeyword:      [3,   85,  70],
  colorCodeSyntaxNamespace:    [258, 72,  78],
  colorCodeSyntaxNumber:       [210, 100, 74],
  colorCodeSyntaxString:       [207, 100, 85],
  colorCodeSyntaxName:         [120, 52,  60],
  colorCodeSyntaxBuiltin:      [32,  92,  67],
  colorCodeSyntaxDecorator:    [276, 73,  86],
  colorCodeSyntaxEntity:       [38,  59,  68],
  colorCodeSyntaxFunction:     [210, 100, 74],
  colorCodeSyntaxTag:          [120, 52,  60],
  colorCodeSyntaxSymbol:       [32,  92,  67],
  colorCodeSyntaxSubtle:       [214, 11,  38],
  colorCodeSyntaxHeading:      [210, 32,  88],
  colorCodeSyntaxInsertedBg:   [137, 92,  15],
  colorCodeSyntaxInsertedText: [120, 52,  60],
  colorCodeSyntaxDeletedBg:    [359, 66,  35,  0.2],
  colorCodeSyntaxDeletedText:  [3,   85,  70],
  colorCodeSyntaxChangedText:  [42,  92,  67],
  colorCodeSyntaxOutput:       [211, 11,  56],
  colorCodeSyntaxMeta:         [211, 17,  75],

  // Selection
  colorBgSelection:            [217, 24,  24],
  colorFgSelection:            [0,   0,   90],

  // Scrollbar
  colorBgScrollbar:            [216, 14,  6],
  colorBgScrollbarThumb:       [215, 23,  20],
  colorBgScrollbarThumbHover:  [215, 23,  35],

  // Hit counter
  colorBgHitCounter:                  [210, 15, 12],
  colorHitCounterSegmentActive:       [209, 18, 70],
  colorHitCounterSegmentInactive:     [214, 29, 20],
  colorBgHitCounterOn:                [210, 15, 6],
  colorHitCounterSegmentActiveOn:     [140, 60, 55],
  colorHitCounterSegmentInactiveOn:   [140, 22, 14],

  // Festive banner — same warm-gold family as light, slightly deepened so it doesn't glare against the near-black background.
  colorBgFestiveBanner:        [42,  92,  68],
  colorFgFestiveBanner:        [210, 25,  10],
  // Zigzag outline — a vivid navy (not colorFgFestiveBanner's near-black) so the scalloped edge reads as a colour, never as a black stroke.
  colorStrokeFestiveBanner:    [212, 60,  34],
  // Sky / clouds
  colorBgCloud100:             [210, 15,  6],
  colorBgCloud300:             [212, 40,  9],
  colorBgCloud400:             [213, 40,  10],
  colorBgCloud500:             [213, 40,  12],
  colorBgSkyFrom:              [214, 40,  11],
  colorBgSkyTo:                [200, 50,  30],
  colorBgSkySubtle:            [210, 40,  16],
  colorBgSkyBottom:            [212, 32,  8,   0.5],

  // Box shadows (literal CSS strings, passed through verbatim)
  boxShadowFloatingLegacy: "0px 6px 12px -3px hsl(210 30% 4% / 0.45), 0px 6px 18px 0px hsl(210 30% 4% / 0.45)",
  boxShadowFloatingSm:     "0px 0px 0px 1px hsl(217 12% 22%), 0px 6px 12px -3px hsl(210 30% 4% / 0.45), 0px 6px 18px 0px hsl(210 30% 4% / 0.45)",
  boxShadowXs:             "0 0 2px 0 hsl(210 30% 96% / 0.04)",
  boxShadowSm:             "0 0 4px 0 hsl(210 30% 96% / 0.06)",
  boxShadowMd:             "0 0 8px 1px hsl(210 30% 96% / 0.08)",
  boxShadowLg:             "0 0 12px 2px hsl(210 30% 96% / 0.12)",
  boxShadowXl:             "0 0 20px 4px hsl(210 30% 96% / 0.15)",
  boxShadowXxl:            "0 0 35px 6px hsl(210 30% 96% / 0.2)",

  // Text shadows
  textShadowContrastSoft:  "0 1px 1px hsl(210 30% 96% / 0.2)"
};

export const DARK_COLORS     = createStyleObject(DARK_COLORS_RAW);
export const DARK_COLORS_CSS = createCssString(DARK_COLORS);
