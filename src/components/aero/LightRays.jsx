import { useMemo } from 'react'

export default function LightRays() {
  const rays = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left:     8 + i * 12,
      width:    30 + (i % 3) * 20,
      delay:    i * 0.7,
      duration: 4 + (i % 3),
      opacity:  0.03 + (i % 4) * 0.015,
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
            transform:     'skewX(-18deg)',
            background:    'linear-gradient(180deg, rgba(0,200,255,0.9) 0%, rgba(0,150,220,0.3) 40%, transparent 80%)',
            transformOrigin: 'top center',
          }}
        />
      ))}
    </div>
  )
}
