import { useState, useMemo } from 'react'
import { SHARK_CLASSES } from '@/hooks/useSharkClassifier'
import { useGame } from '@/context/GameContext'
import RarityBadge from '@/components/aero/RarityBadge'

const ALL_RARITIES  = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
const STATUS_COLOR  = {
  'Least Concern': '#20a060', 'Near Threatened': '#1878c8',
  'Vulnerable': '#d08020', 'Endangered': '#c05820', 'Critically Endangered': '#c03030',
}
const DANGER_COLOR  = { Low: '#20a060', Medium: '#d08020', High: '#c03030' }

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
        <p className="holo-label">XokDex — Species Database</p>
        <h1
          className="font-display text-4xl md:text-5xl font-black mt-1"
          style={{
            background: 'linear-gradient(135deg, #0050a0 0%, #0090d8 50%, #30b8f0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          SharkDex
        </h1>
        <p className="aero-subtitle text-sm mt-1">
          {speciesDiscovered.length} / {SHARK_CLASSES.length} species discovered
        </p>
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
          className="flex-1 rounded-2xl px-4 py-2.5 text-sm focus:outline-none"
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(160,210,240,0.5)',
            color: '#0a3060',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {ALL_RARITIES.map((r) => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              className="rounded-full px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                background: rarity === r
                  ? 'linear-gradient(180deg, #5ab0e8 0%, #2888c8 100%)'
                  : 'rgba(255,255,255,0.7)',
                border: rarity === r ? '1px solid rgba(80,160,230,0.5)' : '1px solid rgba(160,210,240,0.4)',
                color: rarity === r ? 'white' : '#2060a0',
                boxShadow: rarity === r
                  ? '0 2px 8px rgba(0,120,200,0.25), inset 0 1px 0 rgba(255,255,255,0.35)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.8)',
                textShadow: rarity === r ? '0 1px 2px rgba(0,60,120,0.3)' : 'none',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="aero-panel p-12 text-center">
          <p style={{ color: '#3a6890', fontSize: '0.85rem' }}>No specimens found in database</p>
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
                        className="rounded-2xl flex items-center justify-center text-3xl"
                        style={{
                          width: 52, height: 52,
                          background: discovered
                            ? 'linear-gradient(135deg, rgba(200,238,255,0.9), rgba(160,215,248,0.7))'
                            : 'rgba(220,235,248,0.5)',
                          border: discovered ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(200,220,240,0.5)',
                          boxShadow: discovered ? '0 2px 8px rgba(30,100,180,0.12), inset 0 1px 0 rgba(255,255,255,0.8)' : 'none',
                          filter: discovered ? 'none' : 'grayscale(0.6) opacity(0.5)',
                        }}
                      >
                        🦈
                      </div>
                      <RarityBadge rarity={s.rarity} showStars={false} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-display font-extrabold text-base leading-tight"
                        style={{ color: discovered ? '#0a3060' : '#7a9ab8' }}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs italic mt-0.5" style={{ color: '#5a88a8' }}>{s.latin}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: `${DANGER_COLOR[s.danger]}18`,
                          border: `1px solid ${DANGER_COLOR[s.danger]}40`,
                          color: DANGER_COLOR[s.danger],
                          fontSize: '0.62rem',
                        }}
                      >
                        {s.danger}
                      </span>
                      <span style={{ color: '#6a9ab8', fontSize: '0.55rem', fontWeight: 600 }}>
                        {discovered ? '✓ Catalogued · Tap for data' : 'Not yet identified'}
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
                    <p className="holo-label text-center">{s.name}</p>
                    <div className="grid grid-cols-2 gap-1.5 flex-1">
                      {[
                        { l: 'Depth',  v: s.depth,  c: '#1878c8' },
                        { l: 'Danger', v: s.danger,  c: DANGER_COLOR[s.danger] },
                        { l: 'XP',     v: `+${s.xpReward}`, c: '#22a55a' },
                        { l: 'Status', v: s.status.split(' ').slice(-1)[0], c: STATUS_COLOR[s.status] ?? '#2a6090' },
                      ].map(({ l, v, c }) => (
                        <div
                          key={l}
                          className="rounded-xl p-2"
                          style={{
                            background: 'rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.8)',
                          }}
                        >
                          <p className="holo-label" style={{ fontSize: '0.48rem' }}>{l}</p>
                          <p className="text-xs font-bold mt-0.5 truncate" style={{ color: c }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ color: '#2a5878', fontSize: '0.62rem', lineHeight: 1.5 }}>
                      {s.fact?.substring(0, 90)}{s.fact?.length > 90 ? '...' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-center holo-label" style={{ fontSize: '0.58rem', opacity: 0.65 }}>
        Showing {filtered.length} / {SHARK_CLASSES.length} species · Tap card to flip
      </p>
    </div>
  )
}
