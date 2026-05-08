import { Link } from 'react-router-dom'
import XokLogo from '@/components/ui/XokLogo'

const LINKS = [
  { to: '/',           label: 'Home'       },
  { to: '/classifier', label: 'Identifier' },
  { to: '/xokdex',     label: 'SharkDex'   },
  { to: '/quiz',       label: 'Quiz'       },
]

export default function Footer() {
  return (
    <footer className="border-t border-ocean-800/50 bg-ocean-950 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <XokLogo className="h-7 w-7 text-ocean-400" />
            <span className="font-display text-lg font-extrabold text-gradient-ocean">Xok</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="nav-link text-xs">{label}</Link>
            ))}
          </nav>
          <p className="text-ocean-600 text-xs text-center sm:text-right">
            &copy; {new Date().getFullYear()} Xok — know your sharks.
          </p>
        </div>
      </div>
    </footer>
  )
}
