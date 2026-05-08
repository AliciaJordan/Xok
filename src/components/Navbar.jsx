import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import XokLogo from '@/components/ui/XokLogo'

const NAV_LINKS = [
  { to: '/',           label: 'Home'       },
  { to: '/classifier', label: 'Identifier' },
  { to: '/xokdex',     label: 'SharkDex'   },
  { to: '/quiz',       label: 'Quiz'       },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ocean-800/60 bg-ocean-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <XokLogo className="h-8 w-8 glow-ocean group-hover:scale-110 transition-transform duration-200" />
          <span className="font-display text-xl font-extrabold text-gradient-ocean">Xok</span>
        </Link>

        <ul className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'nav-link nav-link-active' : 'nav-link'}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden sm:block">
          <Link to="/classifier" className="btn-primary">
            Identify a Shark
          </Link>
        </div>

        <button
          className="sm:hidden rounded-md p-2 text-ocean-300 hover:text-white hover:bg-ocean-800/50 transition-colors"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {open && (
        <div className="sm:hidden border-t border-ocean-800/60 bg-ocean-950/95 px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ocean-800/60 text-white' : 'text-ocean-300 hover:bg-ocean-800/40 hover:text-white'
                }`
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link to="/classifier" className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>
              Identify a Shark
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
