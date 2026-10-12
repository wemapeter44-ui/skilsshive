function CreditIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M20 2 L35.6 11 L35.6 29 L20 38 L4.4 29 L4.4 11 Z"
        fill="#1a1a1a"
      />
      <path
        d="M20 12 L26.9 16 L26.9 24 L20 28 L13.1 24 L13.1 16 Z"
        fill="#b9ea4a"
      />
    </svg>
  )
}

export default CreditIcon