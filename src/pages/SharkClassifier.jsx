import { useState, useEffect, useCallback, useRef } from 'react'
import { useSharkClassifier } from '@/hooks/useSharkClassifier'
import { useGame }            from '@/context/GameContext'
import SonarDisplay           from '@/components/aero/SonarDisplay'
import MarineObservationConsole from '@/components/aero/MarineObservationConsole'
import ScanLineOverlay        from '@/components/aero/ScanLineOverlay'
import RarityBadge            from '@/components/aero/RarityBadge'
import ImageUploader          from '@/components/classifier/ImageUploader'
import CameraCapture          from '@/components/classifier/CameraCapture'

const STATUS_COLOR = {
  'Least Concern': '#20a060', 'Near Threatened': '#1878c8',
  'Vulnerable': '#d08020', 'Endangered': '#c05820', 'Critically Endangered': '#c03030',
}

function AnalysisBar({ label, value, max = 100, color = '#1878c8' }) {
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
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.45)', borderRadius: 999 }} />
        </div>
      </div>
    </div>
  )
}

export default function SharkClassifier() {
  const [activeTab, setActiveTab]     = useState('upload')
  const [scanPhase, setScanPhase]     = useState('idle')
  const [imageEl,   setImageEl]       = useState(null)
  const [xpGained,  setXpGained]      = useState(null)
  const [scanProgress, setScanProgress] = useState(0)

  const { modelStatus, predictions, inferencing, loadModel, classify, reset } = useSharkClassifier()
  const { recordScan } = useGame()
  const progressRef = useRef(null)

  useEffect(() => { loadModel() }, []) // eslint-disable-line

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
    if (canClassify) classify(imgEl)
  }, [canClassify, classify, reset])

  useEffect(() => {
    if (predictions?.[0]) {
      const top = predictions[0]
      recordScan(top)
      setXpGained(top.xpReward ?? 50)
    }
  }, [predictions]) // eslint-disable-line

  function switchTab(id) { setActiveTab(id); reset(); setScanPhase(canClassify ? 'ready' : scanPhase); setImageEl(null); setXpGained(null) }
  function handleReset()  { reset(); setScanPhase(canClassify ? 'ready' : 'idle'); setImageEl(null); setXpGained(null); setScanProgress(0) }

  const top = predictions?.[0]

  const phaseLabel = {
    idle:     'System idle',
    loading:  'Loading classification engine...',
    ready:    'Awaiting specimen',
    scanning: 'Analyzing marine specimen...',
    results:  'Species identified!',
  }[scanPhase]

  const phaseDot = scanPhase === 'results' ? '#22a55a'
    : scanPhase === 'scanning' ? '#d08020'
    : '#1878c8'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="aero-panel p-6 text-center">
        <p className="holo-label">XOK Marine Biology OS</p>
        <h1
          className="font-display text-4xl md:text-5xl font-black mt-1"
          style={{
            background: 'linear-gradient(135deg, #0050a0 0%, #0090d8 60%, #30b8f0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          Specimen Analyzer
        </h1>
        <p className="aero-subtitle text-sm mt-1">
          Marine species identification — TensorFlow.js neural classification
        </p>
        {modelStatus === 'demo' && (
          <div
            className="mt-3 inline-block px-4 py-1.5 rounded-full text-xs"
            style={{
              background: 'rgba(255,245,210,0.85)',
              border: '1px solid rgba(217,119,6,0.4)',
              color: '#b45309',
              letterSpacing: '0.04em',
            }}
          >
            ⚠ Demo mode — place model.json in /public/models/shark-classifier/
          </div>
        )}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* LEFT — Sonar + console */}
        <div className="space-y-4">
          <div className="aero-panel p-5 flex flex-col items-center gap-4">
            <p className="holo-label">Ocean Sonar</p>
            <SonarDisplay
              active={scanPhase === 'scanning'}
              locked={scanPhase === 'results'}
              size={200}
            />

            {/* Progress */}
            <div className="w-full space-y-1.5">
              <div className="flex justify-between">
                <span className="holo-label">Analysis Progress</span>
                <span className="terminal-text" style={{ fontSize: '0.6rem' }}>{Math.round(scanProgress)}%</span>
              </div>
              <div className="vista-progress-track h-3">
                <div className="vista-progress-fill" style={{ width: `${scanProgress}%`, transition: 'width 0.1s linear' }} />
              </div>
            </div>

            {/* Status indicator */}
            <div className="w-full flex items-center justify-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: phaseDot,
                  boxShadow: `0 0 6px ${phaseDot}80`,
                }}
              />
              <span className="terminal-text" style={{ fontSize: '0.65rem' }}>{phaseLabel}</span>
            </div>
          </div>

          <MarineObservationConsole phase={scanPhase === 'scanning' ? 'scanning' : 'idle'} />
        </div>

        {/* CENTRE — Image input */}
        <div className="space-y-4">
          {/* Tab switcher */}
          <div
            className="flex rounded-2xl p-1 gap-1"
            style={{
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {[{ id: 'upload', label: '↑ Upload' }, { id: 'camera', label: '📷 Camera' }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: activeTab === tab.id
                    ? 'linear-gradient(180deg, #5ab0e8 0%, #2888c8 100%)'
                    : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#2060a0',
                  boxShadow: activeTab === tab.id
                    ? '0 2px 8px rgba(0,120,200,0.3), inset 0 1px 0 rgba(255,255,255,0.4)'
                    : 'none',
                  textShadow: activeTab === tab.id ? '0 1px 2px rgba(0,60,120,0.4)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Specimen viewfinder */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 20px rgba(30,100,180,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
              minHeight: '260px',
            }}
          >
            {/* Corner chrome */}
            {[
              { top: 8, left: 8,  borderTop: '2px solid rgba(80,160,230,0.6)', borderLeft: '2px solid rgba(80,160,230,0.6)', borderRadius: '4px 0 0 0' },
              { top: 8, right: 8, borderTop: '2px solid rgba(80,160,230,0.6)', borderRight: '2px solid rgba(80,160,230,0.6)', borderRadius: '0 4px 0 0' },
              { bottom: 8, left: 8,  borderBottom: '2px solid rgba(80,160,230,0.6)', borderLeft: '2px solid rgba(80,160,230,0.6)', borderRadius: '0 0 0 4px' },
              { bottom: 8, right: 8, borderBottom: '2px solid rgba(80,160,230,0.6)', borderRight: '2px solid rgba(80,160,230,0.6)', borderRadius: '0 0 4px 0' },
            ].map((s, i) => (
              <div key={i} className="absolute z-20 pointer-events-none" style={{ ...s, width: 16, height: 16 }} />
            ))}

            <div className="absolute top-2 left-0 right-0 z-20 flex justify-center pointer-events-none">
              <span style={{ fontFamily: 'Courier New', fontSize: '0.5rem', letterSpacing: '0.12em', color: 'rgba(40,120,200,0.7)', fontWeight: 600 }}>
                Specimen Viewfinder
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
            <button onClick={handleReset} className="btn-aqua-outline w-full justify-center text-sm">
              ↺ Clear Specimen
            </button>
          )}
          {!canClassify && (
            <button onClick={loadModel} className="btn-aqua w-full justify-center">
              🔬 Initialize Neural Engine
            </button>
          )}
        </div>

        {/* RIGHT — Results */}
        <div className="space-y-4">

          {!predictions && !inferencing && (
            <div
              className="aero-panel p-6 text-center space-y-4"
              style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ fontSize: '3.5rem' }}>🦈</div>
              <p className="holo-label">Awaiting Specimen</p>
              <p className="terminal-text-dim" style={{ fontSize: '0.68rem', maxWidth: '200px' }}>
                Upload a shark image or use the camera to begin species identification
              </p>
            </div>
          )}

          {inferencing && (
            <div className="aero-panel p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div
                  className="w-14 h-14 rounded-full"
                  style={{
                    border: '3px solid rgba(160,220,255,0.4)',
                    borderTopColor: '#3aa0d8',
                    animation: 'spin 0.9s linear infinite',
                  }}
                />
              </div>
              <p className="holo-label">Analyzing marine specimen...</p>
              <p className="terminal-text-dim">Matching ocean species database</p>
            </div>
          )}

          {predictions && top && (
            <div className="space-y-3 animate-fade-in-up">
              {/* Top match */}
              <div
                className="aero-panel p-5 space-y-4"
                style={{
                  border: top.rarity === 'Legendary' ? '1.5px solid rgba(217,119,6,0.45)'
                        : top.rarity === 'Epic'      ? '1.5px solid rgba(147,51,234,0.35)'
                        : '1px solid rgba(255,255,255,0.9)',
                  boxShadow: top.rarity === 'Legendary' ? '0 0 24px rgba(245,158,11,0.18)'
                           : top.rarity === 'Epic'      ? '0 0 18px rgba(147,51,234,0.15)'
                           : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="holo-label">Primary Match</p>
                    <p
                      className="font-display text-xl font-black mt-1 leading-tight"
                      style={{ color: '#0a3060' }}
                    >
                      {top.name}
                    </p>
                    <p className="text-xs italic mt-0.5" style={{ color: '#4a80a0' }}>{top.latin}</p>
                  </div>
                  <div
                    className="text-right flex-shrink-0 font-display font-black"
                    style={{ fontSize: '2rem', color: '#1878c8', lineHeight: 1 }}
                  >
                    {top.confidence}%
                  </div>
                </div>

                <RarityBadge rarity={top.rarity} showStars />

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Habitat',  value: top.habitat?.split(',')[0] ?? '—', color: '#1878c8' },
                    { label: 'Depth',    value: top.depth,  color: '#0090b8' },
                    { label: 'Status',   value: top.status, color: STATUS_COLOR[top.status] ?? '#2a6090' },
                    { label: 'Danger',   value: top.danger, color: top.danger === 'High' ? '#c03030' : top.danger === 'Medium' ? '#d08020' : '#20a060' },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="rounded-xl p-2.5"
                      style={{
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                      }}
                    >
                      <p className="holo-label" style={{ fontSize: '0.5rem' }}>{label}</p>
                      <p className="text-xs font-semibold mt-0.5 truncate" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>

                <AnalysisBar label="Confidence" value={top.confidence} color="#1878c8" />

                {/* Fun fact */}
                <div
                  className="rounded-2xl p-3"
                  style={{
                    background: 'rgba(220,242,255,0.7)',
                    border: '1px solid rgba(160,210,240,0.5)',
                  }}
                >
                  <p className="holo-label mb-1" style={{ fontSize: '0.5rem' }}>🌊 Ocean Fact</p>
                  <p style={{ color: '#1a5080', fontSize: '0.72rem', lineHeight: 1.55 }}>{top.fact}</p>
                </div>

                {/* XP gained */}
                {xpGained && (
                  <div
                    className="flex items-center justify-between rounded-2xl px-4 py-3 animate-xp-flash"
                    style={{
                      background: 'rgba(220,248,235,0.8)',
                      border: '1px solid rgba(34,165,90,0.35)',
                    }}
                  >
                    <span style={{ color: '#1a7040', fontSize: '0.72rem', fontWeight: 600 }}>XP Earned</span>
                    <span style={{ color: '#18803a', fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Nunito, sans-serif' }}>+{xpGained}</span>
                  </div>
                )}
              </div>

              {/* Other candidates */}
              {predictions.length > 1 && (
                <div className="space-y-2">
                  <p className="holo-label px-1">Other Candidates</p>
                  {predictions.slice(1).map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl px-4 py-3 flex items-center gap-3"
                      style={{
                        background: 'rgba(255,255,255,0.65)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 2px 8px rgba(30,100,180,0.08)',
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#0a3060' }}>{p.name}</p>
                        <p className="text-xs italic truncate" style={{ color: '#5a88a8' }}>{p.latin}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RarityBadge rarity={p.rarity} showStars={false} />
                        <span className="font-bold" style={{ color: '#1878c8', fontSize: '0.82rem' }}>{p.confidence}%</span>
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
