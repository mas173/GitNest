const RepoSkeleton = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-stone-900/60 border border-stone-800 rounded-xl p-5 overflow-hidden relative"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.04), transparent)",
              animationDelay: `${i * 200}ms`,
            }}
          />

          {/* Top row: repo name + badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-40 bg-stone-800 rounded-md animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            <div className="h-5 w-14 bg-stone-800 rounded-full animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
          </div>

          {/* Description lines */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="h-3 w-full bg-stone-800/80 rounded animate-pulse" style={{ animationDelay: `${i * 130}ms` }} />
            <div className="h-3 w-3/4 bg-stone-800/60 rounded animate-pulse" style={{ animationDelay: `${i * 140}ms` }} />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            {[48, 36, 44].map((w, j) => (
              <div key={j} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-stone-800 animate-pulse" style={{ animationDelay: `${i * 100 + j * 50}ms` }} />
                <div className={`h-3 bg-stone-800 rounded animate-pulse`} style={{ width: w, animationDelay: `${i * 100 + j * 60}ms` }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default RepoSkeleton;
