import "./styles.css";

/*
  A dependency-free Web Component — plain HTMLElement subclass, shadow DOM for style/markup
  encapsulation, an observed attribute for external config, and internal state that stays
  private to each instance. Registered once via customElements.define() below.
*/
class LikeButton extends HTMLElement {
  static observedAttributes = ["label", "step"];

  constructor() {
    super();
    this._count = 0;
    this.attachShadow({ mode: "open" });
  }

  // Runs once this element is actually inserted into the document — safe place to render and wire up listeners.
  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this._count += this.step;
      this.render();
    });
  }

  // Runs whenever an observed attribute changes from outside — keeps the rendered output in sync with the markup.
  attributeChangedCallback() {
    this.render();
  }

  get label() {
    return this.getAttribute("label") ?? "Like";
  }

  get step() {
    return Number(this.getAttribute("step") ?? 1);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          font-family: system-ui, sans-serif;
          padding: 0.5rem 0.875rem;
          border-radius: 0.375rem;
          border: 1px solid hsl(213, 80%, 54%);
          background: hsl(213, 80%, 54%, 0.12);
          color: hsl(213, 85%, 68%);
          font-size: 0.8125rem;
          cursor: pointer;
        }
        button:hover { background: hsl(213, 80%, 54%, 0.22); }
      </style>
      <button>${this.label}: ${this._count} (+${this.step} per click)</button>
    `;
  }
}

customElements.define("like-button", LikeButton);
