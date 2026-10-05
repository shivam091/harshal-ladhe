"use client";

import { useId } from "react";
import type { ChangeEvent, JSX } from "react";
import { GOOGLE_SNIPPET_MAX_CHARS, GOOGLE_TITLE_MAX_CHARS, isHexColour } from "@/utils/open-graph-text";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { CardInput, CardTextarea, LabelRow, CharCount, FieldPair, ColourRow, UploadRow, FileInput, ClearButton } from "@/components/OpenGraphPreview/MetadataForm/MetadataForm.styles";
import type { MetadataFormProps, OpenGraphFields, OpenGraphType, TwitterCardType } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Plain string fields that share one input shape — listed as data so the form stays one loop rather than ten copies of the same JSX.
type TextFieldKey = Exclude<keyof OpenGraphFields, "description" | "twitterCard" | "ogType" | "themeColor">;

// Options with "" as an explicit "not set" choice, because an imported <head> can genuinely lack the tag and the audit needs to see that.
const TWITTER_CARD_OPTIONS: Array<{ value: TwitterCardType; label: string }> = [
  { value: "summary_large_image", label: "summary_large_image" },
  { value: "summary", label: "summary" },
  { value: "", label: "Not set" }
];

// The handful of og:type values most pages actually use, plus "not set" for the same reason as above.
const OG_TYPE_OPTIONS: Array<{ value: OpenGraphType; label: string }> = [
  { value: "website", label: "website" },
  { value: "article", label: "article" },
  { value: "product", label: "product" },
  { value: "profile", label: "profile" },
  { value: "", label: "Not set" }
];

// Fallback for the native colour swatch, which can't display an empty or malformed value.
const SWATCH_FALLBACK = "#9ca3af";

// The form's edits go through setField while typing and commit on blur, so one undo step covers one field edit rather than one keystroke; selects commit immediately since each change is already a single discrete choice, while the swatch (which streams changes during a drag) commits on blur like a text field.
export default function MetadataForm({ state, actions, localImage, onLocalImageChange }: MetadataFormProps): JSX.Element {
  const id = useId();

  // One renderer for every plain text field, so labels, ids and the type-then-commit-on-blur behaviour can't drift between them.
  const textField = (key: TextFieldKey, label: string, placeholder: string, type: "text" | "url" = "text") => (
    <FieldWrapper>
      <FieldLabel htmlFor={`${id}-${key}`}>{label}</FieldLabel>
      <CardInput
        id={`${id}-${key}`}
        type={type}
        spellCheck={type === "text"}
        placeholder={placeholder}
        value={state[key]}
        onChange={(event) => actions.setField(key, event.target.value)}
        onBlur={actions.commitDrag}
      />
    </FieldWrapper>
  );

  // Clears the input's own value too, so picking the same file again after clearing still fires a change event.
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    onLocalImageChange(file);
    event.target.value = "";
  }

  const titleLength = state.title.trim().length;
  const descriptionLength = state.description.trim().length;

  return (
    <>
      <FieldWrapper>
        <LabelRow>
          <FieldLabel htmlFor={`${id}-title`}>Title</FieldLabel>
          <CharCount id={`${id}-title-count`} data-over={titleLength > GOOGLE_TITLE_MAX_CHARS ? "true" : undefined}>
            {titleLength}/{GOOGLE_TITLE_MAX_CHARS}
          </CharCount>
        </LabelRow>
        <CardInput
          id={`${id}-title`}
          type="text"
          placeholder="What the page is about"
          aria-describedby={`${id}-title-count`}
          value={state.title}
          onChange={(event) => actions.setField("title", event.target.value)}
          onBlur={actions.commitDrag}
        />
      </FieldWrapper>

      <FieldWrapper>
        <LabelRow>
          <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
          <CharCount id={`${id}-description-count`} data-over={descriptionLength > GOOGLE_SNIPPET_MAX_CHARS + 2 ? "true" : undefined}>
            {descriptionLength}/160
          </CharCount>
        </LabelRow>
        <CardTextarea
          id={`${id}-description`}
          placeholder="One or two sentences shown under the title"
          aria-describedby={`${id}-description-count`}
          value={state.description}
          onChange={(event) => actions.setField("description", event.target.value)}
          onBlur={actions.commitDrag}
        />
      </FieldWrapper>

      {textField("url", "Canonical URL", "https://example.com/page", "url")}
      {textField("siteName", "Site name", "Example Site")}

      {textField("imageUrl", "Image URL", "https://example.com/og-image.png", "url")}
      <UploadRow>
        <FileInput type="file" accept="image/*" aria-label="Preview a local image instead" onChange={handleFile} />
        {localImage && (
          <>
            <span>
              Previewing <strong>{localImage.name}</strong> — kept in this tab only.
            </span>
            <ClearButton type="button" onClick={() => onLocalImageChange(null)}>
              Remove
            </ClearButton>
          </>
        )}
      </UploadRow>
      {textField("imageAlt", "Image alt text", "Describe what the image shows")}

      <FieldPair>
        <FieldWrapper>
          <FieldLabel htmlFor={`${id}-twitter-card`}>twitter:card</FieldLabel>
          <SelectWrapper>
            <SelectInput
              id={`${id}-twitter-card`}
              value={state.twitterCard}
              onChange={(event) => actions.commitField("twitterCard", event.target.value as TwitterCardType)}
            >
              {TWITTER_CARD_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>
        <FieldWrapper>
          <FieldLabel htmlFor={`${id}-og-type`}>og:type</FieldLabel>
          <SelectWrapper>
            <SelectInput id={`${id}-og-type`} value={state.ogType} onChange={(event) => actions.commitField("ogType", event.target.value as OpenGraphType)}>
              {OG_TYPE_OPTIONS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>
      </FieldPair>

      <FieldWrapper>
        <FieldLabel htmlFor={`${id}-theme-colour`}>Theme colour</FieldLabel>
        <ColourRow>
          <CardInput
            id={`${id}-theme-colour`}
            type="text"
            spellCheck={false}
            placeholder="#0969da"
            value={state.themeColor}
            onChange={(event) => actions.setField("themeColor", event.target.value)}
            onBlur={actions.commitDrag}
          />
          <ColorInput
            type="color"
            aria-label="Pick a theme colour"
            value={isHexColour(state.themeColor) && state.themeColor.trim().length === 7 ? state.themeColor.trim() : SWATCH_FALLBACK}
            onChange={(event) => actions.setField("themeColor", event.target.value)}
            onBlur={actions.commitDrag}
          />
        </ColourRow>
      </FieldWrapper>

      {textField("faviconUrl", "Favicon URL", "https://example.com/favicon.png", "url")}
      <FieldPair>
        {textField("author", "Author", "Jane Doe")}
        {textField("twitterHandle", "X handle", "@example")}
      </FieldPair>
    </>
  );
}

MetadataForm.displayName = "MetadataForm";
