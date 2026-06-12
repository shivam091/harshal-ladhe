import type { ImgHTMLAttributes } from "react";

// The attributes markdown `![alt](src "title")` produces, plus explicit dimensions when an author writes them.
export type MDXImageProps = ImgHTMLAttributes<HTMLImageElement>;
