import { styled } from "@linaria/react";

// Two-column named-area grid — collapses to single column on narrow containers.
export const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "contact-intro    contact-questions"
    "contact-section  contact-questions";
  gap: var(--space-lg);

  @container (width < 48rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "contact-intro"
      "contact-questions"
      "contact-section";
  }
`;

// Intro copy above the form — paragraph spacing applied to consecutive paragraphs.
export const ContactIntro = styled.div`
  grid-area: contact-intro;
  line-height: var(--line-height-paragraph);

  p + p {
    margin-block-start: var(--space-base);
  }
`;

// Conditional span — switches between desktop and mobile copy text via data-show attribute.
export const ResponsiveHint = styled.span`
  &[data-show="desktop"] {
    display: inline;

    @container (width < 48rem) {
      display: none;
    }
  }

  &[data-show="mobile"] {
    display: none;

    @container (width < 48rem) {
      display: inline;
    }
  }
`;

// Form section wrapper — sticky below the header so the form follows long FAQ content.
export const ContactFormSection = styled.div`
  grid-area: contact-section;
  position: sticky;
  inset-block-start: calc(var(--header-height) + var(--space-base));
  align-self: start;
`;
