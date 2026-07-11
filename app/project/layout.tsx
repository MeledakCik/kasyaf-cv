import { Poppins } from "next/font/google";
import Sidebar from "./Sidebar";
import fs from "fs";
import path from "path";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projectDir = path.join(process.cwd(), "project");
  let folders: string[] = [];

  try {
    if (fs.existsSync(projectDir)) {
      folders = fs
        .readdirSync(projectDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    } else {
      folders = ["deteksi", "rencana", "pengerjaan"];
    }
  } catch {
    folders = ["deteksi", "rencana", "pengerjaan"];
  }

  const menuItems = folders.map((name) => {
    let status: "done" | "planned" | "wip" = "planned";
    if (name === "deteksi") status = "done";
    else if (name === "rencana") status = "planned";
    else if (name === "pengerjaan") status = "wip";
    return { name, status };
  });

  return (
    <div className={`${poppins.className} select-none flex h-screen overflow-hidden bg-[#0a0e1a] text-[#e2e8f0]`}>
      <Sidebar menuItems={menuItems} />
      <main className="flex-1 h-full overflow-y-auto p-4 lg:p-6 bg-gradient-to-br from-[#0a0e1a] via-[#111827] to-[#0a0e1a]">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}