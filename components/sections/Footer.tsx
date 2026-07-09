export default function Footer() {
  return (
    <footer className="relative mx-auto max-w-6xl px-6 pb-10">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-[#1f2c45] pt-8 text-[11px] text-[#7c8aac] sm:flex-row">
        <p style={{ fontFamily: "'Poppins', sans-serif" }}>
          © {new Date().getFullYear()} Kasyaf. All rights reserved.
        </p>
        <p className="flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#39e6b5]" />
          System status: online
        </p>
      </div>
    </footer>
  );
}