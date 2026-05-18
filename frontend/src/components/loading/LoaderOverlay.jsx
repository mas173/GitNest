const LoaderOverlay = ({ message = "Processing...", isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm rounded-xl">
      {/* Spinning ring */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-10 h-10 rounded-full border border-stone-700 border-t-emerald-400 animate-spin" />
        <div className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
      </div>

      {/* Message */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-lg">
        <span className="text-emerald-400 font-mono text-xs">$</span>
        <span className="text-stone-400 text-xs font-mono">{message}</span>
        <span className="inline-block w-1.5 h-3.5 bg-emerald-400/70 animate-pulse rounded-sm" />
      </div>
    </div>
  );
};

export default LoaderOverlay;
