import type { JSX } from "react";
import { UNIT_META, UNIT_ORDER } from "@/data/unit-converter-units";
import { NoteList, NoteItem, NoteTerm, NoteResolves, NoteBody } from "@/components/UnitConverter/UnitNotes/UnitNotes.styles";
import { SectionCard, PanelTitle } from "@/components/UnitConverter/UnitConverter.styles";
import type { UnitNotesProps } from "@/components/UnitConverter/UnitConverter.types";

// Every unit's "relative to what" note on show at once, with the active one highlighted — the numbers above are only correct if the context matches where the CSS will actually land.
export default function UnitNotes({ state }: UnitNotesProps): JSX.Element {
  return (
    <>
      <SectionCard>
        <PanelTitle>Where each unit resolves</PanelTitle>
        <NoteList>
          {UNIT_ORDER.map((unit) => {
            const meta = UNIT_META[unit];
            return (
              <NoteItem key={unit} data-active={unit === state.sourceUnit ? "true" : undefined}>
                <NoteTerm>
                  <code>{unit}</code>
                  <NoteResolves>{meta.resolvesAgainst}</NoteResolves>
                </NoteTerm>
                <NoteBody>{meta.note}</NoteBody>
              </NoteItem>
            );
          })}
        </NoteList>
      </SectionCard>
    </>
  );
}

UnitNotes.displayName = "UnitNotes";
