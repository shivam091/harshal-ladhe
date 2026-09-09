import { useMemo, useState } from "react";
import { segmentText } from "./segment";
import "./styles.css";

const DEFAULT_TEXT = "café 👨‍👩‍👧‍👦 🇮🇳 résumé";

export default function App() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const { naive, graphemes } = useMemo(() => segmentText(text), [text]);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Intl.Segmenter</h1>
        <p className="subtitle">Family/flag emoji and accented letters are made of several code points — only one of these two splits them the way a reader actually sees them.</p>

        <input
          className="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type some text with emoji or accents..."
        />

        <div className="columns">
          <div className="column">
            <p className="column-title">[...text] — {naive.length} items</p>
            <div className="chip-row">
              {naive.map((char, i) => (
                <span key={i} className="chip naive">
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="column">
            <p className="column-title">Intl.Segmenter — {graphemes.length} items</p>
            <div className="chip-row">
              {graphemes.map((char, i) => (
                <span key={i} className="chip grapheme">
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
