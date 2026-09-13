import type { JSX } from "react";
import { SHORTHAND_TOKENS } from "@/components/mdx/AnimationShorthandBuilder/AnimationShorthandBuilder.constants";
import {
  Wrapper,
  TokenRow,
  TokenCard,
  TokenValue,
  TokenLabel
} from "@/components/mdx/AnimationShorthandBuilder/AnimationShorthandBuilder.styles";

/*
  A colour-coded breakdown of the 9-token `animation` shorthand string — each positional example
  value paired with the longhand property it fills, in the exact order the browser expects them,
  reducing the "which position is which" load of reading the shorthand as one dense line.
*/
export default function AnimationShorthandBuilder(): JSX.Element {
  return (
    <>
      <Wrapper
        role="img"
        aria-label="The nine animation shorthand tokens, each labeled with the longhand property it corresponds to, in positional order: bounce (animation-name), 1s (animation-duration), ease-out (animation-timing-function), 0s (animation-delay), infinite (animation-iteration-count), alternate (animation-direction), both (animation-fill-mode), running (animation-play-state), auto (animation-timeline)."
      >
        <TokenRow>
          {SHORTHAND_TOKENS.map((token) => (
            <TokenCard key={token.property}>
              <TokenValue>{token.value}</TokenValue>
              <TokenLabel>{token.property}</TokenLabel>
            </TokenCard>
          ))}
        </TokenRow>
      </Wrapper>
    </>
  );
}

AnimationShorthandBuilder.displayName = "AnimationShorthandBuilder";
