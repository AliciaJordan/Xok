export default function ScanLineOverlay({ active = false }) {
  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
      {/* Green tint */}
      <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(0,255,80,0.04)', mixBlendMode: 'screen' }} />

      {/* Moving scan bar */}
      <div
        className="absolute left-0 right-0 animate-scan-bar"
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,100,0.9) 20%, rgba(100,255,200,1) 50%, rgba(0,255,100,0.9) 80%, transparent)',
          boxShadow: '0 0 12px rgba(0,255,100,0.8), 0 0 30px rgba(0,200,80,0.4)',
        }}
      />

      {/* Corner brackets */}
      {[
        { top: 8, left: 8,  borderTop: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
        { top: 8, right: 8, borderTop: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
        { bottom: 8, left: 8,  borderBottom: '2px solid #00ff88', borderLeft: '2px solid #00ff88' },
        { bottom: 8, right: 8, borderBottom: '2px solid #00ff88', borderRight: '2px solid #00ff88' },
      ].map((style, i) => (
        <div key={i} className="absolute" style={{ ...style, width: 20, height: 20 }} />
      ))}

      {/* Scanlines texture */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(0,255,80,0.03) 3px, rgba(0,255,80,0.03) 4px)',
        }}
      />

      {/* "SCANNING" text */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <span style={{
          fontFamily: 'Courier New, monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.15em',
          color: 'rgba(0,255,100,0.9)',
          textShadow: '0 0 8px rgba(0,255,100,0.7)',
        }}>
          ◈ SCANNING MARINE SPECIMEN ◈
        </span>
      </div>
    </div>
  )
}
