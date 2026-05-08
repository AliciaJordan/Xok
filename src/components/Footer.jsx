import { Link } from 'react-router-dom'
import { useGame } from '@/context/GameContext'

export default function Footer() {
  const { level, scansCompleted, speciesDiscovered, xp } = useGame()

  return (
    <footer
      className="relative z-10 mt-auto"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(160,220,255,0.3))',
        borderTop: '1px solid rgba(255,255,255,0.6)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* System status bar */}
          <div
            className="flex items-center gap-4 rounded-2xl px-4 py-2"
            style={{
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(30,100,180,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#22a55a', boxShadow: '0 0 5px rgba(34,165,90,0.5)' }} />
              <span className="holo-label">System Online</span>
            </div>
            <div className="h-3 w-px" style={{ background: 'rgba(100,180,230,0.4)' }} />
            <span className="holo-label">Lv {level}</span>
            <span className="holo-label">{xp} XP</span>
            <span className="holo-label">{scansCompleted} Scans</span>
            <span className="holo-label">{speciesDiscovered.length}/15 Species</span>
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
                className="text-xs font-semibold transition-colors"
                style={{ color: '#3070a0' }}
                onMouseEnter={(e) => e.target.style.color = '#105080'}
                onMouseLeave={(e) => e.target.style.color = '#3070a0'}
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="holo-label" style={{ fontSize: '0.55rem', opacity: 0.6 }}>
            XOK Marine OS © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
