import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import { getHome } from "@/lib/content";
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
  const home = await getHome();
  const title = [home.name, home.tagline].filter(Boolean).join(" — ");
  const who = [home.tagline || "actor and director", home.location && `based in ${home.location}`]
    .filter(Boolean)
    .join(", ");
  return {
    title: {
      default: title,
      template: `%s — ${home.name}`,
    },
    description: `${home.name}, ${who}. Reel, resume, photos, and contact.`,
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
