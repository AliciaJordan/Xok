export default function ScanLineOverlay({ active = false }) {
  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
      {/* Soft blue tint */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{ background: 'rgba(100,180,255,0.06)' }}
      />

      {/* Gentle shimmer bar */}
      <div
        className="absolute left-0 right-0 animate-scan-bar"
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, transparent, rgba(100,190,255,0.6) 25%, rgba(200,240,255,0.9) 50%, rgba(100,190,255,0.6) 75%, transparent)',
          boxShadow: '0 0 16px rgba(100,200,255,0.5)',
        }}
      />

      {/* Rounded corner accents */}
      {[
        { top: 8, left: 8,  borderTop: '2px solid rgba(80,170,240,0.7)', borderLeft: '2px solid rgba(80,170,240,0.7)', borderRadius: '4px 0 0 0' },
        { top: 8, right: 8, borderTop: '2px solid rgba(80,170,240,0.7)', borderRight: '2px solid rgba(80,170,240,0.7)', borderRadius: '0 4px 0 0' },
        { bottom: 8, left: 8,  borderBottom: '2px solid rgba(80,170,240,0.7)', borderLeft: '2px solid rgba(80,170,240,0.7)', borderRadius: '0 0 0 4px' },
        { bottom: 8, right: 8, borderBottom: '2px solid rgba(80,170,240,0.7)', borderRight: '2px solid rgba(80,170,240,0.7)', borderRadius: '0 0 4px 0' },
      ].map((style, i) => (
        <div key={i} className="absolute" style={{ ...style, width: 18, height: 18 }} />
      ))}

      {/* Status text */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <span style={{
          fontFamily: 'Courier New, monospace',
          fontSize: '0.52rem',
          letterSpacing: '0.12em',
          color: 'rgba(40,130,200,0.85)',
          fontWeight: 600,
        }}>
          Analyzing marine specimen...
        </span>
      </div>
    </div>
  )
}
