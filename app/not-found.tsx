import Link from "next/link";
import { Poppins } from "next/font/google";
import { Terminal } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function NotFound() {
  return (
    <main
      className={`${poppins.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-6`}
    >
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[150px]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
          linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
          <Terminal className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="select-none text-[120px] font-extrabold leading-none tracking-tight text-emerald-400 drop-shadow-[0_0_35px_rgba(16,185,129,.45)] md:text-[180px]">
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-slate-400 md:text-lg">
          Sepertinya halaman yang kamu cari tidak tersedia, telah dipindahkan,
          atau URL yang dimasukkan tidak valid.
        </p>
        <Link
          href="/"
          className="group mt-10 rounded-xl border border-emerald-500/30 bg-emerald-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:bg-emerald-400 hover:shadow-emerald-400/40"
        >
          <span className="transition-all duration-300 group-hover:tracking-wide">
            ← Kembali ke Beranda
          </span>
        </Link>
        <p className="mt-12 text-sm text-slate-600">
          Error 404 • Resource Not Found
        </p>
      </div>
    </main>
  );
}
