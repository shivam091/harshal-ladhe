import { iconSpritePresets, starterIcons } from "@/data/icon-sprite-builder-presets";
import { resolveIds, suggestIdFromSource, uniqueId } from "@/components/IconSpriteBuilder/IconSpriteBuilder.utils";
import type {
  IconSpriteEditorState,
  IconSpriteOptions,
  IconSpritePresetMeta,
  IconSpriteShareableState,
  PresetIcon,
  ShareableIcon,
  SpriteIcon,
  StarterIcon
} from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

/*
  Encoded permalinks longer than this stop being reliable — some chat apps and proxies truncate
  URLs past roughly 8 kB — so ShareControls offers the download and local autosave instead.
*/
export const MAX_SHARE_URL_LENGTH = 7000;

// A generous ceiling on one album, so a mis-dropped folder of hundreds of files can't freeze the tab while every icon is parsed.
export const MAX_ICONS = 80;

// Where the external-file snippets point by default — a common public-folder location.
export const DEFAULT_SPRITE_PATH = "/icons/sprite.svg";

// Counter for React keys — deterministic and collision-free within a session, which is all a list key needs.
let keyCounter = 0;

// Fresh stable key for a newly mounted icon, independent of its editable id.
function createKey(): string {
  keyCounter += 1;
  return `stamp-${keyCounter}`;
}

// Starter references resolve by slug, so a permalink can carry "home" instead of its full markup.
function findStarter(slug: string): StarterIcon | undefined {
  return starterIcons.find((starter) => starter.slug === slug);
}

// Turns a preset or permalink entry into a mounted icon, or null when it names a starter that no longer exists.
function toSpriteIcon(entry: PresetIcon | ShareableIcon): SpriteIcon | null {
  if ("starter" in entry) {
    const starter = findStarter(entry.starter);
    return starter ? { key: createKey(), id: entry.id, origin: `Starter · ${starter.name}`, source: starter.source } : null;
  }
  return { key: createKey(), id: entry.id, origin: entry.origin, source: entry.source };
}

// The default options: currentColor on, since the starter icons are single-colour line art.
export const DEFAULT_OPTIONS: IconSpriteOptions = {
  currentColor: true,
  spritePath: DEFAULT_SPRITE_PATH
};

// Opens on the first preset, so the album, the cover and the byte count all have something to show on first load.
export function createDefaultEditorState(): IconSpriteEditorState {
  return applyPreset({ icons: [], options: { ...DEFAULT_OPTIONS } }, iconSpritePresets[0]);
}

// Swaps unchanged starter markup for a short reference and drops React keys, keeping permalinks as small as possible.
export function toShareableState(state: IconSpriteEditorState): IconSpriteShareableState {
  return {
    icons: state.icons.map((icon): ShareableIcon => {
      const starter = starterIcons.find((candidate) => candidate.source === icon.source);
      return starter ? { id: icon.id, starter: starter.slug } : { id: icon.id, origin: icon.origin, source: icon.source };
    }),
    options: state.options
  };
}

// Rebuilds full state from a decoded permalink or autosave, ignoring malformed entries rather than failing the whole album.
export function hydrateState(partial: Partial<IconSpriteShareableState>): IconSpriteEditorState {
  const rawIcons = Array.isArray(partial.icons) ? partial.icons.slice(0, MAX_ICONS) : [];
  const icons = rawIcons
    .filter((entry): entry is ShareableIcon => typeof entry === "object" && entry !== null && typeof entry.id === "string" && ("starter" in entry ? typeof entry.starter === "string" : typeof entry.source === "string"))
    .map(toSpriteIcon)
    .filter((icon): icon is SpriteIcon => icon !== null);
  return { icons, options: { ...DEFAULT_OPTIONS, ...(partial.options ?? {}) } };
}

// Plain JSON → base64 → URL-safe characters, matching every other goodie's permalink encoding.
export function encodeShareableState(state: IconSpriteShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null on any malformed or tampered value so the page falls back to the default album instead of crashing.
export function decodeShareableState(encoded: string): IconSpriteShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as IconSpriteShareableState;
  } catch {
    return null;
  }
}

// The ids already in use, slugged the same way the sprite will slug them.
function takenIds(icons: SpriteIcon[]): Set<string> {
  return new Set(resolveIds(icons.map((icon) => icon.id)));
}

// Adds a batch (one paste or a multi-file drop) as a single undo step, giving each new icon a unique id up front.
export function addIcons(state: IconSpriteEditorState, entries: Array<{ origin: string; source: string; id?: string }>): IconSpriteEditorState {
  const taken = takenIds(state.icons);
  const room = Math.max(0, MAX_ICONS - state.icons.length);
  const added = entries.slice(0, room).map((entry): SpriteIcon => {
    const id = uniqueId(entry.id ?? suggestIdFromSource(entry.source, entry.origin), taken);
    taken.add(id);
    return { key: createKey(), id, origin: entry.origin, source: entry.source };
  });
  return { ...state, icons: [...state.icons, ...added] };
}

// A starter icon is just another addition, named after the starter itself.
export function addStarter(state: IconSpriteEditorState, starter: StarterIcon): IconSpriteEditorState {
  return addIcons(state, [{ origin: `Starter · ${starter.name}`, source: starter.source, id: starter.slug }]);
}

// Stored exactly as typed, so a half-typed id isn't rewritten under the cursor; the build resolves it meanwhile.
export function setIconId(state: IconSpriteEditorState, key: string, id: string): IconSpriteEditorState {
  return { ...state, icons: state.icons.map((icon) => (icon.key === key ? { ...icon, id } : icon)) };
}

// On blur, the typed id settles to the slugged, de-duplicated id the sprite actually uses, so what's shown matches the output.
export function normaliseIconId(state: IconSpriteEditorState, key: string): IconSpriteEditorState {
  const ids = resolveIds(state.icons.map((icon) => icon.id));
  return { ...state, icons: state.icons.map((icon, index) => (icon.key === key ? { ...icon, id: ids[index] } : icon)) };
}

// Moves an icon by delta places, clamped to the album, so the keyboard buttons can never push one off the page.
export function moveIcon(state: IconSpriteEditorState, key: string, delta: number): IconSpriteEditorState {
  const from = state.icons.findIndex((icon) => icon.key === key);
  const to = Math.min(state.icons.length - 1, Math.max(0, from + delta));
  if (from === -1 || from === to) return state;
  const icons = [...state.icons];
  const [moved] = icons.splice(from, 1);
  icons.splice(to, 0, moved);
  return { ...state, icons };
}

// Removing by key rather than index keeps a double-click from removing the wrong neighbour once the list has shifted.
export function removeIcon(state: IconSpriteEditorState, key: string): IconSpriteEditorState {
  return { ...state, icons: state.icons.filter((icon) => icon.key !== key) };
}

// One generic setter for both options — they're flat scalars, so per-option functions would only repeat this line.
export function setOption<K extends keyof IconSpriteOptions>(state: IconSpriteEditorState, key: K, value: IconSpriteOptions[K]): IconSpriteEditorState {
  return { ...state, options: { ...state.options, [key]: value } };
}

// Replaces the album with the set but keeps the sprite path, since that belongs to the user's project rather than the set.
export function applyPreset(state: IconSpriteEditorState, preset: IconSpritePresetMeta): IconSpriteEditorState {
  const icons = preset.icons.map(toSpriteIcon).filter((icon): icon is SpriteIcon => icon !== null);
  return { icons, options: { ...state.options, currentColor: preset.currentColor } };
}

// Empties the album but keeps the options, for starting a collection from scratch.
export function clearAlbum(state: IconSpriteEditorState): IconSpriteEditorState {
  return { ...state, icons: [] };
}

// Back to the default set and options in one undoable step.
export function resetBuilder(): IconSpriteEditorState {
  return createDefaultEditorState();
}
