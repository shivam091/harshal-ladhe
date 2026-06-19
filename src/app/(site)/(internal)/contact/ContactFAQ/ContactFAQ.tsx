"use client";

import type { JSX } from "react";
import Collapse from "@/components/Collapse";
import Sparkles from "@/components/Sparkles";
import { slugify } from "@/utils/string";
import { markdownToHtml } from "@/utils/markdown";
import type { IconPlusState } from "@/icons/IconPlus";
import type { FAQ } from "@/data/faqs";
import IconPlus from "@/icons/IconPlus";
import {
  FAQHeading,
  FAQList,
  FAQRoot,
  IconWrapper
} from "@/app/(site)/(internal)/contact/ContactFAQ/ContactFAQ.styles";

// FAQ data is passed in so the list stays content-driven rather than hard-coded.
interface ContactFAQProps {
  faqs: FAQ[];
}

// Collapsible answers keep the sidebar scannable next to the form.
export default function ContactFAQ({ faqs }: ContactFAQProps): JSX.Element {
  return (
    <>
      <FAQRoot aria-label="Frequently asked questions">
        <FAQHeading>
          <Sparkles isToggleable={false} colors={["#FFC700", "#FF8A9B", "#79E0FF"]}>
            Frequently Asked Questions
          </Sparkles>
        </FAQHeading>
        <FAQList>
          {faqs.map((faq, index) => (
            <li key={index}>
              <Collapse
                id={slugify(faq.question)}
                trigger={(isOpen, isPressed) => {
                  // Pressed wins over open so the icon flattens immediately as feedback before it morphs.
                  const iconState: IconPlusState =
                    isPressed ? "flat" : isOpen ? "chevron" : "plus";

                  return (
                    <>
                      <IconWrapper aria-hidden="true">
                        <IconPlus state={iconState} size={20} />
                      </IconWrapper>
                      {faq.question}
                    </>
                  );
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(faq.answer) }} />
              </Collapse>
            </li>
          ))}
        </FAQList>
      </FAQRoot>
    </>
  );
}

ContactFAQ.displayName = "ContactFAQ";
