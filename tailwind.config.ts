import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                purple: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
            },
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
                },
                glow: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                }
            },
            animation: {
                'star-fall': 'starFall linear infinite',
                'twinkle': 'twinkle 4s ease-in-out infinite',
                sparkle: 'sparkle 0.8s ease-out forwards',
                'glow': 'glow 2s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        }
    }
};
export default config;