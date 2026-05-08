import { MODEL_PATH } from '@/hooks/useSharkClassifier'

const CONFIG = {
  idle: {
    bg: 'bg-ocean-900/50 border-ocean-700/40',
    icon: (
      <svg className="h-4 w-4 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
      </svg>
    ),
    text: (cls) => <span className={cls}>Load the model to begin identification.</span>,
  },
  loading: {
    bg: 'bg-ocean-800/60 border-ocean-600/40',
    icon: <span className="h-4 w-4 rounded-full border-2 border-ocean-400/30 border-t-ocean-400 animate-spin inline-block" />,
    text: (cls) => <span className={cls}>Loading TensorFlow.js model from <code className="text-ocean-300 text-xs">{MODEL_PATH}</code>…</span>,
  },
  ready: {
    bg: 'bg-seafoam-600/10 border-seafoam-500/30',
    icon: (
      <svg className="h-4 w-4 text-seafoam-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    text: (cls) => <span className={cls.replace('ocean-400', 'seafoam-400')}>Model ready — upload or capture an image to identify shark species.</span>,
  },
  demo: {
    bg: 'bg-sand-200/5 border-sand-200/20',
    icon: (
      <svg className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    text: (cls) => (
      <span className="text-yellow-300 text-xs">
        Demo mode — model file not found at <code className="text-yellow-400">{MODEL_PATH}</code>. Predictions are randomised.
        Place your <code className="text-yellow-400">model.json</code> + weight files in <code className="text-yellow-400">public/models/shark-classifier/</code>.
      </span>
    ),
  },
  error: {
    bg: 'bg-coral-500/10 border-coral-400/30',
    icon: (
      <svg className="h-4 w-4 text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    text: (cls) => <span className={cls.replace('ocean-400', 'coral-400')}>Model error — see console for details.</span>,
  },
}

export default function ModelStatusBanner({ status }) {
  const cfg = CONFIG[status] ?? CONFIG.idle
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs ${cfg.bg}`}>
      <span className="mt-0.5 flex-shrink-0">{cfg.icon}</span>
      {cfg.text('text-ocean-400')}
    </div>
  )
}
