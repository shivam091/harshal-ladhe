import { styled } from "@linaria/react";

// FAQ spans both rows beside intro and form; stacks on narrow containers, with FAQs before the form.
export const ContactLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "contact-intro    contact-questions"
    "contact-section  contact-questions";
  gap: 1.5rem;

  @container (width < 48rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "contact-intro"
      "contact-questions"
      "contact-section";
  }
`;

// Spacing only between paragraphs so the intro sits flush with the grid's top edge.
export const ContactIntro = styled.div`
  grid-area: contact-intro;
  line-height: 1.75;

  p + p {
    margin-block-start: 1rem;
  }
`;

// Directional copy ("on the right" vs "below") has to match where the FAQ lands in the current layout.
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

// Sticky below the header so the form stays in view while reading long FAQ content.
export const ContactFormSection = styled.div`
  grid-area: contact-section;
  position: sticky;
  inset-block-start: calc(5rem + 1rem);
  align-self: start;
`;
