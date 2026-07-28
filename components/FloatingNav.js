"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', isActive: pathname === '/' },
    { label: 'About', href: '/about', isActive: pathname === '/about' },
    { label: 'Share Code', href: '/share-code', isActive: pathname === '/share-code' },
    { label: 'Login', href: '/login', isActive: pathname === '/login' },
    { label: 'Enroll', href: '/enroll', isActive: pathname === '/enroll' },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[92vw]">
      <nav 
        aria-label="Main Navigation"
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-900/5 transition-all"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              item.isActive
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30 font-bold'
                : 'text-slate-600 border-transparent hover:text-emerald-700 hover:bg-emerald-50/80 hover:border-emerald-200/60'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
