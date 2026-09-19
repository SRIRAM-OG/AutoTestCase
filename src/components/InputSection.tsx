import { useState } from 'react';
import { Code2, FileJson, BookOpen, Play } from 'lucide-react';
import { motion } from 'motion/react';

const MODES = [
  { id: 'code', label: 'Code Snippet', icon: Code2, placeholder: '# Paste your code here...\n# Example:\ndef divide(a, b):\n    if b == 0:\n        raise ValueError("Cannot divide by zero")\n    return a / b' },
  { id: 'api', label: 'API Specification', icon: FileJson, placeholder: 'POST /api/login\nBody: { email, password }\nReturns: 200, 401, 400, 500\n\nOr describe your REST API endpoint here...' },
  { id: 'story', label: 'User Story', icon: BookOpen, placeholder: 'As a user, I want to login with email and password\nso that I can access my dashboard.\n\nAcceptance criteria:\n- Valid credentials -> 200 redirect to dashboard\n- Invalid password -> 401 error\n- Missing email -> 400 validation error' }
];

const LANGUAGES = [
  { id: 'python', label: 'Python', color: '#3776AB', frameworks: ['pytest', 'unittest'] },
  { id: 'javascript', label: 'JavaScript', color: '#F7DF1E', frameworks: ['Jest', 'Mocha'] },
  { id: 'typescript', label: 'TypeScript', color: '#3178C6', frameworks: ['Jest', 'Vitest'] },
  { id: 'java', label: 'Java', color: '#ED8B00', frameworks: ['JUnit', 'TestNG'] },
  { id: 'cpp', label: 'C++', color: '#00599C', frameworks: ['Google Test', 'Catch2'] },
  { id: 'c', label: 'C', color: '#555555', frameworks: ['Unity', 'CMocka'] },
];

export function InputSection({ onGenerate, loading }: { onGenerate: any, loading: boolean }) {
  const [mode, setMode] = useState(MODES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [framework, setFramework] = useState(LANGUAGES[0].frameworks[0]);
  const [input, setInput] = useState('');

  const handleLangChange = (lang: typeof LANGUAGES[0]) => {
    setLanguage(lang);
    setFramework(lang.frameworks[0]);
  };

  const handleModeChange = (m: typeof MODES[0]) => {
    setMode(m);
    setInput('');
  };

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-[#1A1720] rounded-2xl border border-[#EBE4FF] dark:border-[#3A3050] shadow-[0_2px_12px_rgba(115,83,246,0.08)] dark:shadow-none overflow-hidden mb-6 hover:shadow-[0_4px_24px_rgba(115,83,246,0.15)] transition-shadow duration-300">
      <div className="p-5 border-b border-[#EBE4FF] dark:border-[#3A3050] flex items-center gap-3">
        <div className="w-9 h-9 bg-[#EBE4FF] dark:bg-[#2A2438] rounded-xl flex items-center justify-center transition-colors">
          <Code2 className="text-[#7353F6] dark:text-[#A88BFF] w-5 h-5" />
        </div>
        <h2 className="font-bebas text-2xl text-[#231F20] dark:text-white uppercase tracking-wide mt-1">Input Configuration</h2>
      </div>
      <div className="p-6">
        <div className="text-[11px] font-bold text-[#7353F6] tracking-wider uppercase mb-3">Select Mode</div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all tracking-wide ${mode.id === m.id ? 'bg-gradient-to-r from-[#7353F6] to-[#00C0FF] border-transparent text-white shadow-[0_4px_14px_rgba(115,83,246,0.35)]' : 'bg-white dark:bg-[#1A1720] border-[#EBE4FF] dark:border-[#3A3050] text-[#7353F6] dark:text-[#A88BFF] hover:border-[#7353F6] hover:bg-[#EBE4FF] dark:hover:bg-[#2A2438]'}`}
            >
              <m.icon className="w-4 h-4" /> {m.label}
            </button>
          ))}
        </div>

        {mode.id === 'code' && (
          <>
            <div className="text-[11px] font-bold text-[#7353F6] tracking-wider uppercase mb-3">Select Language</div>
            <div className="flex gap-3 mb-4 flex-wrap">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => handleLangChange(l)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${language.id === l.id ? 'bg-[#7353F6] border-[#7353F6] text-white' : 'bg-white dark:bg-[#1A1720] border-[#EBE4FF] dark:border-[#3A3050] text-[#231F20] dark:text-[#E8E4FF] hover:border-[#7353F6] dark:hover:border-[#A88BFF] hover:bg-[#EBE4FF] dark:hover:bg-[#2A2438]'}`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-bold text-[#7353F6] tracking-wider uppercase mb-3 mt-4">Framework</div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {language.frameworks.map(fw => (
                <button
                  key={fw}
                  onClick={() => setFramework(fw)}
                  className={`px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${framework === fw ? 'bg-[#231F20] dark:bg-white border-[#231F20] dark:border-white text-white dark:text-[#231F20]' : 'bg-white dark:bg-[#1A1720] border-[#EBE4FF] dark:border-[#3A3050] text-[#231F20] dark:text-[#E8E4FF] hover:border-[#231F20] dark:hover:border-white hover:bg-gray-100 dark:hover:bg-[#2A2438]'}`}
                >
                  {fw}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="text-[11px] font-bold text-[#7353F6] tracking-wider uppercase mb-2 mt-4">{mode.id === 'code' ? 'Your Code' : mode.label}</div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode.placeholder}
          className="w-full h-48 bg-[#231F20] dark:bg-[#121015] text-[#E8E4FF] font-mono text-sm border-2 border-[#EBE4FF] dark:border-[#3A3050] rounded-xl p-4 focus:border-[#7353F6] dark:focus:border-[#A88BFF] outline-none resize-y leading-relaxed transition-colors"
        />

        <button
          onClick={() => onGenerate({ mode: mode.id, language: language.id, framework, input })}
          disabled={loading || !input.trim()}
          className="w-full mt-5 bg-gradient-to-r from-[#7353F6] to-[#00C0FF] text-white font-bebas text-xl tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(115,83,246,0.4)] transition-all disabled:opacity-60 disabled:hover:shadow-none disabled:hover:translate-y-0"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
          {loading ? 'Generating...' : (mode.id === 'code' ? 'Generate Test Cases' : mode.id === 'api' ? 'Generate API Tests' : 'Generate User Story Tests')}
        </button>
      </div>
    </motion.div>
  );
}
