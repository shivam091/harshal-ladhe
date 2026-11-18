import type { JSX } from "react";
import type { Metadata } from "next";
import RegexTester from "@/components/RegexTester";
import Details from "@/components/Details";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Regex Tester";
const DESCRIPTION =
  "Live regex tester — match a pattern against real text as you type, see numbered and named capture groups highlighted directly in the string, and read a plain-English breakdown of what the pattern actually does.";
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/regex-tester"
});

// Static server component wrapper, so the explanatory copy renders on the server and only RegexTester itself ships as client code.
export default function RegexTesterPage(): JSX.Element {
  return (
    <>
      <p>
        A regular expression is easy to write and hard to trust — the only way to really know what
        one does is to run it against real text and see what lights up. This tester does exactly
        that: type a pattern and its flags, paste in a test string, and every match is marked up
        live directly in the text, with numbered and named capture groups called out right where
        they were captured, rather than left as an abstract list you have to cross-reference by eye.
      </p>
      <p>
        Every match also gets its own breakdown of captures, and the pattern itself is read back
        piece by piece in plain English — a group, a quantifier, a character class — so a dense
        pattern like <code>(?&lt;year&gt;\d{"{4}"})-(?&lt;month&gt;\d{"{2}"})</code> stops being a
        wall of punctuation and starts reading like a sentence. An invalid pattern surfaces its
        exact error inline, right where it was typed.
      </p>
      <p>
        Once a pattern is right, export it straight into JavaScript, Ruby, Python, or Java source.
      </p>

      <RegexTester />

      <h2 id="how-to-use">How to use</h2>
      <ol>
        <li>
          Type your pattern between the slashes in the <em>Pattern</em> panel, without the
          surrounding <code>/</code> delimiters. Write it as you would inside a JavaScript regex
          literal, for example <code>\d{"{3}"}-\d{"{4}"}</code>. Not sure where to start? Pick a
          preset such as <em>Email address</em> or <em>URL (http/https)</em>.
        </li>
        <li>
          Toggle the flag pins you need:
          <ul>
            <li>
              <code>g</code> (global) finds every match rather than stopping at the first.
            </li>
            <li>
              <code>i</code> ignores case.
            </li>
            <li>
              <code>m</code> makes <code>^</code> and <code>$</code> match at each line break.
            </li>
            <li>
              <code>s</code> lets <code>.</code> match newlines too.
            </li>
            <li>
              <code>u</code> turns on full Unicode handling.
            </li>
            <li>
              <code>y</code> (sticky) only matches from the exact position where the last match
              ended.
            </li>
          </ul>
        </li>
        <li>
          Paste or type the text you want to search into <em>Test string</em>. Every match is
          highlighted in place, a small count marks matches that captured groups, and the summary
          line tells you how many matches there are in total. If the pattern is invalid, the error
          appears under the pattern field instead.
        </li>
        <li>
          Look through <em>Captures</em> to see each match&apos;s position and every numbered or
          named group it captured. A group that didn&apos;t take part in a match shows as{" "}
          <em>(not captured)</em>.
        </li>
        <li>
          Read the <em>Explanation</em> panel for a piece-by-piece, plain-English reading of the
          pattern. It&apos;s the quickest way to spot a quantifier or group that isn&apos;t doing
          what you thought.
        </li>
        <li>
          Choose <em>JavaScript</em>, <em>Ruby</em>, <em>Python</em> or <em>Java</em> in the export
          panel and copy the snippet. Each one is already escaped for that language. Ruby, Python
          and Java only carry over <code>i</code>, <code>m</code> and <code>s</code> (Ruby&apos;s
          dot-matches-newline flag is spelled <code>m</code>), since none of them has a global or
          sticky flag: Python&apos;s <code>findall</code>, Ruby&apos;s <code>scan</code> and
          Java&apos;s <code>Matcher.find()</code> loop already search the whole string.
        </li>
      </ol>

      <h2 id="syntax-cheat-sheet">Syntax cheat sheet</h2>
      <p>
        The tester uses your browser&apos;s own regular-expression engine, so anything that works
        in a JavaScript regex literal works here. These are the building blocks you will use
        most.
      </p>
      <table>
        <thead>
          <tr>
            <th>Syntax</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>.</code>
            </td>
            <td>Any character except a line break (add the <code>s</code> flag to include those).</td>
          </tr>
          <tr>
            <td>
              <code>\d</code> <code>\w</code> <code>\s</code>
            </td>
            <td>A digit, a word character (letters, digits, underscore) and a whitespace character. The capitals invert them.</td>
          </tr>
          <tr>
            <td>
              <code>[abc]</code> <code>[a-z]</code> <code>[^abc]</code>
            </td>
            <td>Any one character from the set, from the range, or <em>not</em> in the set.</td>
          </tr>
          <tr>
            <td>
              <code>^</code> <code>$</code>
            </td>
            <td>The start and end of the string, or of each line with the <code>m</code> flag.</td>
          </tr>
          <tr>
            <td>
              <code>\b</code>
            </td>
            <td>A word boundary: the gap between a word character and a non-word character.</td>
          </tr>
          <tr>
            <td>
              <code>*</code> <code>+</code> <code>?</code>
            </td>
            <td>Zero or more, one or more, and zero or one of the thing before them.</td>
          </tr>
          <tr>
            <td>
              <code>{"{3}"}</code> <code>{"{2,5}"}</code> <code>{"{3,}"}</code>
            </td>
            <td>Exactly 3, between 2 and 5, and at least 3.</td>
          </tr>
          <tr>
            <td>
              <code>(…)</code> <code>{"(?<name>…)"}</code> <code>(?:…)</code>
            </td>
            <td>A numbered capture group, a named capture group, and a group that only groups.</td>
          </tr>
          <tr>
            <td>
              <code>a|b</code>
            </td>
            <td>Either <code>a</code> or <code>b</code>.</td>
          </tr>
          <tr>
            <td>
              <code>(?=…)</code> <code>(?!…)</code>
            </td>
            <td>Lookahead: what follows must (or must not) match, without being consumed.</td>
          </tr>
          <tr>
            <td>
              <code>{"(?<=…)"}</code> <code>{"(?<!…)"}</code>
            </td>
            <td>Lookbehind: what comes before must (or must not) match.</td>
          </tr>
          <tr>
            <td>
              <code>\1</code> <code>{"\\k<name>"}</code>
            </td>
            <td>A backreference to an earlier numbered or named group.</td>
          </tr>
        </tbody>
      </table>

      <h2 id="capture-groups">Capture groups, numbered and named</h2>
      <p>
        Wrapping part of a pattern in parentheses does two jobs: it groups, so a quantifier can
        apply to the whole thing, and it <em>captures</em>, so you can pull that part of the match
        back out. Groups are numbered by the position of their opening bracket, left to right, and
        a named group is also one of the numbered ones. The tester shows both views side by side,
        because the first is what older code uses and the second is what you would rather read.
      </p>
      <p>
        Try the <em>ISO date (named groups)</em> preset. For the text <code>2024-03-02</code>, the
        pattern <code>{"(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})"}</code> captures{" "}
        <code>2024</code> as group 1 (<code>year</code>), <code>03</code> as group 2 (
        <code>month</code>) and <code>02</code> as group 3 (<code>day</code>). In JavaScript you
        would read them as <code>match.groups.year</code>, or refer to them in a replacement as{" "}
        <code>{"$<year>"}</code>.
      </p>
      <p>
        A group that sits on an alternative that did not match, such as the first group in{" "}
        <code>(a)|(b)</code> against <code>b</code>, is <em>not captured</em>. It comes back as
        undefined rather than as an empty string, which is why the Captures panel labels it
        separately.
      </p>

      <h2 id="greedy-and-lazy">Greedy versus lazy quantifiers</h2>
      <p>
        By default quantifiers are <strong>greedy</strong>: they take as much text as they can and
        only give some back if the rest of the pattern needs it. Against{" "}
        <code>&lt;b&gt;one&lt;/b&gt; and &lt;b&gt;two&lt;/b&gt;</code>, the pattern{" "}
        <code>&lt;b&gt;.+&lt;/b&gt;</code> matches the entire string as a single hit, because{" "}
        <code>.+</code> runs to the very end before backing off to the last closing tag.
      </p>
      <p>
        Adding a <code>?</code> after the quantifier makes it <strong>lazy</strong>, so it takes as
        little as possible. <code>&lt;b&gt;.+?&lt;/b&gt;</code> now finds the two tags
        separately. When a pattern matches far more than you meant it to, this is the first thing
        to check, and the highlighting makes the over-reach obvious at a glance.
      </p>

      <h2 id="catastrophic-backtracking">Catastrophic backtracking</h2>
      <p>
        Some patterns can take exponentially longer with every extra character, usually because
        a quantified group contains another quantifier that can match the same text in several
        ways. <code>(a+)+$</code> against a long run of <code>a</code>s followed by a{" "}
        <code>!</code> is the textbook example: the engine tries every way of splitting the
        letters between the inner and outer <code>+</code> before it gives up.
      </p>
      <p>
        On a normal page that would freeze the tab, because a running regex cannot be interrupted.
        Here, matching runs in a background worker. If a pattern is still going after a second,
        the worker is stopped and you get a warning instead of a hung page, and the next edit
        starts a fresh one. In real code the same pattern could hang a server, so the fix is the
        same: rewrite it so each character can only be matched one way, for instance{" "}
        <code>a+$</code>.
      </p>

      <h2 id="across-languages">When you move it to another language</h2>
      <p>
        Matching here always uses the JavaScript engine, and the other three tabs translate the
        pattern for you on a best-effort basis. The dialects are close cousins rather than
        twins, so it is worth knowing what the export changes and what it cannot:
      </p>
      <ul>
        <li>
          <strong>Ruby</strong> treats <code>^</code> and <code>$</code> as line anchors always,
          so without the <code>m</code> flag they are swapped for <code>\A</code> and{" "}
          <code>\z</code> to keep meaning &ldquo;whole string&rdquo;. Ruby&apos;s <code>m</code> flag
          means dot-matches-newline, which is JavaScript&apos;s <code>s</code>, and the export maps
          it for you.
        </li>
        <li>
          <strong>Python</strong> spells named groups <code>{"(?P<name>…)"}</code> and
          backreferences <code>(?P=name)</code>, and the export rewrites them. Its built-in{" "}
          <code>re</code> module has no <code>\p{"{L}"}</code> Unicode property classes, so a note
          is added to the snippet where your pattern uses them.
        </li>
        <li>
          <strong>Java</strong> lives inside string literals, so every backslash is doubled and
          quotes are escaped. A code point above U+FFFF written as <code>{"\\u{1F600}"}</code>{" "}
          becomes <code>{"\\x{1F600}"}</code>.
        </li>
        <li>
          <strong>Flags</strong> map where an equivalent exists (<code>i</code>, <code>m</code>,{" "}
          <code>s</code>). <code>g</code> and <code>y</code> have no counterpart outside
          JavaScript, because those languages choose between &ldquo;first match&rdquo; and
          &ldquo;all matches&rdquo; in the function you call, so they are dropped.
        </li>
      </ul>
      <p>
        Treat the exports as a head start, then run the snippet against a few real inputs in the
        target language. Lookbehind, Unicode handling and edge cases around newlines are where the
        engines differ most.
      </p>

      <h2 id="limits-and-privacy">Limits and privacy</h2>
      <p>
        To keep the page responsive, at most the first 500 matches are listed and highlighted,
        and the summary line says so when it truncates. An empty pattern is treated as
        &ldquo;nothing typed yet&rdquo; rather than matching at every position. Everything runs
        in your browser: your pattern and test text are never uploaded, so it is safe to paste
        real log lines or sample data, and nothing is saved between visits.
      </p>

      <h2 id="faq">Frequently asked questions</h2>
      <Details summary="Why does my pattern match in the tester but not in my code?">
        <p>
          Check the flags first: without <code>g</code>, JavaScript stops after the first match,
          and in other languages the function you call decides whether you get one match or all of
          them. After that, look at escaping. A pattern pasted into a Java or Python string needs
          its backslashes handled for that language, which is what the export tabs do for you.
        </p>
      </Details>
      <Details summary="Why do some matches show a thin marker instead of highlighted text?">
        <p>
          Those are empty matches. A pattern such as <code>\b</code> or <code>x*</code> can
          succeed without consuming any characters, so there is nothing to highlight, only a
          position. The marker shows where each one landed, and the summary line mentions them.
        </p>
      </Details>
      <Details summary="What does the sticky (y) flag actually do?">
        <p>
          It anchors every attempt to the exact position where the previous match ended. With{" "}
          <code>gy</code>, the first gap between matches stops the search, which makes it useful for
          tokenisers that must consume the input end to end.
        </p>
      </Details>
      <Details summary="Should I use \d or [0-9]?">
        <p>
          In JavaScript they are the same: <code>\d</code> only ever matches the ASCII digits 0 to
          9, even with the Unicode flag. In some other engines, such as Python&apos;s{" "}
          <code>re</code> and Java with the right flags, <code>\d</code> can match digits from other
          scripts, so <code>[0-9]</code> is the stricter choice if that matters.
        </p>
      </Details>
      <Details summary="Can I validate an email address with a regular expression?">
        <p>
          Only loosely. The <em>Email address</em> preset is a sensible sanity check for obvious
          typos, but the real rules for email are far more permissive than any short pattern, and
          the only genuine test is sending a message to it.
        </p>
      </Details>
    </>
  );
}
