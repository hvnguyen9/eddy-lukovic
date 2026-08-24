import { FooterGate } from "@/components/footer-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFooter, getHome, getResumePage } from "@/lib/content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [home, footer, resume] = await Promise.all([
    getHome(),
    getFooter(),
    getResumePage(),
  ]);

  // Column layout so short pages (Contact, Resume) still push the footer to
  // the bottom of the screen instead of leaving page background beneath it.
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader name={home.name} showResume={resume.resumes.length > 0} />
      <main className="flex-1">{children}</main>
      <FooterGate pages={footer.pages}>
        <SiteFooter />
      </FooterGate>
    </div>
  );
}
