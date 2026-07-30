"use client";

import type { JSX} from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePointerPositionWhenNearElement } from "@/hooks/use-pointer-position-when-near-element";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import VisuallyHidden from "@/components/VisuallyHidden";
import {
  BUTTON_SIZE_PX,
  VIEWBOX_WIDTH,
  VIEWBOX_HEIGHT,
  MESSAGE_VISIBLE_MS,
  HEART_PATH,
  getProximity,
  getBodyRotation,
  getEyeTranslation,
  useMouthControlPoint,
  useFrownIfDisengaged
} from "@/components/LikeHeart/LikeHeart.helpers";
import Eyes from "@/components/LikeHeart/Eyes";
import Mouth from "@/components/LikeHeart/Mouth";
import Effects from "@/components/LikeHeart/Effects";
import LikeHeartParticles from "@/components/LikeHeart/LikeHeartParticles";
import type { Status, LikeHeartProps as Props } from "@/components/LikeHeart/LikeHeart.types";
import { Wrapper, ButtonSlot, BounceWrapper, Button, Svg, Count, Message } from "@/components/LikeHeart/LikeHeart.styles";

/*
  Animated "like" heart: shows a live count, and on click reports through
  `onLikeClick` to find out what happened, then fills in, bounces, bursts
  confetti, and flashes a message accordingly. Doesn't know or care whether
  the click was a real network request or purely a local demo tally — that
  decision, and the real vs. demo copy/config, belongs entirely to the
  caller (see LikeButton for the real thing, LikeButtonDemo for the
  showcase version). The body leans away from and the eyes track toward a
  nearby cursor, and frown briefly if you wander off without liking.
*/
export default function LikeHeart({
  floating = false,
  standalone = false,
  likes,
  hasLiked,
  fillFraction,
  ariaLabel,
  alreadyLikedMessage,
  onLikeClick,
  children
}: Props): JSX.Element | null {
  // Unique id suffix for this instance's gradient/mask defs, so multiple hearts on one page don't collide.
  const id = useId().replace(/:/g, "");
  const prefersReducedMotion = usePrefersReducedMotion();

  // Tracks the SVG's on-screen position/size for the cursor-proximity math below.
  const [svgRef, svgBoundingBox] = useBoundingBox<SVGSVGElement>();
  // Cursor position, only populated while it's within range of the button.
  const cursorPoint = usePointerPositionWhenNearElement({
    boundingBox: svgBoundingBox,
    radius: BUTTON_SIZE_PX * 3
  });

  // Press-boop scale factor driving Button's inline transform.
  const [magnification, setMagnification] = useState(1);
  // Bumped on every celebrated click to fire a fresh confetti burst (see LikeHeartParticles).
  const [particleTrigger, setParticleTrigger] = useState(0);
  /*
    Whether the bounce animation is currently playing. Re-clicking an
    already-liked heart needs to *restart* the bounce, but a plain boolean
    tied only to `hasLiked` can't drive that — it stays true forever after
    the cap is reached, so data-bounce's value would never change on a
    repeat click. Remounting the button (a key change) would restart it too,
    but also tears down and recreates the Button/Svg subtree, replaying
    Button's own CSS entrance fade-in — a visible "blink" on every click.
    triggerBounce instead just flips this on (a genuine false→true transition
    restarts the CSS animation) and ignores clicks that land while a bounce
    is still playing, rather than yanking it back to the start mid-swing;
    onAnimationEnd below resets it to false once the 6-iteration animation
    actually finishes, so the *next* click can trigger a fresh one.
  */
  const [isBouncing, setIsBouncing] = useState(false);
  const triggerBounce = () => {
    if (!isBouncing) setIsBouncing(true);
  };
  // Empty string = bubble hidden; any other value is shown until it self-clears.
  const [message, setMessage] = useState("");
  /*
    Bumped on every flash so the bubble remounts (key={`message-${messageKey}`})
    and its one-shot float-up/fade-out animation always replays from the
    start, even if the same text (e.g. "already liked") flashes twice in a
    row.
  */
  const [messageKey, setMessageKey] = useState(0);
  const messageTimerRef = useRef<number | null>(null);

  // Shows `text` in the message bubble, replacing/restarting any message already in flight.
  const flashMessage = (text: string) => {
    if (messageTimerRef.current !== null) window.clearTimeout(messageTimerRef.current);
    setMessage(text);
    setMessageKey((n) => n + 1);
    messageTimerRef.current = window.setTimeout(() => setMessage(""), MESSAGE_VISIBLE_MS);
  };

  /*
    Cursor/button proximity, computed once per render and shared by the rotation,
    eye-translation, and disengage-frown effects below, instead of each re-deriving
    the same center point/distance from scratch (this recomputes on every pointermove).
  */
  const proximity = getProximity(BUTTON_SIZE_PX, svgBoundingBox, cursorPoint);

  const isSad = useFrownIfDisengaged(proximity, hasLiked);
  // "super-happy" is fully derived from the `hasLiked` prop — no need to sync it into state.
  const status: Status = hasLiked ? "super-happy" : isSad ? "sad" : "slightly-happy";

  // Clears any pending "hide the message" timer on unmount.
  useEffect(() => {
    return () => {
      if (messageTimerRef.current !== null) window.clearTimeout(messageTimerRef.current);
    };
  }, []);

  // Drives the gradient fill rising from the bottom of the heart, proportional to `fillFraction`.
  const fillSpring = useSpring({
    amount: VIEWBOX_HEIGHT * (1 - fillFraction),
    config: SPRINGS.default,
    immediate: prefersReducedMotion
  });

  // Leans the whole heart away from a nearby cursor.
  const bodySpring = useSpring({
    transform: `rotate(${prefersReducedMotion ? 0 : getBodyRotation(proximity)}deg)`,
    config: SPRINGS.fast
  });

  // Tracks the eye pupils toward a nearby cursor.
  const eyeTranslation = prefersReducedMotion
    ? { x: 0, y: 0 }
    : getEyeTranslation(BUTTON_SIZE_PX, proximity);
  const eyeSpring = useSpring({
    x: eyeTranslation.x,
    y: eyeTranslation.y,
    config: SPRINGS.fast
  });

  const mouthSpring = useMouthControlPoint(status);

  /*
    Delegates entirely to `onLikeClick` to find out what happened — the real
    button's fetch, or a demo's local tally — and just handles the shared
    reaction: bounce always, flash whatever message comes back, and burst
    particles if told to celebrate. A click while already liked never calls
    `onLikeClick` at all, just re-flashes `alreadyLikedMessage`.
  */
  const handleClick = () => {
    triggerBounce();

    if (hasLiked) {
      flashMessage(alreadyLikedMessage);
      return;
    }

    Promise.resolve(onLikeClick()).then((result) => {
      flashMessage(result.message);
      if (result.celebrate) setParticleTrigger((n) => n + 1);
    });
  };

  if (likes === null) return null;

  return (
    <>
      <Wrapper data-floating={String(floating)} data-standalone={String(standalone)}>
        <ButtonSlot>
          <BounceWrapper
            data-bounce={String(isBouncing && !prefersReducedMotion)}
            onAnimationEnd={(e) => {
              // Filter out bubbled events from unrelated animations inside (e.g. Button's own entrance fade-in).
              if (e.animationName.startsWith("like-button-bounce")) setIsBouncing(false);
            }}
          >
            <Button
              type="button"
              onClick={handleClick}
              onPointerEnter={() => setMagnification(1.1)}
              onPointerLeave={() => setMagnification(1)}
              onPointerDown={(e) => {
                if (e.buttons === 1) setMagnification(1.2);
              }}
              onPointerUp={() => setMagnification(1.1)}
              aria-pressed={hasLiked}
              style={{
                transform: `scale(${prefersReducedMotion ? 1 : magnification})`,
                transition: "transform 250ms"
              }}
            >
              <VisuallyHidden>{ariaLabel}</VisuallyHidden>
              <Svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                fill="none"
                aria-hidden="true"
                style={bodySpring}
              >
                <defs>
                  <linearGradient
                    id={`like-active-${id}`}
                    x1="25"
                    y1="42"
                    x2="26.3796"
                    y2="0.0453673"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="hsl(353deg, 100%, 52%)" />
                    <stop offset="1" stopColor="hsl(313deg, 100%, 52%)" />
                  </linearGradient>
                  <linearGradient
                    id={`like-inactive-${id}`}
                    x1="15"
                    y1="41"
                    x2="42"
                    y2="-1.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--empty-heart-lower)" stopOpacity={0.8} />
                    <stop offset="1" stopColor="var(--empty-heart-upper)" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                {/*
                  Clips everything below to the heart outline. SVG masks default to
                  luminance-based masking (alpha * luminance), so the "visible"
                  shape must be filled white (luminance 1) — a black fill here
                  would mask out the entire heart.
                */}
                <mask
                  id={`like-clip-${id}`}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={VIEWBOX_WIDTH}
                  height={VIEWBOX_HEIGHT}
                >
                  <path d={HEART_PATH} fill="#ffffff" />
                </mask>

                {/* Reveals the active (pink/red) gradient from the bottom up as `fillSpring` animates. */}
                <mask
                  id={`like-fill-${id}`}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={VIEWBOX_WIDTH}
                  height={VIEWBOX_HEIGHT}
                >
                  <animated.polygon
                    points={fillSpring.amount.to(
                      (height) => `
                        0,${VIEWBOX_HEIGHT}
                        ${VIEWBOX_WIDTH},${VIEWBOX_HEIGHT}
                        ${VIEWBOX_WIDTH},${height}
                        0,${height}
                      `
                    )}
                    fill="#ffffff"
                  />
                </mask>

                <g mask={`url(#like-clip-${id})`}>
                  <path d={HEART_PATH} fill={`url(#like-inactive-${id})`} />
                  <g mask={`url(#like-fill-${id})`}>
                    <path d={HEART_PATH} fill={`url(#like-active-${id})`} />
                  </g>

                  <Eyes status={status} eyeSpring={eyeSpring} />
                  <Mouth status={status} mouthSpring={mouthSpring} />
                  <Effects />
                </g>
              </Svg>
            </Button>
          </BounceWrapper>

          <LikeHeartParticles trigger={particleTrigger} size={BUTTON_SIZE_PX} />

          {/*
            Caller-supplied overlay (e.g. a demo's Sparkles-at-milestone effect).
            Rendered as an independent sibling positioned over the same area as
            the button — not wrapped around it — so mounting it here never
            touches Button's own identity/parent chain (which would replay its
            entrance fade-in; see BounceWrapper above).
          */}
          {children}

          {message && (
            <Message key={`message-${messageKey}`} role="status">
              {message}
            </Message>
          )}
        </ButtonSlot>

        <Count aria-live="polite">{likes}</Count>
      </Wrapper>
    </>
  );
}

LikeHeart.displayName = "LikeHeart";
