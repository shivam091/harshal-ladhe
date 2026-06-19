// Shape of a single FAQ entry.
export interface FAQ {
  question: string;
  answer: string;
}

// Props accepted by the ContactFAQ component.
export interface ContactFAQProps {
  // List of FAQ entries to render as collapsible items.
  faqs: FAQ[];
}
