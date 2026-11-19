import type { Metadata } from "next";
import TemplateClient from "./TemplateClient";

export const metadata: Metadata = {
  title: "Website Templates & Digital Products",
  description:
    "Ready-to-use website templates and digital products by Muhammad Kasyaf Anugrah: landing pages, company profiles, LMS and more, built with Next.js and Tailwind CSS.",
  alternates: { canonical: "/template" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const params = await searchParams;

  return <TemplateClient initialCategory={params.category ?? "All"} />;
}
