import { useId } from "react";

/**
 * Kasyaf brand mark (split shield + K), inline SVG: crisp at any size, no
 * network request. Same artwork as public/images/logo-mark.svg and app/icon.svg.
 */
export default function BrandMark({
  className = "h-8 w-8",
  title = "Kasyaf",
}: {
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const blue = `kb-${id}`;
  const gray = `kg-${id}`;
  const stem = `ks-${id}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={blue} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id={gray} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b7280" />
          <stop offset="1" stopColor="#374151" />
        </linearGradient>
        <linearGradient id={stem} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8fafc" />
          <stop offset=".55" stopColor="#f8fafc" />
          <stop offset=".56" stopColor="#4f63ea" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path d="M30.5 5.5 9 12.6V30c0 13.6 9.2 23.6 21.5 28.4" stroke={`url(#${blue})`} strokeWidth="4" strokeLinejoin="round" />
      <path d="M33.5 5.5 55 12.6V30c0 13.6-9.2 23.6-21.5 28.4" stroke={`url(#${gray})`} strokeWidth="4" strokeLinejoin="round" />
      <path d="M22 18.5h6.2v27H22z" fill={`url(#${stem})`} />
      <path d="M28.2 30.2 38.6 18.5h7.6L32.6 33.4z" fill="#f8fafc" />
      <path d="M30.4 34.6l2.4-2.9 13.6 13.8h-7.7z" fill="#f8fafc" />
    </svg>
  );
}
