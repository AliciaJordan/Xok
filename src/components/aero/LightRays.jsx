import { useMemo } from 'react'

export default function LightRays() {
  const rays = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left:     6 + i * 16,
      width:    40 + (i % 3) * 24,
      delay:    i * 1.1,
      duration: 6 + (i % 3) * 1.5,
      opacity:  0.08 + (i % 3) * 0.04,
    })), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {rays.map((r) => (
        <div
          key={r.id}
          className="absolute animate-light-ray"
          style={{
            top: 0,
            left:          `${r.left}%`,
            width:         `${r.width}px`,
            height:        '100vh',
            opacity:        r.opacity,
            animationDelay:    `${r.delay}s`,
            animationDuration: `${r.duration}s`,
            transform:     'skewX(-15deg)',
            background:    'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(160,220,255,0.4) 35%, transparent 80%)',
            transformOrigin: 'top center',
          }}
        />
      ))}
    </div>
  )
}
