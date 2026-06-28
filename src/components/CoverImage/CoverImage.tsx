"use client";

import type { JSX, MouseEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getContentParams, trackEvent } from "@/lib/analytics";
import type { CoverImageOpenMethod, CoverImageProps } from "@/components/CoverImage/CoverImage.types";
import { coverFigureClass, coverLinkClass, coverImageClass } from "@/components/CoverImage/CoverImage.styles";

// Matches the content column's widest size (80ch), so phones don't download desktop-sized files.
const SIZES = "(width <= 64rem) 100vw, 50rem";

// Named because `button` codes are opaque; 1 is the middle button in every browser.
const MIDDLE_BUTTON = 1;

/*
  Rendered in the page body because Google Images indexes images readers can see, not ones that
  only appear in og:image or JSON-LD. Fetched eagerly at high priority because it is the page's
  LCP element, and optimised because the source PNGs are far too heavy to serve as they are.
  Linked to the original so readers can view it full size, in a new tab so they never lose their
  place in the article.
*/
export default function CoverImage({ image }: CoverImageProps): JSX.Element {
  const pathname = usePathname();

  // Tagged with the page and its content group so cover opens can be compared per content type.
  function track(method: CoverImageOpenMethod): void {
    trackEvent("cover_image_open", {
      event_label: pathname,
      method,
      content_group: getContentParams(pathname).content_group
    });
  }

  // A modifier means the reader chose the tab themselves, so it's reported apart from a plain click.
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    track(event.ctrlKey || event.metaKey || event.shiftKey ? "new_tab" : "click");
  }

  // Middle-click never fires `click`, so without this the most common new-tab open would go unrecorded.
  function handleAuxClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (event.button === MIDDLE_BUTTON) track("new_tab");
  }

  // Browsers never reveal which menu item was picked, so this records intent, not a confirmed open.
  function handleContextMenu(): void {
    track("context_menu");
  }

  /*
    A caption separate from the alt gives Google visible text beside the image, and is left exposed
    to assistive tech because it says something the alt doesn't, rather than repeating it.
  */
  return (
    <>
      <figure className={coverFigureClass}>
        <a
          href={image.path}
          target="_blank"
          rel="noopener"
          className={coverLinkClass}
          onClick={handleClick}
          onAuxClick={handleAuxClick}
          onContextMenu={handleContextMenu}
        >
          <Image
            src={image.path}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={SIZES}
            loading="eager"
            fetchPriority="high"
            className={coverImageClass}
          />
          <VisuallyHidden>(opens full-size image in a new tab)</VisuallyHidden>
        </a>
        <figcaption>{image.caption}</figcaption>
      </figure>
    </>
  );
}

CoverImage.displayName = "CoverImage";
