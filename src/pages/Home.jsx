import { Link } from 'react-router-dom'
import { useGame } from '@/context/GameContext'
import XPBar from '@/components/aero/XPBar'
import RarityBadge from '@/components/aero/RarityBadge'
import SonarDisplay from '@/components/aero/SonarDisplay'

const FEATURES = [
  { icon: '🔬', label: 'AI Scanner', title: 'Shark Identifier', desc: 'TensorFlow.js identifies 15 shark species from any photo in real time.', to: '/classifier', color: '#1878c8' },
  { icon: '📖', label: 'Database',   title: 'SharkDex',         desc: 'Browse the complete species catalogue — depth, danger, rarity, and conservation status.', to: '/xokdex',    color: '#22a55a' },
  { icon: '🧠', label: 'Quiz Mode',  title: 'Shark Quiz',       desc: 'Knowledge challenges — answer correctly to earn XP and unlock achievements.', to: '/quiz',       color: '#9333ea' },
  { icon: '🏆', label: 'Trophies',   title: 'Achievements',     desc: 'Track discoveries, earn badges, and climb the ranks from Cadet to Master Ichthyologist.', to: '/achievements', color: '#d97706' },
]

const TICKER_DATA = [
  '🦈 Great White Shark — Atlantic Ocean',
  '🌊 Whale Shark — largest fish on Earth',
  '⭐ Zebra Shark — legendary species',
  '📡 15 species in database',
  '🔬 Neural network: online',
  '🌿 Ocean conservation: always',
]

export default function Home() {
  const { level, xp, scansCompleted, speciesDiscovered, achievements } = useGame()

  return (
    <div className="min-h-screen">
      {/* ── SOFT TICKER ── */}
      <div
        className="relative overflow-hidden py-2 z-10"
        style={{
          background: 'rgba(255,255,255,0.5)',
          borderBottom: '1px solid rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex animate-data-scroll whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="holo-label px-8" style={{ fontSize: '0.62rem' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-8">

        {/* ── HERO ── */}
        <div className="aero-panel p-8 md:p-12 text-center space-y-6 animate-fade-in-up">
          <div className="inline-block mb-2">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(100,180,240,0.5)',
                color: '#1870b8',
                letterSpacing: '0.1em',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              🌊 XOK Marine Biology OS — Online
            </span>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-black leading-none"
            style={{
              background: 'linear-gradient(135deg, #0050a0 0%, #0090d8 50%, #30b8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 12px rgba(0,140,220,0.25))',
            }}
          >
            Shark<br />Analysis<br />System
          </h1>

          <p className="aero-subtitle max-w-xl mx-auto text-base" style={{ color: '#2a6090' }}>
            A peaceful marine biology desktop environment — identify shark species, build your collection, and explore the ocean.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/classifier" className="btn-aqua text-base px-8 py-3">
              🔬 Launch Scanner
            </Link>
            <Link to="/xokdex" className="btn-aqua-outline text-base px-8 py-3">
              Browse SharkDex →
            </Link>
          </div>
        </div>

        {/* ── STATUS DASHBOARD ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Level',   value: level,                      icon: '⭐', color: '#1878c8' },
            { label: 'Total XP',value: xp.toLocaleString(),         icon: '💎', color: '#9333ea' },
            { label: 'Scans',   value: scansCompleted,              icon: '🔬', color: '#0090d8' },
            { label: 'Species', value: `${speciesDiscovered.length}/15`, icon: '🦈', color: '#d97706' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="aero-panel p-5 text-center">
              <p style={{ fontSize: '1.8rem' }}>{icon}</p>
              <p className="holo-label mt-1">{label}</p>
              <p
                className="font-display text-3xl font-black mt-1"
                style={{ color }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── FEATURE PANELS + SONAR ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Features */}
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon, label, title, desc, to, color }) => (
              <Link key={to} to={to} className="group block">
                <div className="aero-panel p-5 h-full flex flex-col gap-3 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-aero-glow">
                  <div className="flex items-center justify-between">
                    <p style={{ fontSize: '1.6rem' }}>{icon}</p>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        color,
                        background: 'rgba(255,255,255,0.8)',
                        border: `1px solid ${color}40`,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-lg" style={{ color: '#0a3060' }}>
                      {title}
                    </p>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#3a6890' }}>{desc}</p>
                  </div>
                  <p className="mt-auto text-xs font-bold" style={{ color, opacity: 0.75 }}>Open →</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Sonar + XP */}
          <div className="space-y-4">
            <div className="aero-panel p-5 flex flex-col items-center gap-4">
              <p className="holo-label">Ocean Sonar</p>
              <SonarDisplay active={false} size={180} />
              <div className="text-center">
                <p className="terminal-text" style={{ fontSize: '0.62rem' }}>Awaiting specimen input</p>
                <p className="terminal-text-dim" style={{ fontSize: '0.58rem' }}>Upload an image to begin</p>
              </div>
              <Link to="/classifier" className="btn-aqua w-full btn-aqua-sm justify-center">
                Open Scanner
              </Link>
            </div>
            <XPBar />
            <div className="aero-panel p-4">
              <p className="holo-label mb-3">Recent Achievements</p>
              {achievements.length === 0 ? (
                <p className="terminal-text-dim text-center py-3" style={{ fontSize: '0.65rem' }}>
                  No achievements yet — start scanning!
                </p>
              ) : (
                <div className="space-y-1.5">
                  {achievements.slice(-3).map((id) => (
                    <div key={id} className="flex items-center gap-2">
                      <span style={{ fontSize: '0.75rem' }}>🏅</span>
                      <span className="terminal-text" style={{ fontSize: '0.62rem' }}>
                        Achievement: {id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RARITY GUIDE ── */}
        <div className="aero-panel p-6">
          <p className="holo-label mb-4 text-center">Specimen Rarity Classification</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map((r) => (
              <RarityBadge key={r} rarity={r} showStars />
            ))}
          </div>
          <p className="terminal-text-dim text-center mt-3" style={{ fontSize: '0.62rem' }}>
            Rarity determines XP reward per identification. Legendary specimens grant 1000 XP.
          </p>
        </div>

      </div>
    </div>
  )
}
