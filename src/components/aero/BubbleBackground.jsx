import { useMemo } from 'react'

export default function BubbleBackground() {
  const bubbles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      size:     6 + (i * 9) % 28,
      left:     (i * 19 + 4) % 100,
      delay:    (i * 1.8) % 11,
      duration: 11 + (i * 2.3) % 10,
      opacity:  0.18 + (i % 5) * 0.06,
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
            background: `radial-gradient(circle at 30% 28%,
              rgba(255,255,255,0.85),
              rgba(160,220,255,0.25)
            )`,
            border:    '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 0 8px rgba(100,200,255,0.25)',
          }}
        />
      ))}
    </div>
  )
}
