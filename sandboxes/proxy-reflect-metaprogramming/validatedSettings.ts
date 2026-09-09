export interface Settings {
  volume: number;
  brightness: number;
}

export type LogFn = (message: string) => void;

// Wraps `target` so every get/set is logged, and every `volume`/`brightness` write outside 0-100
// is rejected instead of silently corrupting state — Reflect.get/set run the DEFAULT behavior
// afterward, so reads/writes that pass validation work exactly like a plain object would.
export function createValidatedSettings(target: Settings, log: LogFn): Settings {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      log(`get "${String(prop)}" -> ${value}`);
      return value;
    },
    set(obj, prop, value, receiver) {
      if ((prop === "volume" || prop === "brightness") && (typeof value !== "number" || value < 0 || value > 100)) {
        log(`REJECTED set "${String(prop)}" = ${value} (must be 0-100)`);
        return false;
      }
      log(`set "${String(prop)}" = ${value}`);
      return Reflect.set(obj, prop, value, receiver);
    },
  });
}
