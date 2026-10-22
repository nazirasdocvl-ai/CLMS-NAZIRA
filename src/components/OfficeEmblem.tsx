import React, { useState } from 'react';
import officialLogo from '../assets/images/official_seal_clean.png';

interface OfficeEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const OfficeEmblem: React.FC<OfficeEmblemProps> = ({ className = 'w-10 h-10' }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 rounded-full bg-white select-none overflow-hidden ${className}`}
      title="Official Seal - Office of the Co-District Commissioner, Nazira - Govt. of Assam"
    >
      {!imageError ? (
        <img
          src={officialLogo}
          alt="Office of the Co-District Commissioner, Nazira Official Seal"
          className="w-full h-full object-contain rounded-full shadow-2xs"
          onError={() => setImageError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outermost Ring */}
          <circle cx="250" cy="250" r="236" stroke="#052c6f" strokeWidth="11" fill="#ffffff" />
          <circle cx="250" cy="250" r="223" stroke="#052c6f" strokeWidth="2.5" />
          <circle cx="250" cy="250" r="170" stroke="#052c6f" strokeWidth="4" />

          {/* Symmetrical Dots */}
          <circle cx="55" cy="248" r="7.5" fill="#052c6f" />
          <circle cx="445" cy="248" r="7.5" fill="#052c6f" />

          <defs>
            <path id="topCurveFallback" d="M 65 250 A 196 196 0 0 1 435 250" fill="none" />
            <path id="bottomCurveFallback" d="M 60 250 A 183 183 0 0 0 440 250" fill="none" />
          </defs>

          <text
            fill="#052c6f"
            fontFamily="'Times New Roman', Georgia, serif"
            fontWeight="900"
            fontSize="35"
            letterSpacing="2.5"
          >
            <textPath href="#topCurveFallback" startOffset="50%" textAnchor="middle">
              GOVT. OF ASSAM
            </textPath>
          </text>

          <text
            fill="#052c6f"
            fontFamily="'Times New Roman', Georgia, serif"
            fontWeight="bold"
            fontSize="18"
            letterSpacing="0.6"
          >
            <textPath href="#bottomCurveFallback" startOffset="50%" textAnchor="middle">
              Office of the Co-District Commissioner, Nazira
            </textPath>
          </text>

          <g id="ashokaLionsFallback" fill="#052c6f">
            <ellipse cx="250" cy="192" rx="28" ry="32" />
            <circle cx="250" cy="202" r="10" fill="#ffffff" />
            <path d="M246 197 L254 197 L250 203 Z" fill="#052c6f" />
            <ellipse cx="212" cy="204" rx="22" ry="26" transform="rotate(-15 212 204)" />
            <ellipse cx="288" cy="204" rx="22" ry="26" transform="rotate(15 288 204)" />
            <path
              d="M 196 216 Q 216 244 250 248 Q 284 244 304 216 Q 312 260 300 272 L 200 272 Q 188 260 196 216 Z"
              fill="#052c6f"
            />
            <rect x="192" y="290" width="116" height="6" rx="3" />
            <rect x="194" y="300" width="112" height="28" rx="2" fill="#052c6f" />
            <circle cx="250" cy="314" r="11" fill="#ffffff" />
            <circle cx="250" cy="314" r="9" stroke="#052c6f" strokeWidth="1.8" fill="none" />
            <circle cx="250" cy="314" r="2.5" fill="#052c6f" />
            <rect x="188" y="328" width="124" height="6" rx="3" />
          </g>

          <text
            x="250"
            y="360"
            textAnchor="middle"
            fill="#052c6f"
            fontFamily="'Times New Roman', Georgia, serif"
            fontWeight="bold"
            fontSize="18"
            letterSpacing="1.5"
          >
            सत्यमेव जयते
          </text>
        </svg>
      )}
    </div>
  );
};
