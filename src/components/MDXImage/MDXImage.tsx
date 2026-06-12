import type { JSX } from "react";
import Image from "next/image";
import type { MDXImageProps } from "@/components/MDXImage/MDXImage.types";
import { imageClass } from "@/components/MDXImage/MDXImage.styles";

// Mirrors images.remotePatterns in next.config.mjs; next/image throws for any other remote host.
const OPTIMIZABLE_REMOTE_HOST = /\.public\.blob\.vercel-storage\.com$/;

// Matches the content column's widest size (80ch), so phones don't download desktop-sized files.
const SIZES = "(width <= 64rem) 100vw, 50rem";

function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_REMOTE_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

/*
  Markdown images carry no dimensions, so width/height 0 with a responsive size lets next/image
  build a srcset from `sizes` while the browser sizes the box from the file; authored dimensions
  are kept when present to reserve space. SVGs skip the optimizer, which would rasterise them.
*/
export default function MDXImage({ src, alt = "", title, width, height }: MDXImageProps): JSX.Element {
  if (typeof src !== "string" || !isOptimizable(src)) {
    // eslint-disable-next-line @next/next/no-img-element -- hosts outside remotePatterns can't go through next/image.
    return <img src={typeof src === "string" ? src : undefined} alt={alt} title={title} loading="lazy" decoding="async" className={imageClass} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={Number(width) || 0}
      height={Number(height) || 0}
      sizes={SIZES}
      unoptimized={src.endsWith(".svg")}
      className={imageClass}
      style={width ? undefined : { inlineSize: "100%", blockSize: "auto" }}
    />
  );
}

MDXImage.displayName = "MDXImage";
