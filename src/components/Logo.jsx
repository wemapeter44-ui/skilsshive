import './Logo.css'

function Logo({ size = 30, withText = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b9ea4a" />
            <stop offset="100%" stopColor="#6fb81e" />
          </linearGradient>
        </defs>
        <path
          d="M20 2 L35.6 11 L35.6 29 L20 38 L4.4 29 L4.4 11 Z"
          fill="url(#logoGrad)"
        />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="18"
          fontWeight="800"
          fill="#1a1a1a"
          fontFamily="inherit"
        >
          S
        </text>
      </svg>
      {withText && <span className="logo-text">SkillHive</span>}
    </span>
  )
}

export default Logo