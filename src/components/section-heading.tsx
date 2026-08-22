// A CMS-editable subheading with the site's rule-to-the-right treatment.
// Renders nothing when the text is blank.
export function SectionHeading({ text, dark = false }: { text: string; dark?: boolean }) {
  if (!text.trim()) return null;
  return (
    <h2
      className={`flex items-baseline gap-4 text-[0.72rem] font-semibold tracking-[0.25em] uppercase ${
        dark ? "text-oxblood-bright" : "text-oxblood"
      }`}
    >
      {text}
      <span className={`h-px flex-1 ${dark ? "bg-bone/15" : "bg-line"}`} aria-hidden />
    </h2>
  );
}
