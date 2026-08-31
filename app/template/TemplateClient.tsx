"use client";

import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/function/ProductCard";
import { PRODUCT_CATEGORIES, PRODUCTS } from "@/lib/products-data";

const FILTERS = ["All", ...PRODUCT_CATEGORIES];

export default function TemplateClient({
  initialCategory,
}: {
  initialCategory: string;
}) {
  const router = useRouter();

  // Menggunakan initialCategory langsung dari props tanpa useState & useEffect
  const activeCategory = initialCategory;

  const handleFilterClick = (cat: string) => {
    router.push(cat === "All" ? "/template" : `/template?category=${cat}`);
  };

  return (
    <div className="w-full animate-in fade-in duration-500 select-none p-4 sm:p-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            My Product
          </h1>

          <p className="text-sm sm:text-base text-white/40 font-medium">
            Kumpulan produk yang sudah saya buat
          </p>
        </div>

        <div className="flex bg-[#0d1326] p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full no-scrollbar">
          {FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`shrink-0 px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {PRODUCTS.filter(
          (p) => activeCategory === "All" || p.category === activeCategory,
        ).map((product) => (
          <div key={product.id} className="group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
