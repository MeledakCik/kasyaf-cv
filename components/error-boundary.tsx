// components/error-boundary.tsx
"use client";
import React from "react";
import Link from "next/link";
import { reportBoundaryError } from "@/lib/sensor-client";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class CvErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportBoundaryError(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-6 text-white"
          style={{ fontFamily: "sans-serif" }}
        >
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[150px]" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-400"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Terjadi Kesalahan
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-400 md:text-lg">
              Maaf, terjadi kesalahan tak terduga. Tim kami telah diberitahu.
              Silakan coba muat ulang halaman atau kembali ke beranda.
            </p>
            <Link
              href="/"
              className="group mt-10 rounded-xl border border-red-500/30 bg-red-500 px-8 py-3 font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:bg-red-400 hover:shadow-red-400/40"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                ← Kembali ke Beranda
              </span>
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}