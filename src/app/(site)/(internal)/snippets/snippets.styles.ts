import { styled } from "@linaria/react";
import { introParagraphCss } from "@/components/common.styles";

export const SnippetsSection = styled.section`
  ${introParagraphCss}
`;

// Lets a too-narrow viewport scroll the table instead of squeezing its columns unreadable.
export const SnippetsTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-block-start: 1rem;
`;

// Keeps the table pinned to its container's full width and each column's share predictable, regardless of how much content a cell holds.
export const SnippetsTable = styled.table`
  width: 100%;
  min-inline-size: 40rem;
  table-layout: fixed;
  border-collapse: collapse;

  th {
    padding: 0.75rem 1rem;
    background: var(--color-bg-cloud-300);
    color: var(--color-fg-accent-muted);
    font-size: 0.875rem;
    text-align: left;
  }

  th:first-child {
    border-start-start-radius: 0.375rem;
  }

  th:last-child {
    border-start-end-radius: 0.375rem;
  }

  th:nth-child(1) {
    inline-size: 8%;
  }

  th:nth-child(2) {
    inline-size: 38%;
  }

  th:nth-child(3) {
    inline-size: 18%;
  }

  th:nth-child(4),
  th:nth-child(5) {
    inline-size: 18%;
  }
`;

// Lets long titles wrap instead of forcing the row (and table) wider, while short fixed-format values stay on one line for a clean, scannable row.
export const SnippetRow = styled.tr`
  a {
    color: var(--color-fg-default);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  td {
    padding: 0.75rem 1rem;
    border-block-end: 0.0625rem solid var(--color-border-default);
    overflow-wrap: break-word;
  }

  td:nth-child(3),
  td:nth-child(4),
  td:nth-child(5) {
    white-space: nowrap;
  }
`;
