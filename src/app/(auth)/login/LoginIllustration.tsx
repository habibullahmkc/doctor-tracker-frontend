/**
 * Flat, code-drawn scene for the sign-in panel: a doctor with a tablet in a
 * bright hospital corridor. No photo download and no likeness of a real person.
 */
export function LoginIllustration() {
  return (
    <svg viewBox="0 0 520 640" className="h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="li-corridor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fbff" />
          <stop offset="100%" stopColor="#e3eefc" />
        </linearGradient>
        <linearGradient id="li-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbe9fb" />
          <stop offset="100%" stopColor="#c7dcf6" />
        </linearGradient>
        <linearGradient id="li-coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2ebf6" />
        </linearGradient>
        <linearGradient id="li-scrub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3c8" />
          <stop offset="100%" stopColor="#4fb3a9" />
        </linearGradient>
        <filter id="li-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Corridor */}
      <rect width="520" height="640" fill="url(#li-corridor)" />
      <path d="M0 470 L520 470 L520 640 L0 640 Z" fill="url(#li-floor)" />
      <g filter="url(#li-blur)" opacity="0.85">
        {/* ceiling lights */}
        {[60, 150, 240, 330, 420].map((x) => (
          <rect key={x} x={x} y="40" width="60" height="10" rx="5" fill="#ffffff" />
        ))}
        {/* windows / doors */}
        <rect x="20" y="150" width="70" height="300" rx="6" fill="#ffffff" opacity="0.8" />
        <rect x="430" y="150" width="70" height="300" rx="6" fill="#ffffff" opacity="0.8" />
        <rect x="190" y="200" width="140" height="250" rx="8" fill="#eef5ff" />
        {/* blurred staff in the distance */}
        <g opacity="0.75">
          <circle cx="150" cy="300" r="12" fill="#c8a68b" />
          <rect x="136" y="312" width="28" height="70" rx="12" fill="url(#li-scrub)" />
          <circle cx="215" cy="310" r="10" fill="#b48e72" />
          <rect x="203" y="320" width="24" height="60" rx="10" fill="#93c5fd" />
          <circle cx="250" cy="306" r="10" fill="#d4b39a" />
          <rect x="238" y="316" width="24" height="64" rx="10" fill="url(#li-scrub)" />
        </g>
      </g>

      {/* Doctor (seen from behind, holding a tablet) */}
      <g transform="translate(250 230)">
        {/* coat */}
        <path d="M-10 160 C-10 110 30 86 95 86 C160 86 200 110 205 170 L215 420 L-25 420 Z" fill="url(#li-coat)" />
        <path d="M95 86 L95 420" stroke="#d3deec" strokeWidth="3" />
        {/* collar + neck */}
        <path d="M68 92 C80 112 110 112 122 92 L118 70 L72 70 Z" fill="#d9a785" />
        <path d="M60 96 C72 120 118 120 130 96" fill="none" stroke="#cdd9e8" strokeWidth="6" strokeLinecap="round" />
        {/* stethoscope around the neck */}
        <path d="M58 100 C40 140 52 180 82 190" fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
        <path d="M132 100 C150 140 140 176 116 190" fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
        {/* head, seen from behind: ears, then hair covering the back of the head */}
        <ellipse cx="57" cy="46" rx="7" ry="10" fill="#cf9a77" />
        <ellipse cx="133" cy="46" rx="7" ry="10" fill="#cf9a77" />
        <path d="M82 70 L108 70 L110 84 L80 84 Z" fill="#cf9a77" />
        <ellipse cx="95" cy="36" rx="38" ry="42" fill="#1f2937" />
        <path d="M60 50 C66 70 80 78 95 78 C110 78 124 70 130 50 C126 64 112 72 95 72 C78 72 64 64 60 50 Z" fill="#111827" />
        <path d="M74 8 C84 2 104 2 114 10" fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        {/* left arm + tablet */}
        <path d="M-6 170 C-30 230 -20 290 20 300 L40 288 C20 270 18 226 30 190 Z" fill="url(#li-coat)" />
        <g transform="rotate(-18 -10 300)">
          <rect x="-70" y="270" width="96" height="66" rx="8" fill="#1e293b" />
          <rect x="-64" y="276" width="84" height="54" rx="4" fill="#60a5fa" opacity="0.9" />
          <path d="M-56 316 L-40 300 L-28 310 L-8 290 L12 300" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <ellipse cx="22" cy="296" rx="13" ry="11" fill="#d9a785" />
      </g>

      {/* Soft waves at the bottom */}
      <path d="M0 560 C120 520 220 600 340 570 C420 550 470 520 520 530 L520 640 L0 640 Z" fill="#bfdbfe" opacity="0.65" />
      <path d="M0 600 C140 570 260 640 400 600 C460 584 500 570 520 574 L520 640 L0 640 Z" fill="#99e2d6" opacity="0.7" />
    </svg>
  );
}
