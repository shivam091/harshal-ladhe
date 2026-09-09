import { useState } from "react";
import "./styles.css";

const THEMES = {
  ocean: { from: "#0ea5e9", to: "#0369a1" },
  sunset: { from: "#f97316", to: "#be123c" },
  forest: { from: "#22c55e", to: "#166534" },
} as const;

type ThemeName = keyof typeof THEMES;

// The exact JSX a real opengraph-image.tsx would return, as a plain string kept in sync with the
// preview below — same title/theme in, same markup shape out.
function buildImageResponseCode(title: string, theme: ThemeName): string {
  const { from, to } = THEMES[theme];
  return `export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex", height: "100%", width: "100%",
        background: "linear-gradient(135deg, ${from}, ${to})",
        color: "white", fontSize: 64, fontWeight: 700,
      }}>
        ${title}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}`;
}

export default function App() {
  const [title, setTitle] = useState("Fluid Typography with clamp()");
  const [theme, setTheme] = useState<ThemeName>("ocean");
  const colors = THEMES[theme];

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Dynamic OG Images</h1>
        <p className="subtitle">Every post gets its own share-preview image, generated from its title — no design tool involved.</p>

        <input className="text-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..." />

        <div className="theme-row">
          {(Object.keys(THEMES) as ThemeName[]).map((name) => (
            <button
              key={name}
              className={`theme-btn ${theme === name ? "active" : ""}`}
              type="button"
              onClick={() => setTheme(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div
          className="og-preview"
          style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
        >
          {title || "Your Post Title"}
        </div>

        <pre className="code-output">{buildImageResponseCode(title || "Your Post Title", theme)}</pre>
      </div>
    </>
  );
}
