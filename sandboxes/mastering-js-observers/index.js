import "./shared/playground.css";
import "./styles.css";

// MutationObserver: reacts to child list, attribute, and text changes on #mutation-target.
function setupMutationObserverDemo() {
  const target = document.getElementById("mutation-target");
  const status = document.getElementById("mutation-status");
  const addBtn = document.getElementById("add-item-btn");
  const removeBtn = document.getElementById("remove-item-btn");
  const toggleAttrBtn = document.getElementById("toggle-attr-btn");

  let itemCount = 1;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        const message = `childList: ${mutation.addedNodes.length} node(s) added`;
        console.log("[MutationObserver]", message);
        status.textContent = message;
      } else if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
        const message = `childList: ${mutation.removedNodes.length} node(s) removed`;
        console.log("[MutationObserver]", message);
        status.textContent = message;
      } else if (mutation.type === "attributes") {
        const message = `attributes: "${mutation.attributeName}" changed (was "${mutation.oldValue}")`;
        console.log("[MutationObserver]", message);
        status.textContent = message;
      }
    });
  });

  observer.observe(target, {
    childList: true,
    attributes: true,
    attributeOldValue: true,
    subtree: false,
  });

  addBtn.addEventListener("click", () => {
    itemCount += 1;
    const item = document.createElement("p");
    item.className = "mutation-item";
    item.textContent = `Child #${itemCount}`;
    target.appendChild(item);
  });

  removeBtn.addEventListener("click", () => {
    const items = target.querySelectorAll(".mutation-item");
    if (items.length > 0) target.removeChild(items[items.length - 1]);
  });

  toggleAttrBtn.addEventListener("click", () => {
    target.classList.toggle("is-active");
  });
}

// IntersectionObserver: reports which cards are at least 50% visible inside the scroll strip.
function setupIntersectionObserverDemo() {
  const root = document.getElementById("intersection-root");
  const status = document.getElementById("intersection-status");
  const cards = root.querySelectorAll(".intersection-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const cardNumber = entry.target.dataset.card;
        entry.target.classList.toggle("is-visible", entry.isIntersecting);

        const message = entry.isIntersecting
          ? `Card ${cardNumber} entered (${Math.round(entry.intersectionRatio * 100)}% visible)`
          : `Card ${cardNumber} left the viewport`;
        console.log("[IntersectionObserver]", message);
      });

      const visibleCards = Array.from(cards)
        .filter((card) => card.classList.contains("is-visible"))
        .map((card) => card.dataset.card);

      status.textContent =
        visibleCards.length > 0
          ? `Visible now: Card ${visibleCards.join(", Card ")}`
          : "Nothing visible yet.";
    },
    {
      root,
      threshold: 0.5,
    }
  );

  cards.forEach((card) => observer.observe(card));
}

// ResizeObserver: reports the live content-box size of #resize-target as the user drags it.
function setupResizeObserverDemo() {
  const target = document.getElementById("resize-target");
  const status = document.getElementById("resize-status");

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { inlineSize, blockSize } = entry.contentBoxSize[0];
      const width = Math.round(inlineSize);
      const height = Math.round(blockSize);

      console.log("[ResizeObserver]", `New size: ${width}px × ${height}px`);
      status.textContent = `Current size: ${width}px × ${height}px`;
    }
  });

  observer.observe(target);
}

setupMutationObserverDemo();
setupIntersectionObserverDemo();
setupResizeObserverDemo();
