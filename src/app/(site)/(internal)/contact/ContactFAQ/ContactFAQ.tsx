"use client";

import { JSX } from "react";
import Collapse from "@/components/Collapse";
import Sparkles from "@/components/Sparkles";
import { slugify } from "@/utils/string";
import { markdownToHtml } from "@/utils/markdown";
import type { IconPlusState } from "@/types/icons/plus";
import { ContactFAQProps } from "@/interfaces/contact-faq";
import IconPlus from "@/icons/IconPlus";
import {
  FAQHeading,
  FAQList,
  FAQRoot,
  IconWrapper
} from "@/app/(site)/(internal)/contact/ContactFAQ/ContactFAQ.styles";

// Renders the FAQ sidebar as a list of animated Collapse items with a morphing plus/chevron icon.
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
                  // Derive icon state from collapse interaction: pressed → flat, open → chevron, default → plus.
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
