import { useState, useEffect, useRef } from 'react'

const IDLE_LINES = [
  'XOK MARINE ANALYZER v2.8.4 — READY',
  'Neural classification engine: ONLINE',
  'Hydroacoustic sensors: CALIBRATED',
  'XOKDEX database: CONNECTED [15 SPECIES]',
  'TensorFlow.js runtime: LOADED',
  '> Awaiting specimen input...',
]

const SCANNING_SEQUENCES = [
  ['SPECIMEN INPUT DETECTED', 'Loading image tensor [224×224×3]...', 'Normalizing pixel distribution [0.0–1.0]...'],
  ['Applying dorsal fin morphology filters...', 'Analyzing caudal fin aspect ratio...', 'Checking lateral line configuration...'],
  ['RUNNING CLASSIFICATION NETWORK...', 'Evaluating 15 shark species profiles...', 'Cross-referencing genomic database...'],
  ['Calculating threat assessment matrix...', 'Estimating conservation status...', 'Compiling species report...'],
  ['▓▓▓▓▓▓▓▓▓▓ ANALYSIS COMPLETE ▓▓▓▓▓▓▓▓▓▓', 'Generating XP reward...', 'Updating XOKDEX collection...'],
]

export default function DiagnosticTerminal({ phase = 'idle', className = '' }) {
  const [lines, setLines]     = useState(IDLE_LINES)
  const [cursor, setCursor]   = useState(true)
  const [seqIdx, setSeqIdx]   = useState(0)
  const [lineIdx, setLineIdx] = useState(0)
  const containerRef          = useRef(null)

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => !c), 500)
    return () => clearInterval(t)
  }, [])

  // Scanning sequence
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
    }, 340)
    return () => clearTimeout(t)
  }, [phase, seqIdx, lineIdx])

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(0,10,4,0.92)',
        border: '1px solid rgba(0,255,100,0.2)',
        boxShadow: 'inset 0 0 20px rgba(0,60,20,0.3)',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5"
        style={{ background: 'rgba(0,40,20,0.8)', borderBottom: '1px solid rgba(0,255,100,0.15)' }}
      >
        <div className="flex gap-1.5">
          {['rgba(255,80,80,0.7)', 'rgba(255,190,0,0.7)', 'rgba(0,200,80,0.7)'].map((c, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <span className="terminal-text" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
          XOKDEX SPECIMEN ANALYZER — TERMINAL
        </span>
      </div>

      {/* Lines */}
      <div ref={containerRef} className="p-3 overflow-y-auto" style={{ height: '9rem' }}>
        {lines.map((l, i) => (
          <p
            key={i}
            className={i === lines.length - 1 ? 'terminal-text' : 'terminal-text-dim'}
          >
            {i === lines.length - 1 ? '› ' : '  '}
            {l}
          </p>
        ))}
        <span className="terminal-text" style={{ fontSize: '0.7rem' }}>
          {cursor ? '█' : ' '}
        </span>
      </div>
    </div>
  )
}
