const VARIANTS = {
  ocean:   'bg-ocean-700/50 text-ocean-200 border-ocean-600/40',
  seafoam: 'bg-seafoam-600/20 text-seafoam-400 border-seafoam-500/30',
  coral:   'bg-coral-500/20 text-coral-400 border-coral-400/30',
  sand:    'bg-sand-200/10 text-sand-200 border-sand-200/20',
}

export default function Badge({ children, variant = 'ocean', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
