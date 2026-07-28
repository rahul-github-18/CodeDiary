"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api';
import FloatingNav from '@/components/FloatingNav';

export default function LandingView({ initialMode = null }) {
  const [activeMode, setActiveMode] = useState(initialMode); // null | 'login' | 'enroll'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [enrollStep, setEnrollStep] = useState(1); // 1: Details, 2: OTP verification, 3: Registration Success Welcome
  const [userOtp, setUserOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(120); // 2 min resend timer

  const router = useRouter();

  useEffect(() => {
    setActiveMode(initialMode);
    setEnrollStep(1);
    setTimerSeconds(120);
  }, [initialMode]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.replace('/');
    }
  }, [router]);

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

  // 2-minute countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (activeMode === 'enroll' && enrollStep === 2 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [activeMode, enrollStep, timerSeconds]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Step 1: Click "Register" -> Send OTP via SMTP API & start 2-min timer
  const handleRegisterClick = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setLoading(true);
    try {
      // Call backend API to create pending user (approved: false) & send OTP via SMTP
      const res = await authService.sendOtp(email.trim(), username.trim(), password);
      setUserOtp('');
      setTimerSeconds(120);
      setSuccess(res.message || `Verification OTP sent to ${email.trim()}`);
      setEnrollStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send OTP verification email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Click "Verify OTP & Complete Registration" -> Send OTP to backend API for verification
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userOtp.trim()) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      // Register user in database with verified OTP
      await authService.register(username.trim(), email.trim(), password, userOtp.trim());
      
      // Move to Step 3: Registration Success Welcome Card
      setSuccess('');
      setError('');
      setEnrollStep(3);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid OTP code. Please check your email inbox and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler with 2-min timer
  const handleResendOtp = async () => {
    if (timerSeconds > 0 || loading) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authService.sendOtp(email.trim(), username.trim());
      setUserOtp('');
      setTimerSeconds(120); // Reset 2 min timer
      setSuccess(`A new OTP code has been sent to ${email.trim()}!`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Login submission (Redirects to Dashboard '/')
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = await authService.login(username.trim(), password);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('currentUser', JSON.stringify(user));

      router.replace('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setError('');
    setSuccess('');
    setActiveMode(null);
    setEnrollStep(1);
    setUserOtp('');
    setTimerSeconds(120);
    router.push('/');
  };

  const switchMode = (mode) => {
    setError('');
    setSuccess('');
    setEnrollStep(1);
    setUserOtp('');
    setTimerSeconds(120);
    setActiveMode(mode);
    if (mode === 'enroll') {
      router.push('/enroll');
    } else if (mode === 'login') {
      router.push('/login');
    }
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
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Developer Workspace & Learning Platform</span>
          </div>

          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/light-logo.png"
              alt="CodeDiary Logo"
              className="h-10 w-10 rounded-xl object-contain bg-white p-1.5 border border-slate-300 shadow-sm"
            />
            <span className="text-slate-900 font-extrabold text-2xl tracking-tight">CodeDiary</span>
          </div>

          {/* Main Hero Title & Subtitle */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            Your Personal <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500">Developer Workspace</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
            Organize programming topics, practice Data Structures & Algorithms, write structured notes, and track your daily learning progress—all in one place.
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300/80 text-xs font-bold text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              Topics & Curriculum
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300/80 text-xs font-bold text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              Code Snippets & Sharing
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300/80 text-xs font-bold text-slate-700 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Activity Metrics
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING MODAL OVERLAY */}
      {activeMode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className={`w-full max-w-[390px] rounded-3xl border p-7 shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden text-slate-900 backdrop-blur-xl ${
            activeMode === 'enroll'
              ? 'bg-gradient-to-br from-white/90 via-emerald-50/70 to-teal-50/50 border-emerald-200/80 shadow-emerald-950/10'
              : 'bg-gradient-to-br from-white/90 via-sky-50/70 to-indigo-50/50 border-sky-200/80 shadow-sky-950/10'
          }`}>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200"
              title="Close modal (Esc)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            {enrollStep !== 3 && (
              <div className="text-left mb-6 pr-8">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3 border ${
                  activeMode === 'enroll' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' 
                    : 'bg-sky-50 text-sky-700 border-sky-200/80'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${activeMode === 'enroll' ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500 animate-pulse'}`} />
                  <span>
                    {activeMode === 'enroll' 
                      ? (enrollStep === 1 ? 'Step 1 of 2: Registration Details' : 'Step 2 of 2: Email OTP Verification')
                      : 'User Authentication'}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {activeMode === 'enroll' 
                    ? (enrollStep === 1 ? 'Enroll Account' : 'Verify Email OTP') 
                    : 'Sign In'}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  {activeMode === 'enroll' 
                    ? (enrollStep === 1 
                        ? 'Fill in your details below to receive your OTP verification email.' 
                        : `Check your email inbox (${email || 'your email'}) for the 6-digit verification code.`)
                    : 'Enter your credentials to access your developer workspace.'}
                </p>
              </div>
            )}

            {/* Error Alert Box */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 mb-5 shadow-xs">
                <svg className="h-4 w-4 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Success Alert Box (Step 1 only) */}
            {success && enrollStep === 1 && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 mb-5 shadow-xs">
                <svg className="h-4 w-4 shrink-0 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            )}

            {/* FORM BODY */}
            {activeMode === 'enroll' ? (
              enrollStep === 1 ? (
                /* Step 1: UserName, Email, Password + Register Button */
                <form onSubmit={handleRegisterClick} className="flex flex-col gap-4">
                  {/* 1. UserName Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-700" htmlFor="modal-username">
                      UserName <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="modal-username"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium"
                        placeholder="Choose a username"
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
                  </div>

                  {/* 2. Email Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-700" htmlFor="modal-email">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        id="modal-email"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  {/* 3. Password Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-700" htmlFor="modal-password">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="modal-password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-medium"
                        placeholder="Choose a password"
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

                  {/* 4. Register Action Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-extrabold text-white shadow-lg transition-all transform active:scale-[0.98] cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending OTP Email...
                      </span>
                    ) : (
                      <>
                        <span>Register</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              ) : enrollStep === 2 ? (
                /* Step 2: OTP Verification & 2-Min Timer (Clean UI) */
                <form onSubmit={handleVerifyAndRegister} className="flex flex-col gap-4">
                  {/* OTP Input Field */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-extrabold text-slate-700" htmlFor="modal-otp">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        id="modal-otp"
                        maxLength={6}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-center tracking-[0.4em] font-mono text-lg text-slate-900 placeholder-slate-300 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
                        placeholder="------"
                        value={userOtp}
                        onChange={(e) => {
                          setUserOtp(e.target.value.replace(/\D/g, ''));
                          setError('');
                        }}
                        disabled={loading}
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 flex w-full items-center justify-center rounded-xl py-3.5 px-4 text-sm font-extrabold text-white shadow-lg transition-all transform active:scale-[0.98] cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying OTP...
                      </span>
                    ) : (
                      'Verify OTP & Complete Registration'
                    )}
                  </button>

                  {/* 2-Min Resend Timer Controls */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEnrollStep(1);
                        setError('');
                      }}
                      className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timerSeconds > 0 || loading}
                      className={`font-bold transition-all flex items-center gap-1.5 ${
                        timerSeconds > 0 || loading 
                          ? 'text-slate-400 cursor-not-allowed' 
                          : 'text-emerald-700 hover:text-emerald-900 cursor-pointer'
                      }`}
                    >
                      <span>Resend OTP</span>
                      {timerSeconds > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono text-slate-600 border border-slate-200">
                          {formatTimer(timerSeconds)}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 3: Lean Registration Successful Card */
                <div className="flex flex-col items-center justify-center text-center py-4 animate-in zoom-in-95 duration-200">
                  {/* Brand Logo */}
                  <img
                    src="/light-logo.png"
                    alt="CodeDiary Logo"
                    className="h-14 w-14 rounded-2xl object-contain bg-white p-2 border border-slate-200 shadow-md mb-4"
                  />

                  {/* Clean Title */}
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1.5">
                    Registration Successful!
                  </h3>

                  {/* Simple Subtitle */}
                  <p className="text-xs text-slate-500 font-medium mb-6">
                    Your account has been verified and is ready for use.
                  </p>

                  {/* Action Button: Proceed to Login */}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition-all transform active:scale-[0.98] cursor-pointer bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 hover:from-sky-500 hover:to-indigo-500"
                  >
                    <span>Proceed to Login</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )
            ) : (
              /* Login Form */
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                {/* Username Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-extrabold text-slate-700" htmlFor="modal-username">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="modal-username"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 font-medium"
                      placeholder="Enter username"
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
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-extrabold text-slate-700" htmlFor="modal-password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="modal-password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 font-medium"
                      placeholder="Enter password"
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

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center rounded-xl py-3.5 px-4 text-sm font-extrabold text-white shadow-lg transition-all transform active:scale-[0.98] cursor-pointer bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 hover:from-sky-500 hover:to-indigo-500 shadow-sky-600/25"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            )}

            {/* Mode Switcher Footer Link */}
            {enrollStep !== 3 && (
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                {activeMode === 'enroll' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('enroll')}
                      className="font-extrabold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
                    >
                      Enroll now
                    </button>
                  </span>
                )}
              </div>
            )}

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
