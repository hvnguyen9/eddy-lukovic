import type { Metadata } from "next";
import { sanityEnabled } from "../../../../sanity/env";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false },
};

export default async function StudioPage() {
  if (!sanityEnabled) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="eyebrow">Content studio</p>
        <h1 className="display mt-6 text-4xl font-medium">Not connected yet</h1>
        <p className="mt-6 leading-relaxed text-ink-soft">
          The editing studio needs a (free) Sanity project before it can run.
          The site currently serves the starter content in{" "}
          <code className="bg-bone-deep px-1.5 py-0.5 text-sm">/content</code>.
          See <strong>README.md → Connecting the CMS</strong> for the one-time
          setup — after that, this page becomes the visual editor.
        </p>
      </section>
    );
  }

  const { Studio } = await import("./studio");
  return <Studio />;
}
