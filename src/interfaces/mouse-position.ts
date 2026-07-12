// Cursor coordinates in viewport space; null until the first mousemove event fires.
export interface MousePosition {
  x: number | null;
  y: number | null;
}
