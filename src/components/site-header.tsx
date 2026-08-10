"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// The Resume entry opens the uploaded PDF directly (via the /resume redirect)
// in a new tab, and is hidden entirely when no PDF has been uploaded.
export function SiteHeader({ showResume }: { showResume: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: { href: string; label: string; external?: boolean }[] = [
    { href: "/about", label: "About" },
    { href: "/actor", label: "Actor" },
    { href: "/director", label: "Director" },
    ...(showResume ? [{ href: "/resume", label: "Resume", external: true }] : []),
    { href: "/contact", label: "Contact" },
  ];

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
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="nav-link text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname === link.href}
                className="nav-link text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft hover:text-ink data-[active=true]:text-ink"
              >
                {link.label}
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
          <ul className="flex flex-col gap-5">
            {links.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="display text-2xl italic"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="display text-2xl italic"
                  >
                    {link.label}
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
