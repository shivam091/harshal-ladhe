import "./shared/playground.css";
import "./shared/range-slider.css";
import { positionRangeBubble } from "./shared/range-slider.js";
import "./styles.css";

const item3 = document.getElementById("item-3");
const readout = document.getElementById("readout");
const orderRange = document.getElementById("order-range");
const orderValue = document.getElementById("order-value");
const orderBubble = document.getElementById("order-bubble");

function update() {
  const order = orderRange.value;

  item3.style.order = order;

  orderValue.textContent = order;
  orderBubble.textContent = order;
  positionRangeBubble(orderRange, orderBubble);

  readout.textContent = `#item-3 { order: ${order}; } — every other item stays at its default order: 0`;
}

orderRange.addEventListener("input", update);

update();
