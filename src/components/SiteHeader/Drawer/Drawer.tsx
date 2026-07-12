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

// Full-screen slide-in drawer rendered via a portal; contains main nav, quick links inside a sky scene, and legal footer links.
export default function HeaderDrawer({ id, pathname, onClose }: HeaderDrawerProps): JSX.Element {
  const dialogRef = useRef<HTMLDivElement>(null);
  // Boop state for the Posts nav link's list icon — triggered by hovering the link itself, not the icon.
  const [isListBooped, triggerListBoop] = useBoop();
  // Boop state for the Series nav link's book icon — triggered by hovering the link itself, not the icon.
  const [isBookBooped, triggerBookBoop] = useBoop();
  // Boop state for the Goodies nav link's candy icon — triggered by hovering the link itself, not the icon.
  const [isCandyBooped, triggerCandyBoop] = useBoop();

  // Focus the dialog panel when it mounts so keyboard/AT users are inside the dialog immediately.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Focus trap — keeps Tab and Shift+Tab cycling within the open dialog.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    // Collects every currently focusable element inside the dialog, in DOM order.
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
                // Only the Posts, Series, and Goodies links boop their icon; every other icon renders through the generic registry.
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
