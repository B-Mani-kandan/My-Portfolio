/**
 * Logo — the "MD" monogram on a glossy gradient tile.
 *
 *  - Tile: a two-tone gradient that slowly turns and changes theme colour every ~10s
 *    (mint → violet → orange → sky → amber), with a soft glossy shine.
 *  - Letters: bold, rounded white strokes with a soft shadow beneath for depth.
 *  - A white four-point sparkle twinkles in the corner.
 *
 * In the nav the letters draw themselves in on load; on hover the tile tilts and the
 * sparkle spins (see `.logo-*` in globals.css). The browser-tab icon (app/icon.svg) is
 * the same artwork without animation.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`logo ${className}`} role="img" aria-label="MD">
      <defs>
        <linearGradient id="logo-bg" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          {/* colours cycle through the site theme every ~10s (see .logo-c1 / .logo-c2 in globals.css) */}
          <stop className="logo-c1" offset="0" stopColor="#2fd3a2" />
          <stop className="logo-c2" offset="1" stopColor="#13917c" />
          {/* the colours slowly circle round the tile */}
          <animateTransform attributeName="gradientTransform" type="rotate" values="0 24 24;360 24 24" dur="9s" repeatCount="indefinite" />
        </linearGradient>
        <radialGradient id="logo-shine" cx="14" cy="9" r="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity=".4" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logo-bg)" />
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#logo-shine)" />
      <rect x="2.5" y="2.5" width="43" height="43" rx="13.5" fill="none" stroke="#fff" strokeOpacity=".35" />
      {/* soft shadow under the letters for depth */}
      <path
        className="logo-mark"
        d="M9.5 33V16l6.75 9.2L23 16v17M27 16v17h3a8.5 8.5 0 0 0 0-17z"
        transform="translate(0 1.4)"
        fill="none"
        stroke="#0a1a3a"
        strokeOpacity=".35"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
      <path
        className="logo-mark"
        d="M9.5 33V16l6.75 9.2L23 16v17M27 16v17h3a8.5 8.5 0 0 0 0-17z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
      />
      <path
        className="logo-spark"
        d="M40 4.5Q40.7 8.3 44.5 9 40.7 9.7 40 13.5 39.3 9.7 35.5 9 39.3 8.3 40 4.5z"
        fill="#fff"
      />
    </svg>
  );
}
