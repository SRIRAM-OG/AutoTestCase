import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

export function ThemeToggle({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-white flex items-center justify-center relative overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : -90,
          opacity: theme === 'dark' ? 1 : 0,
          scale: theme === 'dark' ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-[#A88BFF]" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'light' ? 0 : 90,
          opacity: theme === 'light' ? 1 : 0,
          scale: theme === 'light' ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-center w-5 h-5"
      >
        <Sun className="w-5 h-5 text-[#F7DF1E]" />
      </motion.div>
    </button>
  );
}
