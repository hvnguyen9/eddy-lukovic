"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLeaf = { href: string; label: string };
type NavItem = NavLeaf | { label: string; items: NavLeaf[] };

const nav: NavItem[] = [
  { href: "/about", label: "About" },
  {
    label: "Resume",
    items: [
      { href: "/resume/acting", label: "Acting" },
      { href: "/resume/directing", label: "Directing" },
    ],
  },
  {
    label: "Gallery",
    items: [
      { href: "/gallery/acting", label: "Acting" },
      { href: "/gallery/directing", label: "Directing" },
    ],
  },
  { href: "/media", label: "Reel" },
  { href: "/contact", label: "Contact" },
];

const topLinkClass =
  "nav-link text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft hover:text-ink data-[active=true]:text-ink";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bone/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <span className="grid size-8 place-items-center border border-ink font-(family-name:--font-display) text-sm italic">
            EL
          </span>
          <span className="text-[0.8rem] font-semibold uppercase tracking-[0.22em]">
            Eddy Lukovic
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {nav.map((item) =>
            "items" in item ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  data-active={item.items.some((l) => pathname.startsWith(l.href))}
                  className={`${topLinkClass} flex items-center gap-1.5 py-2`}
                >
                  {item.label}
                  <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden="true" className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                    <path d="M0 0.5 L4 4.5 L8 0.5" stroke="currentColor" fill="none" />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-36 border border-line bg-bone shadow-[6px_6px_0_0_var(--color-line)]">
                    {item.items.map((leaf) => (
                      <Link
                        key={leaf.href}
                        href={leaf.href}
                        data-active={pathname === leaf.href}
                        className="block px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft transition-colors hover:bg-bone-deep hover:text-oxblood data-[active=true]:text-oxblood"
                      >
                        {leaf.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-active={pathname === item.href}
                className={topLinkClass}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 p-2 sm:hidden"
        >
          <span
            className={`h-px w-6 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-bone px-6 py-6 sm:hidden">
          <ul className="flex flex-col gap-6">
            {nav.map((item) => (
              <li key={item.label}>
                {"items" in item ? (
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
                      {item.label}
                    </p>
                    <ul className="mt-2 flex flex-col gap-2 border-l border-line pl-4">
                      {item.items.map((leaf) => (
                        <li key={leaf.href}>
                          <Link
                            href={leaf.href}
                            onClick={() => setOpen(false)}
                            className="display text-2xl italic"
                          >
                            {leaf.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display text-2xl italic"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
