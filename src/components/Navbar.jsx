import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import XokLogo from '@/components/ui/XokLogo'
import XPBar   from '@/components/aero/XPBar'
import { useGame } from '@/context/GameContext'

const NAV_LINKS = [
  { to: '/',             label: 'Home'        },
  { to: '/classifier',   label: 'Scanner'     },
  { to: '/xokdex',       label: 'SharkDex'    },
  { to: '/quiz',         label: 'Quiz'        },
  { to: '/achievements', label: 'Achievements' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { level, scansCompleted } = useGame()

  return (
    <header className="sticky top-0 z-50 w-full nav-aero">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <XokLogo className="h-8 w-8 group-hover:scale-110 transition-transform duration-200" style={{ filter: 'drop-shadow(0 0 8px rgba(0,200,255,0.7))' }} />
          <div>
            <span
              className="font-display text-lg font-black leading-none"
              style={{
                background: 'linear-gradient(135deg, #f0faff 0%, #70e0ff 60%, #22ccff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(0,200,255,0.5))',
              }}
            >
              XOK
            </span>
            <p className="holo-label" style={{ fontSize: '0.45rem', lineHeight: 1, marginTop: 1 }}>MARINE OS v2.8</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link-aero ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: XP compact + scan CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <XPBar compact />
          <div
            className="text-center px-3 py-1 rounded-lg"
            style={{ background: 'rgba(0,40,80,0.6)', border: '1px solid rgba(0,176,232,0.3)' }}
          >
            <p className="terminal-text" style={{ fontSize: '0.55rem' }}>SCANS</p>
            <p className="holo-label text-base font-black leading-none">{scansCompleted}</p>
          </div>
          <Link to="/classifier" className="btn-aqua btn-aqua-sm">
            ◈ Identify Shark
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden rounded-xl p-2.5 transition-colors"
          style={{ background: 'rgba(0,100,180,0.3)', border: '1px solid rgba(0,176,232,0.4)' }}
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg className="h-5 w-5 text-aqua-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden px-4 pb-4 pt-2 space-y-1"
          style={{ borderTop: '1px solid rgba(0,176,232,0.2)', background: 'rgba(0,20,50,0.95)' }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-aqua-300'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(0,176,232,0.25)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
              } : {}}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2 space-y-2">
            <XPBar compact />
            <Link to="/classifier" className="btn-aqua w-full" onClick={() => setOpen(false)}>
              ◈ Identify Shark
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
