export default function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`card-ocean p-5 ${hover ? 'hover:border-ocean-500/60 hover:-translate-y-1 transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
