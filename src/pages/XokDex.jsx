import { useState, useMemo } from 'react'
import { SHARK_CLASSES } from '@/hooks/useSharkClassifier'
import { useGame } from '@/context/GameContext'
import RarityBadge from '@/components/aero/RarityBadge'

const ALL_RARITIES  = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
const STATUS_COLOR  = {
  'Least Concern': '#34d399', 'Near Threatened': '#22ccff',
  'Vulnerable': '#fbbf24', 'Endangered': '#fb923c', 'Critically Endangered': '#f87171',
}
const DANGER_COLOR  = { Low: '#34d399', Medium: '#fbbf24', High: '#f87171' }

export default function XokDex() {
  const [query,   setQuery]   = useState('')
  const [rarity,  setRarity]  = useState('All')
  const [flipped, setFlipped] = useState(null)
  const { speciesDiscovered } = useGame()

  const filtered = useMemo(() =>
    SHARK_CLASSES.filter((s) =>
      (rarity === 'All' || s.rarity === rarity) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
       s.latin.toLowerCase().includes(query.toLowerCase()))
    ), [query, rarity])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">

      {/* Header */}
      <div className="aero-panel p-6 text-center">
        <p className="holo-label">XOKDEX — SPECIES DATABASE</p>
        <h1
          className="font-display text-4xl md:text-5xl font-black mt-1"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #70e0ff 50%, #22ccff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(0,200,255,0.4))',
          }}
        >
          SHARKDEX
        </h1>
        <p className="aero-subtitle text-sm mt-1">
          {speciesDiscovered.length} / {SHARK_CLASSES.length} species discovered
        </p>
        {/* Discovery progress */}
        <div className="mt-4 max-w-xs mx-auto vista-progress-track h-3">
          <div className="vista-progress-fill" style={{ width: `${(speciesDiscovered.length / SHARK_CLASSES.length) * 100}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="aero-panel p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search species or Latin name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-aqua-800 focus:outline-none"
          style={{
            background: 'rgba(0,15,40,0.8)',
            border: '1px solid rgba(0,176,232,0.3)',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {ALL_RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                fontFamily: 'Courier New, monospace',
                letterSpacing: '0.05em',
                background: rarity === r ? 'rgba(0,176,232,0.3)' : 'rgba(0,15,40,0.6)',
                border: rarity === r ? '1px solid rgba(0,200,255,0.6)' : '1px solid rgba(0,100,160,0.3)',
                color: rarity === r ? '#70e0ff' : 'rgba(100,160,200,0.6)',
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="aero-panel p-12 text-center">
          <p className="terminal-text" style={{ fontSize: '0.8rem' }}>NO SPECIMENS FOUND IN DATABASE</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const discovered = speciesDiscovered.includes(s.id)
            const isFlipped  = flipped === s.id

            return (
              <div
                key={s.id}
                onClick={() => setFlipped(isFlipped ? null : s.id)}
                className="cursor-pointer"
                style={{ perspective: '1000px', height: '220px' }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT */}
                  <div
                    className="absolute inset-0 aero-panel flex flex-col gap-3 p-5"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="rounded-2xl flex items-center justify-center text-4xl"
                        style={{
                          width: 56, height: 56,
                          background: discovered
                            ? 'linear-gradient(135deg, rgba(0,80,140,0.6), rgba(0,40,80,0.8))'
                            : 'rgba(0,20,50,0.6)',
                          border: discovered ? '1px solid rgba(0,176,232,0.4)' : '1px solid rgba(50,80,120,0.3)',
                          filter: discovered ? 'none' : 'grayscale(1) brightness(0.3)',
                        }}
                      >
                        🦈
                      </div>
                      <RarityBadge rarity={s.rarity} showStars={false} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display font-extrabold text-base leading-tight"
                        style={{ color: discovered ? '#fff' : 'rgba(100,140,180,0.5)', filter: discovered ? 'none' : 'blur(0px)' }}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs italic mt-0.5" style={{ color: 'rgba(100,160,200,0.5)' }}>{s.latin}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${DANGER_COLOR[s.danger]}20`, border: `1px solid ${DANGER_COLOR[s.danger]}40`, color: DANGER_COLOR[s.danger], fontFamily: 'Courier New', fontSize: '0.6rem' }}
                        >
                          {s.danger}
                        </span>
                      </div>
                      <span className="terminal-text-dim" style={{ fontSize: '0.55rem' }}>
                        {discovered ? '✓ CATALOGUED · TAP FOR DATA' : '◈ NOT YET IDENTIFIED'}
                      </span>
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className="absolute inset-0 aero-panel-dark rounded-2xl flex flex-col gap-2 p-4 overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <p className="holo-label text-center">{s.name.toUpperCase()}</p>
                    <div className="grid grid-cols-2 gap-1.5 flex-1">
                      {[
                        { l: 'DEPTH',  v: s.depth,  c: '#22ccff' },
                        { l: 'DANGER', v: s.danger,  c: DANGER_COLOR[s.danger] },
                        { l: 'XP',     v: `+${s.xpReward}`, c: '#00ff88' },
                        { l: 'STATUS', v: s.status.split(' ').slice(-1)[0], c: STATUS_COLOR[s.status] ?? '#70e0ff' },
                      ].map(({ l, v, c }) => (
                        <div key={l} className="rounded-lg p-2" style={{ background: 'rgba(0,20,50,0.7)', border: '1px solid rgba(0,100,180,0.2)' }}>
                          <p className="holo-label" style={{ fontSize: '0.48rem' }}>{l}</p>
                          <p className="text-xs font-bold mt-0.5 truncate" style={{ color: c }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-aqua-300 leading-relaxed" style={{ fontSize: '0.62rem', lineHeight: 1.5 }}>
                      {s.fact?.substring(0, 90)}{s.fact?.length > 90 ? '...' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="terminal-text-dim text-center" style={{ fontSize: '0.6rem' }}>
        SHOWING {filtered.length} / {SHARK_CLASSES.length} DATABASE ENTRIES — TAP CARD TO FLIP
      </p>
    </div>
  )
}
