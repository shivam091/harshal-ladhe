import "./shared/playground.css";
import "./shared/tabs.css";
import "./styles.css";
import { initTabs } from "./shared/tabs.js";

const $ = (id) => document.getElementById(id);

// What to try in each panel, so the change being demonstrated is never a guess.
const TIPS = {
  stuck: "Scroll the article. The header compacts once it's stuck to the top, and the Publish bar loses its border once the article's end scrolls into view.",
  scrollable: "Scroll the list. \"More above\" appears once there's content above to scroll back to, and \"More below\" disappears at the end.",
  snapped: "Scroll the carousel sideways. Whichever slide is snapped into place grows and lights up."
};

// The query behind each panel, shown as the readout so the CSS is right next to its effect.
const CSS_FOR = {
  stuck: ".sticky-header {\n  position: sticky;\n  top: 0;\n  container-type: scroll-state;\n}\n\n@container scroll-state(stuck: top) {\n  .sticky-header-inner {\n    padding-block: 0.5rem;\n    box-shadow: 0 0.5rem 1rem -0.5rem black;\n  }\n}",
  scrollable: ".list-box {\n  overflow-y: auto;\n  container-type: scroll-state;\n}\n\n@container scroll-state(scrollable: top) {\n  .edge--top { opacity: 1; }\n}\n\n@container not scroll-state(scrollable: bottom) {\n  .edge--bottom { opacity: 0; }\n}",
  snapped: ".carousel {\n  scroll-snap-type: x mandatory;\n}\n\n.slide {\n  scroll-snap-align: center;\n  container-type: scroll-state;\n}\n\n@container scroll-state(snapped: x) {\n  .slide-inner {\n    scale: 1;\n    opacity: 1;\n  }\n}"
};

// Without support nothing reacts to scrolling, so the note says why rather than letting the demo look broken.
$("support-note").hidden = CSS.supports("container-type", "scroll-state");

function show(mode) {
  $("tip").textContent = TIPS[mode];
  $("readout").textContent = CSS_FOR[mode];
}

initTabs("#demo-switch .tab", show);
show("stuck");
