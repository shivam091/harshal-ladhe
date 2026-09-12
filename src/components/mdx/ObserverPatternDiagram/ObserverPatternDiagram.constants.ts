// Left x coordinate of the Subject box.
export const SUBJECT_X = 30;
// Top y coordinate of the Subject box, vertically centred against the three-observer stack.
export const SUBJECT_Y = 100;
// Width of the Subject box.
export const SUBJECT_W = 130;
// Height of the Subject box.
export const SUBJECT_H = 60;

// Left x coordinate shared by all three Observer boxes.
export const OBSERVER_X = 320;
// Width shared by all three Observer boxes.
export const OBSERVER_W = 130;
// Height shared by all three Observer boxes.
export const OBSERVER_H = 50;
// Top y coordinate of each Observer box, stacked with even gaps around the Subject's vertical centre.
export const OBSERVER_Y = [30, 105, 180];

// Right edge every "notify()" arrow starts from — the Subject box's right side, vertically centred.
export const NOTIFY_START_X = SUBJECT_X + SUBJECT_W;
// Shared y coordinate of the Subject's right-edge notify point.
export const NOTIFY_START_Y = SUBJECT_Y + SUBJECT_H / 2;
