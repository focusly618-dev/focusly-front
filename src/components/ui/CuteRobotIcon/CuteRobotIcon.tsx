import React from 'react';

interface CuteRobotIconProps {
  size?: number;
  /** 'full' = animated mascot SVG. 'mini' = compact 1-color version for bubbles */
  variant?: 'full' | 'mini';
  primaryColor?: string;
  eyeColor?: string;
}

/**
 * A warm, friendly robot mascot with glowing cyan eyes, a digital smile, and
 * a gently pulsing antenna. Designed to feel approachable and welcoming.
 */
export const CuteRobotIcon: React.FC<CuteRobotIconProps> = ({
  size = 32,
  variant = 'full',
  primaryColor = '#137fec',
  eyeColor = '#22d3ee',
}) => {
  const baseId = React.useId();
  const cleanId = baseId.replace(/:/g, '');

  if (variant === 'mini') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <rect x="5" y="9" width="22" height="17" rx="5" fill={primaryColor} />
        {/* Antenna stem */}
        <rect x="15" y="3" width="2" height="6" rx="1" fill={primaryColor} />
        {/* Antenna ball */}
        <circle cx="16" cy="3" r="2.5" fill={eyeColor} />
        {/* Eyes */}
        <circle cx="11" cy="17" r="2.5" fill="white" />
        <circle cx="21" cy="17" r="2.5" fill="white" />
        <circle cx="11" cy="17" r="1.2" fill={eyeColor} />
        <circle cx="21" cy="17" r="1.2" fill={eyeColor} />
        {/* Smile */}
        <path
          d="M12 22 Q16 25 20 22"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Ear studs */}
        <rect
          x="2"
          y="13"
          width="3"
          height="5"
          rx="1.5"
          fill={primaryColor}
          opacity="0.7"
        />
        <rect
          x="27"
          y="13"
          width="3"
          height="5"
          rx="1.5"
          fill={primaryColor}
          opacity="0.7"
        />
      </svg>
    );
  }

  // Full animated variant
  const antennaGlowId = `antenna-glow-${cleanId}`;
  const eyeGlowId = `eye-glow-${cleanId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glowing filter for antenna */}
        <filter id={antennaGlowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Glowing filter for eyes */}
        <filter id={eyeGlowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Eye pulse animation */}
        <style>{`
          @keyframes eyeBlink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes antennaPulse {
            0%, 100% { r: 4; opacity: 1; }
            50% { r: 5.5; opacity: 0.7; }
          }
          @keyframes bodyFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-1.5px); }
          }
          .robot-body-group {
            animation: bodyFloat 3s ease-in-out infinite;
          }
          .robot-eye-left {
            transform-origin: 22px 31px;
            animation: eyeBlink 4s ease-in-out infinite;
          }
          .robot-eye-right {
            transform-origin: 42px 31px;
            animation: eyeBlink 4s ease-in-out infinite 0.1s;
          }
          .robot-antenna-ball {
            animation: antennaPulse 2s ease-in-out infinite;
          }
        `}</style>
      </defs>

      <g className="robot-body-group">
        {/* Antenna stem */}
        <rect
          x="30"
          y="5"
          width="4"
          height="10"
          rx="2"
          fill={primaryColor}
          opacity="0.9"
        />

        {/* Antenna ball glow + ball */}
        <circle
          className="robot-antenna-ball"
          cx="32"
          cy="5"
          r="4"
          fill={eyeColor}
          filter={`url(#${antennaGlowId})`}
        />

        {/* Head */}
        <rect
          x="10"
          y="14"
          width="44"
          height="34"
          rx="10"
          fill={primaryColor}
        />

        {/* Screen face inset */}
        <rect
          x="14"
          y="18"
          width="36"
          height="26"
          rx="7"
          fill="#0a1628"
          opacity="0.85"
        />

        {/* Left eye group */}
        <g className="robot-eye-left" filter={`url(#${eyeGlowId})`}>
          <circle cx="22" cy="31" r="5" fill={eyeColor} opacity="0.25" />
          <circle cx="22" cy="31" r="3.5" fill={eyeColor} />
          <circle cx="23.2" cy="29.8" r="1" fill="white" opacity="0.9" />
        </g>

        {/* Right eye group */}
        <g className="robot-eye-right" filter={`url(#${eyeGlowId})`}>
          <circle cx="42" cy="31" r="5" fill={eyeColor} opacity="0.25" />
          <circle cx="42" cy="31" r="3.5" fill={eyeColor} />
          <circle cx="43.2" cy="29.8" r="1" fill="white" opacity="0.9" />
        </g>

        {/* Smile - digital pixel-ish curved line */}
        <path
          d="M24 39 Q32 44.5 40 39"
          stroke={eyeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Small cheek blush marks */}
        <ellipse cx="17" cy="36" rx="3" ry="2" fill="#f472b6" opacity="0.35" />
        <ellipse cx="47" cy="36" rx="3" ry="2" fill="#f472b6" opacity="0.35" />

        {/* Left ear stud */}
        <rect
          x="6"
          y="24"
          width="4"
          height="10"
          rx="2"
          fill={primaryColor}
          opacity="0.75"
        />
        {/* Right ear stud */}
        <rect
          x="54"
          y="24"
          width="4"
          height="10"
          rx="2"
          fill={primaryColor}
          opacity="0.75"
        />
      </g>
    </svg>
  );
};

export default CuteRobotIcon;
