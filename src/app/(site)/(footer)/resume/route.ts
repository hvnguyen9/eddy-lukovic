import { redirect } from "next/navigation";
import { getSite } from "@/lib/content";

// /resume is a stable URL that goes straight to the currently uploaded PDF
// (Site Settings → Resume PDF). The browser's PDF viewer handles viewing,
// saving, and printing. With no PDF uploaded, the nav hides the Resume link
// and this falls back to the homepage.
export const revalidate = 60;

export async function GET() {
  const site = await getSite();
  redirect(site.resumePdfUrl || "/");
}
