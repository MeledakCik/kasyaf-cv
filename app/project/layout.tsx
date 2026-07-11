// app/project/layout.tsx
import { Poppins } from "next/font/google";
import Sidebar from "./Sidebar";
import { getProjectData } from "@/lib/projectData";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = getProjectData();
  const menuItems = data.menu.map((name) => {
    let status: "done" | "planned" | "wip" = "planned";
    if (name === "deteksi") status = "done";
    else if (name === "rencana") status = "planned";
    else if (name === "pengerjaan") status = "wip";
    return { name, status };
  });

  return (
    <div
      className={`${poppins.className} flex h-screen overflow-hidden bg-[#0a0e1a] text-[#e2e8f0]`}
    >
      <Sidebar menuItems={menuItems} />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a]">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}