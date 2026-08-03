import { styled } from "@linaria/react";

// Muted so the form's own default-coloured input row still stands out against it, as it does in the footer.
export const Wrapper = styled.aside`
  margin-block: 2rem;
  padding-block: 1.25rem 0.25rem;
  padding-inline: clamp(1rem, 3vw, 1.5rem);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  background: var(--color-bg-muted);

  @media print {
    display: none;
  }
`;

// Not a real heading, since an id'd h2 inside the post body would be picked up by the table of contents.
export const Title = styled.p`
  margin-block: 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
`;
