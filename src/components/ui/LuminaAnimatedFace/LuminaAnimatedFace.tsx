import React from 'react';

interface LuminaAnimatedFaceProps {
  size?: number;
}

/**
 * A custom Notion-style animated face icon modeled after the user's marshmallow character.
 * Features:
 * - 8-lobed scalloped marshmallow cloud body with soft 3D-like gradient shading.
 * - Deep blue vertical oval eyes with blink animation.
 * - Gentle floating breathing motion.
 * - A cute yellow worker pencil peeking from the bottom-right lobe with a writing wiggle animation.
 */
export const LuminaAnimatedFace: React.FC<LuminaAnimatedFaceProps> = ({
  size = 32,
}) => {
  const baseId = React.useId();
  const cleanId = baseId.replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Style sheet containing animations */}
        <style>{`
          @keyframes faceFloat-${cleanId} {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-1.5px) rotate(0.8deg); }
          }
          @keyframes eyeBlink-${cleanId} {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.05); }
          }
          @keyframes pencilWiggle-${cleanId} {
            0%, 100% { transform: translate(0px, 0px) rotate(22deg); }
            50% { transform: translate(-0.8px, 1px) rotate(26deg); }
          }
          .lumina-character-group-${cleanId} {
            transform-origin: 32px 34px;
            animation: faceFloat-${cleanId} 3.2s ease-in-out infinite;
          }
          .lumina-eye-left-${cleanId} {
            transform-origin: 26.25px 30.75px;
            animation: eyeBlink-${cleanId} 4.5s ease-in-out infinite;
          }
          .lumina-eye-right-${cleanId} {
            transform-origin: 37.75px 30.75px;
            animation: eyeBlink-${cleanId} 4.5s ease-in-out infinite 0.1s;
          }
          .lumina-pencil-${cleanId} {
            transform-origin: 47px 47px;
            animation: pencilWiggle-${cleanId} 1.6s ease-in-out infinite;
          }
        `}</style>

        {/* Tactile marshmallow gradient */}
        <linearGradient
          id={`marshmallowGrad-${cleanId}`}
          x1="12"
          y1="12"
          x2="52"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#dee4f0" />
        </linearGradient>

        {/* Deep blue eye gradient for 3D depth */}
        <linearGradient
          id={`eyeGrad-${cleanId}`}
          x1="23"
          y1="24"
          x2="30"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Soft shadow under the character */}
        <filter
          id={`softShadow-${cleanId}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Main Character Group (Floating Animation) */}
      <g
        className={`lumina-character-group-${cleanId}`}
        filter={`url(#softShadow-${cleanId})`}
      >
        {/* Scalloped Marshmallow Cloud Body (8 Lobes) */}
        <path
          d="M32,10 
             C37,10 41,12.5 43.5,16 
             C48.5,15.5 52,18.5 53,23 
             C57.5,25.5 58,30.5 56.5,34.5 
             C58,38.5 57.5,43.5 53,46 
             C52,50.5 48.5,53.5 43.5,53 
             C41,56.5 37,59 32,59 
             C27,59 23,56.5 20.5,53 
             C15.5,53.5 12,50.5 11,46 
             C6.5,43.5 6,38.5 7.5,34.5 
             C6,30.5 6.5,25.5 11,23 
             C12,18.5 15.5,15.5 20.5,16 
             C23,12.5 27,10 32,10 Z"
          fill={`url(#marshmallowGrad-${cleanId})`}
          stroke="#d1d5db"
          strokeWidth="1.2"
        />

        {/* Deep Blue Vertical Oval Eyes */}
        <g className={`lumina-eye-left-${cleanId}`}>
          <rect
            x="23"
            y="24"
            width="6.5"
            height="13.5"
            rx="3.25"
            fill={`url(#eyeGrad-${cleanId})`}
          />
        </g>
        <g className={`lumina-eye-right-${cleanId}`}>
          <rect
            x="34.5"
            y="24"
            width="6.5"
            height="13.5"
            rx="3.25"
            fill={`url(#eyeGrad-${cleanId})`}
          />
        </g>

        {/* Wiggling Worker Pencil peeking from the bottom-right */}
        <g className={`lumina-pencil-${cleanId}`}>
          {/* Yellow pencil body */}
          <rect
            x="44"
            y="32"
            width="5.5"
            height="15"
            rx="0.8"
            fill="#fbbf24"
            stroke="#1e293b"
            strokeWidth="1"
          />
          {/* Pink eraser */}
          <path
            d="M44 32 h5.5 v-2 a1.5 1.5 0 0 0 -5.5 0 z"
            fill="#f472b6"
            stroke="#1e293b"
            strokeWidth="1"
          />
          {/* Silver band */}
          <rect
            x="44"
            y="30.5"
            width="5.5"
            height="2"
            fill="#9ca3af"
            stroke="#1e293b"
            strokeWidth="1"
          />
          {/* Wood point */}
          <polygon
            points="44,47 49.5,47 46.75,51"
            fill="#fef3c7"
            stroke="#1e293b"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Graphite lead */}
          <polygon points="46,49.5 47.5,49.5 46.75,51" fill="#1e293b" />

          {/* Mini hand/paw holding the pencil */}
          <circle
            cx="43.5"
            cy="42"
            r="2.5"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  );
};

export default LuminaAnimatedFace;
