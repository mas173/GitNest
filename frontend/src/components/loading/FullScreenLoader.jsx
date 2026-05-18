const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Ambient glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-emerald-400/3 blur-[80px]" />
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo with spinning rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer spinning ring */}
          <div
            className="absolute w-28 h-28 rounded-full border border-emerald-500/20 border-t-emerald-400"
            style={{ animation: "spin 1.5s linear infinite" }}
          />
          {/* Inner spinning ring (reverse) */}
          <div
            className="absolute w-20 h-20 rounded-full border border-emerald-500/10 border-b-emerald-500/50"
            style={{ animation: "spin 1s linear infinite reverse" }}
          />
          {/* Glow behind logo */}
          <div className="absolute w-14 h-14 rounded-full bg-emerald-500/10 blur-md" />
          {/* Actual GitNest logo — tinted emerald */}
          <img
            src="/logo.png"
            alt="GitNest"
            className="w-14 h-14 object-contain relative z-10"
            style={{ filter: "invert(1) brightness(0.9) sepia(1) hue-rotate(100deg) saturate(3)" }}
          />
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-xl tracking-tight">Git</span>
            <span className="text-emerald-400 font-bold text-xl tracking-tight">Nest</span>
          </div>
          <span className="text-stone-500 text-xs tracking-[0.2em] uppercase">Collaborative Development</span>
        </div>

        {/* Terminal-style loading text */}
        <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 rounded-lg px-4 py-2">
          <span className="text-emerald-400 text-sm font-mono">$</span>
          <span className="text-stone-300 text-sm font-mono">{message}</span>
          <span className="w-2 h-4 bg-emerald-400 animate-pulse rounded-sm" />
        </div>
      </div>
      {/* Keyframe animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FullScreenLoader;
