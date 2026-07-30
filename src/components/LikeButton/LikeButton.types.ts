// Props for the real, network-backed LikeButton container.
export interface LikeButtonProps {
  /*
    Renders as a persistent fixed-position pill instead of sitting inline
    under a heading list. Use on pages with no Table of Contents to dock it
    in — snippets, series — where PostTOC's mobile-collapse fallback doesn't
    apply.
  */
  floating?: boolean;
}
