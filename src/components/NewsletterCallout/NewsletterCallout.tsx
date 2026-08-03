import type { JSX } from "react";
import { useId } from "react";
import NewsletterForm from "@/components/NewsletterForm";
import type { NewsletterCalloutProps } from "@/components/NewsletterCallout/NewsletterCallout.types";
import { Wrapper, Title } from "@/components/NewsletterCallout/NewsletterCallout.styles";

// A reader who just finished (or is deep into) a piece is the likeliest to subscribe, so the form meets them there too.
export default function NewsletterCallout({ source = "article_inline" }: NewsletterCalloutProps): JSX.Element {
  const titleId = useId();

  return (
    <>
      <Wrapper aria-labelledby={titleId}>
        <Title id={titleId}>Enjoying this?</Title>
        <NewsletterForm source={source} />
      </Wrapper>
    </>
  );
}

NewsletterCallout.displayName = "NewsletterCallout";
