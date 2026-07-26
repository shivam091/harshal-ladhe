import { JSX } from "react";
import Icon from "@/components/Icon/Icon";
import {
  getIconForMethod,
  stripBundlerStack,
  stringify
} from "@/components/Sandbox/PreviewPanel/Console/Log/Log.helpers";
import type { LogProps } from "@/interfaces/sandbox";
import {
  Wrapper,
  IconWrapper,
  Content,
  Message,
  ObjectDump
} from "@/components/Sandbox/PreviewPanel/Console/Log/Log.styles";

/*
  Renders one console entry as plain, color-coded text, matching how a browser console looks —
  rather than Sandpack's default of syntax-highlighted, quoted code tokens.
*/
export default function Log({ entry }: LogProps): JSX.Element {
  const { method, data } = entry;
  const iconName = getIconForMethod(method);

  return (
    <>
      <Wrapper data-method={method}>
        {iconName && (
          <IconWrapper>
            <Icon name={iconName} size={16} />
          </IconWrapper>
        )}
        <Content>
          {data.map((value, index) =>
            typeof value === "string" ? (
              <Message key={index}>{stripBundlerStack(value)}</Message>
            ) : (
              <ObjectDump key={index}>{stringify(value)}</ObjectDump>
            )
          )}
        </Content>
      </Wrapper>
    </>
  );
}

Log.displayName = "Log";
