"use client";

import type { JSX } from "react";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useActiveFestiveOccasion } from "@/hooks/use-active-festive-occasion";
import Sparkles from "@/components/Sparkles";
import { Wrapper, Row, Message, WishText, CloseButton, Zigzag } from "@/components/FestiveBanner/FestiveBanner.styles";
import { dismissFestiveBanner, isFestiveBannerDismissed } from "@/components/FestiveBanner/FestiveBanner.helpers";

// Dismissible banner showing festive wishes above SiteHeader.
export default function FestiveBanner(): JSX.Element {
  const occasion = useActiveFestiveOccasion();
  // Whether the current occasion has been dismissed.
  const [isDismissed, setIsDismissed] = useState(false);
  // Id for the zigzag SVG pattern.
  const id = useId();
  const zigzagPatternId = id.replace(/:/g, "") + "-zigzag";

  useEffect(() => {
    if (occasion) setIsDismissed(isFestiveBannerDismissed(occasion.id, new Date()));
  }, [occasion]);

  const closeBanner = () => {
    setIsDismissed(true);
    if (occasion) dismissFestiveBanner(occasion.id, new Date());
  };

  const isVisible = occasion !== null && !isDismissed;
  const message = occasion === null ? "" : typeof occasion.message === "function" ? occasion.message(new Date()) : occasion.message;

  return (
    <>
      <AnimatePresence initial={false}>
        {isVisible && occasion && (
          <motion.div
            key={occasion.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ overflow: "clip" }}
          >
            <Wrapper>
              <Row>
                <Message>
                  <span aria-hidden="true">{occasion.emoji}</span>{" "}
                  <Sparkles
                    isToggleable={false}
                    colors={["#FFC700", "#FF8A9B", "#79E0FF", "#B98CFF", "#7CE38B", "#FF9A5A"]}
                  >
                    <WishText>{message}</WishText>
                  </Sparkles>
                  {occasion.href && (
                    <>
                      {" "}
                      <a
                        href={occasion.href}
                        target={occasion.href.startsWith("http") ? "_blank" : undefined}
                        rel={occasion.href.startsWith("http") ? "noopener" : undefined}
                      >
                        {occasion.linkLabel ?? "Learn more"}
                      </a>
                    </>
                  )}
                </Message>

                <CloseButton onClose={closeBanner} label="Dismiss banner" />
              </Row>

              <Zigzag>
                <svg width="100%" height="15" aria-hidden="true">
                  <defs>
                    <pattern
                      id={zigzagPatternId}
                      x="0"
                      y="0"
                      width="90"
                      height="30"
                      patternUnits="userSpaceOnUse"
                      patternTransform="scale(0.5)"
                    >
                      <path
                        d="M149.176 15.0712C149.705 14.5137 150 13.7744 150 13.0057V-16.5C150 -18.1569 148.657 -19.5 147 -19.5H-57C-58.6569 -19.5 -60 -18.1569 -60 -16.5V13.0057C-60 13.7744 -59.7049 14.5137 -59.1757 15.0712C-55.5419 18.8988 -50.68 22.5 -45 22.5C-37.5355 22.5 -32.6678 18.3758 -29.202 14.8544C-28.4811 14.122 -27.8615 13.4623 -27.2957 12.8599C-26.3923 11.8981 -25.6259 11.0822 -24.8032 10.3488C-23.5088 9.19499 -22.8454 9 -22.5 9C-22.1546 9 -21.4912 9.19499 -20.1968 10.3488C-19.3741 11.0822 -18.6077 11.8981 -17.7044 12.8599C-17.1385 13.4623 -16.5189 14.1219 -15.798 14.8544C-12.3322 18.3758 -7.46449 22.5 0 22.5C7.46449 22.5 12.3322 18.3758 15.798 14.8544C16.5189 14.122 17.1385 13.4623 17.7043 12.8599C18.6077 11.8981 19.3741 11.0822 20.1968 10.3488C21.4912 9.19499 22.1546 9 22.5 9C22.8454 9 23.5088 9.19499 24.8032 10.3488C25.6259 11.0822 26.3923 11.8981 27.2957 12.8599C27.8615 13.4623 28.4811 14.122 29.202 14.8544C32.6678 18.3758 37.5355 22.5 45 22.5C52.4645 22.5 57.3322 18.3758 60.798 14.8544C61.5189 14.122 62.1385 13.4623 62.7043 12.8599C63.6077 11.8981 64.3741 11.0822 65.1968 10.3488C66.4912 9.19499 67.1546 9 67.5 9C67.8454 9 68.5088 9.19499 69.8032 10.3488C70.6259 11.0822 71.3923 11.8981 72.2957 12.8599C72.8615 13.4623 73.4811 14.122 74.202 14.8544C77.6678 18.3758 82.5355 22.5 90 22.5C97.4645 22.5 102.332 18.3758 105.798 14.8544C106.519 14.122 107.138 13.4623 107.704 12.8599C108.608 11.8981 109.374 11.0822 110.197 10.3488C111.491 9.19499 112.155 9 112.5 9C112.845 9 113.509 9.19499 114.803 10.3488C115.626 11.0822 116.392 11.8981 117.296 12.8599C117.862 13.4623 118.481 14.122 119.202 14.8544C122.668 18.3758 127.536 22.5 135 22.5C140.68 22.5 145.542 18.8988 149.176 15.0712Z"
                        fill="var(--color-bg-festive-banner)"
                        stroke="var(--color-stroke-festive-banner)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#${zigzagPatternId})`} />
                </svg>
              </Zigzag>
            </Wrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

FestiveBanner.displayName = "FestiveBanner";
