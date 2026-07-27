import type { Metadata } from "next";
import { ResumeView } from "@/components/resume-view";
import { getResume, getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Acting Resume" };

export default async function ActingResumePage() {
  const [site, resume] = await Promise.all([getSite(), getResume("acting")]);
  return <ResumeView discipline="acting" resume={resume} site={site} />;
}
