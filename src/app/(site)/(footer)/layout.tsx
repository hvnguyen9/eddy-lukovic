import { SiteFooter } from "@/components/site-footer";

// Every page except the homepage gets the footer.
export default function FooterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  );
}
