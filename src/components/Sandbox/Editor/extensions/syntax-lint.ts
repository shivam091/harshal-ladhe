import { syntaxTree } from "@codemirror/language";
import type { Extension, Text } from "@codemirror/state";
import { setDiagnostics, type Diagnostic } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import type { SyntaxNode } from "@lezer/common";

/*
  Text of a JSXOpenTag/JSXFragmentTag/JSXCloseTag's name, or "" for a nameless fragment tag —
  the name node's type varies (JSXIdentifier, member expression, namespaced, builtin), so this
  compares by source text rather than trying to match every possible shape.
*/
function jsxTagName(tag: SyntaxNode, doc: Text): string {
  const start = tag.getChild("JSXStartTag") ?? tag.getChild("JSXStartCloseTag");
  const nameNode = start?.nextSibling;
  if (!nameNode || nameNode.name === "JSXEndTag") return "";
  return doc.sliceString(nameNode.from, nameNode.to);
}

/*
  Syntax-error linting — CodeMirror's language grammars (CSS/HTML/JS/etc, via Lezer) mark most
  things they can't parse with an error node while recovering instead of throwing, but none of
  @codemirror/lang-css, @codemirror/lang-html, etc. surface that as a lint diagnostic on their
  own. This walks the parse tree and turns each into one — catches extra/missing braces and other
  structural breaks. Since Sandpack maps .scss/.less to the plain CSS grammar (no real SCSS
  support), SCSS-only syntax can false-positive here.
*/
export function computeSyntaxDiagnostics(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  /*
    Ranges of a misparsed missing-semicolon block (see below) — generic error nodes that fall
    inside one are redundant with its own diagnostic and get filtered out at the end.
  */
  const missingSemicolonRanges: { from: number; to: number }[] = [];

  syntaxTree(view.state).iterate({
    enter(nodeRef) {
      if (nodeRef.type.isError) {
        diagnostics.push({
          from: nodeRef.from,
          to: Math.max(nodeRef.to, nodeRef.from + 1),
          severity: "error",
          message: "Syntax error"
        });
        return;
      }

      /*
        HTML's grammar mimics the HTML5 spec's own error-recovery rules, where an unclosed or
        mismatched tag auto-closes instead of failing to parse — so it never shows up as an
        `isError` node. A mismatched (wrong name) or orphaned (no matching opener) closing tag is
        its own named node, MismatchedCloseTag; a genuinely unclosed tag instead shows up as an
        Element with an OpenTag but no CloseTag (a self-closed/void element like <img> gets a
        SelfClosingTag instead of OpenTag, so it's naturally excluded here).
      */
      if (nodeRef.name === "MismatchedCloseTag") {
        diagnostics.push({
          from: nodeRef.from,
          to: nodeRef.to,
          severity: "error",
          message: "Mismatched or unexpected closing tag"
        });
        return;
      }

      if (nodeRef.name === "Element") {
        const element = nodeRef.node;
        const openTag = element.getChild("OpenTag");
        if (openTag && !element.getChild("CloseTag")) {
          const tagName = openTag.getChild("TagName") ?? openTag;
          diagnostics.push({
            from: tagName.from,
            to: tagName.to,
            severity: "error",
            message: "Unclosed tag"
          });
        }
        return;
      }

      // A `&` that never resolves to a valid entity — unterminated (no `;`) or an unknown name.
      if (nodeRef.name === "InvalidEntity") {
        diagnostics.push({
          from: nodeRef.from,
          to: nodeRef.to,
          severity: "error",
          message: "Invalid or unterminated character reference"
        });
        return;
      }

      // Tag or closing tag cut off (e.g. by EOF) before it could finish parsing.
      if (nodeRef.name === "IncompleteTag") {
        diagnostics.push({
          from: nodeRef.from,
          to: nodeRef.to,
          severity: "error",
          message: "Incomplete tag"
        });
        return;
      }

      if (nodeRef.name === "IncompleteCloseTag") {
        diagnostics.push({
          from: nodeRef.from,
          to: nodeRef.to,
          severity: "error",
          message: "Incomplete closing tag"
        });
        return;
      }

      /*
        Unlike HTML, JSX's own grammar never checks that a close tag's name matches its open
        tag's — `<div>hi</span>` parses with no error node at all. This cross-checks the two
        names (and, for an unclosed tag, that a close/self-close tag exists at all) the same way
        the HTML checks above do for MismatchedCloseTag/unclosed Element.
      */
      if (nodeRef.name === "JSXElement") {
        const element = nodeRef.node;
        const openTag = element.getChild("JSXOpenTag") ?? element.getChild("JSXFragmentTag");
        const closeTag = element.getChild("JSXCloseTag");

        if (openTag && !closeTag) {
          const nameNode = (openTag.getChild("JSXStartTag") ?? openTag.getChild("JSXStartCloseTag"))
            ?.nextSibling;
          const target = nameNode && nameNode.name !== "JSXEndTag" ? nameNode : openTag;
          diagnostics.push({
            from: target.from,
            to: target.to,
            severity: "error",
            message: "Unclosed JSX tag"
          });
          return;
        }

        if (openTag && closeTag) {
          const openName = jsxTagName(openTag, view.state.doc);
          const closeName = jsxTagName(closeTag, view.state.doc);
          if (openName !== closeName) {
            diagnostics.push({
              from: closeTag.from,
              to: closeTag.to,
              severity: "error",
              message: openName
                ? `Mismatched JSX closing tag: expected </${openName}>`
                : "Mismatched JSX closing tag: expected a fragment close </>"
            });
          }
        }
        return;
      }

      /*
        A property with a `:` but no value (e.g. `color: ;`) parses cleanly — the grammar
        allows an empty value, so it never shows up as an error node on its own.
      */
      if (nodeRef.name === "Declaration") {
        const colon = nodeRef.node.getChild(":");
        if (colon) {
          let hasValue = false;
          for (let sibling = colon.nextSibling; sibling; sibling = sibling.nextSibling) {
            if (sibling.name !== "Important") {
              hasValue = true;
              break;
            }
          }
          if (!hasValue) {
            diagnostics.push({
              from: colon.to,
              to: Math.max(nodeRef.node.to, colon.to + 1),
              severity: "error",
              message: "Missing value for property"
            });
          }
        }
        return;
      }

      /*
        A RuleSet always requires a Block per the grammar (`selector Block`). When a declaration
        is missing its terminating `;`, the parser instead reinterprets `prop: value next: value`
        as a nested ruleset whose "selector" is `prop: value` misread as a tag/pseudo-class pair —
        and since there's no `{` to match, that nested RuleSet ends up with no Block child. A
        legitimately nested rule (`div:hover { ... }`, `&:hover { ... }`) always has one, so
        absence of a Block child on a nested RuleSet is a reliable missing-semicolon fingerprint.
      */
      if (nodeRef.name === "RuleSet") {
        const ruleSet = nodeRef.node;
        if (ruleSet.parent?.name === "Block" && !ruleSet.getChild("Block")) {
          missingSemicolonRanges.push({ from: ruleSet.from, to: ruleSet.to });
          diagnostics.push({
            from: ruleSet.from,
            to: ruleSet.to,
            severity: "error",
            message: "Missing semicolon before this declaration"
          });
        }
      }
    }
  });

  return diagnostics.filter((diagnostic) => {
    if (diagnostic.message !== "Syntax error") return true;
    return !missingSemicolonRanges.some(
      (range) => diagnostic.from >= range.from && diagnostic.to <= range.to + 1
    );
  });
}

/*
  Re-lints on every edit, merging in whatever bundler-reported diagnostic is currently active per
  `getBundlerDiagnostics` — @codemirror/lint's setDiagnostics() fully replaces the diagnostics
  list, so anything else driving it manually (see SandboxCodeEditor's error-line effect, which
  folds computeSyntaxDiagnostics back in on its side) has to merge too, or one clobbers the other.
*/
export function createSyntaxLintExtension(getBundlerDiagnostics: () => Diagnostic[]): Extension {
  return EditorView.updateListener.of((update) => {
    if (!update.docChanged) return;

    const diagnostics = [
      ...computeSyntaxDiagnostics(update.view),
      ...getBundlerDiagnostics()
    ];
    update.view.dispatch(setDiagnostics(update.view.state, diagnostics));
  });
}
