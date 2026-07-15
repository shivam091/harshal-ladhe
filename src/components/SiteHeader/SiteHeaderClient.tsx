"use client";

/**
 * The header's only "use client" boundary, keeping browser-API code out of the server-rendered shell.
 *
 * Handles everything that requires browser APIs:
 *   • usePathname() for active nav-link highlighting
 *   • Theme switching persisted to localStorage
 *   • Mobile drawer open/close state
 *
 * Glass/blur is left to CSS scroll-driven animations so the header runs no
 * scroll listener or IntersectionObserver on the main thread.
 */

import { JSX, useCallback, useEffect, useRef, useState, useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { mainNav, colorSchemes, socialLinks } from "@/data/navigation";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import { useSound } from "@/hooks/use-sound";
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
  const [playSearchOpen] = useSound("/sounds/pop-up-on.mp3");
  const [playSearchClose] = useSound("/sounds/pop-up-off.mp3");
  const [playMenuOpen] = useSound("/sounds/menu-open-softer.mp3");
  const [playMenuClose] = useSound("/sounds/menu-close.mp3");

  const toggleRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  /*
    Prevents focus from being stolen on initial mount / every navigation —
    only return focus to the toggle after the drawer has been opened at least once.
  */
  const hasEverOpenedRef = useRef(false);

  // Press timing lives here rather than in IconHamburger because it gates when the drawer actually opens.
  const [isPressed, setIsPressed] = useState(false);
  const pressedTimestamp = useRef<number | null>(null);
  const pressTimeoutRef = useRef<number | null>(null);

  // Splits transitional from resting states so the morph can't overshoot while a resting icon can still boop.
  const iconStatus: IconHamburgerStatus = isPressed
    ? drawerOpen ? "closing" : "opening"
    : drawerOpen ? "open" : "closed";

  // Holds the drawer ~10 frames before unmounting so the X→bars morph is visible first.
  const closeDrawer = useCallback(() => {
    if (!drawerOpen) return;
    if (pressTimeoutRef.current !== null) window.clearTimeout(pressTimeoutRef.current);
    setIsPressed(true);
    playMenuClose();
    pressTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      setDrawerOpen(false);
      pressTimeoutRef.current = null;
    }, 167);
  }, [drawerOpen, playMenuClose]);

  // Portals need document.body, which doesn't exist during SSR.
  useEffect(() => setMounted(true), []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", drawerOpen);
    return () => document.documentElement.classList.remove("scroll-locked");
  }, [drawerOpen]);

  /*
    The <header> persists across SPA navigations, so open overlays and the glass animation's
    forwards-filled state would leak into the next page — a short page would inherit the glassed look.
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

  // Stops a pending press timeout from setting state after unmount.
  useEffect(() => {
    return () => {
      if (pressTimeoutRef.current !== null) window.clearTimeout(pressTimeoutRef.current);
    };
  }, []);

  // Escape is the expected way to dismiss a modal dialog.
  useEffect(() => {
    if (!drawerOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeDrawer(); }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [drawerOpen, closeDrawer]);

  // Returning focus to the toggle keeps keyboard users where they left off once the drawer closes.
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

  // Routes selection through ThemeContext so the choice persists and applies site-wide.
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

        {/* Theme switcher */}
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
          aria-controls is set only while the Drawer is mounted — a stale reference to a
          since-removed id is worse than omitting the attribute when there's nothing to control.
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
              // Closing has its own animation delay, so skip the minimum-press logic below.
              closeDrawer();
              return;
            }
            const elapsed = pressedTimestamp.current
              ? Date.now() - pressedTimestamp.current
              : MIN_PRESS_MS;
            const remaining = MIN_PRESS_MS - elapsed;
            if (remaining <= 0) {
              setDrawerOpen(true);
              setIsPressed(false);
              playMenuOpen();
            } else {
              pressTimeoutRef.current = window.setTimeout(() => {
                setDrawerOpen(true);
                setIsPressed(false);
                pressTimeoutRef.current = null;
              }, remaining);
              playMenuOpen();
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
