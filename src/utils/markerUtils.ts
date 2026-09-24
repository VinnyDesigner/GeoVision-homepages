import L from 'leaflet';

export const getCategoryColor = (category: string): string => {
  const catColors: Record<string, string> = {
    healthcare: '#0284C7',     // DOH Medical Blue
    education: '#2563EB',      // ADEK Royal Blue
    transport: '#0D9488',      // ITC Transport Teal
    parks: '#16A34A',          // Public Parks Green
    government: '#4F46E5',     // TAMM Government Indigo
    utilities: '#D97706',      // Utilities Amber
    public_safety: '#DC2626',  // Police & Civil Defense Crimson Red
    tourism: '#7C3AED',        // Cultural Heritage Purple
    environment: '#059669',    // Mangrove & Nature Emerald
    agriculture: '#65A30D',    // Agriculture Olive Green
    urban: '#3B82F6',          // Urban Blue
  };
  return catColors[category] || '#215A9E';
};

export const getCategorySvgIcon = (category: string, subcategory?: string, name?: string): string => {
  const subLower = (subcategory || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();

  // 1. Plant Nurseries, Greenhouses & Botanical Centers (Sprout Icon)
  if (
    subLower.includes('nurser') ||
    subLower.includes('plant') ||
    subLower.includes('botanic') ||
    nameLower.includes('nursery') ||
    nameLower.includes('plant') ||
    nameLower.includes('مشتل') ||
    nameLower.includes('مشاتل')
  ) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/></svg>`;
  }

  // 2. EV Charging Stations (Dedicated Electric Charging Lightning Bolt)
  if (
    subLower.includes('charging') ||
    subLower.includes('ev_') ||
    nameLower.includes('ev ') ||
    nameLower.includes('charging') ||
    nameLower.includes('شحن')
  ) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }

  // 3. TAMM Government Customer Centers (TAMM Official Shield & Check)
  if (
    subLower.includes('tamm') ||
    nameLower.includes('tamm') ||
    nameLower.includes('تم')
  ) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
  }

  // 4. Cultural & Heritage Sites / Museums (Classical Landmark Columns)
  if (
    category === 'tourism' ||
    subLower.includes('museum') ||
    subLower.includes('heritage') ||
    nameLower.includes('museum') ||
    nameLower.includes('louvre') ||
    nameLower.includes('hosn') ||
    nameLower.includes('mosque') ||
    nameLower.includes('qasr') ||
    nameLower.includes('متحف') ||
    nameLower.includes('قصر') ||
    nameLower.includes('جامع')
  ) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`;
  }

  // 5. Mangrove & Nature Protected Reserves (Leaf / Nature Sanctuary)
  if (
    category === 'environment' ||
    subLower.includes('reserve') ||
    subLower.includes('mangrove') ||
    nameLower.includes('mangrove') ||
    nameLower.includes('reserve') ||
    nameLower.includes('wetland') ||
    nameLower.includes('قرم') ||
    nameLower.includes('محمية')
  ) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
  }

  // 6. Public Safety (Police & Civil Defense)
  if (
    category === 'public_safety' ||
    subLower.includes('police') ||
    subLower.includes('civil_defense') ||
    nameLower.includes('police') ||
    nameLower.includes('civil defense') ||
    nameLower.includes('شرطة') ||
    nameLower.includes('دفاع مدني')
  ) {
    if (subLower.includes('civil') || nameLower.includes('civil') || nameLower.includes('دفاع')) {
      return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  }

  // 7. Healthcare (Hospitals, Clinics, 24/7 Pharmacies)
  if (category === 'healthcare' || subLower.includes('health') || subLower.includes('hospital') || subLower.includes('pharm')) {
    if (subLower.includes('pharm') || nameLower.includes('pharmacy') || nameLower.includes('صيدلية')) {
      return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`;
  }

  // 8. Education (Schools, Universities)
  if (category === 'education' || subLower.includes('school') || subLower.includes('universit')) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
  }

  // 9. Transport (Bus Stations, Transit Hubs, Parking)
  if (category === 'transport' || subLower.includes('bus') || subLower.includes('transit')) {
    if (subLower.includes('parking')) {
      return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18M7 14h.01M17 14h.01M6 18v2M18 18v2"/></svg>`;
  }

  // 10. Parks & Recreation
  if (category === 'parks' || subLower.includes('park') || nameLower.includes('park') || nameLower.includes('حديقة')) {
    return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0z"/><path d="M7 16v6M17 14v8"/><path d="M13 14v.2a3 3 0 0 1-1.1 5.8h-3.9a3 3 0 0 1-1-5.8V14a3 3 0 0 1 6 0z"/></svg>`;
  }

  // Default General Location Pin
  return `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
};

export const createGeoVisionMarkerIcon = (
  category: string,
  subcategory?: string,
  compact = false,
  isSelected = false,
  name?: string
): L.DivIcon => {
  const color = getCategoryColor(category);
  const iconSvg = getCategorySvgIcon(category, subcategory, name);

  const headSize = isSelected ? (compact ? 34 : 40) : (compact ? 28 : 32);
  const totalWidth = isSelected ? (compact ? 36 : 42) : (compact ? 30 : 34);
  const totalHeight = isSelected ? (compact ? 44 : 52) : (compact ? 36 : 42);
  const arrowSize = isSelected ? (compact ? 7 : 10) : (compact ? 6 : 8);

  const pulseRingHtml = isSelected
    ? `<div style="
        position: absolute;
        top: -8px;
        left: -8px;
        width: ${headSize + 16}px;
        height: ${headSize + 16}px;
        border-radius: 50%;
        background: ${color}40;
        border: 2px solid ${color};
        box-shadow: 0 0 24px ${color};
        animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        z-index: 0;
      "></div>`
    : '';

  const markerHtml = `
    <div class="geovision-map-pointer category-${category} ${isSelected ? 'selected-pin' : ''}" style="
      position: relative;
      width: ${totalWidth}px;
      height: ${totalHeight}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      filter: drop-shadow(0 8px 20px ${color}88);
      z-index: ${isSelected ? 9999 : 1};
    ">
      ${pulseRingHtml}
      <div style="
        width: ${headSize}px;
        height: ${headSize}px;
        border-radius: 50%;
        background: ${color};
        border: ${isSelected ? '3.5px solid #ffffff' : '2.5px solid #ffffff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: ${isSelected ? `0 0 0 3px #176BFF, 0 8px 24px ${color}90` : `0 4px 12px ${color}50, inset 0 1px 0 rgba(255, 255, 255, 0.4)`};
        z-index: 2;
      ">
        ${iconSvg}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: ${arrowSize}px solid ${color};
        margin-top: -3px;
        z-index: 1;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
      "></div>
    </div>
  `;

  return L.divIcon({
    className: `custom-leaflet-marker-pin ${isSelected ? 'is-selected-marker' : ''}`,
    html: markerHtml,
    iconSize: [totalWidth, totalHeight],
    iconAnchor: [totalWidth / 2, totalHeight],
    popupAnchor: [0, -totalHeight],
  });
};
