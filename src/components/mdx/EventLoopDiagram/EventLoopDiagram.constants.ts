// Shared width/height of the Call Stack, Web APIs, and Event Loop boxes.
export const BOX_W = 200;
export const BOX_H = 56;
// Shared left x coordinate of every box in the single-column flow.
export const BOX_X = 70;

// Top y coordinate of the Call Stack box — the flow's starting point.
export const CALL_STACK_Y = 10;
// Top y coordinate of the Web APIs box.
export const WEB_APIS_Y = 100;

// Outer "Task Queues" container grouping the Microtask and Macrotask rows.
export const QUEUES_CONTAINER_X = 55;
export const QUEUES_CONTAINER_Y = 190;
export const QUEUES_CONTAINER_W = 230;
export const QUEUES_CONTAINER_H = 130;

// Shared width/height of the Microtask and Macrotask rows inside the container.
export const QUEUE_ROW_W = 200;
export const QUEUE_ROW_H = 40;
// Top y coordinate of the Microtask Queue row — drawn first to signal it drains before the Macrotask row.
export const MICROTASK_Y = 218;
// Top y coordinate of the Macrotask Queue row.
export const MACROTASK_Y = 264;

// Top y coordinate of the Event Loop box, which checks the queues and pushes callbacks back onto the stack.
export const EVENT_LOOP_Y = 354;

// x coordinate every top-to-bottom connector arrow is centered on.
export const FLOW_CENTER_X = BOX_X + BOX_W / 2;

// Right edge shared by the Call Stack and Event Loop boxes — the loop-back arrow starts/ends here.
export const CALL_STACK_RIGHT_X = BOX_X + BOX_W;
// x coordinate the loop-back arrow bulges out to on the right, clear of every box.
export const LOOP_OUT_X = 310;
// Vertical mid-point of the Call Stack box — where the loop-back arrow re-enters.
export const CALL_STACK_MID_Y = CALL_STACK_Y + BOX_H / 2;
// Vertical mid-point of the Event Loop box — where the loop-back arrow originates.
export const EVENT_LOOP_MID_Y = EVENT_LOOP_Y + BOX_H / 2;

// y coordinate of the legend's first row (Microtask) at the bottom of the diagram.
export const LEGEND_Y = 444;
// Vertical gap between the legend's Microtask and Macrotask rows.
export const LEGEND_ROW_GAP = 20;
