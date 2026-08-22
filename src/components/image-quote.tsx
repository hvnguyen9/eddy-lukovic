import type { ImageQuote as ImageQuoteData } from "@/lib/content";

const POSITION: Record<string, string> = {
  "top-left": "items-start justify-start text-left",
  "top-center": "items-start justify-center text-center",
  "top-right": "items-start justify-end text-right",
  "middle-left": "items-center justify-start text-left",
  "middle-center": "items-center justify-center text-center",
  "middle-right": "items-center justify-end text-right",
  "bottom-left": "items-end justify-start text-left",
  "bottom-center": "items-end justify-center text-center",
  "bottom-right": "items-end justify-end text-right",
};

const SIZE = {
  small: "text-base sm:text-xl",
  medium: "text-xl sm:text-3xl",
  large: "text-2xl sm:text-5xl",
} as const;

const COLOR = {
  light: "text-bone",
  dark: "text-ink",
  accent: "text-oxblood-bright",
} as const;

// A pull-quote laid over a photo — used for review quotes on the Director
// page's lead image. Size, color, and placement are set in the studio.
export function ImageQuote({ quote }: { quote: ImageQuoteData }) {
  const placement = POSITION[quote.position] ?? POSITION["bottom-left"];
  const isDarkText = quote.color === "dark";

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
      <figure
        className={`relative flex size-full p-6 sm:p-12 ${placement}`}
      >
        <div className="max-w-2xl">
          <blockquote
            className={`display leading-tight italic drop-shadow-sm ${SIZE[quote.size] ?? SIZE.medium} ${
              COLOR[quote.color] ?? COLOR.light
            }`}
          >
            “{quote.text}”
          </blockquote>
          {quote.attribution && (
            <figcaption
              className={`mt-3 text-[0.68rem] font-semibold tracking-[0.22em] uppercase ${
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
