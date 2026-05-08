import { useGame } from '@/context/GameContext'

export default function XPBar({ compact = false }) {
  const { xp, level, xpInLevel, xpToNext } = useGame()
  const pct = Math.min(100, (xpInLevel / xpToNext) * 100)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="holo-label">LVL {level}</span>
        <div className="vista-progress-track h-2 w-24 flex-shrink-0">
          <div className="vista-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="holo-label">{xp} XP</span>
      </div>
    )
  }

  return (
    <div className="aero-panel-dark rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full flex items-center justify-center text-xs font-black"
            style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #22ccff, #0058a8)',
              boxShadow: '0 0 12px rgba(0,200,255,0.5)',
              color: 'white',
            }}
          >
            {level}
          </div>
          <div>
            <p className="holo-label">LEVEL {level}</p>
            <p className="terminal-text" style={{ fontSize: '0.6rem' }}>{xp} XP TOTAL</p>
          </div>
        </div>
        <p className="holo-label">{xpInLevel} / {xpToNext}</p>
      </div>
      <div className="vista-progress-track h-3">
        <div className="vista-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
