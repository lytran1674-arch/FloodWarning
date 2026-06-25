export default function RescueIllustration() {
  return (
    <div className="w-full max-w-sm h-56 rounded-xl overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg,#b8d9f0 0%,#7ab8e0 60%,#5a9fd4 100%)' }}
    >
      {/* Green check circle */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-md">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Clouds */}
      <div className="absolute top-2 right-8 w-16 h-7 bg-white/70 rounded-full" />
      <div className="absolute top-4 right-4 w-10 h-5 bg-white/50 rounded-full" />

      {/* Trees */}
      <div className="absolute bottom-14 left-4 flex gap-1.5">
        {[22, 18, 22].map((w, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-green-800 rounded-t-full" style={{ width: w, height: w + 4 }} />
            <div className="w-1.5 h-2.5 bg-yellow-900" />
          </div>
        ))}
      </div>

      {/* Flooded house */}
      <div className="absolute bottom-7 right-7">
        {/* Roof */}
        <div className="relative w-0 h-0 mx-auto"
          style={{ borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderBottom: '16px solid #c0392b' }}
        />
        {/* Walls */}
        <div className="w-10 h-7 bg-stone-200 border border-stone-300 relative">
          <div className="absolute top-1 right-1 w-2.5 h-2 bg-sky-300 border border-stone-300" />
          <div className="absolute bottom-0 left-1 w-3 h-4 bg-stone-400 rounded-sm" />
        </div>
      </div>

      {/* Water */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-600/50 rounded-b-xl" />

      {/* Boat */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Rescuers */}
        <div className="flex gap-1 mb-0.5">
          {[
            { helmet: '#2c3e50', body: '#34495e' },
            { helmet: '#e67e22', body: '#e67e22' },
            { helmet: '#c0392b', body: '#e67e22' },
            { helmet: '#2c3e50', body: '#e67e22' },
          ].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-px">
              <div className="w-2.5 h-1.5 rounded-t-full" style={{ background: p.helmet }} />
              <div className="w-2 h-2 rounded-full bg-amber-200" />
              <div className="w-3 h-3 rounded-sm" style={{ background: p.body }} />
            </div>
          ))}
        </div>
        {/* Boat hull */}
        <div className="w-28 h-1.5 bg-slate-500 rounded-sm" />
        <div className="w-24 h-4 bg-slate-700 rounded-b-xl relative">
          {/* Life ring */}
          <div className="absolute bottom-1 left-7 w-4 h-4 rounded-full border-4 border-red-500 bg-white" />
        </div>
      </div>
    </div>
  )
}
