export default function SectionWrapper({ children, className = '' }) {
  return (
    <section className={`mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20 ${className}`}>
      {children}
    </section>
  )
}
