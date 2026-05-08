import { useState, useEffect, useRef } from 'react'

const IDLE_LINES = [
  '🌊  Marine Biology OS ready',
  '🦈  Species database loaded — 15 species',
  '🔬  Classification engine online',
  '📡  Awaiting specimen input...',
]

const SCANNING_SEQUENCES = [
  ['🖼️  Specimen image received', 'Preparing image for analysis...', 'Resizing to 224 × 224 px...'],
  ['🔍  Analyzing dorsal fin shape...', 'Examining caudal fin proportions...', 'Checking lateral line features...'],
  ['🧠  Matching ocean species database...', 'Evaluating 15 shark profiles...', 'Calculating confidence scores...'],
  ['📋  Estimating conservation status...', 'Preparing educational data...', 'Possible species identified.'],
]

export default function MarineObservationConsole({ phase = 'idle', className = '' }) {
  const [lines, setLines]     = useState(IDLE_LINES)
  const [seqIdx, setSeqIdx]   = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const containerRef          = useRef(null)

  useEffect(() => {
    if (phase !== 'scanning') {
      setLines(IDLE_LINES)
      setSeqIdx(0)
      setLineIdx(0)
      return
    }
    setLines([])
    setSeqIdx(0)
    setLineIdx(0)
  }, [phase])

  useEffect(() => {
    if (phase !== 'scanning') return
    const seq = SCANNING_SEQUENCES[seqIdx]
    if (!seq) return

    const t = setTimeout(() => {
      const newLine = seq[lineIdx]
      if (newLine) {
        setLines((l) => [...l.slice(-14), newLine])
        if (lineIdx + 1 < seq.length) {
          setLineIdx((i) => i + 1)
        } else if (seqIdx + 1 < SCANNING_SEQUENCES.length) {
          setSeqIdx((s) => s + 1)
          setLineIdx(0)
        }
      }
    }, 380)
    return () => clearTimeout(t)
  }, [phase, seqIdx, lineIdx])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(220,240,255,0.70) 100%)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 4px 20px rgba(30,100,180,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
    >
      {/* Title bar — glossy aqua gradient */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{
          background: 'linear-gradient(180deg, #6ac8f0 0%, #3aa0d8 60%, #2288c0 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        {/* Traffic light dots */}
        <div className="flex gap-1.5">
          {['rgba(255,90,90,0.85)', 'rgba(255,190,50,0.85)', 'rgba(60,200,100,0.85)'].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
          ))}
        </div>
        <span
          style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 1px 3px rgba(0,60,120,0.4)',
            fontFamily: 'Courier New, monospace',
          }}
        >
          🔬 Marine Observation Console
        </span>
      </div>

      {/* Log lines */}
      <div ref={containerRef} className="p-3 overflow-y-auto" style={{ height: '9rem' }}>
        {lines.map((l, i) => (
          <p
            key={i}
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '0.68rem',
              lineHeight: 1.65,
              color: i === lines.length - 1 ? '#0a5080' : '#4a82aa',
              fontWeight: i === lines.length - 1 ? 600 : 400,
            }}
          >
            {l}
          </p>
        ))}
      </div>
    </div>
  )
}
