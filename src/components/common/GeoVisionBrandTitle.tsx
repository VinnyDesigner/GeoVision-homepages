import React from 'react';

interface AnimatedMapPointerProps {
  idPrefix?: string;
  className?: string;
}

/**
 * The iconic GeoVision animated map pointer from the Home page.
 * Morphs seamlessly between circular radar wave and pinpoint GPS beacon.
 */
export const AnimatedMapPointer: React.FC<AnimatedMapPointerProps> = ({
  idPrefix = 'geoPin',
  className = 'w-full h-full',
}) => {
  const pinGradId = `${idPrefix}Grad`;
  const pulseGradId = `${idPrefix}Pulse`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={`overflow-visible drop-shadow-[0_0_8px_rgba(56,189,248,0.7)] ${className}`}
      fill="none"
    >
      <defs>
        <linearGradient id={pinGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <radialGradient id={pulseGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
        </radialGradient>
      </defs>

      {/* Radar Ground Wave beneath the pin tip */}
      <ellipse cx="50" cy="152" rx="2" ry="1" fill={`url(#${pulseGradId})`}>
        <animate
          attributeName="rx"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.32; 0.48; 0.65; 0.75; 1"
          values="2; 2; 26; 30; 2; 2"
        />
        <animate
          attributeName="ry"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.32; 0.48; 0.65; 0.75; 1"
          values="1; 1; 6; 7; 1; 1"
        />
        <animate
          attributeName="opacity"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.32; 0.44; 0.65; 0.75; 1"
          values="0; 0; 0.95; 0; 0; 0"
        />
      </ellipse>

      {/* Main Morphing Path: 'O' <---> 'Map Pointer' */}
      <path
        fill={`url(#${pinGradId})`}
        fillRule="evenodd"
        d="M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z"
      >
        <animate
          attributeName="d"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.26; 0.48; 0.70; 0.88; 1"
          values="
            M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
            M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
            M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 88, 72 126, 50 150 C 28 126, 2 88, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
            M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 88, 72 126, 50 150 C 28 126, 2 88, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
            M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
            M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z
          "
          calcMode="spline"
          keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
        />
      </path>

      {/* Sparkling pin tip dot highlight */}
      <circle cx="50" cy="150" r="2.5" fill="#FFFFFF">
        <animate
          attributeName="opacity"
          dur="4s"
          repeatCount="indefinite"
          keyTimes="0; 0.40; 0.48; 0.68; 0.72; 1"
          values="0; 0; 1; 0.8; 0; 0"
        />
      </circle>
    </svg>
  );
};

interface GeoVisionBrandProps {
  size?: 'sm' | 'md' | 'lg';
  idPrefix?: string;
  className?: string;
}

/**
 * The official "GeoVision" brand title from the Home page with the animated map pointer 'o'.
 */
export const GeoVisionBrand: React.FC<GeoVisionBrandProps> = ({
  size = 'sm',
  idPrefix = 'brand',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[17px] sm:text-[18px] font-black',
    md: 'text-2xl sm:text-3xl font-black',
    lg: 'text-3xl sm:text-5xl font-black',
  }[size];

  return (
    <div
      className={`inline-flex items-baseline font-brand geovision-brand-title leading-none tracking-tight select-none ${sizeClasses} ${className}`}
      style={{ fontFamily: '"Montserrat", sans-serif' }}
      data-brand="geovision"
    >
      <span className="text-[#0A192F] dark:text-white drop-shadow-xs dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
        Ge
      </span>
      <span
        className="inline-block relative shrink-0"
        style={{
          width: '0.58em',
          height: '0.54em',
          marginLeft: '0.01em',
          marginRight: '-0.06em',
          transform: 'translateY(-0.01em)',
        }}
      >
        <AnimatedMapPointer idPrefix={idPrefix} />
      </span>
      <span className="text-[#0A192F] dark:text-white drop-shadow-xs dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
        Vision
      </span>
    </div>
  );
};

export default GeoVisionBrand;
