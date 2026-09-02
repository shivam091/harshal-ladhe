import "./styles.css";

const supportNote = document.getElementById("support-note");

if (!CSS.supports("anchor-name: --a")) {
  supportNote.hidden = false;
}
