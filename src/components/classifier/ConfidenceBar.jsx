export default function ConfidenceBar({ value, animate = true }) {
  const pct = Math.min(100, Math.max(0, value))

  const color =
    pct >= 70 ? 'from-seafoam-500 to-seafoam-400' :
    pct >= 40 ? 'from-ocean-500 to-ocean-400' :
                'from-coral-500 to-coral-400'

  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-ocean-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} ${animate ? 'transition-all duration-700 ease-out' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
