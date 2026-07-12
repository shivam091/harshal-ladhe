import type { ElementType, JSX } from "react";
import type { VisuallyHiddenProps } from "@/types/visually-hidden";
import * as styles from "@/components/VisuallyHidden/VisuallyHidden.styles";

// Polymorphic visually-hidden wrapper — clips content off-screen but keeps it in the accessibility tree for screen readers.
export default function VisuallyHidden<T extends ElementType = "span">({
  as,
  children,
  className,
  ...props
}: VisuallyHiddenProps<T>): JSX.Element {
  const Tag = (as ?? "span") as ElementType;
  return (
    <>
      <Tag
        className={[styles.srOnly, className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </Tag>
    </>
  );
}

VisuallyHidden.displayName = "VisuallyHidden";
