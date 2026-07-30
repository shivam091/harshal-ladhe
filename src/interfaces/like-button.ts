import type { ReactNode } from "react";
import type { Status, SpringXY, SpringPosition } from "@/types/like-button";

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

/*
  What a like-click attempt resolves to, so LikeHeart knows what to flash and whether to celebrate — the
  caller (LikeButton for real likes, LikeButtonDemo for the demo) decides both.
*/
export interface LikeClickResult {
  // Text to flash in the message bubble.
  message: string;
  // Whether to burst confetti particles for this click (a new like landed) — false for e.g. a duplicate/already-liked outcome.
  celebrate: boolean;
}

// Props for the shared, presentation-agnostic LikeHeart button.
export interface LikeHeartProps {
  /*
    Renders as a persistent fixed-position pill instead of sitting inline
    under a heading list. Use on pages with no Table of Contents to dock it
    in — snippets, series — where PostTOC's mobile-collapse fallback doesn't
    apply.
  */
  floating?: boolean;
  /*
    Drops the same top separator as `floating`, without escaping to a fixed position — for callers embedding
    this inline with nothing above it (e.g. LikeButtonDemo, in blog prose).
  */
  standalone?: boolean;
  // Live count to display. null = still loading, renders nothing.
  likes: number | null;
  /*
    Whether any further click can make new progress — true means every click
    just re-flashes `alreadyLikedMessage` instead of calling `onLikeClick`.
    For the real button this is "have I liked it" (forever, after the first
    click); for a demo button building up to a cap, it should stay false until
    the click that reaches the cap.
  */
  hasLiked: boolean;
  /*
    How full the heart gradient should render, 0 (empty) to 1 (full). The real button is a binary 0/1 flip; a demo
    can make this proportional to build up gradually.
  */
  fillFraction: number;
  /*
    Full accessible label for the button, computed by the caller (wording differs enough between the real button
    and a demo with visible progress that there's no one-size-fits-all default).
  */
  ariaLabel: string;
  /*
    Flashed (and bounced) whenever a click lands while `hasLiked` is already true, instead of calling `onLikeClick`.
  */
  alreadyLikedMessage: string;
  /*
    Called on every click while `hasLiked` is false. Returns (or resolves to) what to flash and whether to celebrate
    with a particle burst.
  */
  onLikeClick: () => LikeClickResult | Promise<LikeClickResult>;
  /*
    Extra decoration layered over the button — e.g. a Sparkles overlay a demo shows once maxed out. Rendered as an
    independent sibling inside ButtonSlot, never wrapped around Button itself (which would force it to remount — see BounceWrapper below).
  */
  children?: ReactNode;
}

// A decorative particle sprite the burst can draw from.
export interface ParticleSprite {
  // Emoji rendered as the particle — avoids needing image assets for the confetti burst.
  emoji: string;
  // Base size in px, used both to render the emoji (font-size) and to scale its physics (mass).
  size: number;
}

// One particle's full physics + rendering data, generated once and immutable for its lifetime.
export interface ParticleData {
  // Unique per-particle React key, from generateId().
  id: string;
  // Date.now() at spawn — used to prune particles once PARTICLE_LIFESPAN_MS elapses.
  createdAt: number;
  // Emoji + base size this particle renders.
  sprite: ParticleSprite;
  // Precomputed outward-travel angle, in radians.
  angleInRads: number;
  // Total distance this particle travels from center before stopping.
  distance: number;
  // Total rotation (degrees) applied over the particle's flight.
  rotation: number;
  // react-spring config tuned per-particle so farther/heavier particles feel appropriately weighted.
  springConfig: {
    // Spring stiffness — higher snaps to its target faster.
    tension: number;
    // Spring damping — higher settles with less oscillation.
    friction: number;
    // Simulated mass — higher adds inertia/overshoot.
    mass: number;
  };
}

// A concrete on-screen point, in viewport coordinates.
export interface PointObj {
  // Horizontal viewport coordinate.
  x: number;
  // Vertical viewport coordinate.
  y: number;
}

// Props for the heart's eyes: which expression to render, and the tracked pupil offset.
export interface EyesProps {
  // Which face expression to render.
  status: Status;
  // Animated pupil offset tracking a nearby cursor.
  eyeSpring: SpringXY;
}

// Props for the heart's mouth: which expression to render, and the animated curve control point.
export interface MouthProps {
  // Which face expression to render.
  status: Status;
  // Animated control-point position driving the happy/sad mouth curve.
  mouthSpring: SpringPosition;
}

// Props for the confetti burst layered over the heart.
export interface LikeHeartParticlesProps {
  /*
    Bumped by the parent each time a burst should fire (i.e. each successful like) — a plain value change,
    not a count to reach.
  */
  trigger: number;
  // Side length (px) of the heart button the burst is centered over.
  size: number;
}

/*
  Cursor/button proximity snapshot, shared by the rotation, eye-translation, and
  disengage-frown effects below — each one needs the same center point and distance
  to center, so it's computed here once per render (e.g. per pointermove) instead of
  every consumer re-deriving it from scratch. Null once the cursor is unknown,
  off-screen, or outside the button's area-of-effect radius (size * 2), so callers
  can just no-op.
*/
export interface Proximity {
  // Current cursor position.
  cursorPoint: PointObj;
  // Button's own center position.
  centerPoint: PointObj;
  // Distance from cursorPoint to centerPoint.
  distanceToCenter: number;
  // Radius (size * 2) within which proximity effects engage.
  areaOfEffectRadius: number;
}
