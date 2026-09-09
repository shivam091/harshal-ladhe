import { useRef } from "react";
import TextInput from "./TextInput";
import "./styles.css";

export default function App() {
  // An ordinary ref, passed straight into TextInput as the "ref" prop — same as passing it to a
  // plain <input> directly. No forwardRef() anywhere in this file or in TextInput.tsx.
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="wrapper">
        <h1 className="title">ref as a Prop</h1>
        <p className="subtitle">TextInput accepts `ref` directly — click the button to call `.focus()` on the real DOM node underneath it.</p>

        <TextInput label="Your name" ref={inputRef} />

        <button className="focus-btn" type="button" onClick={() => inputRef.current?.focus()}>
          Focus the input
        </button>
      </div>
    </>
  );
}
