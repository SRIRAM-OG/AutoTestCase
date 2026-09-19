/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InputSection } from './components/InputSection';
import { ResultSection } from './components/ResultSection';
import { LoadingState } from './components/LoadingState';
import { Footer } from './components/Footer';
import { generateTests, TestResult } from './services/ai';

export default function App() {
  const [result, setResult] = useState<{ data: TestResult, request: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const isDark = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGenerate = async (request: { mode: string, language: string, framework: string, input: string }) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generateTests(request);
      setResult({ data, request });
    } catch (error) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : String(error);
      alert(`Error generating tests: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2FF] dark:bg-[#121015] text-[#231F20] dark:text-[#E8E4FF] font-sans selection:bg-[#7353F6] selection:text-white transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <main className="max-w-4xl mx-auto px-6 -mt-12 relative z-20">
        <InputSection onGenerate={handleGenerate} loading={loading} />
        {loading && <LoadingState />}
        {result && !loading && <ResultSection result={result.data} request={result.request} />}
        <Footer />
      </main>
    </div>
  );
}
