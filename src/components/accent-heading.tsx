// Renders a CMS-edited headline in the site's display style, with the final
// word picked out in the oxblood accent — matching the design used across
// the site. Returns null for blank headings (blank means hidden).
export function AccentHeading({
  text,
  className = "display mt-6 text-5xl leading-tight font-medium sm:text-6xl",
}: {
  text: string;
  className?: string;
}) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const lastSpace = trimmed.lastIndexOf(" ");
  const head = lastSpace === -1 ? "" : trimmed.slice(0, lastSpace + 1);
  const tail = lastSpace === -1 ? trimmed : trimmed.slice(lastSpace + 1);

  return (
    <h1 className={className}>
      {head}
      <em className="text-oxblood">{tail}</em>
    </h1>
  );
}
