"use client";

import type { JSX} from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/Icon";
import IconList from "@/icons/IconList";
import IconBook from "@/icons/IconBook";
import IconCandy from "@/icons/IconCandy";
import { useBoop } from "@/hooks/use-boop";
import { mainNav, quickLinks, legalLinks } from "@/data/navigation";
import SkyVisual from "@/components/SiteHeader/Drawer/SkyVisual";
import type { HeaderDrawerProps } from "@/components/SiteHeader/Drawer/Drawer.types";
import {
  headerDrawerClass,
  drawerContainerClass,
  DrawerNav,
  NavList,
  NavItem,
  NavLink,
  QuickLinksList,
  QuickLink,
  LegalList,
  LegalItem,
  LegalLink
} from "@/components/SiteHeader/Drawer/Drawer.styles";

// Mobile stand-in for the desktop nav row, gathering every destination into one dismissible panel.
export default function HeaderDrawer({ id, pathname, onClose }: HeaderDrawerProps): JSX.Element {
  const dialogRef = useRef<HTMLDivElement>(null);
  // One boop per animated icon, triggered from the whole link so the hover target is generous.
  const [isListBooped, triggerListBoop] = useBoop();
  // Series' book icon — its own boop so it animates independently.
  const [isBookBooped, triggerBookBoop] = useBoop();
  // Goodies' candy icon — its own boop so it animates independently.
  const [isCandyBooped, triggerCandyBoop] = useBoop();

  // Focus the dialog panel when it mounts so keyboard/AT users are inside the dialog immediately.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // aria-modal promises the rest of the page is inert, so Tab must not escape the dialog.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    // Queried on each Tab rather than once so the trap stays correct if the dialog's contents change.
    const getFocusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
        )
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === el) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.div
        ref={dialogRef}
        id={id}
        className={headerDrawerClass}
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "110%" }}
        transition={{ duration: 0.35, ease: [0.41, 0.1, 0.13, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Main Menu"
        tabIndex={-1}
      >
        <motion.div
          className={drawerContainerClass}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.15, delay: 0 } }}
        >
          {/* Navigation */}
          <DrawerNav
            aria-label="Main Navigation"
          >
            <NavList>
              {mainNav.map((item) => {
                // Only these three icons have bespoke boop animations; the rest use the static registry icon.
                const isListIcon = item.icon === "list";
                const isBookIcon = item.icon === "book";
                const isCandyIcon = item.icon === "candy";
                const onPointerEnter = isListIcon
                  ? triggerListBoop
                  : isBookIcon
                    ? triggerBookBoop
                    : isCandyIcon
                      ? triggerCandyBoop
                      : undefined;
                return (
                  <NavItem
                    key={item.href}
                  >
                    <NavLink
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={onClose}
                      onPointerEnter={onPointerEnter}
                    >
                      {item.icon && (
                        isListIcon
                          ? <IconList size={16} isBooped={isListBooped} />
                          : isBookIcon
                            ? <IconBook size={16} isBooped={isBookBooped} />
                            : isCandyIcon
                              ? <IconCandy size={16} isBooped={isCandyBooped} />
                              : <Icon name={item.icon} size={16} />
                      )}
                      {item.title}
                    </NavLink>
                  </NavItem>
                );
              })}
            </NavList>
          </DrawerNav>

          {/* Decorative sky visual */}
          <SkyVisual>
            <nav aria-label="Quick links">
              <QuickLinksList>
                {quickLinks.map((item) => (
                  <li key={item.href}>
                    <QuickLink
                      href={item.href}
                      onClick={onClose}
                    >
                      {item.title}
                    </QuickLink>
                  </li>
                ))}
              </QuickLinksList>
            </nav>
          </SkyVisual>

          {/* Footer */}
          <footer>
            <LegalList
              aria-label="Legal links"
            >
              {legalLinks.map((item) => (
                <LegalItem key={item.href}>
                  <LegalLink
                    href={item.href}
                  >
                    {item.title}
                  </LegalLink>
                </LegalItem>
              ))}
            </LegalList>
          </footer>
        </motion.div>
      </motion.div>
    </>
  );
}

HeaderDrawer.displayName = "HeaderDrawer";
