import "./shared/playground.css";
import "./styles.css";

const toggle = document.getElementById("chrome-toggle");
const screen = document.getElementById("phone-screen");
const chrome = document.getElementById("phone-chrome");
const readout = document.getElementById("readout");
const lvhPx = document.getElementById("lvh-px");
const svhPx = document.getElementById("svh-px");
const dvhPx = document.getElementById("dvh-px");

const SCREEN_HEIGHT = 380;
const CHROME_HEIGHT = 48;

function update() {
  const chromeHidden = screen.classList.contains("chrome-hidden");

  chrome.classList.toggle("hidden", chromeHidden);
  toggle.textContent = chromeHidden ? "Show address bar" : "Hide address bar";

  // lvh/svh never change; only dvh tracks whether the chrome is actually showing right now.
  const lvh = SCREEN_HEIGHT + CHROME_HEIGHT;
  const svh = SCREEN_HEIGHT;
  const dvh = chromeHidden ? lvh : svh;

  lvhPx.textContent = `${lvh}px`;
  svhPx.textContent = `${svh}px`;
  dvhPx.textContent = `${dvh}px`;

  readout.textContent = [
    `address bar: ${chromeHidden ? "hidden" : "showing"}`,
    `100lvh -> ${lvh}px  (constant — assumes chrome is always gone)`,
    `100svh -> ${svh}px  (constant — assumes chrome is always showing)`,
    `100dvh -> ${dvh}px  (live — matches whichever is true right now)`,
  ].join("\n");
}

toggle.addEventListener("click", () => {
  screen.classList.toggle("chrome-hidden");
  update();
});

update();
