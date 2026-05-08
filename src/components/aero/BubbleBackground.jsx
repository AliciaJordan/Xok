import { useMemo } from 'react'

export default function BubbleBackground() {
  const bubbles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size:     4 + (i * 7) % 26,
      left:     (i * 17 + 5) % 100,
      delay:    (i * 1.3) % 9,
      duration: 7 + (i * 2.1) % 9,
      opacity:  0.08 + (i % 5) * 0.05,
    })), [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full animate-bubble-rise"
          style={{
            width:  b.size,
            height: b.size,
            bottom: '-40px',
            left:   `${b.left}%`,
            opacity: b.opacity,
            animationDelay:    `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            background: `radial-gradient(circle at 30% 25%,
              rgba(180,240,255,0.6),
              rgba(0,180,230,0.1)
            )`,
            border:    '1px solid rgba(120,220,255,0.35)',
            boxShadow: '0 0 6px rgba(0,200,255,0.2)',
          }}
        />
      ))}
    </div>
  )
}
