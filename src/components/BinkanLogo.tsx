import React from 'react';

interface BinkanLogoProps {
  className?: string;
  height?: number;
  color?: string;
}

export const BinkanLogo: React.FC<BinkanLogoProps> = ({
  className = '',
  height = 38,
  color = '#0B1E36',
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        height={height}
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-auto max-h-[44px]"
      >
        {/* Main Logotype: B i n */}
        <text
          x="0"
          y="60"
          fill={color}
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', Arial, sans-serif"
          fontWeight="900"
          fontSize="58"
          letterSpacing="-1.5"
        >
          Bin
        </text>

        {/* Letter 'k' stem */}
        <rect x="106" y="16" width="13" height="44" rx="2" fill={color} />
        {/* Letter 'k' bottom right diagonal */}
        <path d="M 117 42 L 135 60 H 152 L 127 34 Z" fill={color} />

        {/* Curved Railway Track arising from 'k' and arching over 'a' */}
        <g fill={color} stroke={color}>
          {/* Main Curved Rail Lines (Top and Bottom Rail) */}
          <path
            d="M 116 34 C 122 14, 142 6, 182 10"
            fill="none"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 119 40 C 125 21, 144 13, 182 16"
            fill="none"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Railway Sleepers / Cross Ties along the curve */}
          <line x1="118" y1="28" x2="123" y2="36" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="124" y1="22" x2="129" y2="29" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="131" y1="17" x2="136" y2="24" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="139" y1="13" x2="143" y2="20" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="148" y1="11" x2="151" y2="18" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="157" y1="10" x2="159" y2="17" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="166" y1="10" x2="167" y2="17" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="175" y1="11" x2="176" y2="18" strokeWidth="2.5" strokeLinecap="round" />

          {/* Bullet Train Engine at top right of the curved track */}
          <g transform="translate(178, -2)">
            {/* Train body */}
            <path
              d="M 0 10 H 22 C 28 10, 34 13, 34 18 C 34 20, 32 21, 30 21 H 0 Z"
              fill={color}
            />
            {/* Window cutout */}
            <path
              d="M 16 11.5 H 22 C 25 11.5, 28 13, 29 15 H 16 Z"
              fill="#FFFFFF"
            />
            {/* Base rail track line */}
            <line x1="0" y1="23.5" x2="33" y2="23.5" stroke={color} strokeWidth="2" />
          </g>
        </g>

        {/* Letters 'a' and 'n' */}
        <text
          x="148"
          y="60"
          fill={color}
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', Arial, sans-serif"
          fontWeight="900"
          fontSize="58"
          letterSpacing="-1.5"
        >
          an
        </text>
      </svg>
    </div>
  );
};
