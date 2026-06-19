import type { JSX } from "react";
import type {Metadata } from "next";
import ContactForm from "./ContactForm";
import ContactFAQ from "./ContactFAQ";
import { faqs } from "@/data/faqs";
import {
  ContactFormSection,
  ContactIntro,
  ContactLayout,
  ResponsiveHint
} from "@/app/(site)/(internal)/contact/contact.styles";

export const metadata: Metadata = {
  title: "Contact Harshal",
  description: "Have questions or feedback? Browse FAQs or reach out directly through the contact form. Let's connect and collaborate on web development ideas.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Harshal",
    description: "Have questions or feedback? Browse FAQs or reach out directly through the contact form. Let's connect and collaborate on web development ideas.",
    url: "/contact",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Contact Harshal",
    description: "Have questions or feedback? Browse FAQs or reach out directly through the contact form. Let's connect and collaborate on web development ideas."
  }
};

export default function ContactPage(): JSX.Element {
  return (
    <>
      <ContactLayout>
        <ContactIntro>
          <p>
            I&apos;d love to hear from you! Whether it&apos;s feedback, a question about a post,
            or a collaboration idea, feel free to reach out. I always enjoy connecting with
            readers — just use the form below to share your questions, comments, or ideas.
          </p>
          <p>
            If you have a question, please check the <strong>Frequently Asked Questions</strong>{" "}
            <ResponsiveHint data-show="desktop">over on the right</ResponsiveHint>
            <ResponsiveHint data-show="mobile">below</ResponsiveHint>
            {" "}— you might find the answer you&apos;re looking for.
          </p>
        </ContactIntro>

        <ContactFAQ faqs={faqs} />

        <ContactFormSection>
          <ContactForm />
        </ContactFormSection>
      </ContactLayout>
    </>
  );
}
