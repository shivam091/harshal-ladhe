import type { JSX } from "react";
import { stack } from "@/data/stack";
import CoreStackCard from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStackCard";
import { CoreStackGrid } from "@/app/(site)/(internal)/how-did-i-build-my-blog/CoreStack/CoreStack.styles";

// Driven by the stack data file so the list can change without touching the post's MDX.
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
