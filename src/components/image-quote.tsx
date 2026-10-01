import type { ImageQuote as ImageQuoteData } from "@/lib/content";

// Where the quote block sits on the photo.
const POSITION: Record<string, string> = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end",
  "middle-left": "items-center justify-start",
  "middle-center": "items-center justify-center",
  "middle-right": "items-center justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-right": "items-end justify-end",
};

// How the lines line up with each other, chosen independently of placement.
const ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

// Scales down on narrow screens so the author's own line breaks survive
// instead of the browser adding its own.
const SIZE = {
  small: "text-sm sm:text-lg md:text-xl",
  medium: "text-base sm:text-2xl md:text-3xl",
  large: "text-lg sm:text-3xl md:text-5xl",
} as const;

const COLOR = {
  light: "text-bone",
  dark: "text-ink",
  accent: "text-oxblood-bright",
} as const;

// A pull-quote laid over a photo — used for review quotes on the Director
// page's lead image. Everything here is set in the studio.
export function ImageQuote({ quote }: { quote: ImageQuoteData }) {
  const placement = POSITION[quote.position] ?? POSITION["bottom-left"];
  const align = ALIGN[quote.align] ?? ALIGN.left;
  const isDarkText = quote.color === "dark";
  // Light text gets a dark halo and vice versa, so the shadow always lifts
  // the words off a busy photo rather than muddying them.
  const shadow = quote.shadow
    ? isDarkText
      ? "[text-shadow:0_1px_12px_rgba(255,255,255,0.85),0_1px_3px_rgba(255,255,255,0.9)]"
      : "[text-shadow:0_2px_16px_rgba(0,0,0,0.75),0_1px_4px_rgba(0,0,0,0.85)]"
    : "";
  const text = quote.quotationMarks ? `“${quote.text}”` : quote.text;

  return (
    <div className="pointer-events-none absolute inset-0">
      {quote.scrim && (
        <div
          aria-hidden
          className={`absolute inset-0 ${
            isDarkText
              ? "bg-gradient-to-t from-bone/70 via-bone/25 to-transparent"
              : "bg-gradient-to-t from-night/75 via-night/25 to-transparent"
          }`}
        />
      )}
      <figure className={`relative flex size-full p-6 sm:p-12 ${placement}`}>
        {/* Wide enough that the author's own line breaks are the only
              breaks on a normal screen. */}
          <div className={`max-w-5xl ${align}`}>
          {/* whitespace-pre-line keeps the line breaks exactly as typed */}
          <blockquote
            className={`display leading-tight whitespace-pre-line italic ${shadow} ${
              SIZE[quote.size] ?? SIZE.medium
            } ${COLOR[quote.color] ?? COLOR.light}`}
          >
            {text}
          </blockquote>
          {quote.attribution && (
            <figcaption
              className={`mt-3 text-[0.68rem] font-semibold tracking-[0.22em] uppercase ${shadow} ${
                isDarkText ? "text-ink-soft" : "text-bone/75"
              }`}
            >
              {quote.attribution}
            </figcaption>
          )}
        </div>
      </figure>
    </div>
  );
}
