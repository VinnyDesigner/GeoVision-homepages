import type { AttachedSpatialSnapshot } from '../types';

/**
 * Helper to generate a high-definition GIS spatial SVG map thumbnail Data URL
 */
export function createSpatialSnapshotSVG(
  shapeType: 'point' | 'circle' | 'polygon' | 'rect' | 'map_extent',
  center: [number, number],
  titleEn: string,
  areaKm2?: number,
  radiusKm?: number
): string {
  const latStr = center[0].toFixed(4);
  const lngStr = center[1].toFixed(4);
  const areaLabel = areaKm2 ? `${areaKm2.toFixed(1)} km²` : radiusKm ? `${radiusKm.toFixed(1)} km radius` : 'Selected GIS Extent';

  let overlayShapeSvg = '';

  if (shapeType === 'rect') {
    overlayShapeSvg = `
      <rect x="60" y="45" width="180" height="110" rx="8" fill="#10B981" fill-opacity="0.25" stroke="#10B981" stroke-width="3" stroke-dasharray="6,4"/>
      <circle cx="60" cy="45" r="4" fill="#10B981"/>
      <circle cx="240" cy="45" r="4" fill="#10B981"/>
      <circle cx="60" cy="155" r="4" fill="#10B981"/>
      <circle cx="240" cy="155" r="4" fill="#10B981"/>
    `;
  } else if (shapeType === 'circle') {
    overlayShapeSvg = `
      <circle cx="150" cy="100" r="65" fill="#215A9E" fill-opacity="0.25" stroke="#215A9E" stroke-width="3" stroke-dasharray="6,4"/>
      <line x1="150" y1="100" x2="215" y2="100" stroke="#215A9E" stroke-width="2"/>
      <circle cx="150" cy="100" r="5" fill="#063360"/>
    `;
  } else if (shapeType === 'polygon') {
    overlayShapeSvg = `
      <polygon points="150,40 230,70 210,150 90,160 70,80" fill="#8B5CF6" fill-opacity="0.25" stroke="#8B5CF6" stroke-width="3" stroke-dasharray="6,4"/>
      <circle cx="150" cy="40" r="4" fill="#8B5CF6"/>
      <circle cx="230" cy="70" r="4" fill="#8B5CF6"/>
      <circle cx="210" cy="150" r="4" fill="#8B5CF6"/>
      <circle cx="90" cy="160" r="4" fill="#8B5CF6"/>
      <circle cx="70" cy="80" r="4" fill="#8B5CF6"/>
    `;
  } else if (shapeType === 'point') {
    overlayShapeSvg = `
      <circle cx="150" cy="100" r="28" fill="#EF4444" fill-opacity="0.2" stroke="#EF4444" stroke-width="2"/>
      <path d="M150 78 L150 98 M150 102 L150 122 M128 100 L148 100 M152 100 L172 100" stroke="#EF4444" stroke-width="2"/>
      <circle cx="150" cy="100" r="6" fill="#EF4444" stroke="#ffffff" stroke-width="2"/>
    `;
  } else {
    overlayShapeSvg = `
      <rect x="30" y="30" width="240" height="140" rx="10" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="2.5" stroke-dasharray="5,5"/>
    `;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">
      <!-- GIS Base Map Gradient -->
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94A3B8" stroke-width="0.5" stroke-opacity="0.4"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="300" height="200" fill="url(#bgGrad)"/>
      <rect width="300" height="200" fill="url(#grid)"/>

      <!-- Simulated Road / Water Features -->
      <path d="M 0 140 Q 120 120 300 160" fill="none" stroke="#38BDF8" stroke-width="14" stroke-opacity="0.4"/>
      <path d="M 50 0 Q 80 100 120 200" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-opacity="0.7"/>
      <path d="M 0 60 Q 160 80 300 50" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-opacity="0.7"/>

      <!-- Spatial Overlay Geometry -->
      ${overlayShapeSvg}

      <!-- Top Header Stamp -->
      <rect x="8" y="8" width="284" height="24" rx="6" fill="#0F172A" fill-opacity="0.85"/>
      <text x="16" y="24" fill="#38BDF8" font-family="sans-serif" font-size="10" font-weight="bold">🗺️ ${titleEn.toUpperCase()}</text>
      <text x="284" y="24" fill="#94A3B8" font-family="monospace" font-size="9" text-anchor="end">${areaLabel}</text>

      <!-- Bottom Coordinate Bar -->
      <rect x="8" y="168" width="284" height="24" rx="6" fill="#0F172A" fill-opacity="0.85"/>
      <text x="16" y="184" fill="#F8FAFC" font-family="monospace" font-size="9.5" font-weight="bold">${latStr}° N, ${lngStr}° E</text>
      <text x="284" y="184" fill="#38BDF8" font-family="sans-serif" font-size="9" font-weight="bold" text-anchor="end">UTM Zone 39N</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export function buildSpatialSnapshot(
  shapeType: 'point' | 'circle' | 'polygon' | 'rect' | 'map_extent',
  center: [number, number],
  titleEn: string,
  titleAr: string,
  areaKm2?: number,
  radiusKm?: number,
  bounds?: [[number, number], [number, number]],
  points?: [number, number][]
): AttachedSpatialSnapshot {
  return {
    shapeType,
    titleEn,
    titleAr,
    center,
    areaKm2,
    radiusKm,
    bounds,
    points,
    previewUrl: createSpatialSnapshotSVG(shapeType, center, titleEn, areaKm2, radiusKm),
  };
}
