// Only the fields a visible cover needs, so any registry's image shape can be passed straight in.
export interface CoverImageProps {
  image: { path: string; width: number; height: number; alt: string; caption: string };
}

// Sent as the cover_image_open `method`, so GA can separate plain clicks from deliberate new-tab opens.
export type CoverImageOpenMethod = "click" | "new_tab" | "context_menu";
