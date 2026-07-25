"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Editor from './components/Editor';
import Settings from './components/Settings';

const STARTER_CODES = {
  javascript: `// JavaScript Playground\nconsole.log("Hello, World!");\n`,
  python: `# Python 3 Playground\nprint("Hello, World!")\n`,
  cpp: `// C++ Playground\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
  c: `// C Playground\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
  java: `// Java Playground\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
  typescript: `// TypeScript Playground\nconsole.log("Hello, World!");\n`,
  go: `// Go Playground\npackage main\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}\n`,
  rust: `// Rust Playground\nfn main() {\n    println!("Hello, World!");\n}\n`,
  ruby: `# Ruby Playground\nputs "Hello, World!"\n`,
  php: `<?php\n// PHP Playground\necho "Hello, World!\\n";\n`,
  sql: `-- SQL Playground\nSELECT 'Hello, World!' AS greeting;\n`
};

const COMPILER_MAP = {
  cpp: "gcc-head",
  c: "gcc-head-c",
  python: "cpython-3.12.7",
  javascript: "nodejs-20.17.0",
  typescript: "typescript-5.6.2",
  java: "openjdk-jdk-22+36",
  go: "go-1.23.2",
  rust: "rust-1.82.0",
  ruby: "ruby-4.0.2",
  php: "php-8.3.12",
  sql: "sqlite-3.46.1",
  csharp: "dotnetcore-8.0.402"
};

const JUDGE0_MAP = {
  cpp: 105,        // C++ (GCC 14.1.0)
  c: 103,          // C (GCC 14.1.0)
  python: 100,     // Python 3.12.5
  javascript: 97,  // Node.js 20.17.0
  typescript: 101, // TypeScript 5.6.2
  java: 91,        // Java JDK 17.0.6
  go: 107,         // Go 1.23.5
  rust: 108,       // Rust 1.85.0
  ruby: 72,        // Ruby 2.7.0
  php: 98,         // PHP 8.3.11
  sql: 82,         // SQLite 3.27.2
  csharp: 51
};

function transpileJavaToJS(javaCode) {
  let body = javaCode;

  const mainMatch = javaCode.match(/public\s+static\s+void\s+main\s*\([^)]*\)\s*(?:throws\s+[\w,\s]+)?\s*\{([\s\S]*)\}\s*$/m)
    || javaCode.match(/void\s+main\s*\(\s*\)\s*\{([\s\S]*)\}\s*$/m);

  if (mainMatch && mainMatch[1]) {
    body = mainMatch[1];
  }

  body = body.replace(/System\.out\.println\s*\((.*?)\);/g, '__logs.push(String($1));');
  body = body.replace(/System\.out\.print\s*\((.*?)\);/g, '__logs.push(String($1));');

  body = body.replace(/Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\);?/g, '');
  body = body.replace(/BufferedReader\s+\w+\s*=\s*new\s+BufferedReader\s*\([^;]+\);?/g, '');
  body = body.replace(/InputStreamReader\s+\w+\s*=\s*new\s+InputStreamReader\s*\([^;]+\);?/g, '');
  body = body.replace(/\b\w+\.close\s*\(\);?/g, '');

  body = body.replace(/Integer\.parseInt\s*\(\s*\w+\.readLine\s*\(\)\s*\)/g, '(__inputs[__inputIdx++] !== undefined ? parseInt(__inputs[__inputIdx - 1]) : 0)');
  body = body.replace(/Double\.parseDouble\s*\(\s*\w+\.readLine\s*\(\)\s*\)/g, '(__inputs[__inputIdx++] !== undefined ? parseFloat(__inputs[__inputIdx - 1]) : 0.0)');
  body = body.replace(/\b\w+\.readLine\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? String(__inputs[__inputIdx - 1]) : "")');

  body = body.replace(/\b\w+\.nextInt\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? parseInt(__inputs[__inputIdx - 1]) : 0)');
  body = body.replace(/\b\w+\.nextDouble\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? parseFloat(__inputs[__inputIdx - 1]) : 0.0)');
  body = body.replace(/\b\w+\.nextFloat\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? parseFloat(__inputs[__inputIdx - 1]) : 0.0)');
  body = body.replace(/\b\w+\.nextLong\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? parseInt(__inputs[__inputIdx - 1]) : 0)');
  body = body.replace(/\b\w+\.nextLine\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? String(__inputs[__inputIdx - 1]) : "")');
  body = body.replace(/\b\w+\.next\s*\(\)/g, '(__inputs[__inputIdx++] !== undefined ? String(__inputs[__inputIdx - 1]) : "")');

  body = body.replace(/\b(int|double|float|long|boolean|String|char)\b\s+(\w+)/g, 'let $2');

  return body;
}

function detectCodeInputs(codeText, lang) {
  if (!codeText) return { prompts: [], count: 0 };

  const prompts = [];
  let inputCount = 0;

  if (lang === 'java') {
    const javaInputRegex = /(?:(\w+)\.next(?:Int|Double|Float|Long|Line|Short|Byte|Boolean)?\s*\(\)|(\w+)\.readLine\s*\(\))/g;
    let match;

    while ((match = javaInputRegex.exec(codeText)) !== null) {
      inputCount++;
      const inputPos = match.index;
      const codeBefore = codeText.substring(0, inputPos);

      const printMatches = [...codeBefore.matchAll(/System\.out\.print(?:ln)?\s*\(\s*"([^"]+)"\s*\)/g)];

      if (printMatches.length > 0) {
        prompts.push(printMatches[printMatches.length - 1][1]);
      } else {
        prompts.push(`Enter Input ${inputCount}: `);
      }
    }
  } else if (lang === 'cpp') {
    const cinRegex = /cin\s*>>\s*\w+/g;
    let match;

    while ((match = cinRegex.exec(codeText)) !== null) {
      inputCount++;
      const inputPos = match.index;
      const codeBefore = codeText.substring(0, inputPos);

      const coutMatches = [...codeBefore.matchAll(/cout\s*<<\s*"([^"]+)"/g)];
      if (coutMatches.length > 0) {
        prompts.push(coutMatches[coutMatches.length - 1][1]);
      } else {
        prompts.push(`Enter Input ${inputCount}: `);
      }
    }
  } else if (lang === 'c') {
    const scanfRegex = /scanf\s*\(/g;
    let match;

    while ((match = scanfRegex.exec(codeText)) !== null) {
      inputCount++;
      const inputPos = match.index;
      const codeBefore = codeText.substring(0, inputPos);

      const printfMatches = [...codeBefore.matchAll(/printf\s*\(\s*"([^"]+)"\s*\)/g)];
      if (printfMatches.length > 0) {
        prompts.push(printfMatches[printfMatches.length - 1][1]);
      } else {
        prompts.push(`Enter Input ${inputCount}: `);
      }
    }
  } else if (lang === 'python') {
    const inputRegex = /input\s*\(\s*(?:"([^"]+)"|'([^']+)')?\s*\)/g;
    let match;

    while ((match = inputRegex.exec(codeText)) !== null) {
      inputCount++;
      const promptStr = match[1] || match[2];
      if (promptStr) {
        prompts.push(promptStr);
      } else {
        const codeBefore = codeText.substring(0, match.index);
        const printMatches = [...codeBefore.matchAll(/print\s*\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g)];
        if (printMatches.length > 0) {
          prompts.push(printMatches[printMatches.length - 1][1] || printMatches[printMatches.length - 1][2]);
        } else {
          prompts.push(`Enter Input ${inputCount}: `);
        }
      }
    }
  }

  return { prompts, count: inputCount };
}

function formatInteractiveOutput(rawOutput, inputsArray) {
  if (!rawOutput) return "";
  if (!inputsArray || inputsArray.length === 0) return rawOutput;

  let inputIdx = 0;
  let result = rawOutput;

  // Interleave user inputs after prompts (e.g. "Enter a: ", "Enter b: ")
  result = result.replace(/([^:\n]+:\s*)/g, (match) => {
    if (inputIdx < inputsArray.length) {
      const val = inputsArray[inputIdx++];
      return match + val + "\n";
    }
    return match;
  });

  return result;
}

function CodeEditorContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER_CODES.javascript);
  const [inputsList, setInputsList] = useState([]);
  const [consoleInput, setConsoleInput] = useState('');
  const [rawStdinText, setRawStdinText] = useState('');
  const [output, setOutput] = useState('');
  const [executionError, setExecutionError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputMode, setInputMode] = useState('terminal'); // 'terminal' | 'stdin'
  const [historyList, setHistoryList] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [pyodideReady, setPyodideReady] = useState(false);

  const consoleInputRef = useRef(null);
  const terminalLogsContainerRef = useRef(null);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    wandboxUrl: "https://wandbox.org",
    theme: "light",
    tabSize: 2,
    fontSize: 14
  });

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [router]);

  // Load Pyodide for Python client-side instant execution
  useEffect(() => {
    if (language === 'python' && typeof window !== 'undefined' && !window.pyodideInstance && !window.pyodideLoading) {
      window.pyodideLoading = true;
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      script.onload = async () => {
        try {
          if (window.loadPyodide) {
            window.pyodideInstance = await window.loadPyodide();
            setPyodideReady(true);
          }
        } catch (err) {
          console.warn("Pyodide load failed, fallback to cloud engine:", err);
        } finally {
          window.pyodideLoading = false;
        }
      };
      document.body.appendChild(script);
    }
  }, [language]);

  // Auto scroll terminal log output to bottom
  useEffect(() => {
    if (terminalLogsContainerRef.current) {
      terminalLogsContainerRef.current.scrollTop = terminalLogsContainerRef.current.scrollHeight;
    }
  }, [output, executionError, inputsList, isRunning, awaitingInput]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_CODES[newLang] || `// ${newLang} snippet\n`);
    setOutput('');
    setExecutionError('');
    setExecutionTime(null);
    setConsoleInput('');
    setInputsList([]);
    setRawStdinText('');
    setAwaitingInput(false);
  };

  const handleClearConsole = () => {
    setOutput('');
    setExecutionError('');
    setExecutionTime(null);
    setConsoleInput('');
    setInputsList([]);
    setRawStdinText('');
    setAwaitingInput(false);
    if (consoleInputRef.current) {
      consoleInputRef.current.focus();
    }
  };

  const handleReset = () => {
    setCode(STARTER_CODES[language] || '');
    handleClearConsole();
  };

  const runCodeLocalJS = (currentInputs = []) => {
    const startTime = performance.now();
    let logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args) => logs.push("[ERROR] " + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      warn: (...args) => logs.push("[WARN] " + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      info: (...args) => logs.push("[INFO] " + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
    };

    try {
      let inputIdx = 0;
      const mockPrompt = (msg) => {
        if (msg) logs.push(msg);
        if (inputIdx < currentInputs.length) {
          return currentInputs[inputIdx++];
        }
        return null;
      };

      const runFn = new Function('console', 'stdin', 'prompt', code);
      runFn(customConsole, currentInputs.join('\n'), mockPrompt);
      const endTime = performance.now();
      const rawOutput = logs.join('\n');
      const formatted = formatInteractiveOutput(rawOutput, currentInputs);
      setOutput(formatted || "(Program executed successfully with no output)");
      setExecutionError('');
      setExecutionTime((endTime - startTime).toFixed(2));
      setAwaitingInput(false);
    } catch (err) {
      const endTime = performance.now();
      setOutput(logs.join('\n'));
      setExecutionError(err.toString());
      setExecutionTime((endTime - startTime).toFixed(2));
      setAwaitingInput(false);
    } finally {
      setIsRunning(false);
    }
  };

  const runCodeLocalPython = async (currentInputs = []) => {
    const startTime = performance.now();
    let logs = [];
    try {
      const pyodide = window.pyodideInstance;

      pyodide.setStdout({
        batched: (str) => logs.push(str)
      });

      let inputIdx = 0;
      pyodide.setStdin({
        stdin: () => {
          if (inputIdx < currentInputs.length) {
            return currentInputs[inputIdx++];
          }
          return "";
        }
      });

      await pyodide.runPythonAsync(code);
      const endTime = performance.now();
      const rawOutput = logs.join('\n');
      const formatted = formatInteractiveOutput(rawOutput, currentInputs);
      setOutput(formatted || "(Program completed successfully)");
      setExecutionError('');
      setExecutionTime((endTime - startTime).toFixed(2));
      setAwaitingInput(false);
    } catch (err) {
      const endTime = performance.now();
      setOutput(logs.join('\n'));
      setExecutionError(err.toString());
      setExecutionTime((endTime - startTime).toFixed(2));
      setAwaitingInput(false);
    } finally {
      setIsRunning(false);
    }
  };

  const runCodeLocalJava = (currentInputs = []) => {
    const startTime = performance.now();
    let logs = [];
    try {
      const jsBody = transpileJavaToJS(code);
      let inputIdx = 0;

      const runFn = new Function('__logs', '__inputs', '__inputIdx', jsBody);
      runFn(logs, currentInputs, inputIdx);

      const endTime = performance.now();
      const rawOutput = logs.join('\n');
      const formatted = formatInteractiveOutput(rawOutput, currentInputs);

      setOutput(formatted || "(Program completed successfully)");
      setExecutionError('');
      setExecutionTime((endTime - startTime).toFixed(2));
      setAwaitingInput(false);
      setIsRunning(false);
      if (consoleInputRef.current) {
        consoleInputRef.current.focus();
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleRunCode = async (currentInputs = inputsList) => {
    setIsRunning(true);
    setExecutionError('');
    setExecutionTime(null);

    const activeStdin = currentInputs.join('\n');

    // Fast local execution for JavaScript / TypeScript
    if (language === 'javascript' || language === 'typescript') {
      setTimeout(() => {
        runCodeLocalJS(currentInputs);
      }, 10);
      return;
    }

    // Fast local execution for Python if Pyodide is ready
    if (language === 'python' && typeof window !== 'undefined' && window.pyodideInstance) {
      runCodeLocalPython(currentInputs);
      return;
    }

    // Fast 0ms local execution for standard Java snippets
    if (language === 'java') {
      const localSuccess = runCodeLocalJava(currentInputs);
      if (localSuccess) return;
    }

    const startTime = performance.now();
    let codeToSubmit = code;
    if (language === 'java') {
      codeToSubmit = codeToSubmit
        .replace(/\b(\w+)\.hasNext(?:Int|Double|Float|Long|Line|Short|Byte|Boolean)?\(\)/g, 'true');
    }

    // Parallel Engine Race: Concurrently race Judge0 CE + Wandbox API
    const fetchJudge0 = async () => {
      const judge0Id = JUDGE0_MAP[language];
      if (!judge0Id) throw new Error("No Judge0 language ID");

      const res = await fetch("https://ce.judge0.com/submissions?wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language_id: judge0Id,
          source_code: codeToSubmit,
          stdin: activeStdin
        })
      });

      if (!res.ok) throw new Error(`Judge0 HTTP ${res.status}`);
      const data = await res.json();
      return { source: "judge0", data };
    };

    const fetchWandbox = async () => {
      const compiler = COMPILER_MAP[language] || "gcc-head";
      const wandboxEndpoint = `${settings.wandboxUrl.replace(/\/$/, '')}/api/compile.json`;

      let wandboxCode = codeToSubmit;
      if (language === 'java') {
        wandboxCode = wandboxCode.replace(/public\s+class\s+(\w+)/g, 'class $1');
      }

      const res = await fetch(wandboxEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiler: compiler,
          code: wandboxCode,
          stdin: activeStdin
        })
      });

      if (!res.ok) throw new Error(`Wandbox HTTP ${res.status}`);
      const data = await res.json();
      return { source: "wandbox", data };
    };

    try {
      const winner = await Promise.any([fetchJudge0(), fetchWandbox()]);
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

      let rawOutputText = "";
      let errText = "";

      if (winner.source === "judge0") {
        const data = winner.data;
        if (data.stdout) rawOutputText += data.stdout;
        if (data.compile_output) rawOutputText += data.compile_output;
        if (data.stderr) errText += data.stderr;
        if (data.message) errText += data.message;
      } else {
        const data = winner.data;
        if (data.program_output) rawOutputText += data.program_output;
        if (data.compiler_output) rawOutputText += data.compiler_output;
        if (data.program_error) errText += data.program_error;
        if (data.compiler_error) errText += data.compiler_error;
      }

      const formattedOutput = formatInteractiveOutput(rawOutputText, currentInputs);

      const isInputEOFError = errText && (
        errText.includes("NoSuchElementException") ||
        errText.includes("EOFError") ||
        errText.includes("Scanner") ||
        errText.includes("cin") ||
        errText.includes("end of file")
      );

      if (isInputEOFError) {
        setAwaitingInput(true);
        setOutput(formattedOutput || rawOutputText || "(Waiting for input...)");
        setExecutionError('');
      } else {
        setAwaitingInput(false);
        setOutput(formattedOutput || rawOutputText || "(Program completed)");
        setExecutionError(errText || '');
      }
    } catch (err) {
      console.warn("Parallel execution race error:", err);
      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));
      setExecutionError(`Execution Failed. Please check internet connection.`);
      setAwaitingInput(false);
    } finally {
      setIsRunning(false);
      if (consoleInputRef.current) {
        consoleInputRef.current.focus();
      }
    }
  };

  const handleConsoleInputSubmit = (e) => {
    e.preventDefault();
    const val = consoleInput.trim();
    if (!val) return;

    setHistoryList(prev => [...prev, val]);
    setHistoryIndex(-1);

    const newTokens = val.split(/\s+/);
    const updatedInputs = [...inputsList, ...newTokens];
    setInputsList(updatedInputs);
    setConsoleInput('');

    const detected = detectCodeInputs(code, language);

    // If there are remaining input prompts to collect locally before sending to server:
    if (detected.count > 0 && updatedInputs.length < detected.count) {
      setAwaitingInput(true);
      let display = "";
      for (let i = 0; i < detected.count; i++) {
        const p = detected.prompts[i] || `Input ${i + 1}: `;
        if (i < updatedInputs.length) {
          display += `${p}${updatedInputs[i]}\n`;
        } else if (i === updatedInputs.length) {
          display += `${p}`;
          break;
        }
      }
      setOutput(display);
      if (consoleInputRef.current) {
        consoleInputRef.current.focus();
      }
    } else {
      // All inputs collected! Perform 1 SINGLE execution pass!
      setAwaitingInput(false);
      handleRunCode(updatedInputs);
    }
  };

  const handleConsoleInputKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyList.length === 0) return;
      const nextIdx = historyIndex < historyList.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setConsoleInput(historyList[historyList.length - 1 - nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setConsoleInput(historyList[historyList.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setConsoleInput('');
      }
    }
  };

  const handleInitialRunClick = () => {
    setInputsList([]);
    setOutput('');
    setExecutionError('');
    setConsoleInput('');
    setRawStdinText('');

    const detected = detectCodeInputs(code, language);

    if (detected.count > 0 && inputsList.length < detected.count) {
      setAwaitingInput(true);
      const activePrompt = detected.prompts[0] || "Input 1: ";
      setOutput(activePrompt);
      if (consoleInputRef.current) {
        consoleInputRef.current.focus();
      }
    } else {
      setAwaitingInput(false);
      handleRunCode([]);
    }
  };

  return (
    <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 120px)' }}>
        
        {/* Top Control Bar */}
        <div className="card" style={{ padding: '12px 20px', minHeight: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <select
              className="select-control"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{ padding: '8px 16px', fontSize: '0.9rem', fontWeight: '700', minWidth: '160px' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python 3</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="c">C (GCC)</option>
              <option value="java">Java (OpenJDK)</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="ruby">Ruby</option>
              <option value="php">PHP</option>
              <option value="sql">SQL</option>
            </select>

            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Code Diary IDE
            </span>

            {language === 'python' && pyodideReady && (
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '12px' }}>
                ⚡ Client WASM Ready
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-secondary"
              title="Settings"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            >
              ⚙️
            </button>

            <button
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700' }}
            >
              Reset
            </button>

            <button
              onClick={handleInitialRunClick}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isRunning ? (
                <>
                  <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: '#ffffff', borderTopColor: 'transparent' }} />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Split Layout */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: 0 }}>
          
          {/* Left Side: Full Height Monaco Code Editor */}
          <div className="monaco-wrapper" style={{ height: '100%', borderRadius: '16px' }}>
            <Editor
              language={language}
              value={code}
              onChange={setCode}
              theme={settings.theme}
              fontSize={settings.fontSize}
              tabSize={settings.tabSize}
            />
          </div>

          {/* Right Side: Integrated OUTPUT CONSOLE with Interactive Terminal */}
          <div
            className="card output-console-card"
            onClick={() => {
              if (consoleInputRef.current) {
                consoleInputRef.current.focus();
              }
            }}
            style={{
              height: '100%',
              padding: '16px',
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'text'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--link-color)' }}>
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0, color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  OUTPUT CONSOLE
                </h3>
                {executionTime && (
                  <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', borderRadius: '12px', backgroundColor: parseFloat(executionTime) < 200 ? 'rgba(16, 185, 129, 0.15)' : 'var(--hover-bg)', color: parseFloat(executionTime) < 200 ? '#10b981' : 'var(--text-muted)' }}>
                    ⚡ {executionTime} ms
                  </span>
                )}
                {awaitingInput && !isRunning && (
                  <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                    ⏳ Awaiting input...
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setInputMode(inputMode === 'terminal' ? 'stdin' : 'terminal'); }}
                  className="btn btn-secondary"
                  title="Toggle between Terminal mode and Bulk Stdin mode"
                  style={{ padding: '3px 10px', fontSize: '0.75rem', fontWeight: '600' }}
                >
                  {inputMode === 'terminal' ? '⌨️ Terminal' : '📝 Raw Stdin'}
                </button>

                {(output || executionError || inputsList.length > 0) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClearConsole(); }}
                    className="btn btn-secondary"
                    style={{ padding: '3px 10px', fontSize: '0.75rem', fontWeight: '600' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            {inputMode === 'stdin' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                  Bulk Standard Input (stdin) — Enter inputs on separate lines:
                </label>
                <textarea
                  value={rawStdinText}
                  onChange={(e) => {
                    setRawStdinText(e.target.value);
                    const lines = e.target.value.split('\n').filter(x => x.trim() !== '');
                    setInputsList(lines);
                  }}
                  placeholder={"10\n20"}
                  style={{
                    flex: 1,
                    width: '100%',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    resize: 'none'
                  }}
                />
              </div>
            ) : (
              /* Integrated Terminal Area */
              <div
                ref={terminalLogsContainerRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  wordBreak: 'break-word',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Output content */}
                {output && (
                  <div style={{ color: 'var(--text-color)', whiteSpace: 'pre-wrap' }}>
                    {output}
                  </div>
                )}

                {/* Execution error */}
                {executionError && (
                  <div style={{ marginTop: '8px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', whiteSpace: 'pre-wrap' }}>
                    {executionError}
                  </div>
                )}

                {/* Empty State */}
                {!output && !executionError && !isRunning && inputsList.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px' }}>
                    Click "Run Code" or type input below and press Enter to execute.
                  </div>
                )}

                {/* Integrated Input Field right inside output log stream */}
                <form
                  onSubmit={handleConsoleInputSubmit}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '6px',
                    paddingTop: '4px'
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--link-color)', fontSize: '0.95rem', userSelect: 'none' }}>
                    ❯
                  </span>
                  <input
                    ref={consoleInputRef}
                    type="text"
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyDown={handleConsoleInputKeyDown}
                    placeholder={isRunning ? "Running..." : "Type input here & press Enter..."}
                    disabled={isRunning}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      color: 'var(--text-color)',
                      padding: '2px 0'
                    }}
                  />
                  {isRunning && (
                    <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderColor: 'var(--link-color)', borderTopColor: 'transparent' }} />
                  )}
                </form>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          settings={settings}
          onSave={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </Layout>
  );
}

export default function CodeEditorPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-muted)' }}>
        Loading Code Editor...
      </div>
    }>
      <CodeEditorContent />
    </Suspense>
  );
}
