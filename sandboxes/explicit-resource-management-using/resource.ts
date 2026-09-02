// One line of the live demo's activity log, tagged so the UI can color acquire/dispose/error differently.
export interface LogLine {
  id: number;
  text: string;
  kind: "acquire" | "dispose" | "error" | "info";
}

// A resource with a real Symbol.dispose implementation — the exact protocol a `using` declaration calls automatically.
export class Resource {
  readonly name: string;
  private readonly emit: (text: string, kind: LogLine["kind"]) => void;

  constructor(name: string, emit: (text: string, kind: LogLine["kind"]) => void) {
    this.name = name;
    this.emit = emit;
    this.emit(`acquired "${name}"`, "acquire");
  }

  // Called automatically at the end of a `using` block's scope — here, called manually by runBlock() to mirror that.
  [Symbol.dispose](): void {
    this.emit(`disposed "${this.name}"`, "dispose");
  }
}

/*
  Mirrors exactly what a real `using a = ...; using b = ...;` block does under the hood — this
  sandbox spells it out manually so the demo runs without depending on the bundler's parser
  supporting the `using` syntax itself. Real code would just write the declarations directly (see
  the code blocks above) and get this same acquire-in-order / dispose-in-reverse-order /
  dispose-even-on-throw behavior for free from the language.
*/
export function runBlock(names: string[], throwMidBlock: boolean, emit: (text: string, kind: LogLine["kind"]) => void): void {
  const resources: Resource[] = [];
  try {
    for (const name of names) {
      resources.push(new Resource(name, emit));
    }
    if (throwMidBlock) {
      throw new Error("something went wrong mid-block");
    }
    emit("block finished normally", "info");
  } catch (err) {
    emit(`caught: ${err instanceof Error ? err.message : String(err)}`, "error");
  } finally {
    // LIFO — last acquired, first disposed, same order a real `using` block guarantees.
    for (let i = resources.length - 1; i >= 0; i--) {
      resources[i][Symbol.dispose]();
    }
  }
}
