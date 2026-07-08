import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                starFall: {
                    '0%': { transform: 'translateY(0) translateX(0) scale(0)', opacity: '0' },
                    '20%': { opacity: '1' },
                    '100%': { transform: 'translateY(100vh) translateX(50vw) scale(1.5)', opacity: '0' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '0.2' },
                    '50%': { opacity: '1' },
                },
                sparkle: {
                    '0%': { transform: 'scale(0) translate(0, 0)', opacity: '1' },
                    '100%': { transform: 'scale(1.5) translate(var(--x), var(--y))', opacity: '0' },
                }
            },
            animation: {
                'star-fall': 'starFall linear infinite',
                'twinkle': 'twinkle 4s ease-in-out infinite',
                sparkle: 'sparkle 0.8s ease-out forwards',
            }
        }
    }
};
export default config;