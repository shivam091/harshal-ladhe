import "./shared/playground.css";
import "./shared/segmented-control.css";
import "./styles.css";

const stage = document.getElementById("stage");
const output = document.getElementById("props-output");

const directionRadios = document.querySelectorAll("input[name='direction']");
const writingModeRadios = document.querySelectorAll("input[name='writing-mode']");

function update() {
  const direction = document.querySelector("input[name='direction']:checked").value;
  const writingMode = document.querySelector("input[name='writing-mode']:checked").value;

  stage.dir = direction;
  stage.style.writingMode = writingMode;

  output.textContent = `dir="${direction}"
writing-mode: ${writingMode};`;
}

[...directionRadios, ...writingModeRadios].forEach((radio) =>
  radio.addEventListener("change", update)
);

update();
