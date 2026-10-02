"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { COLLECTIONS } from "@/lib/catalog";
import { useCart } from "@/lib/cart-context";
import { track } from "@/lib/analytics";
import SearchOverlay from "@/components/SearchOverlay";
import { useDialogA11y } from "@/lib/use-dialog-a11y";

const PLAIN_LINKS = [{ label: "Store Locator", href: "/#stores" }];

export default function Header() {
  const pathname = usePathname();
  const forceSolid = pathname !== "/";
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 90], forceSolid ? [1, 1] : [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 90], [0, 0.08]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Hovering opens Collections, so the click that follows the hover must not
  // toggle it straight back shut — only a click on an already-clicked-open
  // menu (or keyboard Enter/Space) closes it.
  const openedByHover = useRef(false);
  const { count, open: openCart } = useCart();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);

  // The header is raised above the menu while it's open so the toggle (now a
  // close button) stays visible and clickable — include it in the Tab cycle.
  useDialogA11y({
    open: mobileOpen,
    onClose: () => setMobileOpen(false),
    containerRef: mobileMenuRef,
    alsoInclude: [mobileToggleRef],
    lockScroll: true,
  });
  // Disclosure, not a modal: Escape closes and returns focus, no trap.
  useDialogA11y({
    open: accountOpen,
    onClose: () => setAccountOpen(false),
    containerRef: accountRef,
    autoFocus: false,
    trap: false,
  });
  // Same disclosure pattern for the Collections dropdown.
  useDialogA11y({
    open: openMenu === "Collections",
    onClose: () => setOpenMenu(null),
    containerRef: collectionsRef,
    autoFocus: false,
    trap: false,
  });

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      {/* First Tab stop on the home page: keyboard users otherwise have to
          page through ~6 viewports of scroll-driven sequence (and the whole
          header) before reaching the rest of the page. */}
      {pathname === "/" && (
        <a
          href="#after-intro"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2.5 focus:text-[13px] focus:font-medium focus:text-[var(--ink-900)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--navy)]"
        >
          Skip intro
        </a>
      )}
      <motion.header
        className={`fixed inset-x-0 top-0 ${mobileOpen ? "z-[86]" : "z-[60]"} flex h-16 items-center justify-between px-5 md:px-8`}
      >
        <motion.div aria-hidden style={{ opacity: bg }} className="glass-nav absolute inset-0 -z-10" />
        <motion.div
          aria-hidden
          style={{ opacity: borderOpacity }}
          className="absolute inset-x-0 bottom-0 -z-10 h-px bg-[var(--ink-900)]"
        />

        <div className="flex items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="text-[15px] font-semibold tracking-tight text-[var(--ink-900)]">
              TISSOT <span className="font-normal text-[var(--ink-600)]">PRX</span>
            </Link>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hidden items-center gap-1 lg:flex">
            <Link
              href="/collection"
              className="px-3 py-2 text-[13px] font-medium text-[var(--ink-600)] transition hover:text-[var(--ink-900)]"
            >
              Watches
            </Link>

            <div
              ref={collectionsRef}
              className="relative"
              onMouseEnter={() => {
                cancelClose();
                if (openMenu !== "Collections") openedByHover.current = true;
                setOpenMenu("Collections");
              }}
              onMouseLeave={scheduleClose}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
              }}
            >
              <button
                onClick={() => {
                  if (openedByHover.current && openMenu === "Collections") {
                    openedByHover.current = false;
                    return;
                  }
                  openedByHover.current = false;
                  setOpenMenu(openMenu === "Collections" ? null : "Collections");
                }}
                aria-expanded={openMenu === "Collections"}
                aria-controls="collections-menu"
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-[var(--ink-600)] transition hover:text-[var(--ink-900)]"
              >
                Collections
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="mt-px">
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
              <AnimatePresence>
                {openMenu === "Collections" && (
                  <motion.div
                    id="collections-menu"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full w-[520px] -translate-x-1/2 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-float"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {COLLECTIONS.map((c) => (
                        <Link
                          key={c.id}
                          href={`/collection/${c.id}`}
                          onClick={() => setOpenMenu(null)}
                          className="group rounded-xl p-3 transition hover:bg-black/[0.03]"
                        >
                          <span className="block text-[13px] font-medium text-[var(--ink-900)]">{c.name}</span>
                          <span className="block text-[12px] text-[var(--ink-400)]">{c.tagline}</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/collection"
                      onClick={() => setOpenMenu(null)}
                      className="mt-3 block text-center text-[12px] font-medium text-[var(--navy)] underline underline-offset-4"
                    >
                      View all collections
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {PLAIN_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="px-3 py-2 text-[13px] font-medium text-[var(--ink-600)] transition hover:text-[var(--ink-900)]"
              >
                {l.label}
              </Link>
            ))}
          </motion.nav>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            aria-label="Search"
            className="rounded-full p-2 text-[var(--ink-600)] transition hover:bg-black/[0.05] hover:text-[var(--ink-900)]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <div
            ref={accountRef}
            className="relative hidden md:block"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setAccountOpen(false);
            }}
          >
            <button
              onClick={() => setAccountOpen((v) => !v)}
              aria-label="Account"
              aria-expanded={accountOpen}
              aria-controls="account-menu"
              className="rounded-full p-2 text-[var(--ink-600)] transition hover:bg-black/[0.05] hover:text-[var(--ink-900)]"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.5 19c1.6-3.2 4.4-4.8 7.5-4.8s5.9 1.6 7.5 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  id="account-menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full w-52 rounded-2xl border border-black/[0.06] bg-white p-2 shadow-float"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  <button className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-[var(--ink-900)] hover:bg-black/[0.04]">
                    Sign in
                  </button>
                  <button className="block w-full rounded-xl px-3 py-2 text-left text-[13px] text-[var(--ink-900)] hover:bg-black/[0.04]">
                    Create account
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => {
              setMobileOpen(false);
              openCart();
              track("cart_open", { source: "header" });
            }}
            aria-label={`Shopping bag, ${count} item${count === 1 ? "" : "s"}`}
            className="relative rounded-full p-2 text-[var(--ink-600)] transition hover:bg-black/[0.05] hover:text-[var(--ink-900)]"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--navy)] text-[9px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>

          <button
            ref={mobileToggleRef}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={`ml-1 rounded-full p-2.5 transition lg:hidden ${
              mobileOpen
                ? "bg-white text-[var(--ink-900)] shadow-sm focus-visible:outline-white"
                : "text-[var(--ink-600)] hover:bg-black/[0.05]"
            }`}
          >
            <span className="relative block h-5 w-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  mobileOpen ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              >
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
                }`}
              >
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        </motion.div>
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="fixed inset-0 z-[85] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <motion.div
              className="absolute inset-0 bg-dark/50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-4 top-[76px] origin-top rounded-[24px] bg-white/70 p-6 shadow-lift backdrop-blur-2xl ring-1 ring-white/60"
            >
              <nav className="flex flex-col gap-1">
                {[
                  { label: "Watches", href: "/collection" },
                  { label: "Collections", href: "/collection" },
                  ...PLAIN_LINKS,
                ].map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-3 py-3.5 text-[18px] font-medium tracking-tight text-[var(--ink-900)] transition hover:bg-black/[0.04]"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="my-4 h-px bg-black/[0.08]" />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3"
              >
                <Link
                  href="/collection"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex h-[50px] items-center justify-center rounded-full text-[15px] font-medium text-white"
                >
                  Explore Collection
                </Link>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                    className="flex h-[46px] flex-1 items-center justify-center rounded-full border border-black/10 bg-white/40 text-[14px] font-medium text-[var(--ink-900)] transition hover:bg-white/70"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openCart();
                      track("cart_open", { source: "mobile_menu" });
                    }}
                    className="flex h-[46px] flex-1 items-center justify-center rounded-full border border-black/10 bg-white/40 text-[14px] font-medium text-[var(--ink-900)] transition hover:bg-white/70"
                  >
                    Bag {count > 0 && `(${count})`}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
