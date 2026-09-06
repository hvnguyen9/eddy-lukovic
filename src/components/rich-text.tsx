import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextValue } from "@/lib/content";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:text-oxblood"
      >
        {children}
      </a>
    ),
  },
};

// Renders a formatted paragraph field. `fallback` is the plain-text value
// from before the formatting toolbar existed — it keeps showing until the
// rich field is filled in, so no page ever goes blank mid-migration.
export function RichText({
  value,
  fallback = "",
  className = "",
}: {
  value: RichTextValue;
  fallback?: string;
  className?: string;
}) {
  const hasRich = Array.isArray(value) && value.length > 0;
  if (!hasRich && !fallback.trim()) return null;

  return (
    <div className={`space-y-5 ${className}`}>
      {hasRich ? (
        <PortableText value={value} components={components} />
      ) : (
        <p className="whitespace-pre-line">{fallback}</p>
      )}
    </div>
  );
}
