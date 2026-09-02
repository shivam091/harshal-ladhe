import "./styles.css";

const list = document.getElementById("task-list");
const addBtn = document.getElementById("add-item-btn");
const removeBtn = document.getElementById("remove-item-btn");

let taskCount = 1;

addBtn.addEventListener("click", () => {
  taskCount += 1;
  const item = document.createElement("li");
  item.textContent = `Task ${taskCount}`;
  list.appendChild(item);
});

removeBtn.addEventListener("click", () => {
  if (list.lastElementChild) list.removeChild(list.lastElementChild);
});
