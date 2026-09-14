"use client";

import type { JSX} from "react";
import { useState, useEffect } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  Star,
  SkySvg,
  SkyLayerBack,
  SkyLayerFront,
  CloudMidground,
  CloudForeground,
  CloudBackground,
  HeroBannerContainer,
  PlanetBand,
  PlanetRingBack,
  PlanetRingFront,
  PlanetRingBackThin,
  PlanetRingFrontThin,
  PlanetMarsBody,
  PlanetMoonBody,
  PlanetSaturnBody,
  PlanetJupiterBody,
  PlanetEarthBody,
  PlanetVenusBody,
  PlanetUranusBody,
  PlanetMercuryBody,
  PlanetNeptuneBody,
  PlanetLandmass,
  PlanetClouds,
  PlanetSurfaceFeature
} from "@/components/HeroBanner/HeroBanner.styles";
import { generateStars, generatePlanets } from "@/components/HeroBanner/HeroBanner.helpers";

const STAR_COUNT = 30;
// Fixed seed keeps the first paint identical across server render and client hydration.
const STAR_FIELD_SEED = 20260702;

// One of each planet kind (generatePlanets clamps to PLANET_KINDS.length, so this is the max/full field).
const PLANET_COUNT = 9;
// Distinct from STAR_FIELD_SEED so the two fields don't inherit the same PRNG sequence.
const PLANET_FIELD_SEED = 20260703;

// Decorative hero banner — two-layer cloud SVG with a star-field and SVG-native twinkle/drift animations.
export default function HeroBanner(): JSX.Element {
  // Starts from the fixed-seed field so SSR and hydration match, then re-rolls to a
  // genuinely random field once mounted — that swap happens strictly after hydration,
  // so it can't cause a mismatch, and gives every real page load its own star layout.
  const [stars, setStars] = useState(() => generateStars(STAR_COUNT, STAR_FIELD_SEED));
  const [planets, setPlanets] = useState(() => generatePlanets(PLANET_COUNT, PLANET_FIELD_SEED));
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Intentional one-shot re-roll, not state synced from a prop/external source —
    // the whole point is to diverge from the SSR-matched initial value post-hydration.
    setStars(generateStars(STAR_COUNT, Date.now()));
    setPlanets(generatePlanets(PLANET_COUNT, Date.now() + 1));
  }, []);

  return (
    <>
      <HeroBannerContainer data-banner="hero" data-cloud-shapes aria-hidden="true">
        <SkyLayerBack role="presentation">
          <SkySvg
            width="5120"
            height="456"
            viewBox="0 0 5120 456"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable={false}
          >
            <CloudBackground
              d="M2467 198C2478.93 198 2508.5 148.5 2692.3 167C2855.77 183.454 2890 275.92 2940.45 271C2978.5 267.29 3025.5 66.1073 3208.04 55.5002C3364.5 46.408 3407.37 123 3419.5 123.5C3431.63 124 3448.89 83.0002 3564.32 83.0002C3728 83.0002 3767.67 198.501 3779.08 198C3790.5 197.5 3808 45.0002 4044.68 45.0002C4238.5 45.0002 4245.32 120.5 4256.5 116.5C4267.69 112.5 4277 13.5002 4417.9 13.5002C4567 13.5002 4590.74 115.5 4608.5 116.5C4626.26 117.5 4640.5 13.5007 4795 13.5004C4946 13.5002 4954.43 76.5003 4970.51 76.5003C4986.6 76.5003 4983 8.5 5077 8.5C5147.13 8.5 5148.62 62.7657 5148.14 74.3437C5148.08 75.8075 5148 77.2344 5148 78.6994V360V361.5C5148 383.592 5130.09 401.5 5108 401.5H9C-13.0914 401.5 -31 383.592 -31 361.5V133.5V76.0021V76.0002C-31 75.9604 -30.9925 -7.80104e-05 24 0C103.747 0.000113126 132.617 67.9717 143.069 117.186C148.413 142.347 172.927 161.481 197.99 155.7L478.5 91C598.5 64.5 646 110.5 659 110.5C672 110.5 714 31 856 33.5C998 36 996.5 76 1008.5 73.5C1020.5 71 1014.28 28.0329 1174.5 31C1309.5 33.5 1298.5 110.5 1327.5 110.5C1366.31 110.5 1378.25 109.457 1388 110.5C1406.69 112.5 1429.5 27 1615 27C1743.74 27 1771.09 161.183 1855.16 167C1930.28 172.198 1914.5 85 2032.05 90.0002C2108.93 93.2702 2132.33 148 2146.16 148C2160 148 2184 81.6655 2318.08 102.5C2440.5 121.524 2455.07 198 2467 198Z"
            />

            <CloudMidground
              d="M2617 234C2496.99 229.765 2429.72 276.108 2400.53 303.732C2388.43 315.177 2372.83 323.5 2356.18 323.5H2135.62C2111.05 323.5 2089.95 305.704 2082.79 282.198C2061.56 212.504 2001.53 78.3592 1852.75 71.0003C1691 63 1645 185 1622 186.5C1599 188 1587 88.5 1368.5 88.5C1211 88.5 1180 157.5 1158.4 161.5C1136.8 165.501 1074.33 111 931 129.5C787.671 148 789.676 214.5 770 214C750.324 213.5 736.5 129.5 535.029 142.5C416.863 150.125 382.163 211.07 373.669 260.166C368.141 292.123 343.421 323.5 310.99 323.5H280.024C249.079 323.5 225.052 295.503 224.331 264.567C222.732 195.98 200.305 92 79 92C17.4738 92 3.47982 128.37 0.653094 139.38C0.122368 141.447 0 143.571 0 145.705V398C0 412.36 11.6404 424 25.9998 424H5100C5127.61 424 5150 401.615 5150 374V365V181.851C5150 149.381 5119.54 125.514 5087.89 132.773C5054.67 140.392 5019.02 148.008 5011.31 147.5C4996.11 146.501 4966.41 99.9071 4859.43 95.5003C4731 90.2096 4684 213.5 4663 213.5H4531.84C4513.48 213.5 4496.63 203.435 4485.66 188.715C4451.8 143.286 4365.08 52.9127 4220.67 71.0003C4061 91.0002 4023.5 150.5 4006.5 150.5C3989.5 150.5 3925.6 96.5092 3797.5 100.5C3637 105.5 3599 235.5 3589 231.5C3563.12 221.148 3430.32 192.596 3405.38 180.145C3382.96 168.954 3354.61 161.5 3318.87 161.5C3175.43 161.5 3129.73 224 3116.87 224C3104 224 3073.62 179.5 2953.5 179.5C2782 179.5 2771.92 286 2756 284.5C2740.08 283 2721.1 237.674 2617 234Z"
            />

            <defs>
              <symbol id="star" viewBox="0 0 24 24">
                <Star d="M12 2 L14.09 8.26 L20.97 8.27 L15.45 12.14 L17.54 18.39 L12 14.52 L6.46 18.39 L8.55 12.14 L3.03 8.27 L9.91 8.26 Z" />
              </symbol>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Off-center highlight (cx/cy < 50%) fakes a light source, so each sphere reads as lit from the upper-left rather than as a flat disc. */}
              <radialGradient id="planet-saturn-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(42 65% 82%)" />
                <stop offset="60%" stopColor="hsl(40 55% 66%)" />
                <stop offset="100%" stopColor="hsl(32 45% 42%)" />
              </radialGradient>
              <radialGradient id="planet-moon-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(0 0% 96%)" />
                <stop offset="55%" stopColor="hsl(220 6% 80%)" />
                <stop offset="100%" stopColor="hsl(220 8% 55%)" />
              </radialGradient>
              <radialGradient id="planet-mars-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(18 70% 72%)" />
                <stop offset="55%" stopColor="hsl(14 60% 52%)" />
                <stop offset="100%" stopColor="hsl(10 55% 32%)" />
              </radialGradient>
              <radialGradient id="planet-jupiter-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(36 55% 80%)" />
                <stop offset="55%" stopColor="hsl(28 45% 62%)" />
                <stop offset="100%" stopColor="hsl(22 40% 38%)" />
              </radialGradient>
              <radialGradient id="planet-neptune-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(206 70% 74%)" />
                <stop offset="55%" stopColor="hsl(212 65% 54%)" />
                <stop offset="100%" stopColor="hsl(220 60% 32%)" />
              </radialGradient>
              <radialGradient id="planet-earth-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(202 70% 68%)" />
                <stop offset="55%" stopColor="hsl(212 62% 48%)" />
                <stop offset="100%" stopColor="hsl(220 55% 26%)" />
              </radialGradient>
              <radialGradient id="planet-venus-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(48 55% 84%)" />
                <stop offset="55%" stopColor="hsl(42 45% 68%)" />
                <stop offset="100%" stopColor="hsl(34 40% 46%)" />
              </radialGradient>
              <radialGradient id="planet-uranus-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(185 45% 80%)" />
                <stop offset="55%" stopColor="hsl(190 40% 63%)" />
                <stop offset="100%" stopColor="hsl(196 38% 40%)" />
              </radialGradient>
              <radialGradient id="planet-mercury-gradient" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="hsl(30 12% 64%)" />
                <stop offset="55%" stopColor="hsl(28 10% 48%)" />
                <stop offset="100%" stopColor="hsl(25 12% 28%)" />
              </radialGradient>

              <clipPath id="planet-saturn-clip">
                <circle r="32" />
              </clipPath>
              <clipPath id="planet-moon-clip">
                <circle r="21" />
              </clipPath>
              <clipPath id="planet-mars-clip">
                <circle r="12" />
              </clipPath>
              <clipPath id="planet-jupiter-clip">
                <circle r="24" />
              </clipPath>
              <clipPath id="planet-earth-clip">
                <circle r="18" />
              </clipPath>
              <clipPath id="planet-venus-clip">
                <circle r="13" />
              </clipPath>
              <clipPath id="planet-mercury-clip">
                <circle r="10" />
              </clipPath>

              {/* Sphere with limb-shaded gradient, tilted rings split front/back of the body, and faint cloud bands. */}
              <symbol id="planet-saturn" viewBox="-70 -35 140 70" overflow="visible">
                <g transform="rotate(-18)">
                  <PlanetRingBack d="M -58 0 A 58 16 0 0 0 58 0" />
                  <PlanetSaturnBody r="32" />
                  <g clipPath="url(#planet-saturn-clip)">
                    <PlanetBand x1="-32" y1="-13" x2="32" y2="-10" />
                    <PlanetBand x1="-32" y1="1" x2="32" y2="3" />
                    <PlanetBand x1="-32" y1="15" x2="32" y2="18" />
                  </g>
                  <PlanetRingFront d="M -58 0 A 58 16 0 0 1 58 0" />
                </g>
              </symbol>

              {/* Banded gas giant, no rings. */}
              <symbol id="planet-jupiter" viewBox="-26 -26 52 52" overflow="visible">
                <PlanetJupiterBody r="24" />
                <g clipPath="url(#planet-jupiter-clip)">
                  <PlanetBand x1="-24" y1="-16" x2="24" y2="-14" />
                  <PlanetBand x1="-24" y1="-6" x2="24" y2="-5" />
                  <PlanetBand x1="-24" y1="4" x2="24" y2="6" />
                  <PlanetBand x1="-24" y1="14" x2="24" y2="17" />
                </g>
              </symbol>

              {/* Cratered sphere. */}
              <symbol id="planet-moon" viewBox="-24 -24 48 48" overflow="visible">
                <PlanetMoonBody r="21" />
                <g clipPath="url(#planet-moon-clip)">
                  <PlanetSurfaceFeature cx="-7" cy="-8" rx="5" ry="4" />
                  <PlanetSurfaceFeature cx="6" cy="-2" rx="3.5" ry="3" />
                  <PlanetSurfaceFeature cx="-3" cy="7" rx="4" ry="3.5" />
                  <PlanetSurfaceFeature cx="10" cy="9" rx="3" ry="2.5" />
                </g>
              </symbol>

              {/* Smooth ice giant — small, no surface detail, reads as most distant. */}
              <symbol id="planet-neptune" viewBox="-16 -16 32 32" overflow="visible">
                <PlanetNeptuneBody r="14" />
              </symbol>

              {/* Small rust-red sphere with a couple of darker surface patches. */}
              <symbol id="planet-mars" viewBox="-14 -14 28 28" overflow="visible">
                <PlanetMarsBody r="12" />
                <g clipPath="url(#planet-mars-clip)">
                  <PlanetSurfaceFeature cx="-3" cy="2" rx="3.5" ry="2.5" />
                  <PlanetSurfaceFeature cx="4" cy="-3" rx="2.5" ry="2" />
                </g>
              </symbol>

              {/* Ocean-blue sphere with irregular continent landmasses and a couple of thin cloud wisps over the top. */}
              <symbol id="planet-earth" viewBox="-22 -22 44 44" overflow="visible">
                <PlanetEarthBody r="18" />
                <g clipPath="url(#planet-earth-clip)">
                  <PlanetLandmass d="M -12 -6 C -14 -10 -6 -14 0 -11 C 4 -9 6 -4 2 -2 C -2 0 -10 -2 -12 -6 Z" />
                  <PlanetLandmass d="M 4 6 C 2 3 8 1 11 5 C 13 8 10 12 6 11 C 3 10 5 8 4 6 Z" />
                  <PlanetClouds d="M -15 2 Q -6 -2 2 1 T 15 -2" />
                  <PlanetClouds d="M -11 11 Q 0 7 11 10" />
                </g>
              </symbol>

              {/* Pale, hazy atmosphere — thicker and cloudier-looking than Jupiter's, with fewer/fainter bands. */}
              <symbol id="planet-venus" viewBox="-15 -15 30 30" overflow="visible">
                <PlanetVenusBody r="13" />
                <g clipPath="url(#planet-venus-clip)">
                  <PlanetBand x1="-13" y1="-6" x2="13" y2="-4" />
                  <PlanetBand x1="-13" y1="3" x2="13" y2="5" />
                </g>
              </symbol>

              {/* Pale cyan sphere with near-vertical rings — Uranus's ~98° axial tilt makes its rings read edge-on/vertical rather than Saturn's horizontal band. */}
              <symbol id="planet-uranus" viewBox="-20 -30 40 60" overflow="visible">
                <g transform="rotate(8)">
                  <PlanetRingBackThin d="M 0 -27 A 7 27 0 0 0 0 27" />
                  <PlanetUranusBody r="15" />
                  <PlanetRingFrontThin d="M 0 -27 A 7 27 0 0 1 0 27" />
                </g>
              </symbol>

              {/* Small, warm-gray, heavily cratered sphere. */}
              <symbol id="planet-mercury" viewBox="-12 -12 24 24" overflow="visible">
                <PlanetMercuryBody r="10" />
                <g clipPath="url(#planet-mercury-clip)">
                  <PlanetSurfaceFeature cx="-4" cy="-3" rx="2.2" ry="1.8" />
                  <PlanetSurfaceFeature cx="3" cy="-4" rx="1.6" ry="1.4" />
                  <PlanetSurfaceFeature cx="-2" cy="4" rx="2" ry="1.6" />
                  <PlanetSurfaceFeature cx="4" cy="3" rx="1.4" ry="1.2" />
                  <PlanetSurfaceFeature cx="0" cy="-1" rx="1.2" ry="1" />
                </g>
              </symbol>
            </defs>

            <g role="presentation">
              {planets.map((planet, i) => (
                <g key={i} transform={`translate(${planet.x} ${planet.y})`}>
                  {!prefersReducedMotion && (
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0 0; ${planet.drift.dx} ${planet.drift.dy}; 0 0`}
                      dur={`${planet.drift.dur}s`}
                      additive="sum"
                      repeatCount="indefinite"
                    />
                  )}
                  <use
                    href={`#planet-${planet.kind}`}
                    x={-planet.width / 2}
                    y={-planet.height / 2}
                    width={planet.width}
                    height={planet.height}
                  />
                </g>
              ))}
            </g>

            <g filter="url(#glow)">
              {stars.map((star, i) => (
                <use key={i} href="#star" x={star.x} y={star.y} width={star.size} height={star.size}>
                  {/*
                    These SVG-native <animate>/<animateTransform> loop indefinitely and aren't
                    reached by the global CSS `prefers-reduced-motion` reset (it only resets
                    CSS `animation`/`transition`), so they're gated here explicitly.
                  */}
                  {!prefersReducedMotion && (
                    <animate
                      attributeName="opacity"
                      values={`${star.twinkleFrom};1;${star.twinkleFrom}`}
                      dur={`${star.twinkleDur}s`}
                      begin={`${star.twinkleBegin}s`}
                      repeatCount="indefinite"
                    />
                  )}
                  {!prefersReducedMotion && star.drift && (
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0 0; ${star.drift.dx} ${star.drift.dy}; 0 0`}
                      dur={`${star.drift.dur}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </use>
              ))}
            </g>
          </SkySvg>
        </SkyLayerBack>

        <SkyLayerFront role="presentation">
          <SkySvg
            width="5120"
            height="456"
            viewBox="0 0 5120 456"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable={false}
          >
            <CloudForeground
              d="M2641.4 401.5C2613.31 399.999 2525.75 198 2121.01 198C1862 198 1840 264.5 1806.88 259.5C1773.77 254.499 1723.34 129.991 1562.17 136C1401 142.009 1366.58 313.5 1339 321C1311.42 328.5 1279 226.5 1034.79 234.5C802.99 242.093 724.297 318.5 697 313C669.703 307.5 681 75.9996 430.496 32.4996C214.304 -5.042 99.7464 183.937 60.6394 266.475C51.4353 285.9 27.9703 295.392 8.5729 286.129C-15.3473 274.705 -43 292.144 -43 318.652V429.5C-43 443.859 -31.3592 455.5 -16.9999 455.5H5103C5127.3 455.5 5147 435.8 5147 411.5V232.89C5147 226.643 5146.46 220.404 5144.55 214.457C5136.92 190.729 5108.7 128.5 5022.5 128.5C4881 128.5 4935 253.704 4838.83 249C4808.16 247.499 4757.27 55.5004 4535 59C4312.73 62.4996 4283.98 270.5 4250.5 268.5C4217.02 266.5 4197 199 4037.27 189.5C3834.76 177.455 3790.86 285 3753.5 279C3716.14 273 3652.96 98.8238 3377.5 153.5C3156.46 197.374 3191.5 387.48 3139.82 376.5C3118.64 371.999 3078.5 339 2948.03 339C2894.2 339 2890.37 330.676 2837.19 339C2708.5 359.141 2669.5 403 2641.4 401.5Z"
            />
          </SkySvg>
        </SkyLayerFront>
      </HeroBannerContainer>
    </>
  );
}

HeroBanner.displayName = "HeroBanner";
