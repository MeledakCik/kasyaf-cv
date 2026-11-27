import type { Metadata } from "next";
import ResearchClient from "./ResearchClient";

export const metadata: Metadata = {
  title: "Security Research",
  description:
    "Security research by Muhammad Kasyaf Anugrah: command execution (RECES), Indexing Route Injection and JWT signature bypass via encryption & CDN cache.",
  alternates: { canonical: "/research" },
};

export default function Page() {
  return <ResearchClient />;
}
