// app/project/deteksi/page.tsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";

export default function DeteksiPage() {
  const subDir = path.join(process.cwd(), "project", "deteksi");
  let subFolders: string[] = [];

  try {
    if (fs.existsSync(subDir)) {
      subFolders = fs
        .readdirSync(subDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    }
  } catch {
    subFolders = [];
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent inline-block">
          Deteksi
        </h1>
        <p className="text-[#94a3b8] mt-1">Pilih salah satu sub‑proyek di bawah</p>
      </div>

      {subFolders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#1a1f2e]/30 rounded-2xl border border-dashed border-[#2a2f3e]">
          <FolderOpen className="w-12 h-12 text-[#64748b] mb-3" />
          <p className="text-[#94a3b8]">Belum ada sub‑folder. Buat di <code className="bg-[#0a0e1a] px-2 py-1 rounded">project/deteksi/</code></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subFolders.map((folder) => (
            <Link
              key={folder}
              href={`/project/deteksi/${folder}`}
              className="group relative bg-[#1a1f2e]/60 backdrop-blur-sm p-6 rounded-2xl border border-[#2a2f3e]/50 hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold capitalize text-white group-hover:text-purple-300 transition">
                    {folder}
                  </h2>
                  <p className="text-sm text-[#94a3b8] mt-1 flex items-center gap-1">
                    Lihat detail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition">
                  <FolderOpen className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}