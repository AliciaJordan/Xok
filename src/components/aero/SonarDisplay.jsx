export default function SonarDisplay({ active = true, locked = false, size = 220 }) {
  const rings = [0.82, 0.62, 0.42, 0.22]

  return (
    <div
      className="sonar-screen scanlines rounded-full flex items-center justify-center relative"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      {/* Rings */}
      {rings.map((r) => (
        <div
          key={r}
          className="absolute rounded-full"
          style={{
            width:  `${r * 100}%`,
            height: `${r * 100}%`,
            border: '1px solid rgba(0,255,100,0.18)',
          }}
        />
      ))}

      {/* Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-full h-px" style={{ background: 'rgba(0,255,100,0.15)' }} />
        <div className="absolute w-px h-full" style={{ background: 'rgba(0,255,100,0.15)' }} />
      </div>

      {/* Sweep arm */}
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
              background: 'linear-gradient(to bottom, rgba(0,255,100,0.9), transparent)',
              boxShadow: '0 0 8px rgba(0,255,100,0.6)',
            }}
          />
          {/* Sweep gradient wedge */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(0,255,100,0.12) 0deg, transparent 60deg)',
            }}
          />
        </div>
      )}

      {/* Ping rings */}
      {active && (
        <>
          <div className="absolute inset-0 rounded-full border border-sonar/40 animate-sonar-ping" />
          <div className="absolute inset-0 rounded-full border border-sonar/40 animate-sonar-ping-2" />
          <div className="absolute inset-0 rounded-full border border-sonar/40 animate-sonar-ping-3" />
        </>
      )}

      {/* Centre dot */}
      <div className="absolute rounded-full" style={{ width: 6, height: 6, background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />

      {/* LOCKED blip */}
      {locked && (
        <div
          className="absolute rounded-full animate-ripple"
          style={{
            width: 14, height: 14,
            background: 'rgba(0,255,100,0.9)',
            boxShadow: '0 0 12px #00ff88',
            top: '28%', left: '55%',
          }}
        />
      )}

      {/* Status text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="terminal-text" style={{ fontSize: '0.55rem', letterSpacing: '0.12em' }}>
          {locked ? '●  LOCKED ON' : active ? '●  SCANNING' : '○  STANDBY'}
        </p>
      </div>
    </div>
  )
}
