import { useGame } from '@/context/GameContext'
import { ACHIEVEMENTS, XP_PER_LEVEL } from '@/hooks/useGameState'
import XPBar from '@/components/aero/XPBar'

const RANKS = [
  { name: 'CADET',              minScans: 0,  minSpecies: 0,  color: '#94a3b8' },
  { name: 'JUNIOR BIOLOGIST',   minScans: 5,  minSpecies: 3,  color: '#22c55e' },
  { name: 'FIELD RESEARCHER',   minScans: 10, minSpecies: 7,  color: '#60a5fa' },
  { name: 'MARINE EXPERT',      minScans: 25, minSpecies: 10, color: '#c084fc' },
  { name: 'MASTER ICHTHYOLOGIST', minScans: 50, minSpecies: 15, color: '#fbbf24' },
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
        <p className="holo-label">MARINE BIOLOGY OS — OFFICER RECORD</p>
        <h1
          className="font-display text-4xl md:text-5xl font-black mt-1"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5))',
          }}
        >
          ACHIEVEMENTS
        </h1>
        <p className="aero-subtitle text-sm mt-1">
          {achievements.length} / {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      {/* Officer rank panel */}
      <div
        className="aero-panel p-6"
        style={{ border: `1px solid ${rank.color}40`, boxShadow: `0 0 30px ${rank.color}20` }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="rounded-full flex items-center justify-center text-4xl flex-shrink-0"
            style={{
              width: 96, height: 96,
              background: `radial-gradient(circle, ${rank.color}20, ${rank.color}08)`,
              border: `2px solid ${rank.color}60`,
              boxShadow: `0 0 25px ${rank.color}40`,
            }}
          >
            {rank.name.includes('MASTER') ? '🏆' : rank.name.includes('EXPERT') ? '⭐' : rank.name.includes('RESEARCHER') ? '🔬' : rank.name.includes('JUNIOR') ? '🌊' : '🎓'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="holo-label">CURRENT RANK</p>
            <p className="font-display font-black text-2xl mt-1" style={{ color: rank.color, textShadow: `0 0 20px ${rank.color}60` }}>
              {rank.name}
            </p>
            <p className="text-aqua-300 text-sm mt-1 opacity-80">
              {scansCompleted} scans · {speciesDiscovered.length} species identified · {achievements.length} achievements
            </p>
            {/* Next rank */}
            {rank !== RANKS[RANKS.length - 1] && (() => {
              const nextIdx = RANKS.findIndex((r) => r === rank) + 1
              const next    = RANKS[nextIdx]
              return (
                <p className="terminal-text-dim mt-1" style={{ fontSize: '0.6rem' }}>
                  NEXT: {next.name} — needs {Math.max(0, next.minScans - scansCompleted)} more scans, {Math.max(0, next.minSpecies - speciesDiscovered.length)} more species
                </p>
              )
            })()}
          </div>
          <div className="text-center">
            <div
              className="rounded-full flex items-center justify-center font-display font-black text-3xl mx-auto mb-1"
              style={{
                width: 72, height: 72,
                background: 'linear-gradient(135deg, #22ccff, #0058a8)',
                boxShadow: '0 0 20px rgba(0,200,255,0.5)',
                color: 'white',
              }}
            >
              {level}
            </div>
            <p className="holo-label">LEVEL</p>
          </div>
        </div>

        <div className="mt-4">
          <XPBar />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          { label: 'TOTAL XP',         value: xp.toLocaleString(),    icon: '◆', color: '#c084fc' },
          { label: 'SCANS COMPLETED',  value: scansCompleted,          icon: '◈', color: '#22ccff' },
          { label: 'SPECIES FOUND',    value: `${speciesDiscovered.length}/15`, icon: '🦈', color: '#00ff88' },
          { label: 'QUIZ ACCURACY',    value: quizTotal > 0 ? `${Math.round((quizCorrect / quizTotal) * 100)}%` : '—', icon: '🧠', color: '#fbbf24' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="aero-panel p-4 text-center">
            <p style={{ fontSize: '1.5rem' }}>{icon}</p>
            <p className="holo-label mt-1" style={{ fontSize: '0.5rem' }}>{label}</p>
            <p className="font-display font-black text-xl mt-1" style={{ color, textShadow: `0 0 12px ${color}60` }}>{value}</p>
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
                background: unlocked ? 'rgba(0,200,255,0.07)' : 'rgba(0,10,30,0.6)',
                border: unlocked ? '1px solid rgba(0,200,255,0.3)' : '1px solid rgba(0,60,100,0.3)',
                boxShadow: unlocked ? '0 0 20px rgba(0,200,255,0.1)' : 'none',
                filter: unlocked ? 'none' : 'grayscale(0.5)',
                opacity: unlocked ? 1 : 0.5,
              }}
            >
              <div
                className="flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  width: 52, height: 52,
                  background: unlocked
                    ? 'linear-gradient(135deg, rgba(0,176,232,0.3), rgba(0,80,160,0.3))'
                    : 'rgba(0,20,50,0.6)',
                  border: unlocked ? '1px solid rgba(0,176,232,0.4)' : '1px solid rgba(0,60,100,0.3)',
                  boxShadow: unlocked ? '0 0 15px rgba(0,176,232,0.3)' : 'none',
                }}
              >
                {unlocked ? ach.icon : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${unlocked ? 'text-white' : 'text-aqua-800'}`}>{ach.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(100,150,180,0.6)' }}>{ach.desc}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="holo-label" style={{ fontSize: '0.5rem' }}>REWARD</p>
                <p
                  className="font-mono font-bold text-sm"
                  style={{ color: unlocked ? '#00ff88' : 'rgba(0,150,100,0.4)', textShadow: unlocked ? '0 0 8px rgba(0,255,136,0.5)' : 'none' }}
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
