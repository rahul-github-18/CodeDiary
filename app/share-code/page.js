"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import Layout from '@/components/Layout';
import FloatingNav from '@/components/FloatingNav';
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
  const [newCode, setNewCode] = useState('');
  const [snippetLanguage, setSnippetLanguage] = useState('javascript');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Share result
  const [generatedShareCode, setGeneratedShareCode] = useState('');
  
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
      handleRetrieveCode(codeParam);
    }
  }, [codeParam]);

  const handleShare = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setSaving(true);
    setError('');
    setGeneratedShareCode('');

    try {
      // Generate unique 4-digit code
      const shareCode = Math.floor(1000 + Math.random() * 9000).toString();
      const payloadCode = `[lang:${snippetLanguage}]\n${newCode}`;

      await shareService.createSharedCode(shareCode, payloadCode);
      setGeneratedShareCode(shareCode);
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
      
      {/* Upper 4-Digit Retrieval Box (Only Code Box Above) */}
      <div className="flex items-center justify-between gap-4 bg-white/90 border border-slate-200/90 rounded-2xl px-5 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-xs font-extrabold text-slate-800 tracking-tight">Retrieve Shared Code:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">4-Digit Code:</span>
          <input
            type="text"
            placeholder="1234"
            maxLength={4}
            className="w-20 sm:w-24 rounded-xl border border-slate-300 bg-slate-50 py-1.5 px-2.5 text-center text-sm font-extrabold text-slate-900 tracking-widest outline-none transition focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
            value={retrievalKey}
            onChange={(e) => setRetrievalKey(e.target.value.replace(/\D/g, ''))}
          />
          <button
            type="button"
            onClick={() => handleRetrieveCode()}
            disabled={retrievalLoading || retrievalKey.length !== 4}
            className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            {retrievalLoading ? 'Loading...' : 'View Snippet'}
          </button>
        </div>
      </div>

      {retrievalError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
          {retrievalError}
        </div>
      )}

      {/* Main Snippet Sharing Form */}
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
            {saving ? 'Generating...' : 'Share & Generate 4-Digit Code'}
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
              theme="vs-dark"
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

        {/* Generated Share Code Output Box */}
        {generatedShareCode && (
          <div className="mt-2 p-6 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col items-center gap-3 text-center animate-in fade-in duration-200">
            <span className="text-xs font-extrabold text-sky-800 tracking-wider uppercase">
              YOUR 4-DIGIT SHARE CODE
            </span>
            <div className="px-6 py-3 rounded-2xl bg-white border border-sky-300 shadow-sm">
              <span className="text-4xl sm:text-5xl font-black text-sky-600 tracking-[8px]">
                {generatedShareCode}
              </span>
            </div>
            <p className="text-xs text-sky-700 font-medium">
              Shared code automatically expires in 15 minutes.
            </p>
            <div className="flex gap-3 w-full max-w-xs mt-1">
              <button 
                type="button"
                className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs transition-all cursor-pointer"
                onClick={() => copyToClipboard(generatedShareCode, 'Share key copied!')}
              >
                Copy Code
              </button>
              <button 
                type="button"
                className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 text-white hover:bg-sky-500 font-bold text-xs shadow-xs transition-all cursor-pointer"
                onClick={() => {
                  const link = `${window.location.origin}/share-code?code=${generatedShareCode}`;
                  copyToClipboard(link, 'Direct sharing link copied!');
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {/* Retrieved Snippet Display Block */}
        {retrievedSnippet && (
          <div className="flex flex-col gap-4 mt-2 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left animate-in fade-in duration-200">
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
                theme="vs-dark"
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
        )}
      </form>
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
