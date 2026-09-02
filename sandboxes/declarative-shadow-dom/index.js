import "./styles.css";

/*
  Deliberately delayed — a real script tag can be slow for plenty of ordinary reasons (network,
  a large bundle, a slow parser-blocking resource above it); this exaggerates that gap so the
  declarative card's head start is actually visible rather than happening within one frame.
*/
setTimeout(() => {
  const host = document.getElementById("imperative-host");
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      .card { padding: 0.875rem 1rem; border-radius: 0.5rem; background: hsl(140, 55%, 45%, 0.14); color: hsl(140, 55%, 68%); font-family: system-ui, sans-serif; font-size: 0.875rem; }
    </style>
    <p class="card">I just appeared — attachShadow() only ran once this script executed.</p>
  `;
}, 1800);
