import "./styles.css";

const gallery = document.getElementById("gallery");
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
  const isMasonry = gallery.classList.toggle("masonry");
  gallery.classList.toggle("plain-grid", !isMasonry);
  toggle.textContent = isMasonry ? "Switch to plain grid" : "Switch to masonry";
});
