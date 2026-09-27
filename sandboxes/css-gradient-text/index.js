import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./shared/tabs.css";
import "./shared/range-slider.css";
import "./styles.css";
import { updateRangeSlider } from "./shared/range-slider.js";
import { initTabs } from "./shared/tabs.js";

const $ = (id) => document.getElementById(id);

const demo = $("gradient-demo");
const output = $("gradient-text-output");
const stageNote = $("stage-note");
const contrastList = $("contrast");

const stages = {
  text: $("text-stage"),
  window: $("window-stage"),
  video: $("video-stage"),
  svg: $("svg-stage")
};

const inputs = {
  angle: $("angle-input"),
  color1: $("color-1"),
  color2: $("color-2"),
  strokeWidth: $("stroke-width-input"),
  shadowOffset: $("shadow-offset-input"),
  focalX: $("focal-x-input"),
  focalY: $("focal-y-input"),
  blendMode: $("blend-mode-select"),
  multiline: $("multiline-toggle"),
  wrapFix: $("wrapfix-toggle"),
  descenderFix: $("descender-fix-toggle"),
  hover: $("hover-toggle"),
  guard: $("guard-toggle"),
  vars: $("vars-toggle"),
  fluid: $("fluid-toggle"),
  forced: $("forced-toggle")
};

// Option rows that only make sense for some techniques; each technique lists the ones it shows.
const optionRows = {
  angle: $("angle-field"),
  focal: [$("focal-x-field"), $("focal-y-field")],
  strokeWidth: $("stroke-width-field"),
  shadowOffset: $("shadow-offset-field"),
  blendMode: $("blend-mode-field"),
  shadowVariant: $("shadow-variant"),
  imageVariant: $("image-variant"),
  propertyVariant: $("property-variant"),
  shorthandVariant: $("shorthand-variant"),
  supportsVariant: $("supports-variant"),
  multiline: $("multiline-field"),
  wrapFix: $("wrapfix-field"),
  descenderFix: $("descender-fix-field"),
  hover: $("hover-field"),
  guard: $("guard-field")
};

// Short enough to fit on one line at any width, so a wrap only ever happens when the toggle asks for it.
const SHORT_TEXT = "Gradient Text";
// Long enough to wrap onto 3+ lines inside the 320px heading, so the wrap fix has several fragments to act on.
const LONG_TEXT = "Gradient Text That Wraps Across Several Lines";
// Every descender (g, j, p, y) plus a trailing italic "y" whose lean overhangs the box.
const DESCENDER_TEXT = "Jumpy Typography";

/*
  The preview's background (--pg-surface-muted). The readout prints real colors rather than
  var(--pg-*), so the copied CSS works outside this playground; the contrast chips measure
  against it too.
*/
const STAGE_BG = "#1d2137";

// Techniques whose preview moves, so the readout adds a reduced-motion rule for them.
const ANIMATED = new Set(["animated", "property"]);

/* ---------- Color helpers ---------- */

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(rgb) {
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
}

// Linear sRGB mix — enough to derive a shadow tint that stays visible on the dark stage.
function mix(hexA, hexB, amountA) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(a.map((c, i) => c * amountA + b[i] * (1 - amountA)));
}

// WCAG 2 relative luminance and contrast ratio.
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(hexA, hexB) {
  const [hi, lo] = [luminance(hexA), luminance(hexB)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------- Generated media (no files needed) ---------- */

// A soft "photo" of blurred color blobs; the animated flavor drifts them with SMIL, which keeps running inside a CSS background just like a GIF.
function buildFillImage(c1, c2, animated) {
  const drift = (values, dur) =>
    animated ? `<animate attributeName="cx" values="${values}" dur="${dur}s" repeatCount="indefinite"/>` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" preserveAspectRatio="none">
    <filter id="b"><feGaussianBlur stdDeviation="14"/></filter>
    <rect width="400" height="120" fill="${c2}"/>
    <g filter="url(#b)">
      <circle cx="60" cy="40" r="60" fill="${c1}">${drift("60;340;60", 5)}</circle>
      <circle cx="300" cy="90" r="55" fill="${mix(c1, "#ffffff", 0.55)}">${drift("300;40;300", 6)}</circle>
      <circle cx="190" cy="20" r="40" fill="${mix(c2, "#000000", 0.6)}">${drift("190;360;190", 4)}</circle>
    </g>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/*
  A <video> can't be a CSS background — that's the whole point of the knockout technique — so the
  preview plays a real <video> whose source is a canvas stream, painted with the live colors.
*/
const videoCanvas = document.createElement("canvas");
videoCanvas.width = 480;
videoCanvas.height = 160;
const videoCtx = videoCanvas.getContext("2d");
const knockoutVideo = $("knockout-video");
let videoFrame = 0;
let videoRunning = false;
let videoColors = ["#ff6a00", "#ee0979"];

function paintVideoFrame() {
  if (!videoRunning) return;
  videoFrame += 1;
  const t = videoFrame / 60;
  const [c1, c2] = videoColors;
  const { width, height } = videoCanvas;
  const shift = (Math.sin(t) + 1) / 2;

  const bg = videoCtx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, c1);
  bg.addColorStop(0.15 + shift * 0.7, c2);
  bg.addColorStop(1, mix(c1, "#ffffff", 0.6));
  videoCtx.fillStyle = bg;
  videoCtx.fillRect(0, 0, width, height);

  // A couple of moving blobs so it's obviously footage, not a static gradient.
  for (let i = 0; i < 3; i += 1) {
    const x = ((t * 60 * (i + 1) + i * 160) % (width + 120)) - 60;
    const y = height / 2 + Math.sin(t * 2 + i) * 40;
    videoCtx.fillStyle = i % 2 ? mix(c2, "#000000", 0.5) : mix(c1, "#ffffff", 0.7);
    videoCtx.beginPath();
    videoCtx.arc(x, y, 40, 0, Math.PI * 2);
    videoCtx.fill();
  }

  requestAnimationFrame(paintVideoFrame);
}

function setVideoRunning(running) {
  if (running === videoRunning) return;
  videoRunning = running;
  if (running) {
    if (!knockoutVideo.srcObject && videoCanvas.captureStream) {
      knockoutVideo.srcObject = videoCanvas.captureStream(30);
    }
    requestAnimationFrame(paintVideoFrame);
    knockoutVideo.play().catch(() => {});
  } else {
    knockoutVideo.pause();
  }
}

/* ---------- Readout helpers ---------- */

const CLIP = ["-webkit-background-clip: text;", "background-clip: text;"];
const TRANSPARENT_FILL = "-webkit-text-fill-color: transparent;";

function block(selector, decls, indent = "") {
  const inner = decls.map((d) => `${indent}  ${d}`).join("\n");
  return `${indent}${selector} {\n${inner}\n${indent}}`;
}

/*
  Each technique describes its preview (stage, classes, text, visible options, note) and its CSS
  (a main rule plus any extra blocks). `c` holds the stop colors as the readout should print them —
  real hex values, or var() references when "Use CSS variables" is on.
*/
const TECHNIQUES = {
  linear: {
    group: "essentials",
    options: ["angle"],
    note: "The four-line recipe: a background gradient, clipped to the glyphs, with a transparent fill so it shows through.",
    css: (s, c) => ({
      selector: ".linear-gradient",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
        ...CLIP,
        TRANSPARENT_FILL
      ]
    })
  },

  radial: {
    group: "essentials",
    options: ["focal"],
    classes: ["mode-radial"],
    note: "Only the gradient function changes. Drag the focal point to move where the colors radiate from.",
    css: (s, c) => ({
      selector: ".radial-gradient",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: radial-gradient(circle at ${s.focalX}% ${s.focalY}%, ${c.start}, ${c.end} 70%);`,
        ...CLIP,
        TRANSPARENT_FILL
      ]
    })
  },

  conic: {
    group: "essentials",
    options: ["angle"],
    angleLabel: "Start angle (from)",
    classes: ["mode-conic"],
    note: "Colors sweep around the center. Ending on the first color closes the circle without a hard seam.",
    css: (s, c) => ({
      selector: ".conic-gradient",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: conic-gradient(from ${s.angle}deg, ${c.start}, ${c.end}, ${c.start});`,
        ...CLIP,
        TRANSPARENT_FILL
      ]
    })
  },

  animated: {
    group: "essentials",
    options: [],
    classes: ["mode-animated"],
    note: "The strip is twice the text's width and slides sideways, so it only loops seamlessly on a horizontal (90deg) gradient, which is why the angle is fixed here. To animate any angle, see <code>@property</code> under Advanced.",
    css: (s, c) => ({
      selector: ".animated-gradient",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(90deg, ${c.start}, ${c.end}, ${c.start});`,
        "background-size: 200% auto;",
        ...CLIP,
        TRANSPARENT_FILL,
        "animation: shine 3s linear infinite;"
      ],
      after: ["@keyframes shine {\n  to {\n    background-position: 200% center;\n  }\n}"]
    })
  },

  stroke: {
    group: "essentials",
    options: ["angle", "strokeWidth"],
    classes: ["mode-stroke"],
    note: "A transparent stroke widens the clipped area; the fill matches the background behind the text so only the ring shows the gradient.",
    css: (s, c) => ({
      selector: ".stroke-gradient",
      decls: [
        `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
        ...CLIP,
        `-webkit-text-stroke: ${s.strokeWidth}px transparent;`,
        `-webkit-text-fill-color: ${STAGE_BG}; /* Must match the background behind the text */`
      ]
    })
  },

  shadow: {
    group: "advanced",
    options: ["angle", "shadowOffset", "shadowVariant"],
    classes: (s) => [`mode-${s.shadowVariant}`],
    note: (s) =>
      ({
        "drop-shadow": "<code>filter: drop-shadow()</code> shadows the rendered pixels, meaning the gradient letters themselves.",
        layered: "The element draws the stacked <code>text-shadow</code>s; a <code>::after</code> copy of the text on top carries the gradient.",
        "text-shadow": "The broken version: <code>text-shadow</code> is part of the text layer, so it shows through the transparent fill and muddies the gradient."
      })[s.shadowVariant],
    css: (s, c) => {
      if (s.shadowVariant === "layered") {
        return {
          selector: ".layered-gradient",
          html: `<h1 class="layered-gradient" data-text="${s.text}">${s.text}</h1>`,
          decls: [
            "position: relative;",
            "color: transparent;",
            `text-shadow: ${s.shadowOffset}px ${s.shadowOffset}px 0 ${s.shadowNear}, ${s.shadowOffset * 2}px ${s.shadowOffset * 2}px 0 ${s.shadowFar};`
          ],
          after: [
            block(".layered-gradient::after", [
              "content: attr(data-text);",
              'content: attr(data-text) / ""; /* Hide the duplicate from screen readers */',
              "position: absolute;",
              "inset: 0;",
              `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
              ...CLIP,
              TRANSPARENT_FILL,
              "text-shadow: none;"
            ])
          ]
        };
      }

      const shadow =
        s.shadowVariant === "drop-shadow"
          ? `filter: drop-shadow(${s.shadowOffset}px ${s.shadowOffset}px 2px ${s.shadowNear});`
          : `text-shadow: ${s.shadowOffset}px ${s.shadowOffset}px 0 ${s.shadowNear}; /* ❌ Muddies the gradient */`;

      return {
        selector: ".shadow-gradient",
        decls: [
          `color: ${c.start}; /* Fallback */`,
          `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
          ...CLIP,
          TRANSPARENT_FILL,
          shadow
        ]
      };
    }
  },

  blend: {
    group: "advanced",
    options: ["angle", "blendMode"],
    classes: ["mode-blend"],
    textured: true,
    contrast: false,
    note: "<code>mix-blend-mode</code> blends the letters with the texture behind them. Try each mode, since the result depends heavily on the backdrop.",
    css: (s, c) => ({
      selector: ".blend-gradient",
      before: [block(".blend-container", ['background: url("carbon-fibre-texture.png");', "padding: 10px;"])],
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
        ...CLIP,
        TRANSPARENT_FILL,
        `mix-blend-mode: ${s.blendMode};`
      ]
    })
  },

  image: {
    group: "advanced",
    options: ["imageVariant"],
    classes: ["mode-image"],
    contrast: false,
    note: (s) =>
      s.imageVariant === "animated"
        ? "An animated image clips exactly like a gradient. The preview drifts an SVG; an animated GIF works the same way, but prefer video in production since GIFs are heavy."
        : "<code>background-clip: text</code> clips any background, so a photo or texture works just like a gradient.",
    css: (s) => ({
      selector: ".image-text",
      decls: [
        `background: url("${s.imageVariant === "animated" ? "gradient-background.gif" : "gradient-background.jpg"}") center / cover;`,
        ...CLIP,
        TRANSPARENT_FILL
      ]
    })
  },

  video: {
    group: "advanced",
    stage: "video",
    options: [],
    contrast: false,
    note: "A <code>&lt;video&gt;</code> can't be a CSS background. Instead, black text on a white box with <code>mix-blend-mode: screen</code> turns the letters into windows onto the video playing underneath.",
    css: () => ({
      html: '<div class="video-text">\n  <video autoplay muted loop playsinline>\n    <source src="/assets/videos/gradient.webm" type="video/webm">\n    <source src="/assets/videos/gradient.mp4" type="video/mp4">\n  </video>\n  <h1>Gradient</h1>\n</div>',
      selector: ".video-text h1",
      before: [
        block(".video-text", ["position: relative;"]),
        block(".video-text video", ["display: block;", "width: 100%;", "height: 100%;", "object-fit: cover;"])
      ],
      decls: [
        "position: absolute;",
        "inset: 0;",
        "display: grid;",
        "place-items: center;",
        "margin: 0;",
        "background: #fff; /* Stays white after blending */",
        "color: #000; /* Becomes a see-through window onto the video */",
        "mix-blend-mode: screen;"
      ],
      noFallbackExtras: true
    })
  },

  window: {
    group: "advanced",
    stage: "window",
    options: [],
    note: "Scroll the box. <code>background-attachment: fixed</code> pins the gradient to the viewport, so every heading shows a different slice of one big gradient.",
    css: (s, c) => ({
      selector: ".window-gradient",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(45deg, ${c.start}, ${c.end} 50%, ${c.start});`,
        "background-attachment: fixed; /* Pins the gradient to the viewport */",
        "background-size: cover;",
        ...CLIP,
        TRANSPARENT_FILL
      ]
    })
  },

  property: {
    group: "advanced",
    options: (s) => (s.propertyVariant === "hues" ? ["angle", "propertyVariant"] : ["propertyVariant"]),
    classes: (s) => [`mode-property-${s.propertyVariant}`],
    note: (s) =>
      s.propertyVariant === "rotate"
        ? "Registering <code>--angle</code> with <code>@property</code> gives it a type, so the browser can interpolate it and the gradient rotates smoothly."
        : "Two registered <code>&lt;color&gt;</code> properties trade places, so the hues shift in place instead of panning.",
    css: (s, c) =>
      s.propertyVariant === "rotate"
        ? {
            selector: ".rotating-gradient",
            before: ['@property --angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: 0deg;\n}'],
            decls: [
              `color: ${c.start}; /* Fallback */`,
              `background: linear-gradient(var(--angle), ${c.start}, ${c.end});`,
              ...CLIP,
              TRANSPARENT_FILL,
              "animation: rotate-gradient 4s linear infinite;"
            ],
            after: ["@keyframes rotate-gradient {\n  to {\n    --angle: 360deg;\n  }\n}"]
          }
        : {
            selector: ".shifting-gradient",
            before: [
              `@property --stop-a {\n  syntax: "<color>";\n  inherits: false;\n  initial-value: ${s.color1};\n}`,
              `@property --stop-b {\n  syntax: "<color>";\n  inherits: false;\n  initial-value: ${s.color2};\n}`
            ],
            decls: [
              `color: ${c.start}; /* Fallback */`,
              `background: linear-gradient(${s.angle}deg, var(--stop-a), var(--stop-b));`,
              ...CLIP,
              TRANSPARENT_FILL,
              "animation: shift-hues 4s ease-in-out infinite;"
            ],
            after: [
              `@keyframes shift-hues {\n  0%,\n  100% {\n    --stop-a: ${c.start};\n    --stop-b: ${c.end};\n  }\n\n  50% {\n    --stop-a: ${c.end};\n    --stop-b: ${c.start};\n  }\n}`
            ]
          }
  },

  wrap: {
    group: "pitfalls",
    options: ["angle", "multiline", "wrapFix"],
    classes: (s) => (s.wrapFix ? ["wrap-fix"] : []),
    text: (s) => (s.multiline ? LONG_TEXT : SHORT_TEXT),
    note: (s) =>
      s.wrapFix
        ? "With <code>clone</code>, every line fragment paints its own copy of the background, so each line gets the full gradient."
        : "Without the fix, the wrapped lines share one long gradient strip laid end to end, so each line only gets a slice of it.",
    css: (s, c) => ({
      selector: ".wrap-fix",
      html: `<h1><span class="wrap-fix">${s.text}</span></h1>`,
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
        ...CLIP,
        TRANSPARENT_FILL,
        ...(s.wrapFix ? ["-webkit-box-decoration-break: clone;", "box-decoration-break: clone;"] : [])
      ]
    })
  },

  descenders: {
    group: "pitfalls",
    options: ["angle", "descenderFix"],
    classes: (s) => ["mode-descenders", ...(s.descenderFix ? ["descender-fix"] : [])],
    text: () => DESCENDER_TEXT,
    note: (s) =>
      s.descenderFix
        ? "More <code>line-height</code> and a little padding extend the painted box under the descenders and past the italic lean."
        : "With a tight <code>line-height</code>, the tails of g, j, p and y hang below the box, and the italic y leans past its edge. With no background behind them, those parts vanish.",
    css: (s, c) => ({
      selector: ".gradient-text",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
        ...CLIP,
        TRANSPARENT_FILL,
        "font-style: italic;",
        ...(s.descenderFix
          ? [
              "line-height: 1.2; /* Enough room for descenders */",
              "padding-block-end: 0.1em; /* Extra room for deep descenders */",
              "padding-inline-end: 0.1em; /* Room for italic overhang */"
            ]
          : ["line-height: 0.8; /* ❌ Too tight: descenders fall outside the box */"])
      ]
    })
  },

  shorthand: {
    group: "pitfalls",
    options: ["angle", "shorthandVariant", "hover"],
    classes: (s) => [`override-${s.shorthandVariant}`, ...(s.hover ? ["is-hovered"] : [])],
    text: () => "Hover Me",
    note: (s) =>
      s.shorthandVariant === "shorthand"
        ? "The <code>background</code> shorthand resets every sub-property it doesn't mention, including <code>background-clip</code>. So the hover rule turns the text into a solid gradient rectangle."
        : "<code>background-image</code> only replaces the image, so clipping survives and the reversed gradient stays inside the letters.",
    css: (s, c) => ({
      selector: ".gradient-text",
      decls: [
        `color: ${c.start}; /* Fallback */`,
        `background: linear-gradient(${s.angle}deg, ${c.start}, ${c.end});`,
        ...CLIP,
        TRANSPARENT_FILL
      ],
      after: [
        s.shorthandVariant === "shorthand"
          ? `/* ❌ Resets background-clip — the text disappears */\n${block(".gradient-text:hover", [`background: linear-gradient(${s.angle}deg, ${c.end}, ${c.start});`])}`
          : `/* ✅ Only replaces the image, so clipping survives */\n${block(".gradient-text:hover", [`background-image: linear-gradient(${s.angle}deg, ${c.end}, ${c.start});`])}`
      ]
    })
  },

  supports: {
    group: "pitfalls",
    options: ["angle", "supportsVariant", "guard"],
    classes: (s) => [...(s.supportsVariant === "unsupported" ? ["sim-no-clip"] : []), ...(s.guard ? ["guarded"] : [])],
    note: (s) => {
      if (s.supportsVariant === "supported") {
        return "In a browser that can clip, the guarded and unguarded versions look identical. Switch the simulated browser to see the difference.";
      }
      return s.guard
        ? "The browser fails the <code>@supports</code> test, never gets the transparent fill, and keeps the readable fallback color."
        : "This browser can't clip but still honors the transparent fill, so the text vanishes behind a gradient box. A fallback <code>color</code> alone doesn't save it.";
    },
    css: (s, c) => {
      const gradientDecls = [`background: linear-gradient(to right, ${c.start}, ${c.end});`, ...CLIP, TRANSPARENT_FILL];
      if (!s.guard) {
        return { selector: "h1", decls: [`color: ${c.start}; /* Fallback */`, ...gradientDecls] };
      }
      return {
        selector: "h1",
        decls: [`color: ${c.start}; /* Everyone gets a readable solid color */`],
        after: [`@supports (-webkit-background-clip: text) or (background-clip: text) {\n${block("h1", gradientDecls, "  ")}\n}`]
      };
    }
  },

  svg: {
    group: "pitfalls",
    stage: "svg",
    options: ["angle"],
    note: "The gradient is part of the graphic, so it doesn't rely on background clipping. The trade-off is that SVG <code>&lt;text&gt;</code> never wraps.",
    css: (s) => {
      const [x1, y1, x2, y2] = svgGradientVector(s.angle);
      return {
        raw:
          '<svg viewBox="0 0 400 60" role="img" aria-label="SVG Gradient Text">\n' +
          "  <defs>\n" +
          `    <linearGradient id="svgGrad" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">\n` +
          `      <stop offset="0%" stop-color="${s.color1}" />\n` +
          `      <stop offset="100%" stop-color="${s.color2}" />\n` +
          "    </linearGradient>\n" +
          "  </defs>\n" +
          '  <text x="200" y="45" text-anchor="middle" fill="url(#svgGrad)" font-size="40" font-weight="800">SVG Gradient Text</text>\n' +
          "</svg>"
      };
    }
  }
};

// CSS angles point "to top" at 0deg and turn clockwise; SVG gradients need the same direction as a start/end vector in the 0–1 box.
function svgGradientVector(angle) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = -Math.cos(rad) / 2;
  const round = (v) => `${Math.round(v * 1000) / 10}%`;
  return [round(0.5 - dx), round(0.5 - dy), round(0.5 + dx), round(0.5 + dy)];
}

// Techniques may give a value or a function of state for classes/options/notes/text.
// Plain checks instead of `??`: Sandpack's bundler doesn't parse nullish coalescing.
function resolve(value, state, fallback) {
  if (typeof value === "function") return value(state);
  return value === undefined ? fallback : value;
}

function readState() {
  const radio = (name) => document.querySelector(`input[name='${name}']:checked`).value;
  const color1 = inputs.color1.value;
  const color2 = inputs.color2.value;
  return {
    technique: radio("technique"),
    shadowVariant: radio("shadow-variant"),
    imageVariant: radio("image-variant"),
    propertyVariant: radio("property-variant"),
    shorthandVariant: radio("shorthand-variant"),
    supportsVariant: radio("supports-variant"),
    angle: Number(inputs.angle.value),
    color1,
    color2,
    strokeWidth: Number(inputs.strokeWidth.value),
    shadowOffset: Number(inputs.shadowOffset.value),
    // Tints of the stops rather than black, which would disappear against the dark stage.
    shadowNear: mix(color2, STAGE_BG, 0.45),
    shadowFar: mix(color1, STAGE_BG, 0.25),
    focalX: Number(inputs.focalX.value),
    focalY: Number(inputs.focalY.value),
    blendMode: inputs.blendMode.value,
    multiline: inputs.multiline.checked,
    wrapFix: inputs.wrapFix.checked,
    descenderFix: inputs.descenderFix.checked,
    hover: inputs.hover.checked,
    guard: inputs.guard.checked,
    vars: inputs.vars.checked,
    fluid: inputs.fluid.checked,
    forced: inputs.forced.checked
  };
}

function showOptions(visible) {
  Object.entries(optionRows).forEach(([key, row]) => {
    [row].flat().forEach((el) => {
      el.hidden = !visible.includes(key);
    });
  });
}

function renderContrast(state, technique) {
  const show = technique.contrast !== false;
  contrastList.hidden = !show;
  if (!show) return;

  contrastList.innerHTML = [state.color1, state.color2]
    .map((hex, i) => {
      const ratio = contrast(hex, STAGE_BG);
      const verdict = ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "Fails";
      const cls = ratio >= 3 ? "pass" : "fail";
      return `<li><span class="swatch" style="background:${hex}"></span>Color ${i + 1} <code>${ratio.toFixed(1)}:1</code> <span class="${cls}">${verdict}</span></li>`;
    })
    .join("");
}

// Single render pass — every control funnels through here, so the preview and readout can never drift apart.
function updateDemo() {
  const state = readState();
  const technique = TECHNIQUES[state.technique];
  const stageKey = technique.stage || "text";

  state.text = resolve(technique.text, state, SHORT_TEXT);

  showOptions(resolve(technique.options, state, []));
  $("angle-label").textContent = technique.angleLabel || "Angle";

  Object.entries(stages).forEach(([key, el]) => {
    el.hidden = key !== stageKey;
  });
  stages.text.classList.toggle("stage--textured", Boolean(technique.textured));

  updateRangeSlider(inputs.angle, $("angle-value"), (v) => `${v}deg`);
  updateRangeSlider(inputs.strokeWidth, $("stroke-width-value"), (v) => `${v}px`);
  updateRangeSlider(inputs.shadowOffset, $("shadow-offset-value"), (v) => `${v}px`);
  updateRangeSlider(inputs.focalX, $("focal-x-value"), (v) => `${v}%`);
  updateRangeSlider(inputs.focalY, $("focal-y-value"), (v) => `${v}%`);

  demo.className = ["gradient-demo", ...resolve(technique.classes, state, [])].join(" ");
  demo.textContent = state.text;
  demo.dataset.text = state.text;

  // Custom properties go on every gradient element, so the window stage's headings follow the controls too.
  document.querySelectorAll(".gradient-demo").forEach((el) => {
    el.style.setProperty("--gradient-angle", `${state.angle}deg`);
    el.style.setProperty("--gradient-start", state.color1);
    el.style.setProperty("--gradient-end", state.color2);
    el.style.setProperty("--stroke-width", `${state.strokeWidth}px`);
    el.style.setProperty("--shadow-offset", `${state.shadowOffset}px`);
    el.style.setProperty("--shadow-near", state.shadowNear);
    el.style.setProperty("--shadow-far", state.shadowFar);
    el.style.setProperty("--focal-x", `${state.focalX}%`);
    el.style.setProperty("--focal-y", `${state.focalY}%`);
    el.style.setProperty("--blend-mode", state.blendMode);
  });

  if (state.technique === "image") {
    demo.style.setProperty("--fill-image", buildFillImage(state.color1, state.color2, state.imageVariant === "animated"));
  }

  const [x1, y1, x2, y2] = svgGradientVector(state.angle);
  const svgGrad = $("svg-grad");
  Object.entries({ x1, y1, x2, y2 }).forEach(([attr, value]) => svgGrad.setAttribute(attr, value));
  $("svg-stop-1").setAttribute("stop-color", state.color1);
  $("svg-stop-2").setAttribute("stop-color", state.color2);

  videoColors = [state.color1, state.color2];
  setVideoRunning(stageKey === "video");

  stageNote.innerHTML = resolve(technique.note, state, "");
  renderContrast(state, technique);

  output.textContent = buildCssOutput(state, technique);
}

// Mirrors the demo's live state as copy-pasteable code, including the production extras a real stylesheet needs.
function buildCssOutput(state, technique) {
  const colors = state.vars
    ? { start: "var(--gradient-start)", end: "var(--gradient-end)" }
    : { start: state.color1, end: state.color2 };
  const spec = technique.css(state, colors);

  if (spec.raw) return spec.raw;

  const parts = [];
  if (spec.html) parts.push(`<!-- HTML -->\n${spec.html}`, "/* CSS */");
  if (state.vars && !spec.noFallbackExtras) {
    parts.push(block(":root", [`--gradient-start: ${state.color1};`, `--gradient-end: ${state.color2};`]));
  }
  parts.push(...(spec.before || []));

  const decls = [...spec.decls];
  if (state.fluid) {
    decls.unshift("font-size: clamp(2rem, 8vw, 5rem);", "overflow-wrap: break-word;");
    if (!decls.some((d) => d.startsWith("line-height"))) decls.splice(1, 0, "line-height: 1.2;");
  }
  parts.push(block(spec.selector, decls));
  parts.push(...(spec.after || []));

  if (ANIMATED.has(state.technique)) {
    parts.push(`@media (prefers-reduced-motion: reduce) {\n${block(spec.selector, ["animation: none;"], "  ")}\n}`);
  }

  if (state.forced && !spec.noFallbackExtras) {
    parts.push(
      `@media (forced-colors: active) {\n${block(spec.selector, ["background: none;", "-webkit-text-fill-color: currentColor;"], "  ")}\n}`
    );
  }

  return parts.join("\n\n");
}

// Switching groups lands on that group's first technique, so the preview always matches the visible picker.
initTabs("#group-switch .tab", (group) => {
  const current = document.querySelector("input[name='technique']:checked");
  if (TECHNIQUES[current.value].group !== group) {
    document.querySelector(`#${group}-demo input[name='technique']`).checked = true;
  }
  updateDemo();
});

document
  .querySelectorAll(
    "input[name='technique'], input[name='shadow-variant'], input[name='image-variant'], input[name='property-variant'], input[name='shorthand-variant'], input[name='supports-variant']"
  )
  .forEach((radio) => radio.addEventListener("change", updateDemo));

Object.values(inputs).forEach((input) => input.addEventListener("input", updateDemo));

updateDemo();
