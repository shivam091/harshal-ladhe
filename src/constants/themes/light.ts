/*
  Light theme color tokens — also the fallback when no theme attribute is set yet.

  Authored as raw HSL tuples so hues stay easy to compare and tweak across themes, then
  serialised to plain CSS so switching themes is just a data-theme swap with no runtime styling.
*/
import type { ColorMapRaw } from "@/utils/color";
import { createStyleObject, createCssString } from "@/utils/color";

export const LIGHT_COLORS_RAW: ColorMapRaw = {
  // Backgrounds
  colorBgDefault:            [0,   0,   100],
  colorBgMuted:              [210, 29,  97],
  colorBgNeutralMuted:       [212, 9,   55,  0.12],
  colorBgNeutralEmphasis:    [212, 9,   39],
  colorBgDisabled:           [210, 21,  94],
  colorBgTransparent:        [0,   0,   100, 0],
  colorBgAccentEmphasis:     [212, 92,  43],
  colorBgAccentMuted:        [203, 100, 94],
  colorBgSuccessEmphasis:    [135, 64,  33],
  colorBgSuccessMuted:       [138, 74,  92],
  colorBgDangerEmphasis:     [356, 71,  47],
  colorBgDangerMuted:        [3,   100, 93],
  colorBgAttentionEmphasis:  [25,  100, 37],
  colorBgAttentionMuted:     [24,  100, 95],

  // Foregrounds
  colorFgDefault:            [222, 22,  5],
  colorFgMuted:              [225, 15,  50],
  colorFgNeutral:            [212, 9,   39],
  colorFgOnEmphasis:         [0,   0,   100],
  colorFgLink:               [212, 92,  43],
  colorFgLinkHover:          [205, 100, 31],
  colorFgLinkVisited:        [275, 100, 25],
  colorFgLinkFocus:          [205, 100, 31],
  colorFgDisabled:           [212, 9,   55],
  colorFgWhite:              [0,   0,   100],
  colorFgAccent:             [212, 92,  43],
  colorFgAccentMuted:        [200, 40,  27],
  colorFgSuccess:            [137, 66,  30],
  colorFgDanger:             [357, 71,  48],
  colorFgAttention:          [25,  100, 37],
  colorFgHeading:            [333, 100, 55],

  // Borders
  colorBorderDefault:              [210, 21,  88],
  colorBorderMuted:                [210, 21,  88,  0.7],
  colorBorderNeutralMuted:         [210, 21,  88,  0.7],
  colorBorderDisabled:             [212, 9,   55,  0.1],
  colorBorderTransparent:          [0,   0,   100, 0],
  colorBorderAccentEmphasis:       [212, 92,  43],
  colorBorderAccentMuted:          [207, 100, 66,  0.4],
  colorBorderSuccessEmphasis:      [137, 66,  30],
  colorBorderSuccessMuted:         [138, 53,  54,  0.4],
  colorBorderDangerEmphasis:       [356, 71,  47],
  colorBorderDangerMuted:          [3,   100, 75,  0.4],
  colorBorderAttentionEmphasis:    [25,  100, 37],
  colorBorderAttentionMuted:       [25,  96,  63,  0.4],

  // Outline
  colorOutlineFocus:               [212, 92,  43],

  // Controls
  colorBgControl:                        [210, 29,  97],
  colorBgControlHover:                   [210, 21,  94],
  colorFgControl:                        [216, 12,  16],
  colorBorderControl:                    [210, 21,  88],
  colorBgControlDisabled:                [210, 21,  94],
  colorFgControlDisabled:                [212, 9,   55],
  colorBorderControlDisabled:            [212, 9,   55,  0.1],
  colorBgControlActive:                  [211, 22,  91],
  colorBgControlTransparent:             [0,   0,   100, 0],
  colorBorderControlTransparent:         [0,   0,   100, 0],
  colorBgControlTransparentHover:        [212, 9,   55,  0.1],
  colorBorderControlTransparentHover:    [0,   0,   100, 0],
  colorBgControlTransparentActive:       [212, 9,   55,  0.15],
  colorBorderControlTransparentActive:   [0,   0,   100, 0],

  // Overlay
  colorBgOverlay:              [0,   0,   100],
  colorBorderOverlay:          [210, 21,  88,  0.5],

  // Code syntax
  colorCodeSyntaxComment:      [210, 9,   45],
  colorCodeSyntaxErrorText:    [0,   71,  60],
  colorCodeSyntaxErrorBg:      [357, 100, 95],
  colorCodeSyntaxKeyword:      [354, 68,  53],
  colorCodeSyntaxNamespace:    [261, 49,  51],
  colorCodeSyntaxNumber:       [211, 100, 39],
  colorCodeSyntaxString:       [216, 92,  19],
  colorCodeSyntaxName:         [135, 60,  33],
  colorCodeSyntaxBuiltin:      [356, 71,  44],
  colorCodeSyntaxDecorator:    [258, 72,  75],
  colorCodeSyntaxEntity:       [20,  29,  38],
  colorCodeSyntaxFunction:     [211, 100, 39],
  colorCodeSyntaxTag:          [135, 60,  33],
  colorCodeSyntaxSymbol:       [28,  91,  47],
  colorCodeSyntaxSubtle:       [210, 12,  83],
  colorCodeSyntaxHeading:      [215, 13,  15],
  colorCodeSyntaxInsertedBg:   [135, 100, 92],
  colorCodeSyntaxInsertedText: [135, 60,  33],
  colorCodeSyntaxDeletedBg:    [357, 100, 95],
  colorCodeSyntaxDeletedText:  [356, 71,  44],
  colorCodeSyntaxChangedText:  [42,  91,  40],
  colorCodeSyntaxOutput:       [210, 9,   36],
  colorCodeSyntaxMeta:         [214, 12,  30],

  // Selection
  colorBgSelection:            [50,  100, 78],
  colorFgSelection:            [222, 22,  5],

  // Scrollbar
  colorBgScrollbar:            [0,   0,   100],
  colorBgScrollbarThumb:       [210, 30,  55],
  colorBgScrollbarThumbHover:  [225, 7,   60],

  // Hit counter
  colorBgHitCounter:                  [213, 80, 95],
  colorHitCounterSegmentActive:       [225, 27, 40],
  colorHitCounterSegmentInactive:     [212, 39, 87],
  colorBgHitCounterOn:                [212, 9,  39],
  colorHitCounterSegmentActiveOn:     [136, 60, 50],
  colorHitCounterSegmentInactiveOn:   [136, 15, 45],

  // Sky / clouds
  colorBgCloud100:             [203, 60,  95],
  colorBgCloud300:             [202, 68,  92],
  colorBgCloud400:             [201, 60,  86],
  colorBgCloud500:             [200, 80,  83],
  colorBgSkyFrom:              [200, 70,  78],
  colorBgSkyTo:                [200, 70,  70],
  colorBgSkySubtle:            [200, 90,  88],
  colorBgSkyBottom:            [200, 79,  83],

  // Box shadows (literal CSS strings, passed through verbatim)
  // Contact + ambient layers tinted toward the sky's navy, not black, so elevation reads as part of the same scene;
  // every step keeps two layers so sm → md hover lifts interpolate instead of popping.
  boxShadowFloatingLegacy: "0px 6px 12px -3px hsl(216 12% 16% / 0.04), 0px 6px 18px 0px hsl(216 12% 16% / 0.12)",
  boxShadowFloatingSm:     "0px 0px 0px 1px hsl(210 21% 88% / 0.5), 0px 6px 12px -3px hsl(216 12% 16% / 0.04), 0px 6px 18px 0px hsl(216 12% 16% / 0.12)",
  boxShadowXs:             "0 1px 1px 0 hsl(212 45% 22% / 0.05), 0 1px 3px 0 hsl(205 55% 35% / 0.06)",
  boxShadowSm:             "0 1px 2px 0 hsl(212 45% 22% / 0.06), 0 2px 6px -1px hsl(205 55% 35% / 0.1)",
  boxShadowMd:             "0 2px 4px -1px hsl(212 45% 22% / 0.08), 0 8px 20px -4px hsl(205 55% 35% / 0.18)",
  boxShadowLg:             "0 4px 8px -2px hsl(212 45% 22% / 0.1), 0 14px 32px -6px hsl(205 55% 35% / 0.22)",
  boxShadowXl:             "0 6px 12px -3px hsl(212 45% 22% / 0.12), 0 22px 44px -8px hsl(205 55% 35% / 0.26)",
  boxShadowXxl:            "0 10px 20px -4px hsl(212 45% 22% / 0.14), 0 32px 64px -10px hsl(205 55% 35% / 0.3)",

  // Text shadows
  textShadowContrastSoft:  "0 1px 1px hsl(0 0% 0% / 0.2)"
};

export const LIGHT_COLORS     = createStyleObject(LIGHT_COLORS_RAW);
export const LIGHT_COLORS_CSS = createCssString(LIGHT_COLORS);
