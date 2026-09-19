export function Hero() {
  return (
    <div className="bg-[#231F20] pt-10 px-6 pb-24 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#7353F6] opacity-25 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#00C0FF] opacity-20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="font-bebas text-5xl md:text-6xl text-white tracking-wide uppercase leading-none">
          Automatic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7353F6] to-[#00C0FF]">Testcase</span><br/>Generator
        </h1>
        <p className="text-[#A88BFF] text-sm md:text-base mt-4 font-semibold">
          AI-Powered · Multi-Language · Production-Ready Test Suite Generation
        </p>
        <div className="flex gap-2 mt-6 flex-wrap">
          {['PYTHON', 'JAVA', 'C++', 'JAVASCRIPT', 'API SPEC', 'USER STORY', 'LIVE COMPILER'].map(tag => (
            <span key={tag} className="bg-[#7353F6]/20 border border-[#7353F6]/40 text-[#A88BFF] text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
