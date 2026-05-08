import { useGame } from '@/context/GameContext'
import { ACHIEVEMENTS, XP_PER_LEVEL } from '@/hooks/useGameState'
import XPBar from '@/components/aero/XPBar'

const RANKS = [
  { name: 'Cadet',              minScans: 0,  minSpecies: 0,  color: '#6b7a8d' },
  { name: 'Junior Biologist',   minScans: 5,  minSpecies: 3,  color: '#22a55a' },
  { name: 'Field Researcher',   minScans: 10, minSpecies: 7,  color: '#3b82f6' },
  { name: 'Marine Expert',      minScans: 25, minSpecies: 10, color: '#9333ea' },
  { name: 'Master Ichthyologist', minScans: 50, minSpecies: 15, color: '#d97706' },
]

function getRank(scans, species) {
  return [...RANKS].reverse().find((r) => scans >= r.minScans && species >= r.minSpecies) ?? RANKS[0]
}

export default function Achievements() {
  const { achievements, scansCompleted, speciesDiscovered, xp, level, quizCorrect, quizTotal } = useGame()
  const rank = getRank(scansCompleted, speciesDiscovered.length)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">

      {/* Header */}
      <div className="aero-panel p-6 text-center">
        <p className="holo-label">Marine Biology OS — Officer Record</p>
        <h1
          className="font-display text-4xl md:text-5xl font-black mt-1"
          style={{
            background: `linear-gradient(135deg, ${rank.color} 0%, ${rank.color}bb 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}
        >
          Achievements
        </h1>
        <p className="aero-subtitle text-sm mt-1">
          {achievements.length} / {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      {/* Officer rank panel */}
      <div
        className="aero-panel p-6"
        style={{ border: `1.5px solid ${rank.color}50` }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="rounded-full flex items-center justify-center text-4xl flex-shrink-0"
            style={{
              width: 92, height: 92,
              background: `radial-gradient(circle, ${rank.color}18, ${rank.color}08)`,
              border: `2px solid ${rank.color}50`,
              boxShadow: `0 4px 20px ${rank.color}25, inset 0 1px 0 rgba(255,255,255,0.7)`,
            }}
          >
            {rank.name.includes('Master') ? '🏆' : rank.name.includes('Expert') ? '⭐' : rank.name.includes('Researcher') ? '🔬' : rank.name.includes('Junior') ? '🌊' : '🎓'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="holo-label">Current Rank</p>
            <p className="font-display font-black text-2xl mt-1" style={{ color: rank.color }}>
              {rank.name}
            </p>
            <p style={{ color: '#3a6890', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {scansCompleted} scans · {speciesDiscovered.length} species · {achievements.length} achievements
            </p>
            {rank !== RANKS[RANKS.length - 1] && (() => {
              const nextIdx = RANKS.findIndex((r) => r === rank) + 1
              const next    = RANKS[nextIdx]
              return (
                <p className="terminal-text-dim mt-1" style={{ fontSize: '0.62rem' }}>
                  Next: {next.name} — {Math.max(0, next.minScans - scansCompleted)} more scans, {Math.max(0, next.minSpecies - speciesDiscovered.length)} more species
                </p>
              )
            })()}
          </div>
          <div className="text-center">
            <div
              className="rounded-full flex items-center justify-center font-display font-black text-3xl mx-auto mb-1 text-white"
              style={{
                width: 68, height: 68,
                background: 'linear-gradient(135deg, #5ab0e8, #1870b8)',
                boxShadow: '0 4px 16px rgba(30,130,220,0.35), inset 0 1px 0 rgba(255,255,255,0.35)',
              }}
            >
              {level}
            </div>
            <p className="holo-label">Level</p>
          </div>
        </div>

        <div className="mt-4">
          <XPBar />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          { label: 'Total XP',        value: xp.toLocaleString(),    icon: '💎', color: '#9333ea' },
          { label: 'Scans Completed', value: scansCompleted,          icon: '🔬', color: '#1878c8' },
          { label: 'Species Found',   value: `${speciesDiscovered.length}/15`, icon: '🦈', color: '#20a060' },
          { label: 'Quiz Accuracy',   value: quizTotal > 0 ? `${Math.round((quizCorrect / quizTotal) * 100)}%` : '—', icon: '🧠', color: '#d97706' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="aero-panel p-4 text-center">
            <p style={{ fontSize: '1.4rem' }}>{icon}</p>
            <p className="holo-label mt-1" style={{ fontSize: '0.5rem' }}>{label}</p>
            <p className="font-display font-black text-xl mt-1" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Achievement list */}
      <div className="grid gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = achievements.includes(ach.id)
          return (
            <div
              key={ach.id}
              className="rounded-2xl p-4 flex items-center gap-4 transition-all duration-200"
              style={{
                background: unlocked ? 'rgba(255,255,255,0.78)' : 'rgba(240,248,255,0.5)',
                border: unlocked ? '1px solid rgba(255,255,255,0.95)' : '1px solid rgba(200,225,248,0.5)',
                boxShadow: unlocked ? '0 4px 16px rgba(30,100,180,0.12), inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
                opacity: unlocked ? 1 : 0.55,
              }}
            >
              <div
                className="flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  width: 52, height: 52,
                  background: unlocked
                    ? 'linear-gradient(135deg, rgba(200,238,255,0.9), rgba(160,215,248,0.7))'
                    : 'rgba(220,235,248,0.5)',
                  border: unlocked ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(200,220,240,0.4)',
                  boxShadow: unlocked ? '0 2px 8px rgba(30,100,180,0.1), inset 0 1px 0 rgba(255,255,255,0.8)' : 'none',
                }}
              >
                {unlocked ? ach.icon : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: unlocked ? '#0a3060' : '#6a90b0' }}>{ach.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#5a88a8' }}>{ach.desc}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="holo-label" style={{ fontSize: '0.5rem' }}>Reward</p>
                <p
                  className="font-mono font-bold text-sm"
                  style={{ color: unlocked ? '#18803a' : '#5a9870' }}
                >
                  +{ach.xp} XP
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
