import { Beaker } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) {
  return (
    <header className="bg-[#231F20] px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-[0_2px_16px_rgba(115,83,246,0.3)] transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#7353F6] to-[#00C0FF] rounded-xl flex items-center justify-center">
          <Beaker className="text-white w-5 h-5" />
        </div>
        <div>
          <div className="font-bebas text-2xl text-white tracking-wide uppercase leading-none mt-1">AutoTest <span className="text-[#5CC9F5]">AI</span></div>
          <div className="text-[10px] text-[#A88BFF] tracking-widest uppercase mt-0.5 font-bold">Team Datapulse · Agentica 2.0</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-[#7353F6] to-[#00C0FF] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wider hidden sm:block">
          HACKATHON 2026
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </header>
  );
}
