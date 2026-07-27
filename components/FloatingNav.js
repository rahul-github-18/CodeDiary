"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingNav() {
  const pathname = usePathname();

  const isAboutActive = pathname === '/about';
  const isShareCodeActive = pathname === '/share-code';
  const isLoginActive = pathname === '/login';
  const isEnrollActive = pathname === '/enroll';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw]">
      <nav 
        aria-label="Main Navigation"
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-900/5 transition-all"
      >
        {/* Brand Link */}
        <Link 
          href="/" 
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-slate-800 font-bold text-xs sm:text-sm hover:text-sky-600 transition-colors"
        >
          <img 
            src="/light-logo.png" 
            alt="CodeDiary Logo" 
            className="w-5 h-5 rounded-md object-contain bg-slate-100 p-0.5" 
          />
          <span className="hidden xs:inline tracking-tight">CodeDiary</span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-200 my-auto" />

        {/* 1. About */}
        <Link
          href="/about"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isAboutActive
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          About
        </Link>

        {/* 2. Share Code */}
        <Link
          href="/share-code"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isShareCodeActive
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Share Code
        </Link>

        {/* 3. Login */}
        <Link
          href="/login"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isLoginActive
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Login
        </Link>

        {/* 4. Enroll */}
        <Link
          href="/enroll"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isEnrollActive
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
          }`}
        >
          Enroll
        </Link>
      </nav>
    </div>
  );
}
