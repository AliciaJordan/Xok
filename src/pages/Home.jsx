import { Link } from 'react-router-dom'
import { useGame } from '@/context/GameContext'
import XPBar from '@/components/aero/XPBar'
import RarityBadge from '@/components/aero/RarityBadge'
import SonarDisplay from '@/components/aero/SonarDisplay'

const FEATURES = [
  { icon: '◈', label: 'AI SCANNER', title: 'Shark Identifier', desc: 'TensorFlow.js neural network identifies 15 shark species from any photo in real time.', to: '/classifier', color: '#22ccff' },
  { icon: '◉', label: 'DATABASE',   title: 'SharkDex',         desc: 'Browse the complete species catalogue — taxonomy, depth, danger, rarity, and conservation status.', to: '/xokdex',    color: '#00ff88' },
  { icon: '◆', label: 'QUIZ MODE',  title: 'Shark Quiz',       desc: 'Adaptive knowledge challenges — answer correctly to earn XP and unlock achievements.', to: '/quiz',       color: '#c084fc' },
  { icon: '★', label: 'TROPHIES',   title: 'Achievements',     desc: 'Track your discoveries, earn badges, and climb the ranks from Cadet to Master Ichthyologist.', to: '/achievements', color: '#fbbf24' },
]

const TICKER_DATA = [
  '🦈 GREAT WHITE DETECTED IN SECTOR 7', '📡 SONAR LOCK ON WHALE SHARK',
  '⚠ OCEANIC WHITETIP STATUS: CRITICAL', '✓ DATABASE: 15/15 SPECIES INDEXED',
  '🌊 DEEP SCAN DEPTH: 1928m', '◈ NEURAL NET ACCURACY: 94.7%',
  '★ ZEBRA SHARK — RARITY: LEGENDARY', '📊 XOKDEX BUILD 2.8.4 — STABLE',
]

export default function Home() {
  const { level, xp, scansCompleted, speciesDiscovered, achievements } = useGame()

  return (
    <div className="min-h-screen">
      {/* ── TICKER ── */}
      <div
        className="relative overflow-hidden py-2 z-10"
        style={{ background: 'rgba(0,10,30,0.8)', borderBottom: '1px solid rgba(0,176,232,0.25)' }}
      >
        <div className="flex animate-data-scroll whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="terminal-text px-8" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
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
                background: 'rgba(0,200,255,0.12)',
                border: '1px solid rgba(0,200,255,0.4)',
                color: '#70e0ff',
                letterSpacing: '0.12em',
                fontFamily: 'Courier New, monospace',
              }}
            >
              ◈ XOK MARINE BIOLOGY OS — ONLINE
            </span>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-black leading-none"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #b3efff 30%, #22ccff 65%, #0096d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(0,200,255,0.4))',
            }}
          >
            SHARK<br />ANALYSIS<br />SYSTEM
          </h1>

          <p className="aero-subtitle max-w-xl mx-auto">
            A futuristic marine biology operating system — identify shark species, build your collection, and become a Master Ichthyologist.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/classifier" className="btn-aqua text-base px-8 py-3">
              ◈ Launch Scanner
            </Link>
            <Link to="/xokdex" className="btn-aqua-outline text-base px-8 py-3">
              Browse SharkDex →
            </Link>
          </div>
        </div>

        {/* ── STATUS DASHBOARD ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'LEVEL', value: level, icon: '★', color: '#22ccff' },
            { label: 'TOTAL XP', value: xp.toLocaleString(), icon: '◆', color: '#c084fc' },
            { label: 'SCANS', value: scansCompleted, icon: '◈', color: '#00ff88' },
            { label: 'SPECIES', value: `${speciesDiscovered.length}/15`, icon: '◉', color: '#fbbf24' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="aero-panel p-5 text-center">
              <p style={{ fontSize: '1.8rem', filter: `drop-shadow(0 0 10px ${color})` }}>{icon}</p>
              <p className="holo-label mt-1">{label}</p>
              <p
                className="font-display text-3xl font-black mt-1"
                style={{ color, textShadow: `0 0 15px ${color}60` }}
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
                <div
                  className="aero-panel p-5 h-full flex flex-col gap-3 transition-all duration-200 group-hover:-translate-y-1"
                  style={{ '--hover-glow': color }}
                >
                  <div className="flex items-center justify-between">
                    <p style={{ fontSize: '1.6rem', color, filter: `drop-shadow(0 0 8px ${color})` }}>{icon}</p>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        fontFamily: 'Courier New, monospace',
                        letterSpacing: '0.1em',
                        color,
                        background: `${color}18`,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-white text-lg" style={{ textShadow: `0 0 12px ${color}40` }}>
                      {title}
                    </p>
                    <p className="text-aqua-300 text-sm mt-1 leading-relaxed opacity-80">{desc}</p>
                  </div>
                  <p className="mt-auto text-xs font-bold" style={{ color, opacity: 0.7 }}>OPEN SYSTEM →</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Sonar + XP */}
          <div className="space-y-4">
            <div className="aero-panel p-5 flex flex-col items-center gap-4">
              <p className="holo-label">LIVE SONAR</p>
              <SonarDisplay active size={180} />
              <div className="text-center">
                <p className="terminal-text" style={{ fontSize: '0.6rem' }}>AWAITING SPECIMEN INPUT</p>
                <p className="terminal-text-dim" style={{ fontSize: '0.55rem' }}>Upload image to begin analysis</p>
              </div>
              <Link to="/classifier" className="btn-aqua w-full btn-aqua-sm justify-center">
                Open Scanner
              </Link>
            </div>
            <XPBar />
            <div className="aero-panel p-4">
              <p className="holo-label mb-3">RECENT ACHIEVEMENTS</p>
              {achievements.length === 0 ? (
                <p className="terminal-text-dim text-center py-3" style={{ fontSize: '0.65rem' }}>
                  No achievements yet. Start scanning!
                </p>
              ) : (
                <div className="space-y-1.5">
                  {achievements.slice(-3).map((id) => (
                    <div key={id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 4px #00ff88' }} />
                      <span className="terminal-text" style={{ fontSize: '0.6rem' }}>ACHIEVEMENT UNLOCKED: {id.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RARITY GUIDE ── */}
        <div className="aero-panel p-6">
          <p className="holo-label mb-4 text-center">SPECIMEN RARITY CLASSIFICATION SYSTEM</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map((r) => (
              <RarityBadge key={r} rarity={r} showStars />
            ))}
          </div>
          <p className="terminal-text-dim text-center mt-3" style={{ fontSize: '0.6rem' }}>
            Rarity determines XP reward per identification. Legendary specimens grant 1000 XP.
          </p>
        </div>

      </div>
    </div>
  )
}
