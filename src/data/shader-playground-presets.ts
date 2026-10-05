import type { ShaderPresetMeta } from "@/components/ShaderPlayground/ShaderPlayground.types";

/*
  Curated starting shaders for the preset gallery — each one short enough to read in a sitting,
  written against the Shadertoy-style mainImage() entry point, and each declaring at least one
  `// @slider` or `// @color` uniform so every preset doubles as a demo of the auto-generated
  controls. All of them stick to GLSL ES 1.00-compatible syntax (constant loop bounds, mod()
  rather than %, no texture lookups) so they also run on the WebGL1 fallback context.
*/
export const shaderPlaygroundPresets: ShaderPresetMeta[] = [
  {
    slug: "gradient-uv",
    name: "Gradient UV",
    swatch: ["#ff4d6d", "#4dd2ff"],
    source: `// The "hello world" of shaders: a pixel's position becomes its colour.
uniform float uBlue; // @slider 0 1 0.5
uniform vec3 uTint; // @color #3fa7ff

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 col = vec3(uv, uBlue + 0.25 * sin(iTime));
  col = mix(col, uTint, 0.25);
  fragColor = vec4(col, 1.0);
}
`
  },
  {
    slug: "plasma",
    name: "Plasma",
    swatch: ["#ff6ec7", "#7cf4ff"],
    source: `// Layered sine waves summed into one field, then pushed through a cosine palette.
uniform float uScale; // @slider 1 20 8
uniform float uSpeed; // @slider 0 3 1

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * uSpeed;
  vec2 p = uv * uScale;

  float v = sin(p.x + t);
  v += sin((p.y + t) * 0.5);
  v += sin((p.x + p.y + t) * 0.5);
  v += sin(length(p + 3.0 * vec2(sin(t * 0.3), cos(t * 0.5))) + t);

  vec3 col = 0.5 + 0.5 * cos(v * 1.5 + vec3(0.0, 2.0, 4.0));
  fragColor = vec4(col, 1.0);
}
`
  },
  {
    slug: "ray-marched-sphere",
    name: "Ray-marched Sphere",
    swatch: ["#ff7a45", "#1b1f3a"],
    source: `// Sphere tracing: step along each ray by the distance to the nearest surface.
uniform float uRadius; // @slider 0.3 1.5 1
uniform vec3 uColor; // @color #ff7a45

float sceneSdf(vec3 p) {
  float sphere = length(p) - uRadius;
  float ground = p.y + 1.0;
  return min(sphere, ground);
}

vec3 sceneNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    sceneSdf(p + e.xyy) - sceneSdf(p - e.xyy),
    sceneSdf(p + e.yxy) - sceneSdf(p - e.yxy),
    sceneSdf(p + e.yyx) - sceneSdf(p - e.yyx)
  ));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  vec3 ro = vec3(0.0, 0.3, 3.5);
  vec3 rd = normalize(vec3(uv, -1.5));

  float t = 0.0;
  for (int i = 0; i < 96; i++) {
    float d = sceneSdf(ro + rd * t);
    if (d < 0.001 || t > 20.0) break;
    t += d;
  }

  vec3 col = vec3(0.06, 0.07, 0.12) + 0.12 * (uv.y + 0.5);
  if (t < 20.0) {
    vec3 p = ro + rd * t;
    vec3 n = sceneNormal(p);
    vec3 light = normalize(vec3(cos(iTime), 1.2, sin(iTime)));
    float diffuse = max(dot(n, light), 0.0);
    float checker = mod(floor(p.x) + floor(p.z), 2.0);
    vec3 albedo = p.y < -0.99 ? vec3(0.2 + 0.2 * checker) : uColor;
    col = albedo * (0.12 + 0.88 * diffuse);
  }

  fragColor = vec4(pow(col, vec3(0.4545)), 1.0);
}
`
  },
  {
    slug: "truchet-tiles",
    name: "Truchet Tiles",
    swatch: ["#ffd166", "#118ab2"],
    source: `// Every cell holds the same two quarter-arcs, randomly flipped, and the arcs join up into endless paths.
uniform float uTiles; // @slider 4 30 10
uniform float uLineWidth; // @slider 0.03 0.3 0.1

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  uv += vec2(0.05, 0.03) * iTime;

  vec2 grid = uv * uTiles;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  if (hash21(cell) > 0.5) local.x = -local.x;

  vec2 corner = local.x > -local.y ? vec2(0.5) : vec2(-0.5);
  float d = abs(length(local - corner) - 0.5);
  float line = 1.0 - smoothstep(uLineWidth - 0.03, uLineWidth, d);

  vec3 background = vec3(0.07, 0.08, 0.12);
  vec3 ink = 0.5 + 0.5 * cos(iTime + cell.x * 0.3 + vec3(0.0, 2.0, 4.0));
  fragColor = vec4(mix(background, ink, line), 1.0);
}
`
  },
  {
    slug: "mandelbrot-zoom",
    name: "Mandelbrot Zoom",
    swatch: ["#ffb347", "#2b1055"],
    source: `// z = z*z + c, iterated until it escapes; then a smooth escape count picks the colour.
uniform float uZoomSpeed; // @slider 0 1 0.3
uniform vec3 uGlow; // @color #ffb347

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float zoom = exp(-mod(iTime * uZoomSpeed, 12.0));
  vec2 c = vec2(-0.743643887, 0.131825904) + uv * 2.5 * zoom;

  vec2 z = vec2(0.0);
  float n = 0.0;
  for (int i = 0; i < 256; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 16.0) break;
    n += 1.0;
  }

  vec3 col = vec3(0.0);
  if (n < 256.0) {
    float s = n - log2(log2(dot(z, z))) + 4.0;
    col = 0.5 + 0.5 * cos(s * 0.15 + vec3(0.0, 1.8, 3.0));
    col = mix(col, uGlow, 0.35);
  }
  fragColor = vec4(col, 1.0);
}
`
  },
  {
    slug: "metaballs",
    name: "Metaballs",
    swatch: ["#7c5cff", "#0d0a1f"],
    source: `// Five drifting charges summed into one field; click and drag to add a sixth.
uniform float uThreshold; // @slider 0.5 3 1.2
uniform vec3 uColor; // @color #7c5cff

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float field = 0.0;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 centre = 0.35 * vec2(
      sin(iTime * (0.6 + 0.1 * fi) + fi * 1.7),
      cos(iTime * (0.5 + 0.13 * fi) + fi * 2.3)
    );
    vec2 d = uv - centre;
    field += 0.012 / (dot(d, d) + 0.0001);
  }

  if (iMouse.z > 0.0) {
    vec2 d = uv - (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;
    field += 0.02 / (dot(d, d) + 0.0001);
  }

  float edge = smoothstep(uThreshold, uThreshold * 1.15, field);
  vec3 col = mix(vec3(0.04, 0.03, 0.08), uColor, edge);
  col += 0.15 * uColor * clamp(field / uThreshold, 0.0, 1.0);
  fragColor = vec4(col, 1.0);
}
`
  },
  {
    slug: "voronoi",
    name: "Voronoi",
    swatch: ["#06d6a0", "#ef476f"],
    source: `// Each pixel finds its nearest wandering seed point; the gap to the second-nearest draws the borders.
uniform float uCells; // @slider 2 20 6
uniform float uEdge; // @slider 0 0.2 0.05

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.y * uCells;
  vec2 cell = floor(uv);
  vec2 local = fract(uv);

  float nearest = 8.0;
  float second = 8.0;
  vec2 nearestId = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 id = cell + offset;
      vec2 seed = 0.5 + 0.4 * sin(iTime + 6.2831 * hash22(id));
      float d = length(offset + seed - local);
      if (d < nearest) {
        second = nearest;
        nearest = d;
        nearestId = id;
      } else if (d < second) {
        second = d;
      }
    }
  }

  vec3 col = 0.55 + 0.45 * cos(6.2831 * hash22(nearestId).x + vec3(0.0, 2.1, 4.2));
  col *= 1.0 - 0.4 * nearest;
  col *= smoothstep(0.0, uEdge + 0.001, second - nearest);
  fragColor = vec4(col, 1.0);
}
`
  }
];
