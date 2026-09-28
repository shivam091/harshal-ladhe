// Shared corner radius for every decision and result box, so the two columns read as one flowchart.
export const BOX_RADIUS = 10;

// Left column holds the questions the browser asks in order; the right column holds the answer each "yes" produces.
export const DECISION_COLUMN = { x: 40, width: 280 };

// Right column sits far enough right to leave a readable gutter for the "yes" arrows and their labels.
export const RESULT_COLUMN = { x: 400, width: 240 };

// Every row shares one height so the "no" arrows between rows are all the same length.
export const ROW_HEIGHT = 48;

// Starting pill — the element whose name is being computed, drawn as a pill so it reads as input, not a test.
export const START = { x: 80, y: 16, width: 200, height: 36 };

/*
  The four checks in the order the accessible-name computation actually runs them. aria-hidden comes first
  because a hidden element never reaches naming at all; <title> comes last because it is the fallback that
  only counts when neither ARIA attribute supplied a name. `tone` picks the result box's theme colours.
*/
export const ROWS = [
  {
    y: 72,
    question: "aria-hidden=\"true\"?",
    result: "Skipped entirely",
    detail: "element and subtree leave the tree",
    tone: "danger"
  },
  {
    y: 144,
    question: "aria-labelledby set?",
    result: "Name from referenced text",
    detail: "each id resolved, joined in order",
    tone: "success"
  },
  {
    y: 216,
    question: "aria-label set?",
    result: "Name from the attribute",
    detail: "wins over any <title> child",
    tone: "success"
  },
  {
    y: 288,
    question: "Has a <title> child?",
    result: "Name from first <title>",
    detail: "the fallback, also a hover tooltip",
    tone: "success"
  }
] as const;

// Terminal box when every check fails — attention-coloured because a meaningful graphic ends up silent.
export const NO_NAME = { x: 40, y: 360, width: 280, height: 48 };

// Full-width footnote for the role="img" side effect, which changes what the children expose rather than the name.
export const ROLE_NOTE = { x: 40, y: 428, width: 600, height: 56 };
