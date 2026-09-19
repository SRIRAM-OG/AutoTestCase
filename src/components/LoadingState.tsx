import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  "Analyzing code structure...",
  "Identifying edge cases...",
  "Generating test suite...",
  "Simulating test execution...",
  "Calculating coverage metrics...",
  "Finalizing results..."
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#1A1720] rounded-2xl border border-[#EBE4FF] dark:border-[#3A3050] shadow-lg dark:shadow-none p-16 flex flex-col items-center justify-center mb-6 transition-colors duration-300">
      <Loader2 className="w-14 h-14 text-[#7353F6] dark:text-[#A88BFF] animate-spin mb-5" />
      <h3 className="font-bebas text-3xl text-[#231F20] dark:text-white tracking-wide">Processing...</h3>
      <div className="h-6 mt-2 overflow-hidden relative w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p 
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-[#7353F6] dark:text-[#A88BFF] font-bold tracking-wide absolute transition-colors"
          >
            {MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
