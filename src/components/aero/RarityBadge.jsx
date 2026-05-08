const STARS = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 }

export default function RarityBadge({ rarity, showStars = true, className = '' }) {
  const cls  = `rarity-${rarity?.toLowerCase()}`
  const stars = STARS[rarity] ?? 1

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold ${cls} ${className}`}
      style={{ fontFamily: 'Courier New, monospace', letterSpacing: '0.05em' }}
    >
      {showStars && (
        <span style={{ fontSize: '0.6rem', letterSpacing: '-1px' }}>
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
      )}
      {rarity?.toUpperCase()}
    </span>
  )
}
