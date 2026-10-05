import { styled } from "@linaria/react";

/*
  Scrollable code listing. Capped in height so a long program scrolls inside the panel — the active
  line is kept in view by scrolling this box alone, never the page.
*/
export const CodeScroller = styled.div`
  position: relative;
  max-block-size: 26rem;
  overflow: auto;
  scrollbar-width: thin;
`;

// Line numbers via a CSS counter, so copying the code never picks them up.
export const CodeList = styled.pre`
  margin: 0;
  padding: 0.75rem 0;
  font-family: var(--signal-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  tab-size: 2;
  counter-reset: line;
`;

/*
  One source line with its line number and a signal lamp in the gutter. The active line lights its
  lamp and gets a tinted band, so the line being executed reads like the one route set on a diagram.
*/
export const CodeLine = styled.span`
  position: relative;
  display: block;
  padding-inline: 3.25rem 0.75rem;
  counter-increment: line;
  white-space: pre;
  transition: background 200ms ease;

  &::before {
    content: counter(line);
    position: absolute;
    inset-inline-start: 0.5rem;
    inline-size: 1.5rem;
    text-align: end;
    color: var(--color-fg-muted);
    opacity: 0.7;
  }

  &::after {
    content: "";
    position: absolute;
    inset-inline-start: 2.375rem;
    inset-block-start: 50%;
    inline-size: 0.4375rem;
    block-size: 0.4375rem;
    border-radius: 50%;
    transform: translateY(-50%);
    background: transparent;
  }

  &[data-active="true"] {
    background: color-mix(in oklab, var(--color-fg-attention) 16%, transparent);
  }

  &[data-active="true"]::after {
    background: var(--color-fg-attention);
    box-shadow: 0 0 0.375rem 0.0625rem color-mix(in oklab, var(--color-fg-attention) 70%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Token colours come from the site's own syntax-theme variables, so this hand-rendered listing matches every Shiki-highlighted block on the page.
export const Token = styled.span`
  &[data-type="keyword"] {
    color: var(--color-code-syntax-keyword);
  }
  &[data-type="function"] {
    color: var(--color-code-syntax-function);
  }
  &[data-type="string"] {
    color: var(--color-code-syntax-string);
  }
  &[data-type="number"] {
    color: var(--color-code-syntax-number);
  }
  &[data-type="comment"] {
    color: var(--color-code-syntax-comment);
    font-style: italic;
  }
`;
