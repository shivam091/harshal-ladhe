import "./shared/playground.css";
import "./shared/tabs.css";
import "./shared/segmented-control.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";
import { initTabs } from "./shared/tabs.js";

const $ = (id) => document.getElementById(id);

const card = $("gradient-border-card");
const cardLabel = $("card-label");
const stage = $("stage");
const output = $("border-output");
const stageNote = $("stage-note");

const inputs = {
  thickness: $("thickness-input"),
  radius: $("radius-input"),
  angle: $("angle-input"),
  color1: $("color-1"),
  color2: $("color-2"),
  color3: $("color-3"),
  pattern: $("pattern-toggle"),
  hover: $("hover-toggle"),
  fix: $("fix-toggle"),
  vars: $("vars-toggle"),
  focus: $("focus-toggle"),
  mixin: $("mixin-toggle")
};

// Option rows that only make sense for some techniques; each technique lists the ones it shows.
const optionRows = {
  gradientType: $("gradient-type"),
  sides: $("sides-variant"),
  theme: $("theme-variant"),
  notShowing: $("not-showing-variant"),
  bleeding: $("bleeding-variant"),
  thickness: $("thickness-field"),
  radius: $("radius-field"),
  angle: $("angle-field"),
  color3: $("color-3-field"),
  pattern: $("pattern-field"),
  hover: $("hover-field"),
  fix: $("fix-field")
};

/*
  Real colors rather than var(--pg-*), so the copied CSS matches the preview outside this
  playground: the card's inner fill, and the page color the striped border's gaps show.
*/
const SURFACE = { dark: "#171a2b", light: "#ffffff" };
const PAGE_BG = { dark: "#1d2137", light: "#f6f8fa" };
// The resting gray for hover-only borders; lighter on the light scheme so it still reads as a border.
const REST_COLOR = { dark: "#4b5170", light: "#d0d7de" };

// Techniques whose preview moves, so the readout adds a reduced-motion rule for them.
const ANIMATED = new Set(["animated", "rotating", "not-moving"]);

const CORE_OPTIONS = ["gradientType", "thickness", "radius", "angle", "color3", "pattern"];

/* ---------- Gradient builder ---------- */

/*
  Builds the chosen gradient function. `c` holds the colors as they should be printed (hex or
  var()), so the same builder feeds both the live preview and the readout. Conic and stripes use
  the third color; the others only need two.
*/
function buildGradient(type, s, c, from) {
  switch (type) {
    case "radial":
      return `radial-gradient(circle, ${c.start}, ${c.end})`;
    case "conic":
      return `conic-gradient(from ${from || `${s.angle}deg`}, ${c.start}, ${c.end}, ${c.mid}, ${c.start})`;
    case "stripes":
      return `repeating-linear-gradient(${s.angle}deg, ${c.start} 0 15px, ${c.gap} 15px 25px, ${c.end} 25px 40px, ${c.gap} 40px 50px)`;
    default:
      return `linear-gradient(${s.angle}deg, ${c.start}, ${c.end})`;
  }
}

// Ends on a matching stop only where it matters: conic closes its circle, stripes repeat on their own.
function usesThirdColor(type) {
  return type === "conic" || type === "stripes";
}

/* ---------- Readout helpers ---------- */

function block(selector, decls, indent = "") {
  const inner = decls.map((d) => (d ? `${indent}  ${d}` : "")).join("\n");
  return `${indent}${selector} {\n${inner}\n${indent}}`;
}

const layers = (c, gradient, innerKeyword = " padding-box") => [
  "background:",
  `  linear-gradient(${c.surface}, ${c.surface})${innerKeyword},`,
  `  ${gradient} border-box;`
];

const MASK_DECLS = [
  "-webkit-mask:",
  "  linear-gradient(#fff 0 0) content-box,",
  "  linear-gradient(#fff 0 0);",
  "-webkit-mask-composite: xor;"
];

const STANDARD_MASK = ["mask:", "  linear-gradient(#fff 0 0) content-box exclude,", "  linear-gradient(#fff 0 0);"];

function maskRules(s, gradient, withPrefix) {
  return {
    selector: ".gradient-border",
    decls: ["position: relative;", `border-radius: ${s.radius}px;`],
    after: [
      block(".gradient-border::before", [
        'content: "";',
        "position: absolute;",
        "inset: 0;",
        `padding: ${s.thickness}px; /* The border thickness */`,
        "border-radius: inherit;",
        `background: ${gradient};`,
        "pointer-events: none;",
        "",
        ...(withPrefix ? MASK_DECLS : []),
        ...STANDARD_MASK
      ])
    ]
  };
}

/*
  Each technique describes its preview (classes, visible options, note, label) and its CSS (a main
  rule plus any extra blocks). `c` holds colors as the readout should print them; `g` is the
  gradient already built for the readout.
*/
const TECHNIQUES = {
  "background-clip": {
    group: "core",
    options: CORE_OPTIONS,
    classes: ["mode-background-clip"],
    mixin: true,
    note: (s) =>
      s.pattern
        ? "The solid <code>padding-box</code> layer covers the backdrop, so the center isn't see-through. That's this technique's one limitation, and what <code>mask</code> solves."
        : "Two layers: a solid fill clipped to the <code>padding-box</code> on top, and the gradient clipped to the <code>border-box</code> underneath. Only the transparent border ring shows the gradient.",
    css: (s, c, g) => ({
      selector: ".gradient-border",
      decls: [`border: ${s.thickness}px solid transparent;`, `border-radius: ${s.radius}px;`, ...layers(c, g)]
    })
  },

  "border-image": {
    group: "core",
    options: [...CORE_OPTIONS, "sides"],
    classes: (s) => ["mode-border-image", ...(s.sides === "bottom" ? ["side-bottom"] : [])],
    label: (s) => (s.sides === "bottom" ? "Gradient Underline" : "Gradient Border"),
    note: (s) =>
      s.sides === "bottom"
        ? "Because <code>border-image</code> works per side, a single gradient edge like this underline is its easiest use."
        : "The gradient replaces the border's color, and the center stays transparent. Drag the radius: <code>border-image</code> ignores <code>border-radius</code>, so the corners stay square.",
    css: (s, c, g) => ({
      selector: s.sides === "bottom" ? ".gradient-underline" : ".gradient-border",
      decls: [
        s.sides === "bottom" ? `border-bottom: ${s.thickness}px solid;` : `border: ${s.thickness}px solid;`,
        `border-image: ${g} 1; /* The 1 is the slice */`
      ]
    })
  },

  mask: {
    group: "core",
    options: CORE_OPTIONS,
    classes: ["mode-mask"],
    note: "A <code>::before</code> covers the card with the gradient, then two mask layers with <code>exclude</code> cut away everything except the padding ring. Nothing paints the center, so the backdrop shows through.",
    css: (s, c, g) => maskRules(s, g, true)
  },

  animated: {
    group: "advanced",
    options: ["thickness", "radius", "angle", "color3"],
    classes: ["mode-background-clip", "mode-animated"],
    gradient: (s, c) => `linear-gradient(${s.angle}deg, ${c.start}, ${c.end}, ${c.mid})`,
    mixin: true,
    note: "The gradient is three times the card's size, and <code>background-position</code> slides it out to 100% and back, so only part of it shows through the border at any moment.",
    css: (s, c, g) => ({
      selector: ".animated-border",
      decls: [
        `border: ${s.thickness}px solid transparent;`,
        `border-radius: ${s.radius}px;`,
        ...layers(c, g),
        "background-size: 300% 300%;",
        "animation: border-animation 6s linear infinite;"
      ],
      before: [
        "@keyframes border-animation {\n  0% {\n    background-position: 0% 50%;\n  }\n\n  50% {\n    background-position: 100% 50%;\n  }\n\n  100% {\n    background-position: 0% 50%;\n  }\n}"
      ]
    })
  },

  rotating: {
    group: "advanced",
    options: ["thickness", "radius", "color3"],
    classes: ["mode-background-clip", "mode-rotating"],
    gradientType: "conic",
    from: "var(--spin)",
    note: "Registering <code>--angle</code> as an <code>&lt;angle&gt;</code> lets the browser interpolate it, so the conic's starting angle turns while the card itself stays still.",
    css: (s, c) => ({
      selector: ".spinning-border",
      before: ['@property --angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: 0deg;\n}'],
      decls: [
        `border: ${s.thickness}px solid transparent;`,
        `border-radius: ${s.radius}px;`,
        ...layers(c, `conic-gradient(from var(--angle), ${c.start}, ${c.end}, ${c.mid}, ${c.start})`),
        "animation: spin-border 4s linear infinite;"
      ],
      after: ["@keyframes spin-border {\n  to {\n    --angle: 360deg;\n  }\n}"]
    })
  },

  hover: {
    group: "advanced",
    options: ["thickness", "radius", "angle", "hover"],
    classes: (s) => ["mode-hover", ...(s.hover ? ["is-hovered"] : [])],
    label: () => "Hover or focus me",
    note: "Both colors start as the same gray. On <code>:hover</code> or <code>:focus-within</code> they change to the gradient's colors, and because they're registered <code>&lt;color&gt;</code> properties, they fade instead of snapping. Toggle the hold to watch it.",
    css: (s, c) => ({
      selector: ".card",
      before: [
        `@property --border-start {\n  syntax: "<color>";\n  inherits: false;\n  initial-value: ${s.restColor};\n}`,
        `@property --border-end {\n  syntax: "<color>";\n  inherits: false;\n  initial-value: ${s.restColor};\n}`
      ],
      decls: [
        `border: ${s.thickness}px solid transparent;`,
        `border-radius: ${s.radius}px;`,
        ...layers(c, `linear-gradient(${s.angle}deg, var(--border-start), var(--border-end))`),
        "transition: --border-start 0.3s ease, --border-end 0.3s ease;"
      ],
      after: [block(".card:hover,\n.card:focus-within", [`--border-start: ${c.start};`, `--border-end: ${c.end};`])]
    })
  },

  theme: {
    group: "advanced",
    options: ["gradientType", "thickness", "radius", "angle", "color3", "theme"],
    classes: ["mode-background-clip"],
    forceVars: true,
    mixin: true,
    note: "The surface lives in a CSS variable, so switching the scheme swaps the inner fill with it. The border never turns into a white box on a dark page.",
    css: (s, c, g) => ({
      selector: ".dynamic-border",
      rootExtra: [block("@media (prefers-color-scheme: dark)", [block(":root", [`--surface: ${SURFACE.dark};`], "  ").trim()])],
      decls: [`border: ${s.thickness}px solid transparent;`, `border-radius: ${s.radius}px;`, ...layers(c, g)]
    })
  },

  "not-showing": {
    group: "pitfalls",
    options: ["gradientType", "thickness", "radius", "angle", "color3", "notShowing", "fix"],
    classes: (s) => [s.notShowing === "slice" ? "pit-no-slice" : "pit-solid-border", ...(s.fix ? ["fixed"] : [])],
    fixLabel: (s) => (s.notShowing === "slice" ? "Add the slice value (1)" : "Make the border transparent"),
    note: (s) => {
      if (s.notShowing === "slice") {
        return s.fix
          ? "With a slice of <code>1</code>, a 1px frame of the gradient is stretched along every side."
          : "Without a slice value it defaults to <code>100%</code>, which puts the whole gradient into the four corners and leaves the sides empty.";
      }
      return s.fix
        ? "A transparent border is a window onto the gradient layer beneath it."
        : "A solid <code>border-color</code> is painted on top of the background, so it hides the gradient completely.";
    },
    css: (s, c, g) =>
      s.notShowing === "slice"
        ? {
            selector: ".gradient-border",
            decls: [
              `border: ${s.thickness}px solid;`,
              s.fix ? `border-image: ${g} 1; /* ✅ */` : `border-image: ${g}; /* ❌ No slice — corners only */`
            ]
          }
        : {
            selector: ".gradient-border",
            decls: [
              s.fix
                ? `border: ${s.thickness}px solid transparent; /* ✅ */`
                : `border: ${s.thickness}px solid #4b5170; /* ❌ Covers the gradient */`,
              `border-radius: ${s.radius}px;`,
              ...layers(c, g)
            ]
          }
  },

  bleeding: {
    group: "pitfalls",
    options: ["gradientType", "thickness", "radius", "angle", "color3", "bleeding", "fix"],
    classes: (s) => [s.bleeding === "no-keyword" ? "pit-no-keyword" : "pit-no-inner", ...(s.fix ? ["fixed"] : [])],
    fixLabel: (s) => (s.bleeding === "no-keyword" ? "Add the padding-box keyword" : "Add the inner padding-box layer"),
    note: (s) => {
      if (s.fix) return "The inner layer stops at the <code>padding-box</code>, so the gradient only shows in the border ring.";
      return s.bleeding === "no-keyword"
        ? "The opposite failure: without <code>padding-box</code> the inner layer defaults to <code>border-box</code> and paints over the ring too, so the border disappears."
        : "With no inner layer, nothing covers the middle, so the gradient bleeds under the content.";
    },
    css: (s, c, g) => {
      let background;
      if (s.fix) background = layers(c, g);
      else if (s.bleeding === "no-keyword") background = layers(c, g, "").map((d, i) => (i === 1 ? `${d} /* ❌ No padding-box */` : d));
      else background = [`background: ${g} border-box; /* ❌ No inner layer */`];
      return {
        selector: ".gradient-border",
        decls: [`border: ${s.thickness}px solid transparent;`, `border-radius: ${s.radius}px;`, ...background]
      };
    }
  },

  corners: {
    group: "pitfalls",
    options: ["gradientType", "thickness", "radius", "angle", "color3", "fix"],
    classes: (s) => ["pit-corners", ...(s.fix ? ["fixed"] : [])],
    fixLabel: () => "Switch to background-clip",
    note: (s) =>
      s.fix
        ? "<code>background-clip</code> follows <code>border-radius</code>, so the corners round properly."
        : "<code>border-radius</code> is set, but <code>border-image</code> ignores it, so the gradient border keeps square corners.",
    css: (s, c, g) => ({
      selector: ".gradient-border",
      decls: s.fix
        ? [`border: ${s.thickness}px solid transparent;`, `border-radius: ${s.radius}px; /* ✅ Respected */`, ...layers(c, g)]
        : [
            `border: ${s.thickness}px solid;`,
            `border-image: ${g} 1;`,
            `border-radius: ${s.radius}px; /* ❌ Ignored by border-image */`,
            `background: ${c.surface};`
          ]
    })
  },

  "not-moving": {
    group: "pitfalls",
    options: ["thickness", "radius", "angle", "color3", "fix"],
    classes: (s) => ["pit-static", ...(s.fix ? ["fixed"] : [])],
    gradient: (s, c) => `linear-gradient(${s.angle}deg, ${c.start}, ${c.end}, ${c.mid})`,
    fixLabel: () => "Set background-size: 300% 300%",
    note: (s) =>
      s.fix
        ? "Now the gradient is larger than the card, so sliding <code>background-position</code> reveals new colors."
        : "The animation is running, but the gradient is the same size as the card, so <code>background-position</code> has nothing extra to slide into view.",
    css: (s, c, g) => ({
      selector: ".animated-border",
      decls: [
        `border: ${s.thickness}px solid transparent;`,
        `border-radius: ${s.radius}px;`,
        ...layers(c, g),
        ...(s.fix ? ["background-size: 300% 300%; /* ✅ Room to slide */"] : ["/* ❌ No background-size — nothing to slide */"]),
        "animation: border-animation 6s linear infinite;"
      ]
    })
  },

  "safari-mask": {
    group: "pitfalls",
    options: ["gradientType", "thickness", "radius", "angle", "color3", "pattern", "fix"],
    classes: (s) => ["mode-mask", "pit-safari", ...(s.fix ? ["fixed"] : [])],
    fixLabel: () => "Include the -webkit-mask lines",
    note: (s) =>
      s.fix
        ? "With the <code>-webkit-mask</code> lines (and <code>xor</code>, the older keyword for <code>exclude</code>), older Safari cuts the ring out correctly."
        : "Simulated older Safari, which only understands <code>-webkit-mask</code>: the standard <code>mask</code> is dropped, so the unmasked <code>::before</code> paints a solid gradient over the whole card.",
    css: (s, c, g) => maskRules(s, g, s.fix)
  },

  "white-box": {
    group: "pitfalls",
    options: ["gradientType", "thickness", "radius", "angle", "color3", "fix"],
    classes: (s) => ["mode-background-clip", "pit-white-box", ...(s.fix ? ["fixed"] : [])],
    fixLabel: () => "Use a CSS variable for the surface",
    forceVars: (s) => s.fix,
    note: (s) =>
      s.fix
        ? "The inner layer reads <code>var(--surface)</code>, which the dark theme overrides, so the card matches the page."
        : "The inner layer is hard-coded to <code>#fff</code>, so on a dark page the card turns into a white box.",
    css: (s, c, g) => ({
      selector: ".gradient-border",
      rootExtra: s.fix ? [block("@media (prefers-color-scheme: dark)", [block(":root", [`--surface: ${SURFACE.dark};`], "  ").trim()])] : [],
      decls: [
        `border: ${s.thickness}px solid transparent;`,
        `border-radius: ${s.radius}px;`,
        ...(s.fix ? layers(c, g) : layers(Object.assign({}, c, { surface: "#fff" }), g).map((d, i) => (i === 1 ? `${d} /* ❌ Hard-coded */` : d)))
      ]
    })
  }
};

// Techniques may give a value or a function of state for classes/options/notes/labels.
// Plain checks instead of `??`: Sandpack's bundler doesn't parse nullish coalescing.
function resolve(value, state, fallback) {
  if (typeof value === "function") return value(state);
  return value === undefined ? fallback : value;
}

function readState() {
  const radio = (name) => document.querySelector(`input[name='${name}']:checked`).value;
  const theme = radio("theme-variant");
  return {
    technique: radio("technique"),
    gradientType: radio("gradient-type"),
    sides: radio("sides-variant"),
    theme,
    notShowing: radio("not-showing-variant"),
    bleeding: radio("bleeding-variant"),
    thickness: Number(inputs.thickness.value),
    radius: Number(inputs.radius.value),
    angle: Number(inputs.angle.value),
    color1: inputs.color1.value,
    color2: inputs.color2.value,
    color3: inputs.color3.value,
    pattern: inputs.pattern.checked,
    hover: inputs.hover.checked,
    fix: inputs.fix.checked,
    vars: inputs.vars.checked,
    focus: inputs.focus.checked,
    mixin: inputs.mixin.checked
  };
}

function showOptions(visible) {
  Object.entries(optionRows).forEach(([key, row]) => {
    row.hidden = !visible.includes(key);
  });
}

// Single render pass — every control funnels through here, so the preview and readout can never drift apart.
function updateDemo() {
  const s = readState();
  const technique = TECHNIQUES[s.technique];
  // The theme demo is the only one that switches schemes; everything else previews on the dark page.
  const scheme = s.technique === "theme" ? s.theme : "dark";
  const type = technique.gradientType || s.gradientType;

  s.restColor = REST_COLOR[scheme];

  let visible = resolve(technique.options, s, []);
  // The direction slider means nothing to a radial gradient, and the third color only feeds conic/stripes.
  if (technique.options.includes("gradientType")) {
    if (type === "radial") visible = visible.filter((k) => k !== "angle");
    if (!usesThirdColor(type)) visible = visible.filter((k) => k !== "color3");
  }
  showOptions(visible);

  $("angle-label").textContent = type === "conic" ? "From angle" : "Direction";
  $("fix-label").textContent = resolve(technique.fixLabel, s, "Apply the fix");
  $("mixin-field").hidden = !(technique.mixin && (technique.gradient || type === "linear"));

  updateRangeSlider(inputs.thickness, $("thickness-value"), (v) => `${v}px`);
  updateRangeSlider(inputs.radius, $("radius-value"), (v) => `${v}px`);
  updateRangeSlider(inputs.angle, $("angle-value"), (v) => `${v}deg`);

  stage.classList.toggle("stage--pattern", visible.includes("pattern") && s.pattern);
  stage.classList.toggle("stage--light", scheme === "light");

  card.className = [
    "gradient-border-card",
    ...resolve(technique.classes, s, []),
    ...(s.focus ? ["with-focus-ring"] : [])
  ].join(" ");
  cardLabel.textContent = resolve(technique.label, s, "Gradient Border");

  // The preview always paints real colors; only the readout switches to var() references.
  const hex = { start: s.color1, end: s.color2, mid: s.color3, gap: PAGE_BG[scheme], surface: SURFACE[scheme] };
  const previewGradient = technique.gradient ? technique.gradient(s, hex) : buildGradient(type, s, hex, technique.from);

  card.style.setProperty("--border-size", `${s.thickness}px`);
  card.style.setProperty("--border-radius", `${s.radius}px`);
  card.style.setProperty("--border-angle", `${s.angle}deg`);
  card.style.setProperty("--border-gradient", previewGradient);
  // The white-box pitfall is the one place the fill is hard-coded instead of following the scheme.
  const whiteBox = s.technique === "white-box" && !s.fix;
  card.style.setProperty("--surface", whiteBox ? "#ffffff" : SURFACE[scheme]);
  card.style.setProperty("--rest-color", s.restColor);
  card.style.setProperty("--color-1", s.color1);
  card.style.setProperty("--color-2", s.color2);

  stageNote.innerHTML = resolve(technique.note, s, "");
  output.textContent = buildOutput(s, technique, type, scheme);
}

// Mirrors the demo's live state as copy-pasteable code, including the production extras a real stylesheet needs.
function buildOutput(s, technique, type, scheme) {
  const useVars = s.vars || resolve(technique.forceVars, s, false);
  const third = technique.gradient || usesThirdColor(type) || s.technique === "rotating";
  const c = useVars
    ? {
        start: "var(--gradient-start)",
        end: "var(--gradient-end)",
        mid: "var(--gradient-mid)",
        gap: PAGE_BG[scheme],
        surface: "var(--surface)"
      }
    : { start: s.color1, end: s.color2, mid: s.color3, gap: PAGE_BG[scheme], surface: SURFACE[scheme] };
  const g = technique.gradient ? technique.gradient(s, c) : buildGradient(type, s, c);

  if (s.mixin && !$("mixin-field").hidden) return buildMixinOutput(s, technique, c, scheme);

  const spec = technique.css(s, c, g);
  const parts = [];

  if (useVars) {
    // Theme-aware demos put the light surface in :root; the dark override follows in rootExtra.
    const rootSurface = spec.rootExtra && spec.rootExtra.length ? SURFACE.light : SURFACE[scheme];
    parts.push(
      block(":root", [
        `--surface: ${rootSurface};`,
        `--gradient-start: ${s.color1};`,
        `--gradient-end: ${s.color2};`,
        ...(third ? [`--gradient-mid: ${s.color3};`] : [])
      ])
    );
    parts.push(...(spec.rootExtra || []));
  }

  parts.push(...(spec.before || []));
  parts.push(block(spec.selector, spec.decls));
  parts.push(...(spec.after || []));

  if (s.focus) {
    parts.push(block(`${spec.selector}:focus-visible`, [`outline: 2px solid ${c.start};`, "outline-offset: 4px;"]));
  }

  if (ANIMATED.has(s.technique)) {
    parts.push(`@media (prefers-reduced-motion: reduce) {\n${block(spec.selector, ["animation: none;"], "  ")}\n}`);
  }

  return parts.join("\n\n");
}

// The post's mixin takes the colors as one list, so every other argument can be set by name.
function buildMixinOutput(s, technique, c, scheme) {
  const animate = s.technique === "animated";
  const colors = animate ? `(${c.start}, ${c.end}, ${c.mid})` : `(${c.start}, ${c.end})`;
  const inner = s.vars || technique.forceVars ? "var(--surface)" : SURFACE[scheme];
  const args = [
    colors,
    `$size: ${s.thickness}px`,
    `$radius: ${s.radius}px`,
    `$direction: ${s.angle}deg`,
    `$inner: ${inner}`,
    ...(animate ? ["$animate: true"] : [])
  ];
  return [
    "// Uses the gradient-border mixin from this post",
    `.card {\n  @include gradient-border(\n    ${args.join(",\n    ")}\n  );${
      s.focus ? `\n\n  &:focus-visible {\n    outline: 2px solid ${c.start};\n    outline-offset: 4px;\n  }` : ""
    }\n}`
  ].join("\n");
}

// Switching groups lands on that group's first technique, so the preview always matches the visible picker.
initTabs("#group-switch .tab", (group) => {
  const current = document.querySelector("input[name='technique']:checked");
  if (TECHNIQUES[current.value].group !== group) {
    document.querySelector(`#${group}-demo input[name='technique']`).checked = true;
  }
  updateDemo();
});

// mask exists for see-through centers, so it opens on the patterned backdrop that proves it.
document.querySelectorAll("input[name='technique']").forEach((radio) =>
  radio.addEventListener("change", () => {
    if (radio.value === "mask" || radio.value === "safari-mask") inputs.pattern.checked = true;
    updateDemo();
  })
);

document
  .querySelectorAll(
    "input[name='gradient-type'], input[name='sides-variant'], input[name='theme-variant'], input[name='not-showing-variant'], input[name='bleeding-variant']"
  )
  .forEach((radio) => radio.addEventListener("change", updateDemo));

Object.values(inputs).forEach((input) => input.addEventListener("input", updateDemo));

updateDemo();
