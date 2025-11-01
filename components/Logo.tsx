import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  // The gradient ID is made more unique to avoid potential conflicts.
  const gradientId = "g-logo-gradient";
  return (
    <div className={`logo ${className || ''}`} role="img" aria-label="Logo E-LIGUE Academy">
      <div className="brand">
        <div className="e-part">E-</div>
        <svg className="mortar" viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#000000"/>
              <stop offset="1" stop-color="#3533cd"/>
            </linearGradient>
          </defs>
          <g transform="translate(0,2)">
            <polygon points="32,2 4,12 32,22 60,12" fill={`url(#${gradientId})`}/>
            <rect x="20" y="20" width="24" height="6" rx="1" fill="#111"/>
            <path d="M44 10 C46 12,46 16,42 18" stroke="#3533cd" stroke-width="1.8" fill="none"/>
            <circle cx="42" cy="18" r="1.8" fill="#3533cd"/>
          </g>
        </svg>
        <div className="ligue">LIGUE</div>
      </div>
      <div className="academy">ACADEMY</div>
    </div>
  );
};

export default Logo;
