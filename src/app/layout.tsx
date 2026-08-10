import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import { getSite } from "@/lib/content";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const title = [site.name, site.tagline].filter(Boolean).join(" — ");
  const who = [site.tagline || "actor and director", site.location && `based in ${site.location}`]
    .filter(Boolean)
    .join(", ");
  return {
    title: {
      default: title,
      template: `%s — ${site.name}`,
    },
    description: `${site.name}, ${who}. Reel, resume, photos, and contact.`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
