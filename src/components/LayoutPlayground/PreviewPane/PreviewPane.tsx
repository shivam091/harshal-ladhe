import type { JSX } from "react";
import { compileContainerStyle, compileItemStyle } from "@/utils/layout-playground";
import type { PreviewPaneProps } from "@/interfaces/layout-playground";
import { PreviewScroller, Container, Item } from "@/components/LayoutPlayground/PreviewPane/PreviewPane.styles";

// Clicking an item in the live preview selects it — the same shortcut StopEditor's draggable handles and BoxShadowGenerator's layer chips both offer, so a user can jump straight to a box's own controls without hunting for it in ItemList.
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  return (
    <>
      <PreviewScroller>
        <Container style={{ ...compileContainerStyle(state), inlineSize: `${state.containerWidth}px` }}>
          {state.items.map((item) => (
            <Item
              key={item.id}
              style={{ background: item.color, ...compileItemStyle(item, state.mode) }}
              data-selected={state.selectedItemId === item.id ? "true" : undefined}
              onClick={() => actions.selectItem(item.id)}
            >
              {item.label}
            </Item>
          ))}
        </Container>
      </PreviewScroller>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
