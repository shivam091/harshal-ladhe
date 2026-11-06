// One situation a reader might expect @starting-style to react to, kept as data so both columns render identically.
export interface TriggerCase {
  // Short name of the situation, written as readers would describe it in their own code.
  label: string;
  // Why it does or doesn't count as a first style computation, which is the part readers get wrong.
  hint: string;
}
