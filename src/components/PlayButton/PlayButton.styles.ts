import { styled } from "@linaria/react";
import Button from "@/components/Button";

/*
  Fixed block-size so it lines up with a neighbouring 2.5rem Select: Button's lg/square combo
  is sized off icon + padding, which otherwise lands a couple of pixels short.
*/
export const Root = styled(Button)`
  block-size: 2.5rem;
  border-radius: 0.375rem;
`;
