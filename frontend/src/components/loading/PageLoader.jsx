const PageLoader = ({ message = "Fetching data..." }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-24 gap-6">
      {/* Progress bar */}
      <div className="w-48 h-0.5 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full animate-[progress_1.8s_ease-in-out_infinite]"
        />
      </div>

      {/* Pulsing dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Message */}
      <div className="flex items-center gap-2">
        <span className="text-emerald-500 font-mono text-xs">›</span>
        <span className="text-stone-500 text-sm font-mono">{message}</span>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
