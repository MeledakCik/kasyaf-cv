import type { Metadata } from "next";
import ResearchClient from "./ResearchClient";

export const metadata: Metadata = {
  title: "Security Research",
  description:
    "Independent security research by Muhammad Kasyaf Anugrah: RECES (server-side command execution) and Indexing Route Injection, with audits and remediation for Next.js and Laravel.",
  alternates: { canonical: "/research" },
};

export default function Page() {
  return <ResearchClient />;
}
