import { JSX } from "react";
import { stack } from "@/data/stack";
import CoreStackCard from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStackCard";
import { CoreStackGrid } from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStack/CoreStack.styles";

// Renders the core stack as a responsive grid of clickable technology cards.
export default function CoreStack(): JSX.Element {
  return (
    <>
      <CoreStackGrid>
        {stack.map((item) => (
          <CoreStackCard key={item.name} item={item} />
        ))}
      </CoreStackGrid>
    </>
  );
}

CoreStack.displayName = "CoreStack";
