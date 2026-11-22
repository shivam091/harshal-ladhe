import "./shared/playground.css";
import "./styles.css";

const $ = (id) => document.getElementById(id);

// The only shape of code this playground will ever execute, so a typed-in payload can't do anything here.
const ARITHMETIC = /^[\d\s+\-*/().]+$/;

const hasTrustedTypes = typeof window.trustedTypes !== "undefined";

/*
  Real policy: the browser refuses to build a TrustedScript from anything that isn't arithmetic. Wrapped in a
  try/catch because createPolicy() can throw (for example if a CSP restricts policy names), and the demo should
  still explain itself without it.
*/
const calcPolicy = (() => {
  if (!hasTrustedTypes) return null;
  try {
    return window.trustedTypes.createPolicy("calc", {
      createScript(input) {
        if (!ARITHMETIC.test(input)) throw new TypeError("Only arithmetic is allowed");
        return input;
      }
    });
  } catch (_error) {
    return null;
  }
})();

// Real check: does this browser unwrap a TrustedScript passed to eval() (a polyfilled object would just be returned)?
function supportsTrustedEval() {
  if (!hasTrustedTypes) return false;
  try {
    return !(0, eval)(window.trustedTypes.emptyScript);
  } catch (_error) {
    return false;
  }
}

// The default policy modelled by the second checkbox: approves a string only when its body is arithmetic.
function defaultCreateScript(codeString, sink) {
  const body = sink === "Function" ? codeString.slice(codeString.indexOf("{\n") + 2, codeString.lastIndexOf("\n}")) : codeString;
  if (!ARITHMETIC.test(body)) throw new TypeError("default policy: not arithmetic");
  return codeString;
}

// Mirrors the full source text the engine would compile, which is what the richer host hook now receives.
function assembleCode(route, params, body) {
  if (route === "eval") return String(body);
  return `function anonymous(${params.join(",")}\n) {\n${String(body)}\n}`;
}

// Builds the body in the form the "How the body arrives" select describes, or explains why it can't exist.
function buildBody(kind, code, log) {
  if (kind === "plain") return code;

  if (kind === "lookalike") {
    return {
      toString() {
        return code;
      }
    };
  }

  if (!calcPolicy) {
    log("calc policy unavailable: this browser has no Trusted Types");
    return null;
  }

  try {
    const script = calcPolicy.createScript(code);
    log("calcPolicy.createScript() accepted the code and returned a TrustedScript");
    return script;
  } catch (error) {
    log(`calcPolicy.createScript() threw: ${error.message}`);
    log("no TrustedScript exists, so the call never happens");
    return null;
  }
}

// Runs approved code, but only arithmetic, so the playground stays harmless whatever is selected.
function execute(route, params, bodyText, log) {
  if (!ARITHMETIC.test(bodyText)) {
    log("approved, but this playground only runs arithmetic, so nothing executed");
    return;
  }
  const result = route === "eval" ? (0, eval)(bodyText) : new Function(...params, bodyText)();
  log(`result: ${result}`);
}

// Walks the three steps the browser takes once Trusted Types is enforced; throws EvalError where it would.
function gate({ route, params, body, hasDefaultPolicy, log }) {
  const isTrusted = (value) => hasTrustedTypes && window.trustedTypes.isScript(value);
  const everyArgumentTrusted = [body, ...params].every(isTrusted);
  log(`1. brand check: ${everyArgumentTrusted ? "the body and every parameter are TrustedScript objects" : "not every argument is a TrustedScript"}`);
  if (everyArgumentTrusted) return;

  const sink = route === "eval" ? "eval" : "Function";
  const codeString = assembleCode(route, params, body);
  log(`2. default policy: asked about ${JSON.stringify(codeString)} for sink "${sink}"`);
  if (!hasDefaultPolicy) throw new EvalError("no default policy to approve a plain string");

  let approved;
  try {
    approved = defaultCreateScript(codeString, sink);
  } catch (error) {
    throw new EvalError(error.message);
  }
  if (approved !== codeString) throw new EvalError("the default policy returned a different string");
  log("   the default policy returned the same code, so it is approved");
}

// One click = one full pass, so each option's effect shows up as a different set of lines.
function run() {
  const lines = [];
  const log = (message) => {
    lines.push(message);
    $("readout").textContent = lines.join("\n");
  };

  const code = $("code-select").value;
  const route = $("route-select").value;
  const kind = $("kind-select").value;
  const enforced = $("enforce-toggle").checked;
  const params = route === "function-param" ? ["n"] : [];

  const body = buildBody(kind, code, log);
  if (body === null) return;

  // Real: the spec returns anything that isn't a String untouched, which is why a look-alike never runs through eval().
  if (route === "eval" && typeof body === "object" && !(hasTrustedTypes && window.trustedTypes.isScript(body))) {
    log(`eval(object) === object: ${(0, eval)(body) === body}. The object is returned, nothing ran`);
    return;
  }

  if (!enforced) {
    log("Trusted Types is not enforced, so no brand check happens");
    execute(route, params, String(body), log);
    return;
  }

  try {
    gate({ route, params, body, hasDefaultPolicy: $("default-toggle").checked, log });
    log("3. script-src: 'trusted-types-eval' allows it while Trusted Types is enforced");
    execute(route, params, String(body), log);
  } catch (error) {
    log(`${error.name}: ${error.message}`);
  }
}

// Reports what this browser really supports, because the rest of the demo is a model.
function showSupport() {
  const yesNo = (value) => (value ? "yes" : "no");
  $("support").textContent = [
    `trustedTypes available: ${yesNo(hasTrustedTypes)}`,
    `calc policy created: ${yesNo(calcPolicy)}`,
    `eval(TrustedScript) runs the code natively: ${yesNo(supportsTrustedEval())}`
  ].join("\n");
}

$("run-btn").addEventListener("click", run);
showSupport();
