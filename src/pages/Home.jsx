import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const FEATURES = [
  {
    icon: '🦈',
    title: 'AI Shark Identifier',
    description: 'Upload a photo or use your camera — a TensorFlow.js neural network identifies the shark species and shows confidence scores in real time.',
    to: '/classifier',
    badge: 'TensorFlow.js',
    badgeVariant: 'seafoam',
  },
  {
    icon: '📖',
    title: 'SharkDex',
    description: 'Browse all 15 species in our database — conservation status, danger level, depth range, and Latin taxonomy for every entry.',
    to: '/xokdex',
    badge: '15 species',
    badgeVariant: 'ocean',
  },
  {
    icon: '🧠',
    title: 'Shark Quiz',
    description: 'Test your knowledge of shark biology, behaviour, and conservation with adaptive questions and instant scoring.',
    to: '/quiz',
    badge: 'Interactive',
    badgeVariant: 'coral',
  },
]

const STATS = [
  { value: '15',   label: 'Shark species'       },
  { value: '95%',  label: 'Model accuracy'       },
  { value: '100%', label: 'In-browser inference' },
  { value: '0',    label: 'Servers required'     },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-ocean-gradient">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-ocean-400/15 bg-ocean-400/5 animate-float"
              style={{
                width:  `${80 + i * 50}px`,
                height: `${80 + i * 50}px`,
                left:   `${8 + i * 18}%`,
                top:    `${15 + (i % 3) * 22}%`,
                animationDelay:    `${i * 0.9}s`,
                animationDuration: `${6 + i}s`,
              }}
            />
          ))}
        </div>

        <SectionWrapper className="relative text-center py-24 lg:py-36">
          <Badge variant="seafoam" className="mb-4">Shark intelligence, in your browser</Badge>
          <h1 className="font-display text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Identify any{' '}
            <span className="text-gradient-ocean">shark species</span>{' '}
            instantly
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-ocean-200">
            Xok uses a TensorFlow.js convolutional neural network to classify 15 shark species
            directly in your browser — no uploads, no servers, full privacy.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/classifier" className="btn-primary text-base px-8 py-3">
              Identify a Shark
            </Link>
            <Link to="/xokdex" className="btn-outline text-base px-8 py-3">
              Browse SharkDex
            </Link>
          </div>
        </SectionWrapper>

        <svg className="w-full" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M0 30 C360 60 1080 0 1440 30 L1440 60 L0 60 Z" fill="#0b2d41" />
        </svg>
      </div>

      {/* Features */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <h2 className="section-title">Everything about sharks</h2>
          <p className="section-subtitle">Three tools built for shark enthusiasts and researchers.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon, title, description, to, badge, badgeVariant }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <span className="text-4xl animate-wave inline-block">{icon}</span>
                  <Badge variant={badgeVariant}>{badge}</Badge>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-ocean-300 transition-colors">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-ocean-300 leading-relaxed">{description}</p>
                </div>
                <span className="mt-auto text-xs font-semibold text-ocean-400 group-hover:text-ocean-300 transition-colors">
                  Explore →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* Stats strip */}
      <div className="border-y border-ocean-800/50 bg-ocean-900/30">
        <SectionWrapper className="py-10">
          <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="font-display text-3xl font-black text-gradient-ocean">{value}</dt>
                <dd className="mt-1 text-sm text-ocean-400">{label}</dd>
              </div>
            ))}
          </dl>
        </SectionWrapper>
      </div>
    </div>
  )
}
