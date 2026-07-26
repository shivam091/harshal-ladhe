import { forceParsing, syntaxTree } from "@codemirror/language";
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
  own. This walks the parse tree and turns select cases into diagnostics.

  Deliberately NOT handled here: generic `isError` nodes, and HTML's "Element with an OpenTag but
  no CloseTag" shape (the obvious way to detect an unclosed tag). Both are confirmed to produce
  false positives on real, well-formed sandbox content — @lezer/css, @lezer/html, and
  @lezer/javascript all have a reproducible bug where a corrupted incremental parse leaves stale
  error state that surfaces many rules/elements later in an otherwise valid file (confirmed with a
  single one-shot parse of real files, so it's not specific to this editor's incremental re-lint
  path). Upgrading @lezer/css to its latest patch didn't fix it, and @lezer/html/@lezer/javascript
  are already on latest, so there's no available version fix. The checks below don't rely on
  `isError` or on that Element shape, so they're unaffected.
*/
export function computeSyntaxDiagnostics(view: EditorView): Diagnostic[] {
  /*
    Lezer parses lazily in the background; right after mount (before any real edit triggers a
    docChanged update) syntaxTree() can return a partial tree whose not-yet-parsed tail misreads
    as error nodes — e.g. a nested RuleSet missing its Block child, wrongly flagged below as a
    missing semicolon. Forces the parse to catch up to the full doc first so diagnostics are only
    ever computed against a complete tree.
  */
  forceParsing(view, view.state.doc.length);

  const diagnostics: Diagnostic[] = [];

  syntaxTree(view.state).iterate({
    enter(nodeRef) {
      /*
        HTML's grammar mimics the HTML5 spec's own error-recovery rules, where a mismatched
        closing tag auto-closes instead of failing to parse — so it never shows up as an
        `isError` node. It's its own named node instead, MismatchedCloseTag.
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
        the MismatchedCloseTag check above does for HTML.
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

  return diagnostics;
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
