// One panel: a mini "browser" shown before and after a middleware response, contrasting what changes.
export interface RedirectRewritePanel {
  // Short heading naming the response type this panel demonstrates.
  title: string;
  // The label shown on the arrow connecting the "before" and "after" browsers.
  arrowLabel: string;
  // Address bar text shown in the "before" browser.
  beforeUrl: string;
  // Address bar text shown in the "after" browser — identical to beforeUrl for a rewrite.
  afterUrl: string;
  // Whether the address bar itself is the thing that visibly changed in this panel.
  addressBarChanged: boolean;
  // Content-area label shown in the "before" browser.
  beforeContent: string;
  // Content-area label shown in the "after" browser.
  afterContent: string;
  // One-line verdict shown under the panel.
  note: string;
}
