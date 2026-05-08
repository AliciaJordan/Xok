import { useGame } from '@/context/GameContext'

export default function XPBar({ compact = false }) {
  const { xp, level, xpInLevel, xpToNext } = useGame()
  const pct = Math.min(100, (xpInLevel / xpToNext) * 100)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="holo-label">Lv {level}</span>
        <div className="vista-progress-track h-2 w-24 flex-shrink-0">
          <div className="vista-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="holo-label">{xp} XP</span>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl p-4 space-y-2"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(210,238,255,0.65) 100%)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 4px 16px rgba(30,100,180,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="rounded-full flex items-center justify-center text-sm font-black text-white"
            style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #5ab0e8, #1870b8)',
              boxShadow: '0 3px 10px rgba(30,130,220,0.4), inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            {level}
          </div>
          <div>
            <p className="holo-label">Level {level}</p>
            <p className="terminal-text" style={{ fontSize: '0.6rem' }}>{xp} XP total</p>
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
