"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function FloatingNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams ? searchParams.get('mode') : null;

  const isAboutActive = pathname === '/about';
  const isShareCodeActive = pathname === '/share-code';
  const isLoginActive = pathname === '/login' && mode !== 'register' && mode !== 'enroll';
  const isEnrollActive = pathname === '/login' && (mode === 'register' || mode === 'enroll');

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw]">
      <nav 
        aria-label="Main Navigation"
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-slate-900/5 transition-all"
      >
        {/* Brand Link */}
        <Link 
          href="/" 
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <img 
            src="/light-logo.png" 
            alt="CodeDiary Logo" 
            className="w-5 h-5 rounded-md object-contain bg-slate-100 dark:bg-slate-800 p-0.5" 
          />
          <span className="hidden xs:inline tracking-tight">CodeDiary</span>
        </Link>

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 my-auto" />

        {/* 1. About */}
        <Link
          href="/about"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isAboutActive
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Share Code
        </Link>

        {/* 3. Login */}
        <Link
          href="/login?mode=login"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isLoginActive
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Login
        </Link>

        {/* 4. Enroll */}
        <Link
          href="/login?mode=enroll"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isEnrollActive
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/40'
          }`}
        >
          Enroll
        </Link>
      </nav>
    </div>
  );
}
