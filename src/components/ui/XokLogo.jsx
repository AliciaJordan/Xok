export default function XokLogo({ className = 'h-8 w-8' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Xok logo"
    >
      {/* Ocean drop / wave shape */}
      <circle cx="20" cy="20" r="18" fill="url(#xok-grad)" />
      {/* Stylised "X" fish-tail shape */}
      <path
        d="M13 14 L20 20 L13 26M27 14 L20 20 L27 26"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bubble */}
      <circle cx="27" cy="13" r="2" fill="white" opacity="0.7" />
      <defs>
        <linearGradient id="xok-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0fa3cc" />
          <stop offset="100%" stopColor="#0b2d41" />
        </linearGradient>
      </defs>
    </svg>
  )
}
