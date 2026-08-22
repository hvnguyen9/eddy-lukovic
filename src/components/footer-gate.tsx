"use client";

import { usePathname } from "next/navigation";

const PAGE_KEYS: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/actor": "actor",
  "/director": "director",
  "/resume": "resume",
  "/contact": "contact",
};

// Shows the footer only on the pages ticked in the studio's Footer settings.
export function FooterGate({
  pages,
  children,
}: {
  pages: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const key = PAGE_KEYS[pathname];
  if (!key || !pages.includes(key)) return null;
  return <>{children}</>;
}
