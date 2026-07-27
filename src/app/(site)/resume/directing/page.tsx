import type { Metadata } from "next";
import { ResumeView } from "@/components/resume-view";
import { getResume, getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Directing Resume" };

export default async function DirectingResumePage() {
  const [site, resume] = await Promise.all([getSite(), getResume("directing")]);
  return <ResumeView discipline="directing" resume={resume} site={site} />;
}
