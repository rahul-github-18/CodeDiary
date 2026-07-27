"use client";

import React, { Suspense } from 'react';
import LandingView from '@/components/LandingView';

export default function EnrollPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600 font-sans">
        Loading workspace...
      </div>
    }>
      <LandingView initialMode="enroll" />
    </Suspense>
  );
}
