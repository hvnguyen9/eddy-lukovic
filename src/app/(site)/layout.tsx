import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite();

  return (
    <>
      <SiteHeader showResume={Boolean(site.resumePdfUrl)} />
      <main>{children}</main>
    </>
  );
}
