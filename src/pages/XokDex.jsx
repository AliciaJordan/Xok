import { useState, useMemo } from 'react'
import SectionWrapper from '@/components/ui/SectionWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { SHARK_CLASSES } from '@/hooks/useSharkClassifier'

const STATUS_VARIANT = {
  'Least Concern':          'seafoam',
  'Near Threatened':        'ocean',
  'Vulnerable':             'sand',
  'Endangered':             'coral',
  'Critically Endangered':  'coral',
}

const DANGER_VARIANT = {
  Low:    'seafoam',
  Medium: 'sand',
  High:   'coral',
}

const ALL_STATUSES = ['All', ...new Set(SHARK_CLASSES.map((s) => s.status))]

export default function XokDex() {
  const [query,  setQuery]  = useState('')
  const [status, setStatus] = useState('All')

  const filtered = useMemo(() =>
    SHARK_CLASSES.filter((s) =>
      (status === 'All' || s.status === status) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
       s.latin.toLowerCase().includes(query.toLowerCase()))
    ), [query, status])

  return (
    <SectionWrapper>
      <div className="text-center mb-10">
        <Badge variant="ocean" className="mb-3">15 species</Badge>
        <h1 className="section-title">SharkDex</h1>
        <p className="section-subtitle max-w-xl mx-auto">
          A field guide to every shark species in the Xok classifier — taxonomy, depth, danger, and conservation status.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          placeholder="Search by name or Latin…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-xl bg-ocean-900/60 border border-ocean-700/50 px-4 py-2.5 text-sm text-white
                     placeholder:text-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500"
        />
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors border whitespace-nowrap
                ${status === s
                  ? 'bg-ocean-500 border-ocean-500 text-white'
                  : 'border-ocean-700/50 text-ocean-400 hover:border-ocean-500 hover:text-white'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-ocean-500 py-16">No sharks matched your search.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-ocean-800/80 flex items-center justify-center text-2xl">
                  🦈
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{s.name}</p>
                  <p className="text-xs text-ocean-500 italic truncate">{s.latin}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={STATUS_VARIANT[s.status] ?? 'ocean'}>{s.status}</Badge>
                <Badge variant={DANGER_VARIANT[s.danger] ?? 'ocean'}>Danger: {s.danger}</Badge>
                <Badge variant="ocean">{s.depth}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-ocean-600 text-xs">
        Showing {filtered.length} of {SHARK_CLASSES.length} species
      </p>
    </SectionWrapper>
  )
}
