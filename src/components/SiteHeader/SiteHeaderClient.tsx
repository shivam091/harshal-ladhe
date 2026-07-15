"use client";

/**
 * HeaderClient — the sole "use client" boundary for the header.
 *
 * Handles everything that requires browser APIs:
 *   • usePathname() for active nav-link highlighting
 *   • Theme switching persisted to localStorage
 *   • Mobile drawer open/close state
 *
 * The glass/blur effect is now handled entirely by CSS scroll-driven
 * animations (@keyframes glass-on + animation-timeline: scroll()), so
 * there is NO IntersectionObserver or scroll listener here.
 */

import { JSX, useCallback, useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { mainNav, colorSchemes, socialLinks } from "@/data/navigation";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import {
  AdjustIcon,
  SearchIcon
} from "@/components/Icon";
import { Icon } from "@/components/Icon";
import SoundToggle from "@/components/SoundToggle";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem
} from "@/components/DropdownMenu";
import Drawer from "@/components/SiteHeader/Drawer";
import IconRssLink from "@/icons/IconRssLink";
import IconHamburger from "@/icons/IconHamburger";
import IconDeviceDesktop from "@/icons/IconDeviceDesktop";
import IconSun from "@/icons/IconSun";
import IconSunDim from "@/icons/IconSunDim";
import IconMoonCrescent from "@/icons/IconMoonCrescent";
import type { ThemeOption } from "@/types/color-scheme";
import type { IconHamburgerStatus } from "@/types/icon";
import {
  headerActionClass,
  Nav,
  NavList,
  NavLink,
  ActionsRow,
  AdjustIconWrap,
  successIconClass
} from "@/components/SiteHeader/SiteHeaderClient.styles";

// Minimum press duration (~7 frames @ 60fps) so the bars→X morph is always visible even on an instant tap.
const MIN_PRESS_MS = Math.ceil(16.667 * 7);

// Client boundary for the header — owns nav highlighting, theme switching, RSS boop, hamburger timing, and the mobile drawer lifecycle.
export default function SiteHeaderClient(): JSX.Element {
  const pathname = usePathname();
  const atomLink = socialLinks.find((link) => link.type === "atom");
  const { theme, setTheme } = useTheme();
  const drawerId = useId();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  /*
    Prevents focus from being stolen on initial mount / every navigation —
    only return focus to the toggle after the drawer has been opened at least once.
  */
  const hasEverOpenedRef = useRef(false);

  // Boop state lives inside IconHamburger itself; only press timing lives here.
  const [isPressed, setIsPressed] = useState(false);
  const pressedTimestamp = useRef<number | null>(null);
  const pressTimeoutRef = useRef<number | null>(null);

  // 4-state machine: opening/closing use clamp:true springs; open/closed allow boop bounce
  const iconStatus: IconHamburgerStatus = isPressed
    ? drawerOpen ? "closing" : "opening"
    : drawerOpen ? "open" : "closed";

  /*
    Briefly shows the 'closing' animation on the hamburger (X → bars flatten to centre)
    before the drawer actually disappears. 167ms = 10 frames @ 60fps
  */
  const closeDrawer = useCallback(() => {
    if (!drawerOpen) return;
    if (pressTimeoutRef.current !== null) window.clearTimeout(pressTimeoutRef.current);
    setIsPressed(true);
    pressTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      setDrawerOpen(false);
      pressTimeoutRef.current = null;
    }, 167);
  }, [drawerOpen]);

  // Track client mount so the portal target (document.body) is available
  useEffect(() => setMounted(true), []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", drawerOpen);
    return () => document.documentElement.classList.remove("scroll-locked");
  }, [drawerOpen]);

  /*
    Close drawer + reset glass animation on route changes
    The <header> element persists across SPA navigations (shared layout, never
    unmounted). animation-fill-mode: forwards retains --glass-opacity: 0.7
    from a previous page's scroll position, so a short page (no scrollbar)
    would inherit the glassed state. Restarting the animation clears that.
  */
  useEffect(() => {
    setDrawerOpen(false);
    setIsPressed(false);
    if (pressTimeoutRef.current !== null) {
      window.clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }

    const header = toggleRef.current?.closest("header");
    if (header instanceof HTMLElement) {
      header.style.animationName = "none";
      void header.offsetHeight; // force reflow so the browser registers the change
      header.style.animationName = "";
    }
  }, [pathname]);

  // Cleanup press timeout on unmount
  useEffect(() => {
    return () => {
      if (pressTimeoutRef.current !== null) window.clearTimeout(pressTimeoutRef.current);
    };
  }, []);

  // Escape closes drawer; also traps focus back to the toggle button
  useEffect(() => {
    if (!drawerOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeDrawer(); }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [drawerOpen, closeDrawer]);

  /*
    Return focus to the toggle when the drawer closes.
    The hasEverOpenedRef guard prevents stealing focus on initial mount and navigations.
    Drawer.tsx handles focusing itself when it mounts.
  */
  useEffect(() => {
    if (drawerOpen) {
      hasEverOpenedRef.current = true;
    } else if (hasEverOpenedRef.current) {
      toggleRef.current?.focus();
    }
  }, [drawerOpen]);

  const [isAdjustBooped, triggerAdjustBoop] = useBoop();
  const adjustBoopStyle = useTransformBoop(isAdjustBooped, { rotation: -45, scaleX: 1.1, scaleY: 1.1, springConfig: SPRINGS.quick });

  // One boop state per color-scheme dropdown item, each driving its own bespoke animated icon.
  const [isSystemBooped, triggerSystemBoop] = useBoop();
  const [isSunBooped, triggerSunBoop] = useBoop();
  const [isSoftDarkBooped, triggerSoftDarkBoop] = useBoop();
  const [isMoonBooped, triggerMoonBoop] = useBoop();

  // Persists the chosen color scheme key to localStorage via ThemeContext.
  const handleTheme = useCallback((key: ThemeOption) => {
    setTheme(key);
  }, [setTheme]);

  return (
    <>
      {/* Desktop navigation */}
      <Nav
        aria-label="Main Navigation"
      >
        <NavList>
          {mainNav.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.title}
              </NavLink>
            </li>
          ))}
        </NavList>
      </Nav>

      {/* Header actions */}
      <ActionsRow>
        {/*
          Not wired up to anything yet. `disabled` stops these from being announced to
          assistive tech as functional controls that silently do nothing on activation.
        */}
        <button className={headerActionClass} aria-label="Search (coming soon)" disabled>
          <SearchIcon size={16} />
        </button>

        <SoundToggle size={16} className={headerActionClass} />

        {/* Theme switcher — Radix DropdownMenu */}
        <DropdownMenu>
          <DropdownTrigger>
            <button
              className={headerActionClass}
              aria-label="Toggle color scheme"
              onPointerEnter={triggerAdjustBoop}
            >
              <AdjustIconWrap style={adjustBoopStyle}>
                <AdjustIcon size={16} />
              </AdjustIconWrap>
            </button>
          </DropdownTrigger>

          <DropdownContent align="center" side="bottom" aria-label="Available color schemes">
            {colorSchemes.map((scheme) => {
              const isActive = scheme.key === theme;

              // Every color-scheme item gets its own bespoke animated icon that boops on hover/focus.
              const boopedIcon =
                scheme.key === "system"
                  ? { icon: <IconDeviceDesktop size={14} isBooped={isSystemBooped} />, trigger: triggerSystemBoop }
                  : scheme.key === "light"
                    ? { icon: <IconSun size={14} isBooped={isSunBooped} />, trigger: triggerSunBoop }
                    : scheme.key === "soft-dark"
                      ? { icon: <IconSunDim size={14} isBooped={isSoftDarkBooped} />, trigger: triggerSoftDarkBoop }
                      : scheme.key === "dark"
                        ? { icon: <IconMoonCrescent size={14} isBooped={isMoonBooped} />, trigger: triggerMoonBoop }
                        : null;

              return (
                <DropdownItem
                  key={scheme.key}
                  onSelect={() => handleTheme(scheme.key)}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onPointerEnter={boopedIcon?.trigger}
                  onFocus={boopedIcon?.trigger}
                >
                  {boopedIcon?.icon ?? <Icon name={scheme.icon} size={14} />}
                  {scheme.label}
                  {isActive && (
                    <Icon name="check" size={12} className={successIconClass} />
                  )}
                </DropdownItem>
              );
            })}
          </DropdownContent>
        </DropdownMenu>

        <IconRssLink size={16} className={headerActionClass} analytics={atomLink?.analytics} />

        {/*
          Hamburger — hidden on desktop, visible on mobile. IconHamburger IS the button;
          it owns boop state + scale wrapper internally.
          aria-controls is only set while the Drawer is actually mounted (it's portaled in
          via AnimatePresence only when drawerOpen) — a stale reference to a since-removed
          id is worse than omitting the attribute when there's nothing (yet) to control.
        */}
        <IconHamburger
          ref={toggleRef}
          iconStatus={iconStatus}
          isOpen={drawerOpen}
          size={16}
          className={headerActionClass}
          data-mobile-only
          aria-label="Toggle menu"
          aria-controls={drawerOpen ? drawerId : undefined}
          aria-expanded={drawerOpen}
          onPointerDown={() => {
            pressedTimestamp.current = Date.now();
            setIsPressed(true);
            if (pressTimeoutRef.current !== null) window.clearTimeout(pressTimeoutRef.current);
          }}
          onClick={() => {
            if (drawerOpen) {
              // closeDrawer owns the 167 ms X→bars closing-animation window.
              closeDrawer();
              return;
            }
            // Opening: enforce ~7 frames (≈117ms) via MIN_PRESS_MS so the bars→X morph is always visible even on an instant tap.
            const elapsed = pressedTimestamp.current
              ? Date.now() - pressedTimestamp.current
              : MIN_PRESS_MS;
            const remaining = MIN_PRESS_MS - elapsed;
            if (remaining <= 0) {
              setDrawerOpen(true);
              setIsPressed(false);
            } else {
              pressTimeoutRef.current = window.setTimeout(() => {
                setDrawerOpen(true);
                setIsPressed(false);
                pressTimeoutRef.current = null;
              }, remaining);
            }
          }}
          onPointerLeave={() => setIsPressed(false)}
        />
      </ActionsRow>

      {/* Mobile drawer */}
      {/* Portal escapes the header's backdrop-filter stacking context so
          position:fixed works relative to the viewport, not the header. */}
      {mounted && createPortal(
        <AnimatePresence>
          {drawerOpen && (
            <Drawer
              key="header-drawer"
              id={drawerId}
              pathname={pathname}
              onClose={closeDrawer}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

SiteHeaderClient.displayName = "SiteHeaderClient";
