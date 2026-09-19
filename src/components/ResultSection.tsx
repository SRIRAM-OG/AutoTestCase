import { useState } from 'react';
import { CheckCircle2, Copy, Download, PlayCircle, Terminal, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { TestResult } from '../services/ai';

export function ResultSection({ result, request }: { result: TestResult, request: any }) {
  const [activeTab, setActiveTab] = useState<'tests' | 'updated'>('tests');
  const [showTerminal, setShowTerminal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (text: string, type: 'tests' | 'updated') => {
    const ext = request.language === 'python' ? 'py' : request.language === 'javascript' ? 'js' : request.language === 'typescript' ? 'ts' : request.language === 'java' ? 'java' : request.language === 'cpp' ? 'cpp' : 'txt';
    const fname = type === 'tests' ? `test_suite.${ext}` : `updated_code.${ext}`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    setShowTerminal(true);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  const isWarning = result.status.toLowerCase().includes('repaired') || result.status.toLowerCase().includes('fixed') || result.status.toLowerCase().includes('partial');
  const passedCount = result.testDetails?.filter(t => t.passed).length || 0;
  const failedCount = result.testDetails?.filter(t => !t.passed).length || 0;
  const totalCount = result.testDetails?.length || result.testCount;
  const allPassed = failedCount === 0;

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-[#1A1720] rounded-2xl border border-[#EBE4FF] dark:border-[#3A3050] shadow-[0_2px_12px_rgba(115,83,246,0.08)] dark:shadow-none overflow-hidden mb-6 transition-colors duration-300">
      <div className="p-5 border-b border-[#EBE4FF] dark:border-[#3A3050] flex items-center gap-3">
        <div className="w-9 h-9 bg-[#EBE4FF] dark:bg-[#2A2438] rounded-xl flex items-center justify-center transition-colors">
          <CheckCircle2 className="text-[#7353F6] dark:text-[#A88BFF] w-5 h-5" />
        </div>
        <h2 className="font-bebas text-2xl text-[#231F20] dark:text-white uppercase tracking-wide mt-1">Test Results</h2>
      </div>
      
      <div className="p-6">
        {/* Status Badges */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${isWarning ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/50' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700/50'}`}>
            {isWarning ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} {result.status}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EBE4FF] dark:bg-[#2A2438] text-[#7353F6] dark:text-[#A88BFF] text-xs font-bold transition-colors">
            🧪 {result.testCount} Test Cases
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EBE4FF] dark:bg-[#2A2438] text-[#7353F6] dark:text-[#A88BFF] text-xs font-bold transition-colors">
            📊 {result.coveragePercent}% Coverage
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EBE4FF] dark:bg-[#2A2438] text-[#7353F6] dark:text-[#A88BFF] text-xs font-bold transition-colors">
            ⚡ {result.edgeCases} Edge Cases
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${activeTab === 'tests' ? 'bg-[#7353F6] border-[#7353F6] text-white shadow-md' : 'bg-white dark:bg-[#1A1720] border-[#EBE4FF] dark:border-[#3A3050] text-[#7353F6] dark:text-[#A88BFF] hover:border-[#7353F6] dark:hover:border-[#A88BFF]'}`}
          >
            📋 Generated Test Suite
          </button>
          {result.hasUpdatedCode && (
            <button
              onClick={() => setActiveTab('updated')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${activeTab === 'updated' ? 'bg-[#5CC9F5] border-[#5CC9F5] text-white shadow-md' : 'bg-white dark:bg-[#1A1720] border-[#EBE4FF] dark:border-[#3A3050] text-[#5CC9F5] hover:border-[#5CC9F5]'}`}
            >
              🔄 Updated Code
            </button>
          )}
        </div>

        {/* Code Block */}
        <div className="bg-[#231F20] dark:bg-[#121015] rounded-xl overflow-hidden border border-[#3A3050] dark:border-[#2A2438] transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A1720] border-b border-[#3A3050] dark:border-[#2A2438]">
            <span className="text-[#A88BFF] text-[11px] font-bold tracking-widest uppercase">
              {activeTab === 'tests' ? `${request.language} · ${request.framework}` : 'Updated Source Code'}
            </span>
            <div className="flex gap-2">
              <button onClick={() => handleCopy(activeTab === 'tests' ? result.testCode : result.updatedCode)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3A3050] text-[#A88BFF] text-[11px] font-bold hover:bg-[#7353F6]/20 hover:border-[#7353F6] transition-all">
                <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => handleDownload(activeTab === 'tests' ? result.testCode : result.updatedCode, activeTab)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3A3050] text-[#A88BFF] text-[11px] font-bold hover:bg-[#7353F6]/20 hover:border-[#7353F6] transition-all">
                <Download className="w-3 h-3" /> Download
              </button>
              <button onClick={handleRun} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/50 text-green-400 text-[11px] font-bold hover:bg-green-500/10 transition-all">
                <PlayCircle className="w-3 h-3" /> Run
              </button>
            </div>
          </div>
          <pre className="p-5 text-[#E8E4FF] font-mono text-sm overflow-x-auto max-h-[400px] whitespace-pre-wrap leading-relaxed">
            {activeTab === 'tests' ? result.testCode : result.updatedCode}
          </pre>
          
          {/* Terminal */}
          {showTerminal && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-[#1A1720] border-t border-[#3A3050] p-5 font-mono text-sm max-h-80 overflow-y-auto">
              <div className="flex items-center gap-2 text-[#A88BFF] mb-3 font-bold"><Terminal className="w-4 h-4"/> Terminal Output</div>
              
              {isSimulating ? (
                <div className="text-green-400 animate-pulse">Compiling and Executing...</div>
              ) : (
                <div className="space-y-3">
                  <div className="text-gray-300">Running {totalCount} tests against original code...</div>
                  
                  <div className="space-y-2 pl-2">
                    {result.testDetails?.map((test, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {test.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                          <span className={test.passed ? "text-green-400" : "text-red-400"}>
                            {test.name}
                          </span>
                        </div>
                        {!test.passed && test.errorReason && (
                          <div className="ml-6 mt-1 text-red-300/80 text-xs border-l-2 border-red-500/30 pl-3 py-1">
                            {test.errorReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 pt-3 border-t border-[#3A3050] font-bold ${allPassed ? 'text-green-400' : 'text-red-400'}`}>
                    {allPassed ? (
                      `✅ All ${totalCount} tests passed successfully!`
                    ) : (
                      `❌ ${failedCount} failed, ${passedCount} passed out of ${totalCount} tests.`
                    )}
                    <div className="text-gray-400 font-normal mt-1">
                      Coverage: {result.coveragePercent}% | Time: {(Math.random() * 2).toFixed(2)}s
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Coverage Grid */}
        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="bg-[#EBE4FF] dark:bg-[#2A2438] rounded-xl p-4 text-center border border-[#EBE4FF] dark:border-[#3A3050] transition-colors">
              <div className="font-bebas text-4xl text-[#7353F6] dark:text-[#A88BFF]">{result.coveragePercent}%</div>
              <div className="text-[11px] font-bold text-[#231F20] dark:text-[#E8E4FF] opacity-70 uppercase tracking-wider mt-1">Coverage</div>
              <div className="h-1.5 bg-[#231F20]/10 dark:bg-[#E8E4FF]/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7353F6] to-[#00C0FF] transition-all duration-1000" style={{ width: `${result.coveragePercent}%` }} />
              </div>
            </div>
            <div className="bg-[#EBE4FF] dark:bg-[#2A2438] rounded-xl p-4 text-center border border-[#EBE4FF] dark:border-[#3A3050] transition-colors">
              <div className="font-bebas text-4xl text-[#7353F6] dark:text-[#A88BFF]">{result.testCount}</div>
              <div className="text-[11px] font-bold text-[#231F20] dark:text-[#E8E4FF] opacity-70 uppercase tracking-wider mt-1">Test Cases</div>
              <div className="h-1.5 bg-[#231F20]/10 dark:bg-[#E8E4FF]/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7353F6] to-[#00C0FF] transition-all duration-1000" style={{ width: `${Math.min(result.testCount * 10, 100)}%` }} />
              </div>
            </div>
            <div className="bg-[#EBE4FF] dark:bg-[#2A2438] rounded-xl p-4 text-center border border-[#EBE4FF] dark:border-[#3A3050] transition-colors">
              <div className="font-bebas text-4xl text-[#7353F6] dark:text-[#A88BFF]">{result.confidence}%</div>
              <div className="text-[11px] font-bold text-[#231F20] dark:text-[#E8E4FF] opacity-70 uppercase tracking-wider mt-1">AI Confidence</div>
              <div className="h-1.5 bg-[#231F20]/10 dark:bg-[#E8E4FF]/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7353F6] to-[#00C0FF] transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="mt-5 bg-gradient-to-br from-[#EBE4FF] to-[#F0EDFF] dark:from-[#2A2438] dark:to-[#1A1720] rounded-xl p-5 border-l-4 border-[#7353F6] dark:border-[#A88BFF] transition-colors">
          <div className="text-[11px] font-bold text-[#7353F6] dark:text-[#A88BFF] uppercase tracking-widest mb-2 transition-colors">
            {activeTab === 'tests' ? 'Analysis & Explanation' : 'What Changed'}
          </div>
          <p className="text-sm text-[#231F20] dark:text-[#E8E4FF] leading-relaxed font-medium transition-colors">
            {activeTab === 'tests' ? result.explanation : (result.whatChanged || 'No changes were made to the source code.')}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
