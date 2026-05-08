import ConfidenceBar from './ConfidenceBar'
import Badge from '@/components/ui/Badge'

const STATUS_VARIANT = {
  'Least Concern':           'seafoam',
  'Near Threatened':         'ocean',
  'Vulnerable':              'sand',
  'Endangered':              'coral',
  'Critically Endangered':   'coral',
  'Data Deficient':          'sand',
}

const DANGER_VARIANT = {
  Low:    'seafoam',
  Medium: 'sand',
  High:   'coral',
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-ocean-900/60 border border-ocean-700/40 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 rounded bg-ocean-800" />
        <div className="h-5 w-14 rounded-full bg-ocean-800" />
      </div>
      <div className="h-3 w-28 rounded bg-ocean-800/60" />
      <div className="h-1.5 w-full rounded-full bg-ocean-800" />
    </div>
  )
}

export default function PredictionPanel({ predictions, inferencing }) {
  if (inferencing) {
    return (
      <div className="space-y-3">
        <p className="text-ocean-500 text-xs font-medium uppercase tracking-wider">Analysing…</p>
        {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  if (!predictions) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ocean-800 min-h-64 gap-3 p-8 text-center">
        <span className="text-5xl">🦈</span>
        <p className="text-ocean-400 text-sm">Results will appear here after identification.</p>
      </div>
    )
  }

  const top = predictions[0]

  return (
    <div className="space-y-3">
      {/* Top match highlight */}
      <div className="rounded-2xl bg-gradient-to-br from-ocean-800/80 to-ocean-900/80 border border-ocean-600/50 p-5">
        <p className="text-ocean-400 text-xs font-medium uppercase tracking-wider mb-3">Best match</p>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-display text-xl font-extrabold text-white">{top.name}</p>
            <p className="text-ocean-400 text-xs italic mt-0.5">{top.latin}</p>
          </div>
          <span className="font-display text-3xl font-black text-gradient-ocean whitespace-nowrap">
            {top.confidence}%
          </span>
        </div>
        <ConfidenceBar value={top.confidence} />
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant={STATUS_VARIANT[top.status] ?? 'ocean'}>{top.status}</Badge>
          <Badge variant={DANGER_VARIANT[top.danger] ?? 'ocean'}>Danger: {top.danger}</Badge>
          <Badge variant="ocean">{top.depth}</Badge>
        </div>
      </div>

      {/* Other candidates */}
      {predictions.length > 1 && (
        <>
          <p className="text-ocean-500 text-xs font-medium uppercase tracking-wider pt-1">Other candidates</p>
          {predictions.slice(1).map((p) => (
            <div
              key={p.id}
              className="rounded-xl bg-ocean-900/50 border border-ocean-800/60 px-4 py-3 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ocean-100 truncate">{p.name}</p>
                  <p className="text-xs text-ocean-500 italic truncate">{p.latin}</p>
                </div>
                <span className="text-sm font-bold text-ocean-300 whitespace-nowrap">{p.confidence}%</span>
              </div>
              <ConfidenceBar value={p.confidence} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
