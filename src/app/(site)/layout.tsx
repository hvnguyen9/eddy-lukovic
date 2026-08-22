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

  return (
    <>
      <SiteHeader name={home.name} showResume={resume.resumes.length > 0} />
      <main>{children}</main>
      <FooterGate pages={footer.pages}>
        <SiteFooter />
      </FooterGate>
    </>
  );
}
