import React from "react";

// True Vector Icons designed for premium line-drawing and 3D-fill animations

export const MentalIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="domain-icon mental-anim svg-drawing-icon continuously-repeating-pulse"
  >
    <defs>
      <linearGradient id="mentalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="mentalFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.06" />
      </linearGradient>
      <radialGradient id="mentalPeace" cx="50%" cy="45%" r="35%">
        <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.55" />
        <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lotusGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.5" />
      </radialGradient>
      <linearGradient id="lotusPetalOuter" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="lotusPetalInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fcd34d" />
      </linearGradient>
      <filter id="glowMental">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="sparkGlow">
        <feGaussianBlur stdDeviation="2" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="lotusBloom">
        <feGaussianBlur stdDeviation="1.5" result="bloom" />
        <feMerge>
          <feMergeNode in="bloom" />
          <feMergeNode in="bloom" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glowMental)" className="drawing-group">
      {/* ═══ FRONT-VIEW BRAIN — 🧠 emoji style ═══ */}

      {/* Left hemisphere — outer shape with bumpy contour */}
      <path
        d="M58 18 C56 16 52 12 46 10 C40 8 34 10 30 14
           C26 18 22 24 20 32 C18 38 20 42 22 46
           C20 50 18 54 20 58 C22 62 24 66 28 70
           C32 74 36 78 40 82 C44 86 48 88 52 88
           C56 88 58 86 58 82 Z"
        stroke="url(#mentalGrad)"
        fill="url(#mentalFill)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-1"
      />

      {/* Right hemisphere — mirror */}
      <path
        d="M62 18 C64 16 68 12 74 10 C80 8 86 10 90 14
           C94 18 98 24 100 32 C102 38 100 42 98 46
           C100 50 102 54 100 58 C98 62 96 66 92 70
           C88 74 84 78 80 82 C76 86 72 88 68 88
           C64 88 62 86 62 82 Z"
        stroke="url(#mentalGrad)"
        fill="url(#mentalFill)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-2"
      />

      {/* ═══ Left hemisphere folds — S-curved wrinkles ═══ */}
      <path
        d="M24 30 C30 26 38 30 46 26 C50 24 54 26 57 24"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1.3"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.35"
      />
      <path
        d="M22 42 C28 38 36 44 44 38 C48 36 54 40 57 38"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.3"
      />
      <path
        d="M22 54 C28 50 36 56 44 50 C48 48 54 52 57 50"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.25"
      />
      <path
        d="M26 66 C32 62 38 66 44 62 C48 60 54 64 57 62"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.2"
      />
      <path
        d="M34 76 C38 74 44 76 48 74 C52 72 56 74 57 73"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="0.9"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.15"
      />

      {/* ═══ Right hemisphere folds — mirrored S-curves ═══ */}
      <path
        d="M96 30 C90 26 82 30 74 26 C70 24 66 26 63 24"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1.3"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.35"
      />
      <path
        d="M98 42 C92 38 84 44 76 38 C72 36 66 40 63 38"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.3"
      />
      <path
        d="M98 54 C92 50 84 56 76 50 C72 48 66 52 63 50"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1.1"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.25"
      />
      <path
        d="M94 66 C88 62 82 66 76 62 C72 60 66 64 63 62"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="1"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.2"
      />
      <path
        d="M86 76 C82 74 76 76 72 74 C68 72 64 74 63 73"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="0.9"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.15"
      />

      {/* Midline divide */}
      <line
        x1="60"
        y1="10"
        x2="60"
        y2="90"
        stroke="url(#mentalGrad)"
        strokeWidth="0.8"
        opacity="0.2"
        className="svg-shape petal-2"
      />

      {/* Brain stem */}
      <path
        d="M54 88 C56 94 58 98 60 100 C62 98 64 94 66 88"
        stroke="url(#mentalGrad)"
        fill="url(#mentalFill)"
        strokeWidth="2"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.6"
      />

      {/* ═══ Peaceful inner glow ═══ */}
      <circle
        cx="60"
        cy="50"
        r="18"
        fill="url(#mentalPeace)"
        stroke="none"
        className="svg-shape inner-core"
      />

      {/* ═══ LOTUS FLOWER — warm gold/amber against cool indigo brain ═══ */}
      <g
        filter="url(#lotusBloom)"
        transform="translate(60, 50)"
        className="svg-shape inner-core"
      >
        {/* Center petal — top (tall) */}
        <path
          d="M0 -4 C-3 -10 -2 -17 0 -20 C2 -17 3 -10 0 -4Z"
          fill="url(#lotusPetalOuter)"
          stroke="#f59e0b"
          strokeWidth="0.6"
          opacity="0.95"
          className="svg-shape petal-1"
        />
        {/* Left petals */}
        <path
          d="M-2 -3 C-8 -9 -15 -11 -18 -8 C-14 -5 -8 -2 -2 -3Z"
          fill="url(#lotusPetalOuter)"
          stroke="#f59e0b"
          strokeWidth="0.5"
          opacity="0.9"
          className="svg-shape petal-2"
        />
        <path
          d="M-2 0 C-8 -2 -14 0 -16 4 C-12 6 -6 4 -2 0Z"
          fill="url(#lotusPetalInner)"
          stroke="#fbbf24"
          strokeWidth="0.4"
          opacity="0.75"
          className="svg-shape petal-1"
        />
        {/* Right petals */}
        <path
          d="M2 -3 C8 -9 15 -11 18 -8 C14 -5 8 -2 2 -3Z"
          fill="url(#lotusPetalOuter)"
          stroke="#f59e0b"
          strokeWidth="0.5"
          opacity="0.9"
          className="svg-shape petal-2"
        />
        <path
          d="M2 0 C8 -2 14 0 16 4 C12 6 6 4 2 0Z"
          fill="url(#lotusPetalInner)"
          stroke="#fbbf24"
          strokeWidth="0.4"
          opacity="0.75"
          className="svg-shape petal-1"
        />
        {/* Lotus center dot — bright warm core */}
        <circle r="3" fill="#fef3c7" opacity="0.95" />
        <circle r="1.5" fill="#fff" opacity="0.9" />
        {/* Gentle bloom pulse — warm gold ring */}
        <circle
          r="5"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.8"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            values="5;10;5"
            dur="3s"
            begin="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.12;0.5"
            dur="3s"
            begin="6s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* ═══ Neural pathway for animated spark ═══ */}
      <path
        id="neuralPath1"
        d="M24 32 C34 28 44 34 54 30 C64 26 74 32 96 28"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.1"
        className="svg-shape petal-1"
      />
      <path
        id="neuralPath2"
        d="M22 58 C32 52 42 58 52 54 C62 50 72 56 98 52"
        stroke="url(#mentalGrad)"
        fill="none"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.1"
        className="svg-shape petal-2"
      />

      {/* ═══ Gentle animated sparks ═══ */}
      <g filter="url(#sparkGlow)">
        <circle r="2" fill="#c7d2fe" opacity="0.8" className="neural-spark">
          <animateMotion
            dur="5s"
            begin="6s"
            repeatCount="indefinite"
            path="M24 32 C34 28 44 34 54 30 C64 26 74 32 96 28"
          />
        </circle>
        <circle r="1.6" fill="#e0e7ff" opacity="0.6" className="neural-spark">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            begin="8s"
            path="M22 58 C32 52 42 58 52 54 C62 50 72 56 98 52"
          />
        </circle>
        <circle r="1.3" fill="#a5b4fc" opacity="0.45" className="neural-spark">
          <animateMotion
            dur="5.5s"
            repeatCount="indefinite"
            begin="9.5s"
            path="M96 28 C74 32 64 26 54 30 C44 34 34 28 24 32"
          />
        </circle>
      </g>

      {/* ═══ Outer peace ripple from lotus ═══ */}
      <circle
        cx="60"
        cy="50"
        r="10"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="0.5"
        opacity="0.2"
        className="svg-shape inner-core"
      >
        <animate
          attributeName="r"
          values="10;16;10"
          dur="4s"
          begin="6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.15;0.03;0.15"
          dur="4s"
          begin="6s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
);

export const PhysicalIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="domain-icon physical-anim svg-drawing-icon continuously-repeating-pulse"
  >
    <defs>
      <linearGradient id="physGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="physFillL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#047857" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="physFillR" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.15" />
      </linearGradient>
      <radialGradient id="heartGlow" cx="50%" cy="40%" r="35%">
        <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0" />
      </radialGradient>
      <filter id="glowPhys">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="pulseGlow">
        <feGaussianBlur stdDeviation="2" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="heartBloom">
        <feGaussianBlur stdDeviation="3.5" result="bloom" />
        <feMerge>
          <feMergeNode in="bloom" />
          <feMergeNode in="bloom" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <g filter="url(#glowPhys)" className="drawing-group">
      {/* ═══ LEFT HEART HALF — darker 3D shadow ═══ */}
      <path
        d="M60 92 C60 92 18 64 18 36 C18 18 36 16 50 26 C58 32 60 36 60 36 Z"
        stroke="url(#physGrad)"
        fill="url(#physFillL)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape phys-heart"
      />
      {/* ═══ RIGHT HEART HALF — lighter highlight ═══ */}
      <path
        d="M60 92 C60 92 102 64 102 36 C102 18 84 16 70 26 C62 32 60 36 60 36 Z"
        stroke="url(#physGrad)"
        fill="url(#physFillR)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape phys-heart"
      />

      {/* ═══ Subtle vein lines inside heart ═══ */}
      <path
        d="M46 34 C42 42 38 52 42 62"
        stroke="#047857"
        fill="none"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.15"
        className="svg-shape petal-1"
      />
      <path
        d="M74 34 C78 42 82 52 78 62"
        stroke="#34d399"
        fill="none"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.15"
        className="svg-shape petal-2"
      />
      <path
        d="M60 40 C58 50 54 60 56 72"
        stroke="#10b981"
        fill="none"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.12"
        className="svg-shape petal-1"
      />
      <path
        d="M32 38 C30 46 34 56 40 60"
        stroke="#047857"
        fill="none"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.10"
        className="svg-shape petal-2"
      />
      <path
        d="M88 38 C90 46 86 56 80 60"
        stroke="#34d399"
        fill="none"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.10"
        className="svg-shape petal-1"
      />

      {/* ═══ Persistent red medical cross accent ═══ */}
      <g filter="url(#heartBloom)" className="svg-shape inner-core">
        <rect
          x="57"
          y="42"
          width="6"
          height="16"
          rx="1.5"
          fill="url(#crossGrad)"
          opacity="0.85"
        />
        <rect
          x="52"
          y="47"
          width="16"
          height="6"
          rx="1.5"
          fill="url(#crossGrad)"
          opacity="0.85"
        />
      </g>

      {/* ═══ Inner glow — warm center ═══ */}
      <circle
        cx="60"
        cy="50"
        r="16"
        fill="url(#heartGlow)"
        stroke="none"
        className="svg-shape inner-core"
      />

      {/* ═══ EKG WAVEFORM — detailed ═══ */}
      <path
        d="M12 55 L30 55 L36 55 L40 48 L44 55 L48 53 L51 55
           L54 38 L57 68 L60 28 L63 75 L66 45 L69 55
           L72 52 L76 55 L80 48 L84 55 L90 55 L108 55"
        stroke="#ecfdf5"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape phys-ekg"
        opacity="0.9"
      />

      {/* ═══ Heartbeat pulse rings ═══ */}
      <g filter="url(#pulseGlow)">
        <circle
          cx="60"
          cy="50"
          r="8"
          fill="none"
          stroke="#6ee7b7"
          strokeWidth="0.6"
          opacity="0.4"
        >
          <animate
            attributeName="r"
            values="8;18;8"
            dur="2s"
            begin="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.05;0.4"
            dur="2s"
            begin="6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="60"
          cy="50"
          r="12"
          fill="none"
          stroke="#34d399"
          strokeWidth="0.4"
          opacity="0.25"
        >
          <animate
            attributeName="r"
            values="12;24;12"
            dur="2s"
            begin="6.3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.25;0.02;0.25"
            dur="2s"
            begin="6.3s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* ═══ Animated blood flow sparks ═══ */}
      <g filter="url(#pulseGlow)">
        <circle r="2" fill="#f87171" opacity="0.7">
          <animateMotion
            dur="4s"
            begin="6s"
            repeatCount="indefinite"
            path="M60 36 C50 45 38 55 35 65 C32 75 45 82 60 92"
          />
        </circle>
        <circle r="1.5" fill="#fca5a5" opacity="0.5">
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            begin="7.5s"
            path="M60 36 C70 45 82 55 85 65 C88 75 75 82 60 92"
          />
        </circle>
        <circle r="1.2" fill="#fb7185" opacity="0.4">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            begin="9s"
            path="M60 92 C45 82 32 75 35 65 C38 55 50 45 60 36"
          />
        </circle>
      </g>
    </g>
  </svg>
);

export const FinancialIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="domain-icon financial-anim svg-drawing-icon continuously-repeating-pulse"
  >
    <defs>
      <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e40af" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="finBar1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#1e40af" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="finBar2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="finBar3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.35" />
      </linearGradient>
      <radialGradient id="finGlow" cx="65%" cy="30%" r="40%">
        <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="trendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <filter id="glowFin">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="coinGlow">
        <feGaussianBlur stdDeviation="1.5" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glowFin)" className="drawing-group">
      {/* ═══ Grid lines — subtle background ═══ */}
      <line
        x1="18"
        y1="92"
        x2="102"
        y2="92"
        stroke="#3b82f6"
        strokeWidth="0.5"
        opacity="0.15"
        className="svg-shape petal-1"
      />
      <line
        x1="18"
        y1="72"
        x2="102"
        y2="72"
        stroke="#3b82f6"
        strokeWidth="0.4"
        opacity="0.08"
        strokeDasharray="3,3"
        className="svg-shape petal-1"
      />
      <line
        x1="18"
        y1="52"
        x2="102"
        y2="52"
        stroke="#3b82f6"
        strokeWidth="0.4"
        opacity="0.08"
        strokeDasharray="3,3"
        className="svg-shape petal-2"
      />
      <line
        x1="18"
        y1="32"
        x2="102"
        y2="32"
        stroke="#3b82f6"
        strokeWidth="0.4"
        opacity="0.08"
        strokeDasharray="3,3"
        className="svg-shape petal-2"
      />

      {/* ═══ Bar chart — 4 bars with progressive gradient fills ═══ */}
      <rect
        x="22"
        y="72"
        width="14"
        height="20"
        rx="2"
        stroke="url(#finGrad)"
        fill="url(#finBar1)"
        strokeWidth="1.5"
        className="svg-shape bar-1"
      />
      <rect
        x="42"
        y="56"
        width="14"
        height="36"
        rx="2"
        stroke="url(#finGrad)"
        fill="url(#finBar2)"
        strokeWidth="1.5"
        className="svg-shape bar-2"
      />
      <rect
        x="62"
        y="38"
        width="14"
        height="54"
        rx="2"
        stroke="url(#finGrad)"
        fill="url(#finBar2)"
        strokeWidth="1.5"
        className="svg-shape bar-3"
      />
      <rect
        x="82"
        y="22"
        width="14"
        height="70"
        rx="2"
        stroke="url(#finGrad)"
        fill="url(#finBar3)"
        strokeWidth="1.5"
        className="svg-shape bar-4"
      />

      {/* ═══ Bar top shine highlights ═══ */}
      <rect
        x="24"
        y="72"
        width="10"
        height="3"
        rx="1"
        fill="#93c5fd"
        opacity="0.25"
        className="svg-shape petal-1"
      />
      <rect
        x="44"
        y="56"
        width="10"
        height="3"
        rx="1"
        fill="#93c5fd"
        opacity="0.3"
        className="svg-shape petal-2"
      />
      <rect
        x="64"
        y="38"
        width="10"
        height="3"
        rx="1"
        fill="#93c5fd"
        opacity="0.35"
        className="svg-shape petal-1"
      />
      <rect
        x="84"
        y="22"
        width="10"
        height="3"
        rx="1"
        fill="#bfdbfe"
        opacity="0.4"
        className="svg-shape petal-2"
      />

      {/* ═══ Growth trend line ═══ */}
      <path
        d="M29 70 C36 62 42 56 49 54 C56 52 62 40 69 36 C76 32 82 24 89 20"
        stroke="url(#trendGrad)"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape trend-arrow"
      />
      {/* Trend arrow head */}
      <path
        d="M86 24 L92 18 L88 26"
        stroke="url(#trendGrad)"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape trend-arrow"
      />

      {/* ═══ Coin / dollar symbol — top-right ═══ */}
      <g
        filter="url(#coinGlow)"
        transform="translate(96, 14)"
        className="svg-shape inner-core"
      >
        <circle
          r="9"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <circle r="7" fill="#fef3c7" opacity="0.15" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="11"
          fontWeight="700"
          opacity="0.85"
        >
          $
        </text>
        {/* Coin shimmer pulse */}
        <circle
          r="9"
          fill="none"
          stroke="#fde68a"
          strokeWidth="0.5"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="9;14;9"
            dur="3s"
            begin="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.05;0.3"
            dur="3s"
            begin="6s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* ═══ Growth glow behind tallest bar ═══ */}
      <circle
        cx="89"
        cy="50"
        r="18"
        fill="url(#finGlow)"
        stroke="none"
        className="svg-shape inner-core"
      />

      {/* ═══ Animated rising sparkles ═══ */}
      <g filter="url(#coinGlow)">
        <circle r="1.5" fill="#93c5fd" opacity="0.7">
          <animateMotion
            dur="3s"
            begin="6s"
            repeatCount="indefinite"
            path="M29 72 C29 60 29 48 29 36"
          />
          <animate
            attributeName="opacity"
            values="0.7;0.1;0.7"
            dur="3s"
            begin="6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="1.2" fill="#60a5fa" opacity="0.5">
          <animateMotion
            dur="3.5s"
            repeatCount="indefinite"
            begin="7s"
            path="M69 38 C69 28 69 18 69 8"
          />
          <animate
            attributeName="opacity"
            values="0.5;0.08;0.5"
            dur="3.5s"
            begin="7s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="1.8" fill="#bfdbfe" opacity="0.6">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            begin="8s"
            path="M89 22 C89 14 89 6 89 -2"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.05;0.6"
            dur="4s"
            begin="8s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </g>
  </svg>
);

export const MindfulnessIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="domain-icon mindfulness-anim svg-drawing-icon continuously-repeating-pulse"
  >
    <defs>
      <linearGradient id="mindGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <filter id="glowMind">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glowMind)" className="drawing-group">
      {/* Lotus petals */}
      <path
        d="M60 25 C50 45 40 55 60 70 C80 55 70 45 60 25Z"
        stroke="url(#mindGrad)"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="svg-shape petal-1"
      />
      <path
        d="M30 50 C45 45 55 50 60 70 C45 65 35 60 30 50Z"
        stroke="url(#mindGrad)"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="svg-shape petal-2"
      />
      <path
        d="M90 50 C75 45 65 50 60 70 C75 65 85 60 90 50Z"
        stroke="url(#mindGrad)"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="svg-shape petal-1"
      />
      <path
        d="M40 75 C48 65 55 65 60 70 C55 80 48 82 40 75Z"
        stroke="url(#mindGrad)"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="svg-shape petal-2"
      />
      <path
        d="M80 75 C72 65 65 65 60 70 C65 80 72 82 80 75Z"
        stroke="url(#mindGrad)"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="svg-shape petal-1"
      />
      {/* Meditation figure */}
      <circle
        cx="60"
        cy="88"
        r="4"
        fill="url(#mindGrad)"
        className="svg-shape inner-core"
        stroke="none"
      />
      <path
        d="M48 105 C52 95 56 92 60 92 C64 92 68 95 72 105"
        stroke="url(#mindGrad)"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="svg-shape petal-2"
      />
    </g>
  </svg>
);

export const ZenZoneIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="domain-icon zen-anim svg-drawing-icon continuously-repeating-pulse"
  >
    <defs>
      <linearGradient id="zenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="glowZen">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glowZen)" className="drawing-group">
      {/* Leaf shape */}
      <path
        d="M60 15 C30 40 20 70 60 105 C100 70 90 40 60 15Z"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-1"
      />
      {/* Leaf vein center */}
      <path
        d="M60 30 L60 95"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="svg-shape petal-2"
      />
      {/* Leaf veins */}
      <path
        d="M60 50 C50 45 40 50 35 55"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.6"
      />
      <path
        d="M60 50 C70 45 80 50 85 55"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.6"
      />
      <path
        d="M60 65 C50 60 42 63 38 68"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.5"
      />
      <path
        d="M60 65 C70 60 78 63 82 68"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.5"
      />
      <path
        d="M60 80 C52 76 46 78 42 82"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="svg-shape petal-1"
        opacity="0.4"
      />
      <path
        d="M60 80 C68 76 74 78 78 82"
        stroke="url(#zenGrad)"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="svg-shape petal-2"
        opacity="0.4"
      />
    </g>
  </svg>
);

export const DetoxIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    className="domain-icon detox-anim svg-drawing-icon continuously-repeating-pulse"
  >
    <defs>
      <linearGradient id="detoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="detoxFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
        <stop offset="50%" stopColor="#ec4899" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
      </linearGradient>
      <radialGradient id="detoxGlow" cx="50%" cy="45%" r="35%">
        <stop offset="0%" stopColor="#faf5ff" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#d8b4fe" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
      </radialGradient>
      <filter id="glowDetox">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="detoxBloom">
        <feGaussianBlur stdDeviation="2" result="bloom" />
        <feMerge>
          <feMergeNode in="bloom" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glowDetox)" className="drawing-group">
      {/* ═══ LOTUS FLOWER — centered, large ═══ */}

      {/* Center petal — tall */}
      <path
        d="M60 20 C52 40, 52 60, 60 80 C68 60, 68 40, 60 20Z"
        stroke="url(#detoxGrad)"
        fill="url(#detoxFill)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-1"
      />

      {/* Left upper petal */}
      <path
        d="M60 50 C40 30, 20 40, 25 60 C30 70, 45 70, 60 60Z"
        stroke="url(#detoxGrad)"
        fill="url(#detoxFill)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-2"
      />

      {/* Right upper petal */}
      <path
        d="M60 50 C80 30, 100 40, 95 60 C90 70, 75 70, 60 60Z"
        stroke="url(#detoxGrad)"
        fill="url(#detoxFill)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-1"
      />

      {/* Left lower petal */}
      <path
        d="M45 60 C25 45, 10 55, 15 70 C20 76, 35 76, 45 65Z"
        stroke="url(#detoxGrad)"
        fill="url(#detoxFill)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-2"
        opacity="0.7"
      />

      {/* Right lower petal */}
      <path
        d="M75 60 C95 45, 110 55, 105 70 C100 76, 85 76, 75 65Z"
        stroke="url(#detoxGrad)"
        fill="url(#detoxFill)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-shape petal-1"
        opacity="0.7"
      />

      {/* Base curve */}
      <path
        d="M40 78 Q60 92, 80 78"
        stroke="url(#detoxGrad)"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="svg-shape petal-2"
      />

      {/* Inner glow */}
      <circle
        cx="60"
        cy="58"
        r="14"
        fill="url(#detoxGlow)"
        stroke="none"
        className="svg-shape inner-core"
      />

      {/* Center dot */}
      <g filter="url(#detoxBloom)" className="svg-shape inner-core">
        <circle cx="60" cy="58" r="5" fill="#faf5ff" opacity="0.7" />
        <circle cx="60" cy="58" r="2.5" fill="#fff" opacity="0.9" />
      </g>

      {/* Bloom pulse */}
      <circle
        cx="60"
        cy="58"
        r="8"
        fill="none"
        stroke="#d8b4fe"
        strokeWidth="0.8"
        opacity="0.4"
        className="svg-shape inner-core"
      >
        <animate
          attributeName="r"
          values="8;16;8"
          dur="3.5s"
          begin="6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0.08;0.4"
          dur="3.5s"
          begin="6s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Outer peace ripple */}
      <circle
        cx="60"
        cy="58"
        r="20"
        fill="none"
        stroke="#a855f7"
        strokeWidth="0.5"
        opacity="0.15"
      >
        <animate
          attributeName="r"
          values="20;30;20"
          dur="4.5s"
          begin="7s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.15;0.03;0.15"
          dur="4.5s"
          begin="7s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
);
