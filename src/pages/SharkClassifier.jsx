import { useState, useEffect, useCallback, useRef } from 'react'
import { useSharkClassifier } from '@/hooks/useSharkClassifier'
import { useGame }            from '@/context/GameContext'
import SonarDisplay           from '@/components/aero/SonarDisplay'
import DiagnosticTerminal     from '@/components/aero/DiagnosticTerminal'
import ScanLineOverlay        from '@/components/aero/ScanLineOverlay'
import RarityBadge            from '@/components/aero/RarityBadge'
import ImageUploader          from '@/components/classifier/ImageUploader'
import CameraCapture          from '@/components/classifier/CameraCapture'

const DANGER_STYLE = {
  High:   { cls: 'danger-high',   label: '⚠ HIGH THREAT' },
  Medium: { cls: 'danger-medium', label: '◈ MEDIUM THREAT' },
  Low:    { cls: 'danger-low',    label: '✓ LOW THREAT' },
}

function AnalysisBar({ label, value, max = 100, color = '#22ccff' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="holo-label">{label}</span>
        <span className="terminal-text" style={{ fontSize: '0.65rem' }}>{value}{typeof max === 'number' && max !== 100 ? `/${max}` : '%'}</span>
      </div>
      <div className="vista-progress-track h-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 8px ${color}80`,
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.3)', borderRadius: 999 }} />
        </div>
      </div>
    </div>
  )
}

export default function SharkClassifier() {
  const [activeTab, setActiveTab]     = useState('upload')
  const [scanPhase, setScanPhase]     = useState('idle')  // idle|loading|ready|scanning|results
  const [imageEl,   setImageEl]       = useState(null)
  const [xpGained,  setXpGained]      = useState(null)
  const [scanProgress, setScanProgress] = useState(0)

  const { modelStatus, predictions, inferencing, loadError, loadModel, classify, reset } = useSharkClassifier()
  const { recordScan } = useGame()

  const progressRef = useRef(null)

  // Auto-load
  useEffect(() => { loadModel() }, []) // eslint-disable-line

  // Sync scan phase with model + inference state
  useEffect(() => {
    if (modelStatus === 'loading') setScanPhase('loading')
    else if (modelStatus === 'ready' || modelStatus === 'demo') {
      setScanPhase((p) => p === 'loading' || p === 'idle' ? 'ready' : p)
    }
  }, [modelStatus])

  useEffect(() => {
    if (inferencing) {
      setScanPhase('scanning')
      setScanProgress(0)
      progressRef.current = setInterval(() => {
        setScanProgress((p) => Math.min(97, p + (100 - p) * 0.04 + 0.5))
      }, 80)
    } else if (predictions) {
      clearInterval(progressRef.current)
      setScanProgress(100)
      setScanPhase('results')
    }
    return () => clearInterval(progressRef.current)
  }, [inferencing, predictions])

  const canClassify = ['ready', 'demo'].includes(modelStatus)

  const handleImageReady = useCallback((imgEl) => {
    setImageEl(imgEl)
    reset()
    setScanPhase('ready')
    if (canClassify) {
      classify(imgEl)
    }
  }, [canClassify, classify, reset])

  useEffect(() => {
    if (predictions?.[0]) {
      const top = predictions[0]
      const gained = top.xpReward ?? 50
      recordScan(top)
      setXpGained(gained)
    }
  }, [predictions]) // eslint-disable-line

  function switchTab(id) { setActiveTab(id); reset(); setScanPhase(canClassify ? 'ready' : scanPhase); setImageEl(null); setXpGained(null) }
  function handleReset()  { reset(); setScanPhase(canClassify ? 'ready' : 'idle'); setImageEl(null); setXpGained(null); setScanProgress(0) }

  const top = predictions?.[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="aero-panel p-6 text-center">
        <p className="holo-label">XOK MARINE BIOLOGY OS</p>
        <h1
          className="font-display text-4xl md:text-5xl font-black mt-1"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #70e0ff 50%, #22ccff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.4))',
          }}
        >
          SPECIMEN ANALYZER
        </h1>
        <p className="aero-subtitle text-sm mt-1">
          Marine identification terminal — TensorFlow.js neural classification engine
        </p>
        {modelStatus === 'demo' && (
          <div
            className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24', fontFamily: 'Courier New, monospace', letterSpacing: '0.05em' }}
          >
            ⚠ DEMO MODE — Place model.json in /public/models/shark-classifier/
          </div>
        )}
      </div>

      {/* ── MAIN TERMINAL GRID ── */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* LEFT — Sonar + input */}
        <div className="space-y-4">
          {/* Sonar panel */}
          <div className="aero-panel-dark rounded-2xl p-5 flex flex-col items-center gap-4">
            <p className="holo-label">SONAR ARRAY</p>
            <SonarDisplay
              active={scanPhase !== 'idle'}
              locked={scanPhase === 'scanning' || scanPhase === 'results'}
              size={200}
            />

            {/* Progress bar */}
            <div className="w-full space-y-1">
              <div className="flex justify-between">
                <span className="holo-label">ANALYSIS PROGRESS</span>
                <span className="terminal-text" style={{ fontSize: '0.6rem' }}>{Math.round(scanProgress)}%</span>
              </div>
              <div className="vista-progress-track h-3">
                <div
                  className="vista-progress-fill"
                  style={{ width: `${scanProgress}%`, transition: 'width 0.1s linear' }}
                />
              </div>
            </div>

            {/* Status indicator */}
            <div className="w-full flex items-center justify-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: scanPhase === 'results' ? '#00ff88'
                    : scanPhase === 'scanning' ? '#fbbf24'
                    : '#22ccff',
                  boxShadow: `0 0 8px ${scanPhase === 'results' ? '#00ff88' : scanPhase === 'scanning' ? '#fbbf24' : '#22ccff'}`,
                  animation: scanPhase === 'scanning' ? 'pulse 0.8s infinite' : 'none',
                }}
              />
              <span className="terminal-text" style={{ fontSize: '0.65rem' }}>
                {scanPhase === 'idle'     ? 'SYSTEM IDLE'
                : scanPhase === 'loading' ? 'LOADING NEURAL ENGINE...'
                : scanPhase === 'ready'   ? 'AWAITING SPECIMEN'
                : scanPhase === 'scanning'? 'SCANNING MARINE SPECIMEN...'
                : '◈ ANALYSIS COMPLETE'}
              </span>
            </div>
          </div>

          {/* Diagnostic terminal */}
          <DiagnosticTerminal phase={scanPhase === 'scanning' ? 'scanning' : 'idle'} />
        </div>

        {/* CENTRE — Image input */}
        <div className="space-y-4">
          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: 'rgba(0,15,40,0.7)', border: '1px solid rgba(0,176,232,0.25)' }}
          >
            {[{ id: 'upload', label: '↑ UPLOAD' }, { id: 'camera', label: '◉ CAMERA' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className="flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '0.08em',
                  background: activeTab === tab.id ? 'rgba(0,176,232,0.3)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid rgba(0,176,232,0.5)' : '1px solid transparent',
                  color: activeTab === tab.id ? '#70e0ff' : 'rgba(100,160,200,0.6)',
                  boxShadow: activeTab === tab.id ? '0 0 12px rgba(0,176,232,0.2)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Specimen viewfinder */}
          <div
            className="relative rounded-2xl overflow-hidden scanlines"
            style={{
              background: 'rgba(0,8,20,0.9)',
              border: '2px solid rgba(0,176,232,0.3)',
              boxShadow: '0 0 30px rgba(0,120,200,0.15)',
              minHeight: '260px',
            }}
          >
            {/* Corner UI chrome */}
            {[
              { top: 6, left: 6,   borderTop: '2px solid #22ccff', borderLeft: '2px solid #22ccff' },
              { top: 6, right: 6,  borderTop: '2px solid #22ccff', borderRight: '2px solid #22ccff' },
              { bottom: 6, left: 6,  borderBottom: '2px solid #22ccff', borderLeft: '2px solid #22ccff' },
              { bottom: 6, right: 6, borderBottom: '2px solid #22ccff', borderRight: '2px solid #22ccff' },
            ].map((s, i) => (
              <div key={i} className="absolute z-20 pointer-events-none" style={{ ...s, width: 16, height: 16 }} />
            ))}

            {/* Viewfinder label */}
            <div className="absolute top-2 left-0 right-0 z-20 flex justify-center pointer-events-none">
              <span style={{ fontFamily: 'Courier New', fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(0,200,255,0.6)' }}>
                ◈ SPECIMEN VIEWFINDER
              </span>
            </div>

            {activeTab === 'upload' ? (
              <ImageUploader onImageReady={handleImageReady} disabled={!canClassify || inferencing} />
            ) : (
              <CameraCapture onCapture={handleImageReady} disabled={!canClassify || inferencing} />
            )}

            <ScanLineOverlay active={inferencing} />
          </div>

          {imageEl && !inferencing && (
            <button onClick={handleReset} className="btn-aqua-outline w-full justify-center text-xs">
              ↺ CLEAR SPECIMEN
            </button>
          )}

          {!canClassify && (
            <button onClick={loadModel} className="btn-aqua w-full justify-center">
              ◈ INITIALIZE NEURAL ENGINE
            </button>
          )}
        </div>

        {/* RIGHT — Results */}
        <div className="space-y-4">
          {/* Result panel */}
          {!predictions && !inferencing && (
            <div
              className="aero-panel-dark rounded-2xl p-6 text-center space-y-4"
              style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 15px rgba(0,200,255,0.3))' }}>🦈</div>
              <p className="holo-label">AWAITING SPECIMEN</p>
              <p className="terminal-text-dim" style={{ fontSize: '0.65rem', maxWidth: '200px' }}>
                Upload a shark image or use camera to begin species analysis
              </p>
            </div>
          )}

          {inferencing && (
            <div className="aero-panel-dark rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 rounded-full animate-spin"
                  style={{ border: '3px solid rgba(0,100,150,0.3)', borderTopColor: '#22ccff', boxShadow: '0 0 20px rgba(0,200,255,0.3)' }}
                />
              </div>
              <p className="terminal-text animate-terminal-blink">SCANNING MARINE SPECIMEN...</p>
              <p className="terminal-text-dim">Running neural classification network</p>
            </div>
          )}

          {predictions && top && (
            <div className="space-y-3 animate-fade-in-up">
              {/* Top match */}
              <div
                className="aero-panel-dark rounded-2xl p-5 space-y-4"
                style={{
                  border: top.rarity === 'Legendary' ? '1px solid rgba(245,158,11,0.5)'
                        : top.rarity === 'Epic'      ? '1px solid rgba(192,132,252,0.5)'
                        : '1px solid rgba(0,176,232,0.3)',
                  boxShadow: top.rarity === 'Legendary' ? '0 0 30px rgba(245,158,11,0.2)'
                           : top.rarity === 'Epic'      ? '0 0 20px rgba(168,85,247,0.2)'
                           : 'none',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="holo-label">PRIMARY MATCH</p>
                    <p
                      className="font-display text-xl font-black mt-1 leading-tight"
                      style={{
                        background: 'linear-gradient(135deg, #fff 0%, #70e0ff 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                      }}
                    >
                      {top.name}
                    </p>
                    <p className="text-xs italic mt-0.5" style={{ color: 'rgba(100,180,220,0.7)' }}>{top.latin}</p>
                  </div>
                  <div
                    className="text-right flex-shrink-0"
                    style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#22ccff', textShadow: '0 0 15px rgba(0,200,255,0.6)', lineHeight: 1 }}
                  >
                    {top.confidence}%
                  </div>
                </div>

                <RarityBadge rarity={top.rarity} showStars />

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'HABITAT',  value: top.habitat?.split(',')[0] ?? '—', color: '#22ccff' },
                    { label: 'DEPTH',    value: top.depth,  color: '#70e0ff' },
                    { label: 'STATUS',   value: top.status, color: top.status.includes('Critical') ? '#f87171' : top.status === 'Endangered' ? '#fb923c' : '#34d399' },
                    { label: 'DANGER',   value: top.danger, color: top.danger === 'High' ? '#f87171' : top.danger === 'Medium' ? '#fbbf24' : '#34d399' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-lg p-2.5" style={{ background: 'rgba(0,20,50,0.6)', border: '1px solid rgba(0,100,180,0.2)' }}>
                      <p className="holo-label" style={{ fontSize: '0.5rem' }}>{label}</p>
                      <p className="text-xs font-semibold mt-0.5 truncate" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>

                <AnalysisBar label="CONFIDENCE" value={top.confidence} color="#22ccff" />

                {/* Fun fact */}
                <div
                  className="rounded-xl p-3"
                  style={{ background: 'rgba(0,200,255,0.05)', border: '1px solid rgba(0,200,255,0.15)' }}
                >
                  <p className="holo-label mb-1" style={{ fontSize: '0.5rem' }}>◈ SPECIMEN FACT</p>
                  <p className="text-aqua-200 leading-relaxed" style={{ fontSize: '0.72rem' }}>{top.fact}</p>
                </div>

                {/* XP gained */}
                {xpGained && (
                  <div
                    className="flex items-center justify-between rounded-xl px-4 py-3 animate-xp-flash"
                    style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)' }}
                  >
                    <span className="terminal-text" style={{ fontSize: '0.7rem' }}>XP GAINED</span>
                    <span className="terminal-text font-black" style={{ fontSize: '1.2rem' }}>+{xpGained}</span>
                  </div>
                )}
              </div>

              {/* Other candidates */}
              {predictions.length > 1 && (
                <div className="space-y-2">
                  <p className="holo-label px-1">OTHER CANDIDATES</p>
                  {predictions.slice(1).map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl px-4 py-3 flex items-center gap-3"
                      style={{ background: 'rgba(0,15,40,0.7)', border: '1px solid rgba(0,100,180,0.2)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-aqua-100 truncate">{p.name}</p>
                        <p className="text-xs italic truncate" style={{ color: 'rgba(100,160,200,0.6)' }}>{p.latin}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RarityBadge rarity={p.rarity} showStars={false} />
                        <span className="terminal-text font-bold" style={{ fontSize: '0.8rem' }}>{p.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
