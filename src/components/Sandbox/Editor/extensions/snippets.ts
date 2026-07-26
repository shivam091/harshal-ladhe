import { completeFromList, snippetCompletion } from "@codemirror/autocomplete";
import { cssLanguage } from "@codemirror/lang-css";
import { htmlLanguage } from "@codemirror/lang-html";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";

/*
  Snippets — JS/TS already ship basic snippets via @codemirror/lang-javascript; jsSnippets adds
  more at that same registration point. CSS/HTML ship none, so those two lists are this editor's only source.
*/

/*
  Prefixes: arrow, async, clg, switch, ternary, export, destr, template, promise, fetch,
  usestate, useeffect, fc, ret, map, filter, reduce, foreach, settimeout, useref, usememo,
  usecallback, iife, frag, cond — frag/cond need no JSX file-type gating since Sandpack always
  configures javascript() with jsx:true.
*/
const jsSnippets = [
  snippetCompletion("const ${name} = (${params}) => {\n\t${}\n};", {
    label: "arrow",
    detail: "arrow function",
    type: "keyword"
  }),
  snippetCompletion("async function ${name}(${params}) {\n\t${}\n}", {
    label: "async",
    detail: "async function",
    type: "keyword"
  }),
  snippetCompletion("console.log(${});", {
    label: "clg",
    detail: "console.log",
    type: "function"
  }),
  snippetCompletion(
    "switch (${expression}) {\n\tcase ${value}:\n\t\t${}\n\t\tbreak;\n\tdefault:\n\t\t${}\n}",
    {
      label: "switch",
      detail: "switch statement",
      type: "keyword"
    }
  ),
  snippetCompletion("${condition} ? ${consequent} : ${alternate}", {
    label: "ternary",
    detail: "conditional expression",
    type: "keyword"
  }),
  snippetCompletion("export default ${name};", {
    label: "export",
    detail: "default export",
    type: "keyword"
  }),
  snippetCompletion("const {${names}} = ${source};", {
    label: "destr",
    detail: "object destructuring",
    type: "keyword"
  }),
  snippetCompletion("`${text}`", {
    label: "template",
    detail: "template literal",
    type: "keyword"
  }),
  snippetCompletion(
    "new Promise((${resolve}, ${reject}) => {\n\t${}\n});",
    {
      label: "promise",
      detail: "new Promise",
      type: "function"
    }
  ),
  snippetCompletion(
    'const ${response} = await fetch("${url}");\nconst ${data} = await ${response}.json();',
    {
      label: "fetch",
      detail: "fetch + await json()",
      type: "function"
    }
  ),
  snippetCompletion(
    "const [${state}, set${State}] = useState(${initialValue});",
    {
      label: "usestate",
      detail: "React useState",
      type: "function"
    }
  ),
  snippetCompletion("useEffect(() => {\n\t${}\n}, [${dependencies}]);", {
    label: "useeffect",
    detail: "React useEffect",
    type: "function"
  }),
  snippetCompletion(
    "export default function ${Name}() {\n\treturn (\n\t\t${}\n\t);\n}",
    {
      label: "fc",
      detail: "React function component",
      type: "function"
    }
  ),
  snippetCompletion("return ${value};", {
    label: "ret",
    detail: "return statement",
    type: "keyword"
  }),
  snippetCompletion("${array}.map((${item}) => ${item})", {
    label: "map",
    detail: "Array.map",
    type: "function"
  }),
  snippetCompletion("${array}.filter((${item}) => ${condition})", {
    label: "filter",
    detail: "Array.filter",
    type: "function"
  }),
  snippetCompletion(
    "${array}.reduce((${accumulator}, ${item}) => {\n\t${}\n}, ${initialValue})",
    {
      label: "reduce",
      detail: "Array.reduce",
      type: "function"
    }
  ),
  snippetCompletion("${array}.forEach((${item}) => {\n\t${}\n});", {
    label: "foreach",
    detail: "Array.forEach",
    type: "function"
  }),
  snippetCompletion("setTimeout(() => {\n\t${}\n}, ${1000});", {
    label: "settimeout",
    detail: "setTimeout",
    type: "function"
  }),
  snippetCompletion("const ${ref} = useRef(${null});", {
    label: "useref",
    detail: "React useRef",
    type: "function"
  }),
  snippetCompletion(
    "const ${value} = useMemo(() => ${computation}, [${dependencies}]);",
    {
      label: "usememo",
      detail: "React useMemo",
      type: "function"
    }
  ),
  snippetCompletion(
    "const ${handler} = useCallback((${params}) => {\n\t${}\n}, [${dependencies}]);",
    {
      label: "usecallback",
      detail: "React useCallback",
      type: "function"
    }
  ),
  snippetCompletion("(function () {\n\t${}\n})();", {
    label: "iife",
    detail: "immediately invoked function expression",
    type: "function"
  }),
  snippetCompletion("<>\n\t${}\n</>", {
    label: "frag",
    detail: "JSX fragment",
    type: "keyword"
  }),
  snippetCompletion("{${condition} && (\n\t${}\n)}", {
    label: "cond",
    detail: "JSX conditional render",
    type: "keyword"
  })
];

/*
  Prefixes: @media, flex, grid, keyframes, root, transition, shadow, center, mixin, include,
  scssvar, if, plus Emmet-style one-property shorthands (df, db, dib, dn, dg, posa, posr, posf,
  poss, oh, oa, jcc, aic, fxdc, fl, fr, cur, usn, w, h, m, p, bdrs, bgc, c, fz, fw, ta, op, z).
  mixin/include/scssvar/if are SCSS-only but harmless here (snippetCompletion just inserts text on
  a prefix match). .scss/.sass files get these free too — Sandpack maps both to the same css() call.
*/
const cssSnippets = [
  snippetCompletion("@media (${min-width: 768px}) {\n\t${}\n}", {
    label: "@media",
    detail: "query block",
    type: "keyword"
  }),
  snippetCompletion(
    "display: flex;\nalign-items: ${center};\njustify-content: ${center};",
    {
      label: "flex",
      detail: "container",
      type: "property"
    }
  ),
  snippetCompletion(
    "display: grid;\ngrid-template-columns: ${repeat(3, 1fr)};\ngap: ${1rem};",
    {
      label: "grid",
      detail: "container",
      type: "property"
    }
  ),
  snippetCompletion(
    "@keyframes ${name} {\n\tfrom {\n\t\t${}\n\t}\n\tto {\n\t\t${}\n\t}\n}",
    {
      label: "keyframes",
      detail: "@keyframes block",
      type: "keyword"
    }
  ),
  snippetCompletion(":root {\n\t--${name}: ${value};\n}", {
    label: "root",
    detail: ":root variables",
    type: "keyword"
  }),
  snippetCompletion("transition: ${property} ${0.2s} ${ease};", {
    label: "transition",
    detail: "transition property",
    type: "property"
  }),
  snippetCompletion("box-shadow: ${0 1px 3px rgba(0, 0, 0, 0.1)};", {
    label: "shadow",
    detail: "box-shadow",
    type: "property"
  }),
  snippetCompletion(
    "position: absolute;\ntop: 50%;\nleft: 50%;\ntransform: translate(-50%, -50%);",
    {
      label: "center",
      detail: "absolute centering",
      type: "property"
    }
  ),
  snippetCompletion("@mixin ${name}(${params}) {\n\t${}\n}", {
    label: "mixin",
    detail: "SCSS @mixin",
    type: "keyword"
  }),
  snippetCompletion("@include ${name}(${args});", {
    label: "include",
    detail: "SCSS @include",
    type: "keyword"
  }),
  snippetCompletion("$${name}: ${value};", {
    label: "scssvar",
    detail: "SCSS variable",
    type: "variable"
  }),
  snippetCompletion("@if ${condition} {\n\t${}\n} @else {\n\t${}\n}", {
    label: "if",
    detail: "SCSS @if/@else",
    type: "keyword"
  }),

  /*
    Emmet-style short prefixes — one property per snippet. A literal value with no tabstop means
    that's the one value wanted often enough to hardcode; others take a ${value} tabstop.
  */
  snippetCompletion("display: flex;", {
    label: "df",
    detail: "display: flex",
    type: "property"
  }),
  snippetCompletion("display: block;", {
    label: "db",
    detail: "display: block",
    type: "property"
  }),
  snippetCompletion("display: inline-block;", {
    label: "dib",
    detail: "display: inline-block",
    type: "property"
  }),
  snippetCompletion("display: none;", {
    label: "dn",
    detail: "display: none",
    type: "property"
  }),
  snippetCompletion("display: grid;", {
    label: "dg",
    detail: "display: grid",
    type: "property"
  }),
  snippetCompletion("position: absolute;", {
    label: "posa",
    detail: "position: absolute",
    type: "property"
  }),
  snippetCompletion("position: relative;", {
    label: "posr",
    detail: "position: relative",
    type: "property"
  }),
  snippetCompletion("position: fixed;", {
    label: "posf",
    detail: "position: fixed",
    type: "property"
  }),
  snippetCompletion("position: sticky;", {
    label: "poss",
    detail: "position: sticky",
    type: "property"
  }),
  snippetCompletion("overflow: hidden;", {
    label: "oh",
    detail: "overflow: hidden",
    type: "property"
  }),
  snippetCompletion("overflow: auto;", {
    label: "oa",
    detail: "overflow: auto",
    type: "property"
  }),
  snippetCompletion("justify-content: center;", {
    label: "jcc",
    detail: "justify-content: center",
    type: "property"
  }),
  snippetCompletion("align-items: center;", {
    label: "aic",
    detail: "align-items: center",
    type: "property"
  }),
  snippetCompletion("flex-direction: column;", {
    label: "fxdc",
    detail: "flex-direction: column",
    type: "property"
  }),
  snippetCompletion("float: left;", {
    label: "fl",
    detail: "float: left",
    type: "property"
  }),
  snippetCompletion("float: right;", {
    label: "fr",
    detail: "float: right",
    type: "property"
  }),
  snippetCompletion("cursor: pointer;", {
    label: "cur",
    detail: "cursor: pointer",
    type: "property"
  }),
  snippetCompletion("user-select: none;", {
    label: "usn",
    detail: "user-select: none",
    type: "property"
  }),
  snippetCompletion("width: ${100%};", {
    label: "w",
    detail: "width",
    type: "property"
  }),
  snippetCompletion("height: ${100%};", {
    label: "h",
    detail: "height",
    type: "property"
  }),
  snippetCompletion("margin: ${0};", {
    label: "m",
    detail: "margin",
    type: "property"
  }),
  snippetCompletion("padding: ${0};", {
    label: "p",
    detail: "padding",
    type: "property"
  }),
  snippetCompletion("border-radius: ${4px};", {
    label: "bdrs",
    detail: "border-radius",
    type: "property"
  }),
  snippetCompletion("background-color: ${#fff};", {
    label: "bgc",
    detail: "background-color",
    type: "property"
  }),
  snippetCompletion("color: ${#000};", {
    label: "c",
    detail: "color",
    type: "property"
  }),
  snippetCompletion("font-size: ${1rem};", {
    label: "fz",
    detail: "font-size",
    type: "property"
  }),
  snippetCompletion("font-weight: ${600};", {
    label: "fw",
    detail: "font-weight",
    type: "property"
  }),
  snippetCompletion("text-align: ${center};", {
    label: "ta",
    detail: "text-align",
    type: "property"
  }),
  snippetCompletion("opacity: ${0.5};", {
    label: "op",
    detail: "opacity",
    type: "property"
  }),
  snippetCompletion("z-index: ${10};", {
    label: "z",
    detail: "z-index",
    type: "property"
  })
];

/*
  Prefixes: html5, link, script, img, a, div, form, input, button, ul, nav, table, sp, p, label,
  select, textarea, section, header, footer, comment, video.
*/
const htmlSnippets = [
  snippetCompletion(
    '<!doctype html>\n<html lang="${en}">\n<head>\n\t<meta charset="UTF-8" />\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\t<title>${Document}</title>\n</head>\n<body>\n\t${}\n</body>\n</html>',
    { label: "html5", detail: "boilerplate", type: "keyword" }
  ),
  snippetCompletion('<link rel="stylesheet" href="${styles.css}" />', {
    label: "link",
    detail: "stylesheet",
    type: "keyword"
  }),
  snippetCompletion('<script src="${script.js}"></script>', {
    label: "script",
    detail: "external script",
    type: "keyword"
  }),
  snippetCompletion('<img src="${src}" alt="${alt}" />', {
    label: "img",
    detail: "image",
    type: "keyword"
  }),
  snippetCompletion('<a href="${href}">${text}</a>', {
    label: "a",
    detail: "anchor",
    type: "keyword"
  }),
  snippetCompletion('<div class="${class}">\n\t${}\n</div>', {
    label: "div",
    detail: "div with class",
    type: "keyword"
  }),
  snippetCompletion(
    '<form action="${action}" method="${post}">\n\t${}\n\t<button type="submit">${Submit}</button>\n</form>',
    {
      label: "form",
      detail: "form",
      type: "keyword"
    }
  ),
  snippetCompletion(
    '<input type="${text}" name="${name}" placeholder="${placeholder}" />',
    {
      label: "input",
      detail: "input field",
      type: "keyword"
    }
  ),
  snippetCompletion('<button type="${button}">${text}</button>', {
    label: "button",
    detail: "button",
    type: "keyword"
  }),
  snippetCompletion("<ul>\n\t<li>${}</li>\n</ul>", {
    label: "ul",
    detail: "unordered list",
    type: "keyword"
  }),
  snippetCompletion("<nav>\n\t${}\n</nav>", {
    label: "nav",
    detail: "navigation",
    type: "keyword"
  }),
  snippetCompletion(
    "<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>${Header}</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>${}</td>\n\t\t</tr>\n\t</tbody>\n</table>",
    {
      label: "table",
      detail: "table skeleton",
      type: "keyword"
    }
  ),
  snippetCompletion("<span>${text}</span>", {
    label: "sp",
    detail: "span",
    type: "keyword"
  }),
  snippetCompletion("<p>${text}</p>", {
    label: "p",
    detail: "paragraph",
    type: "keyword"
  }),
  snippetCompletion('<label for="${id}">${text}</label>', {
    label: "label",
    detail: "label",
    type: "keyword"
  }),
  snippetCompletion(
    '<select name="${name}">\n\t<option value="${value}">${text}</option>\n</select>',
    {
      label: "select",
      detail: "select + option",
      type: "keyword"
    }
  ),
  snippetCompletion('<textarea name="${name}" rows="${4}"></textarea>', {
    label: "textarea",
    detail: "textarea",
    type: "keyword"
  }),
  snippetCompletion("<section>\n\t${}\n</section>", {
    label: "section",
    detail: "section",
    type: "keyword"
  }),
  snippetCompletion("<header>\n\t${}\n</header>", {
    label: "header",
    detail: "header",
    type: "keyword"
  }),
  snippetCompletion("<footer>\n\t${}\n</footer>", {
    label: "footer",
    detail: "footer",
    type: "keyword"
  }),
  snippetCompletion("<!-- ${comment} -->", {
    label: "comment",
    detail: "HTML comment",
    type: "keyword"
  }),
  snippetCompletion('<video src="${src}" controls></video>', {
    label: "video",
    detail: "video",
    type: "keyword"
  })
];

/*
  Registers the snippet lists above as extra "autocomplete" language data on the same language
  singletons Sandpack's javascript()/css()/html() calls wrap — additive, not a replacement.
*/
export const sandboxSnippetExtensions: Extension[] = [
  javascriptLanguage.data.of({ autocomplete: completeFromList(jsSnippets) }),
  cssLanguage.data.of({ autocomplete: completeFromList(cssSnippets) }),
  htmlLanguage.data.of({ autocomplete: completeFromList(htmlSnippets) })
];
