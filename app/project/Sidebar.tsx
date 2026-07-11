"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Menu, X, Layers, 
  Search, Calendar, Clock, FileText,
  ArrowLeft
} from "lucide-react";

interface MenuItem {
  name: string;
  status: "done" | "planned" | "wip";
}

const iconMap: Record<string, any> = {
  deteksi: Search,
  rencana: Calendar,
  pengerjaan: Clock,
  default: FileText,
};

const statusConfig = {
  done: {
    label: "Selesai",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dotColor: "bg-emerald-400",
  },
  planned: {
    label: "Terencana",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    dotColor: "bg-blue-400",
  },
  wip: {
    label: "Dalam Proses",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dotColor: "bg-amber-400",
  },
};

export default function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const grouped = {
    done: menuItems.filter((item) => item.status === "done"),
    planned: menuItems.filter((item) => item.status === "planned"),
    wip: menuItems.filter((item) => item.status === "wip"),
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#1a1f2e]/80 backdrop-blur-md rounded-xl border border-[#2a2f3e] text-[#e2e8f0] shadow-lg hover:bg-[#2d3748] transition-all"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-72 bg-[#1a1f2e] border-r border-[#2a2f3e]/50
          h-full transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex-shrink-0 overflow-y-auto p-5
          shadow-2xl shadow-black/30
        `}
      >
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#2a2f3e]/50">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20">
            <Layers className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold text-white">Proyek</span>
        </div>
        {Object.entries(grouped).map(([status, items]) => {
          if (items.length === 0) return null;
          const config = statusConfig[status as keyof typeof statusConfig];

          return (
            <div key={status} className="mb-5">
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
                  {config.label}
                </span>
                <div className="flex-1 h-px bg-[#2a2f3e]/30" />
              </div>
              <ul className="space-y-1 ml-4">
                {items.map((item) => {
                  const isActive = pathname === `/project/${item.name}`;
                  const Icon = iconMap[item.name] || iconMap.default;

                  return (
                    <li key={item.name}>
                      <Link
                        href={`/project/${item.name}`}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          transition-all duration-200
                          ${isActive
                            ? `bg-[#2d3748] text-white shadow-sm`
                            : "text-[#cbd5e1] hover:bg-[#2d3748]/60 hover:text-white"
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-[#64748b]"}`} />
                        <span className="flex-1 font-medium text-sm capitalize">{item.name}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        <div className="mt-6 pt-4 border-t border-[#2a2f3e]/30">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#cbd5e1] hover:bg-[#2d3748]/60 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748b]" />
            <span className="font-medium text-sm">Back to Cover</span>
          </Link>
        </div>
        <div className="mt-4 pt-2 text-xs text-[#64748b] flex items-center gap-2">
          <FileText size={14} />
          <span>{menuItems.length} menu tersedia</span>
        </div>
      </aside>
    </>
  );
}