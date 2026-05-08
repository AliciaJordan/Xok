export default function SonarDisplay({ active = true, locked = false, size = 220 }) {
  const rings = [0.82, 0.62, 0.42, 0.22]

  return (
    <div
      className="rounded-full flex items-center justify-center relative flex-shrink-0"
      style={{
        width: size, height: size,
        background: 'radial-gradient(circle, rgba(220,245,255,0.9) 0%, rgba(160,220,250,0.7) 60%, rgba(100,190,240,0.5) 100%)',
        border: '2px solid rgba(255,255,255,0.8)',
        boxShadow: '0 4px 24px rgba(60,160,240,0.25), inset 0 0 40px rgba(180,230,255,0.3), inset 0 1px 0 rgba(255,255,255,0.9)',
        overflow: 'hidden',
      }}
    >
      {/* Gloss overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 50%)',
        }}
      />

      {/* Rings */}
      {rings.map((r) => (
        <div
          key={r}
          className="absolute rounded-full"
          style={{
            width:  `${r * 100}%`,
            height: `${r * 100}%`,
            border: '1px solid rgba(60,140,220,0.22)',
          }}
        />
      ))}

      {/* Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-full h-px" style={{ background: 'rgba(60,140,220,0.18)' }} />
        <div className="absolute w-px h-full" style={{ background: 'rgba(60,140,220,0.18)' }} />
      </div>

      {/* Sweep arm — only when actively scanning */}
      {active && (
        <div
          className="absolute inset-0 animate-sonar-sweep"
          style={{ transformOrigin: 'center' }}
        >
          <div
            className="absolute"
            style={{
              top:    '50%',
              left:   '50%',
              width:  '2px',
              height: '44%',
              transformOrigin: 'top center',
              transform: 'translateX(-50%) rotate(0deg)',
              background: 'linear-gradient(to bottom, rgba(30,130,220,0.8), transparent)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(60,160,240,0.18) 0deg, transparent 55deg)',
            }}
          />
        </div>
      )}

      {/* Soft ping rings — only when scanning */}
      {active && (
        <>
          <div
            className="absolute rounded-full animate-sonar-ping"
            style={{ inset: 0, border: '1px solid rgba(60,140,220,0.35)' }}
          />
          <div
            className="absolute rounded-full animate-sonar-ping-2"
            style={{ inset: 0, border: '1px solid rgba(60,140,220,0.35)' }}
          />
          <div
            className="absolute rounded-full animate-sonar-ping-3"
            style={{ inset: 0, border: '1px solid rgba(60,140,220,0.35)' }}
          />
        </>
      )}

      {/* Centre dot */}
      <div
        className="absolute rounded-full"
        style={{ width: 8, height: 8, background: '#3090d8', boxShadow: '0 0 8px rgba(48,144,216,0.6)' }}
      />

      {/* Locked blip */}
      {locked && (
        <div
          className="absolute rounded-full animate-ripple-soft"
          style={{
            width: 12, height: 12,
            background: 'rgba(30,150,255,0.85)',
            boxShadow: '0 0 10px rgba(30,150,255,0.5)',
            top: '30%', left: '57%',
          }}
        />
      )}

      {/* Status label */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p style={{
          fontFamily: 'Courier New, monospace',
          fontSize: '0.52rem',
          letterSpacing: '0.1em',
          color: 'rgba(30,90,160,0.75)',
          fontWeight: 600,
        }}>
          {locked ? '● Species Located' : active ? '● Scanning...' : '○ Standby'}
        </p>
      </div>
    </div>
  )
}
