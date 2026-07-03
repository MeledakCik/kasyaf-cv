"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TiltCard } from "@/components/function/TiltCard";
import { TEMPLATE_CATEGORIES, TEMPLATES } from "@/lib/templates-data";

const FILTERS = ["All", ...TEMPLATE_CATEGORIES];

export default function TemplatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");

  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const handleFilterClick = (cat: string) => {
    router.push(cat === "All" ? "/template" : `/template?category=${cat}`);
  };

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-500 select-none p-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Template Koleksi</h1>
          <p className="text-white/40 font-medium">Pilih gaya yang sesuai untuk proyek Anda</p>
        </div>

        <div className="flex bg-[#0d1326] p-1 rounded-xl border border-white/5">
          {FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.filter(t => activeCategory === "All" || t.category === activeCategory).map((tpl) => (
          <div key={tpl.id} className="group">
            <TiltCard card={tpl} onClick={() => router.push(tpl.path)}  />
          </div>
        ))}
      </div>
    </div>
  );
}