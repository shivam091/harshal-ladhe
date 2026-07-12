import { JSX } from "react";
import { WaveDividerIcon } from "@/components/Icon";
import { DividerRoot } from "@/components/SignOff/PageSignOff/PageSignOff.styles";

// Renders a closing signoff blurb at the bottom of a page.
export default function PageSignOff(): JSX.Element {
  return (
    <>
      <DividerRoot aria-hidden="true">
        <WaveDividerIcon />
      </DividerRoot>
    </>
  );
}
