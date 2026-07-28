"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import Layout from '@/components/Layout';
import FloatingNav from '@/components/FloatingNav';
import Footer from '@/components/Footer';
import { shareService } from '@/lib/api';

function ExpiryCountdown({ createdAtStr }) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      if (!createdAtStr) return;
      const createdTime = new Date(createdAtStr).getTime();
      const expiryTime = createdTime + (15 * 60 * 1000); // 15 minutes
      const remainingMs = expiryTime - Date.now();

      if (remainingMs <= 0) {
        setCountdown('Expired');
      } else {
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [createdAtStr]);

  return (
    <span className="text-xs font-semibold text-red-500">
      Expires in: {countdown}
    </span>
  );
}

function ShareCodeContent({ isLoggedIn }) {
  const [activeTab, setActiveTab] = useState('share'); // 'share' or 'get'
  const [newCode, setNewCode] = useState('');
  const [snippetLanguage, setSnippetLanguage] = useState('javascript');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');

  // Retrieval states
  const [retrievalKey, setRetrievalKey] = useState('');
  const [retrievedSnippet, setRetrievedSnippet] = useState(null);
  const [retrievalLoading, setRetrievalLoading] = useState(false);
  const [retrievalError, setRetrievalError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get('code');

  // Auto-retrieve if code query param is present
  useEffect(() => {
    if (codeParam && codeParam.length === 4) {
      setRetrievalKey(codeParam);
      setActiveTab('get');
      handleRetrieveCode(codeParam);
    }
  }, [codeParam]);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setSaving(true);
    setError('');
    setShareSuccess('');

    try {
      // Generate unique 4-digit code
      const shareCode = Math.floor(1000 + Math.random() * 9000).toString();
      const payloadCode = `[lang:${snippetLanguage}]\n${newCode}`;

      await shareService.createSharedCode(shareCode, payloadCode);

      // Fill generated code into the top code box directly
      setRetrievalKey(shareCode);
      setShareSuccess(`Snippet shared! Your 4-digit code is ${shareCode} (filled in the box above).`);

      // Auto-copy to clipboard
      try {
        navigator.clipboard.writeText(shareCode);
      } catch (clipErr) {
        console.warn('Clipboard write warning:', clipErr);
      }

      setNewCode('');
    } catch (err) {
      console.error(err);
      setError('Failed to share code snippet.');
    } finally {
      setSaving(false);
    }
  };

  const handleRetrieveCode = async (keyToRetrieve) => {
    const key = (keyToRetrieve || retrievalKey).trim();
    if (key.length !== 4) {
      setRetrievalError('Please enter a valid 4-digit code.');
      return;
    }

    setRetrievalLoading(true);
    setRetrievalError('');
    setRetrievedSnippet(null);

    try {
      const data = await shareService.getSharedCodeByKey(key);
      if (data && data.length > 0) {
        const snippet = data[0];

        let parsedLanguage = 'javascript';
        let parsedCode = snippet.code;

        if (snippet.code.startsWith('[lang:')) {
          const match = snippet.code.match(/^\[lang:([^\]]+)\]\n([\s\S]*)$/);
          if (match) {
            parsedLanguage = match[1];
            parsedCode = match[2];
          }
        }

        setRetrievedSnippet({
          ...snippet,
          language: parsedLanguage,
          code: parsedCode
        });
        setActiveTab('get');
      } else {
        setRetrievalError('No active snippet found for this code. It may have expired.');
      }
    } catch (err) {
      console.error(err);
      setRetrievalError('Failed to retrieve code snippet.');
    } finally {
      setRetrievalLoading(false);
    }
  };

  const copyToClipboard = (text, message = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    alert(message);
  };

  const innerUI = (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">

      {/* Top Bar with Old-Style Tab Switcher & 4-Digit Code Box */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 border border-slate-200/90 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
        {/* Old-style Share Code / Get Code Tab Switcher */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 border border-slate-300/80 text-xs font-medium w-full sm:w-64">
          <button
            type="button"
            onClick={() => {
              setActiveTab('share');
              setError('');
            }}
            className={`flex-1 rounded-lg py-2 text-center transition-all cursor-pointer ${activeTab === 'share' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Share Code
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('get');
              setRetrievalError('');
            }}
            className={`flex-1 rounded-lg py-2 text-center transition-all cursor-pointer ${activeTab === 'get' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Get Code
          </button>
        </div>

        {/* 4-Digit Code Box */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">4-Digit Code:</span>
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="1234"
              maxLength={4}
              className={`w-20 sm:w-24 rounded-xl py-1.5 px-2.5 text-center text-sm font-extrabold tracking-widest outline-none transition-all ${retrievalKey && retrievalKey.length === 4
                  ? 'bg-sky-50 border-2 border-sky-500 text-sky-600 shadow-sm ring-4 ring-sky-500/20'
                  : 'border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20'
                }`}
              value={retrievalKey}
              onChange={(e) => setRetrievalKey(e.target.value.replace(/\D/g, ''))}
            />
            <button
              type="button"
              onClick={() => handleRetrieveCode()}
              disabled={retrievalLoading || retrievalKey.length !== 4}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {retrievalLoading ? 'Loading...' : 'View Snippet'}
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally Render Share / Get Card */}
      {activeTab === 'share' ? (
        /* Share Snippet Card */
        <form onSubmit={handleShare} className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-sm flex flex-col gap-6">

          {/* Header Row: Title on Left, Generate Button on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Share a Snippet</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Paste your code below to get a temporary 4-digit code.</p>
            </div>

            <button
              type="submit"
              disabled={saving || !newCode.trim()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-[0.99] font-bold text-white shadow-md shadow-sky-600/25 flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap self-start sm:self-auto"
            >
              {saving ? 'Generating...' : 'Generate Code'}
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase">Language</label>
            <select
              value={snippetLanguage}
              onChange={(e) => setSnippetLanguage(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 font-medium"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
              <option value="plaintext">Plain Text</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase">Paste Code</label>
            <div className="h-72 rounded-2xl overflow-hidden border border-slate-300">
              <Editor
                height="100%"
                language={snippetLanguage}
                theme="light"
                value={newCode}
                onChange={(val) => setNewCode(val || '')}
                options={{
                  selectOnLineNumbers: true,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  autoClosingBrackets: 'always',
                  minimap: { enabled: false },
                  fontSize: 13,
                  automaticLayout: true
                }}
              />
            </div>
          </div>

        </form>
      ) : (
        /* Retrieve Code Card */
        <div className="bg-white/90 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-sm flex flex-col gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Retrieved Shared Code</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {retrievedSnippet
                ? 'Viewing shared code snippet.'
                : 'Enter a 4-digit code in the top box and click View Snippet to display.'}
            </p>
          </div>

          {retrievalError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
              {retrievalError}
            </div>
          )}

          {retrievedSnippet ? (
            <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Retrieved Snippet ({retrievedSnippet.language})
                  </span>
                  <span className="text-slate-300">•</span>
                  <ExpiryCountdown createdAtStr={retrievedSnippet.created_at} />
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(retrievedSnippet.code, 'Code snippet copied!')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  Copy Snippet
                </button>
              </div>

              <div className="h-80 rounded-xl overflow-hidden border border-slate-300">
                <Editor
                  height="100%"
                  language={retrievedSnippet.language}
                  theme="light"
                  value={retrievedSnippet.code}
                  options={{
                    readOnly: true,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    fontSize: 13,
                    automaticLayout: true
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  if (isLoggedIn) {
    return innerUI;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans select-none relative overflow-hidden flex flex-col justify-between">
      {/* Floating Header Navigation */}
      <FloatingNav />

      {/* Soft Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10 w-full flex-1">
        {innerUI}
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

export default function ShareCodePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600 font-sans">
        Loading workspace...
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600 font-sans">Loading...</div>}>
        <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
          <ShareCodeContent isLoggedIn={true} />
        </Layout>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600 font-sans">Loading...</div>}>
      <ShareCodeContent isLoggedIn={false} />
    </Suspense>
  );
}
