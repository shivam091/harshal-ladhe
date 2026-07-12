// CSS transform parameters for a boop animation — all fields are optional, defaulting to no-op identity values.
export interface TransformBoopConfig {
  transformX?: number;
  transformY?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  springConfig?: { tension?: number; friction?: number };
}
