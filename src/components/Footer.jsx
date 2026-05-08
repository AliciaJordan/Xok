import { Link } from 'react-router-dom'
import { useGame } from '@/context/GameContext'

export default function Footer() {
  const { level, scansCompleted, speciesDiscovered, xp } = useGame()

  return (
    <footer
      className="relative z-10 mt-auto"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(0,10,30,0.9))',
        borderTop: '1px solid rgba(0,176,232,0.2)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* System status bar */}
          <div
            className="flex items-center gap-4 rounded-xl px-4 py-2"
            style={{ background: 'rgba(0,15,40,0.7)', border: '1px solid rgba(0,176,232,0.2)' }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
              <span className="terminal-text" style={{ fontSize: '0.6rem' }}>SYSTEM ONLINE</span>
            </div>
            <div className="h-3 w-px" style={{ background: 'rgba(0,255,100,0.2)' }} />
            <span className="holo-label">LVL {level}</span>
            <span className="holo-label">{xp} XP</span>
            <span className="holo-label">{scansCompleted} SCANS</span>
            <span className="holo-label">{speciesDiscovered.length}/15 SPECIES</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-4">
            {[
              ['/', 'Home'], ['/classifier', 'Scanner'], ['/xokdex', 'SharkDex'],
              ['/quiz', 'Quiz'], ['/achievements', 'Trophies'],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="text-xs font-medium transition-colors"
                style={{ color: 'rgba(120,200,255,0.6)' }}
                onMouseEnter={(e) => e.target.style.color = '#70e0ff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(120,200,255,0.6)'}
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="holo-label" style={{ fontSize: '0.55rem', opacity: 0.5 }}>
            XOK MARINE OS © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
