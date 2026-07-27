"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api';
import FloatingNav from '@/components/FloatingNav';

function LoginContent() {
  const [activeMode, setActiveMode] = useState(null); // null | 'login' | 'enroll'
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams ? searchParams.get('mode') : null;

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.replace('/');
    }
  }, [router]);

  // React to URL query parameters dynamically
  useEffect(() => {
    if (modeParam === 'register' || modeParam === 'enroll') {
      setActiveMode('enroll');
      setIsRegisterMode(true);
    } else if (modeParam === 'login') {
      setActiveMode('login');
      setIsRegisterMode(false);
    } else {
      setActiveMode(null);
      setIsRegisterMode(false);
    }
  }, [modeParam]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeMode) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegisterMode) {
        // Register (Enrollment request)
        const response = await authService.register(username, password);
        setSuccess(response.message || 'Registration successful! Wait for admin approval.');
        setIsRegisterMode(false);
        setActiveMode('login');
        setUsername('');
        setPassword('');
      } else {
        // Login
        const user = await authService.login(username, password);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('currentUser', JSON.stringify(user));

        router.replace('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const openLogin = () => {
    setError('');
    setSuccess('');
    setActiveMode('login');
    setIsRegisterMode(false);
    router.push('/login?mode=login');
  };

  const openEnroll = () => {
    setError('');
    setSuccess('');
    setActiveMode('enroll');
    setIsRegisterMode(true);
    router.push('/login?mode=enroll');
  };

  const closeModal = () => {
    setError('');
    setSuccess('');
    setActiveMode(null);
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-slate-100 p-4 font-sans select-none text-slate-900 relative overflow-hidden">
      {/* Floating Header Navigation */}
      <FloatingNav />

      {/* Soft Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />

      {/* Main Content Area: Pristine Landing Page */}
      <div className="flex-1 flex items-center justify-center w-full z-10 pt-20 pb-10">
        <div className="flex flex-col items-center justify-center text-center max-w-[720px] px-4 my-12">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/light-logo.png"
              alt="CodeDiary Logo"
              className="h-12 w-12 rounded-2xl object-contain bg-white p-1.5 border border-slate-300 shadow-md"
            />
            <span className="text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight">Code Diary</span>
          </div>

          {/* Main Hero Title & Subtitle */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            Your developer workspace.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-normal">
            Organize programming topics, save code snippets, and track daily progress in one structured developer dashboard.
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300/80 text-xs font-bold text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              Topics & Curriculum
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300/80 text-xs font-bold text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Code Snippets
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300/80 text-xs font-bold text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Activity Metrics
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING MODAL OVERLAY (Login & Enroll Popup) */}
      {activeMode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-[420px] rounded-2xl border border-slate-300/90 bg-white p-7 shadow-2xl shadow-slate-900/20 relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="text-left mb-6 pr-6">
              <h2 className="text-xl font-bold text-slate-900">
                {activeMode === 'enroll' ? 'Enroll Account' : 'Welcome back'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeMode === 'enroll' ? 'Submit account request for enrollment' : 'Enter your credentials to access your workspace'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-200/80 p-1 mb-6 border border-slate-300/80 text-xs font-medium">
              <button
                type="button"
                className={`flex-1 rounded-lg py-1.5 text-center transition-all cursor-pointer ${activeMode === 'login' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={openLogin}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 rounded-lg py-1.5 text-center transition-all cursor-pointer ${activeMode === 'enroll' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={openEnroll}
              >
                Enroll User
              </button>
            </div>

            {/* Error Alert Box */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 mb-5">
                <svg className="h-4 w-4 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert Box */}
            {success && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 mb-5">
                <svg className="h-4 w-4 shrink-0 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="modal-username">
                  Username
                </label>
                <input
                  type="text"
                  id="modal-username"
                  className="w-full rounded-xl border border-slate-300 bg-slate-100/80 py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 font-medium"
                  placeholder={activeMode === 'enroll' ? "Choose a username" : "Enter username"}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  autoFocus
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700" htmlFor="modal-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="modal-password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-100/80 py-2.5 pl-3.5 pr-10 text-sm text-slate-900 placeholder-slate-500 outline-none transition focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 font-medium"
                    placeholder={activeMode === 'enroll' ? "Choose a password" : "Enter password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mt-2 flex w-full items-center justify-center rounded-xl py-3 px-4 text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
                  loading ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : activeMode === 'enroll' ? (
                  'Enroll Account'
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="w-full border-t border-slate-200/80 py-5 px-4 text-xs text-slate-500 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Copyright © {new Date().getFullYear()} CodeDiary. All Rights Reserved.
          </p>
          <a 
            href="https://www.linkedin.com/in/rahul-ranjan-6b2ab424a/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600 font-sans">
        Loading workspace...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
