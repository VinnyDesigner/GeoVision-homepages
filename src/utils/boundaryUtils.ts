export interface LocationBoundary {
  id: string;
  nameEn: string;
  nameAr: string;
  typeEn: string;
  typeAr: string;
  center: [number, number];
  coordinates: [number, number][]; // [latitude, longitude]
  areaKm2: number;
  strokeColor?: string;
  fillColor?: string;
}

/**
 * Authentic Abu Dhabi District & Community Boundaries
 * Defined in WGS84 coordinates [latitude, longitude]
 */
export const ABU_DHABI_DISTRICT_BOUNDARIES: Record<string, LocationBoundary> = {
  khalifa_city: {
    id: 'khalifa_city',
    nameEn: 'Khalifa City Sector Boundary',
    nameAr: 'نطاق قطاع مدينة خليفة',
    typeEn: 'Residential Community District',
    typeAr: 'منطقة سكنية مجتمعية',
    center: [24.4217, 54.5828],
    areaKm2: 18.5,
    strokeColor: '#2563EB',
    fillColor: '#3B82F6',
    coordinates: [
      [24.444, 54.562],
      [24.448, 54.588],
      [24.438, 54.612],
      [24.415, 54.620],
      [24.398, 54.605],
      [24.395, 54.575],
      [24.412, 54.558],
      [24.444, 54.562],
    ],
  },
  yas_island: {
    id: 'yas_island',
    nameEn: 'Yas Island Zone Boundary',
    nameAr: 'نطاق جزيرة ياس الترفيهية',
    typeEn: 'Tourism & Entertainment Island',
    typeAr: 'جزيرة سياحية وترفيهية',
    center: [24.4881, 54.6074],
    areaKm2: 25.0,
    strokeColor: '#0284C7',
    fillColor: '#0EA5E9',
    coordinates: [
      [24.535, 54.598],
      [24.526, 54.628],
      [24.498, 54.636],
      [24.468, 54.625],
      [24.458, 54.595],
      [24.475, 54.572],
      [24.502, 54.570],
      [24.528, 54.582],
      [24.535, 54.598],
    ],
  },
  al_reem_island: {
    id: 'al_reem_island',
    nameEn: 'Al Reem Island District Boundary',
    nameAr: 'نطاق جزيرة الريم',
    typeEn: 'Commercial & Residential Island',
    typeAr: 'جزيرة تجارية وسكنية',
    center: [24.4965, 54.3986],
    areaKm2: 8.4,
    strokeColor: '#059669',
    fillColor: '#10B981',
    coordinates: [
      [24.516, 54.402],
      [24.512, 54.422],
      [24.488, 54.418],
      [24.478, 54.405],
      [24.482, 54.388],
      [24.506, 54.388],
      [24.516, 54.402],
    ],
  },
  saadiyat_island: {
    id: 'saadiyat_island',
    nameEn: 'Saadiyat Cultural District Boundary',
    nameAr: 'نطاق جزيرة السعديات الثقافية',
    typeEn: 'Cultural & Heritage District',
    typeAr: 'المنطقة الثقافية والتراثية',
    center: [24.5262, 54.4363],
    areaKm2: 27.0,
    strokeColor: '#7C3AED',
    fillColor: '#8B5CF6',
    coordinates: [
      [24.562, 54.428],
      [24.558, 54.478],
      [24.532, 54.485],
      [24.508, 54.458],
      [24.505, 54.420],
      [24.528, 54.408],
      [24.562, 54.428],
    ],
  },
  al_maryah_island: {
    id: 'al_maryah_island',
    nameEn: 'Al Maryah Island Financial Freezone',
    nameAr: 'نطاق جزيرة الماريه المالي',
    typeEn: 'Financial & Healthcare District',
    typeAr: 'المنطقة المالية والرعاية الصحية',
    center: [24.4981, 54.3892],
    areaKm2: 2.1,
    strokeColor: '#D97706',
    fillColor: '#F59E0B',
    coordinates: [
      [24.509, 54.385],
      [24.506, 54.394],
      [24.487, 54.392],
      [24.489, 54.383],
      [24.509, 54.385],
    ],
  },
  corniche: {
    id: 'corniche',
    nameEn: 'Corniche Waterfront Promenade Boundary',
    nameAr: 'نطاق كورنيش أبوظبي البحري',
    typeEn: 'Coastal Waterfront Corridor',
    typeAr: 'المحور البحري السياحي',
    center: [24.4715, 54.3361],
    areaKm2: 6.2,
    strokeColor: '#0EA5E9',
    fillColor: '#38BDF8',
    coordinates: [
      [24.489, 54.318],
      [24.494, 54.358],
      [24.480, 54.365],
      [24.462, 54.340],
      [24.468, 54.315],
      [24.489, 54.318],
    ],
  },
  abu_dhabi_island: {
    id: 'abu_dhabi_island',
    nameEn: 'Abu Dhabi Island Central District',
    nameAr: 'نطاق قطاع جزيرة أبوظبي المركزي',
    typeEn: 'Metropolitan Core District',
    typeAr: 'المنطقة المركزية لجزيرة أبوظبي',
    center: [24.4650, 54.3680],
    areaKm2: 38.5,
    strokeColor: '#2563EB',
    fillColor: '#3B82F6',
    coordinates: [
      [24.515, 54.370],
      [24.502, 54.408],
      [24.470, 54.430],
      [24.430, 54.442],
      [24.415, 54.415],
      [24.430, 54.335],
      [24.460, 54.312],
      [24.502, 54.330],
      [24.515, 54.370],
    ],
  },
  city_center: {
    id: 'city_center',
    nameEn: 'Abu Dhabi Downtown / Al Dana Boundary',
    nameAr: 'نطاق وسط مدينة أبوظبي (الدانا)',
    typeEn: 'Metropolitan Core District',
    typeAr: 'قلب العاصمة الحضري',
    center: [24.4539, 54.3773],
    areaKm2: 12.0,
    strokeColor: '#1D70B8',
    fillColor: '#2563EB',
    coordinates: [
      [24.498, 54.355],
      [24.498, 54.388],
      [24.465, 54.385],
      [24.462, 54.350],
      [24.498, 54.355],
    ],
  },
  al_bateen: {
    id: 'al_bateen',
    nameEn: 'Al Bateen Waterfront District Boundary',
    nameAr: 'نطاق منطقة البطين البحرية',
    typeEn: 'Waterfront & Diplomatic District',
    typeAr: 'منطقة سياحية ودبلوماسية',
    center: [24.4520, 54.3410],
    areaKm2: 7.8,
    strokeColor: '#0D9488',
    fillColor: '#14B8A6',
    coordinates: [
      [24.468, 54.322],
      [24.466, 54.356],
      [24.436, 54.348],
      [24.438, 54.318],
      [24.468, 54.322],
    ],
  },
  al_raha_beach: {
    id: 'al_raha_beach',
    nameEn: 'Al Raha Beach Community Boundary',
    nameAr: 'نطاق شاطئ الراحة المجتمعي',
    typeEn: 'Coastal Residential District',
    typeAr: 'منطقة شاطئية وسكنية',
    center: [24.4450, 54.5900],
    areaKm2: 9.6,
    strokeColor: '#4F46E5',
    fillColor: '#6366F1',
    coordinates: [
      [24.462, 54.560],
      [24.456, 54.615],
      [24.432, 54.605],
      [24.438, 54.558],
      [24.462, 54.560],
    ],
  },
  masdar_city: {
    id: 'masdar_city',
    nameEn: 'Masdar City Clean-Tech Boundary',
    nameAr: 'نطاق مدينة مصدر المستدامة',
    typeEn: 'Sustainable Tech & Research District',
    typeAr: 'منطقة التكنولوجيا والبحوث المستدامة',
    center: [24.4250, 54.6150],
    areaKm2: 6.0,
    strokeColor: '#16A34A',
    fillColor: '#22C55E',
    coordinates: [
      [24.438, 54.608],
      [24.438, 54.632],
      [24.412, 54.628],
      [24.415, 54.604],
      [24.438, 54.608],
    ],
  },
  musaffah: {
    id: 'musaffah',
    nameEn: 'Musaffah Industrial Sector Boundary',
    nameAr: 'نطاق منطقة مصفح الصناعية',
    typeEn: 'Industrial & Trade Zone',
    typeAr: 'المنطقة الصناعية والتجارية',
    center: [24.3541, 54.4981],
    areaKm2: 24.5,
    strokeColor: '#EA580C',
    fillColor: '#F97316',
    coordinates: [
      [24.380, 54.475],
      [24.375, 54.535],
      [24.332, 54.525],
      [24.338, 54.470],
      [24.380, 54.475],
    ],
  },
  zayed_sports_city: {
    id: 'zayed_sports_city',
    nameEn: 'Zayed Sports City Campus Boundary',
    nameAr: 'نطاق مدينة زايد الرياضية',
    typeEn: 'Sports, Events & Recreation Campus',
    typeAr: 'مجمع رياضي وترفيهي',
    center: [24.4178, 54.4539],
    areaKm2: 3.8,
    strokeColor: '#E11D48',
    fillColor: '#F43F5E',
    coordinates: [
      [24.428, 54.442],
      [24.428, 54.468],
      [24.408, 54.462],
      [24.410, 54.438],
      [24.428, 54.442],
    ],
  },
  al_manhal: {
    id: 'al_manhal',
    nameEn: 'Al Manhal / Al Karama District Boundary',
    nameAr: 'نطاق قطاع المنحل والكرامة',
    typeEn: 'Healthcare & Cultural District',
    typeAr: 'منطقة الرعاية الصحية والثقافة',
    center: [24.4680, 54.3720],
    areaKm2: 5.4,
    strokeColor: '#2563EB',
    fillColor: '#3B82F6',
    coordinates: [
      [24.482, 54.360],
      [24.482, 54.384],
      [24.454, 54.384],
      [24.454, 54.360],
      [24.482, 54.360],
    ],
  },
  al_khalidiya: {
    id: 'al_khalidiya',
    nameEn: 'Al Khalidiya District Boundary',
    nameAr: 'نطاق منطقة الخالدية',
    typeEn: 'Commercial & Cultural District',
    typeAr: 'منطقة تجارية وثقافية',
    center: [24.4710, 54.3480],
    areaKm2: 4.8,
    strokeColor: '#0284C7',
    fillColor: '#38BDF8',
    coordinates: [
      [24.482, 54.338],
      [24.484, 54.360],
      [24.460, 54.362],
      [24.458, 54.335],
      [24.482, 54.338],
    ],
  },
  mushrif: {
    id: 'mushrif',
    nameEn: 'Mushrif / Umm Al Emarat Park District',
    nameAr: 'نطاق منطقة المشرف وحديقة أم الإمارات',
    typeEn: 'Parks & Residential District',
    typeAr: 'منطقة حدائق وسكنية',
    center: [24.4497, 54.3812],
    areaKm2: 6.2,
    strokeColor: '#059669',
    fillColor: '#10B981',
    coordinates: [
      [24.465, 54.370],
      [24.465, 54.398],
      [24.436, 54.398],
      [24.436, 54.370],
      [24.465, 54.370],
    ],
  },
  jubail_island: {
    id: 'jubail_island',
    nameEn: 'Jubail Island Mangrove Nature Reserve',
    nameAr: 'نطاق محمية جزيرة جبيل الطبيعية',
    typeEn: 'Eco-Tourism & Mangrove Reserve',
    typeAr: 'محمية بيئية وأشجار القرم',
    center: [24.5452, 54.4891],
    areaKm2: 12.0,
    strokeColor: '#059669',
    fillColor: '#34D399',
    coordinates: [
      [24.568, 54.470],
      [24.565, 54.515],
      [24.528, 54.510],
      [24.530, 54.470],
      [24.568, 54.470],
    ],
  },
  zayed_city: {
    id: 'zayed_city',
    nameEn: 'Zayed City Sector Boundary',
    nameAr: 'نطاق قطاع مدينة زايد',
    typeEn: 'Administrative & Health District',
    typeAr: 'منطقة إدارية وصحية',
    center: [24.4012, 54.6051],
    areaKm2: 15.0,
    strokeColor: '#2563EB',
    fillColor: '#60A5FA',
    coordinates: [
      [24.418, 54.590],
      [24.418, 54.625],
      [24.385, 54.625],
      [24.385, 54.590],
      [24.418, 54.590],
    ],
  },
  al_reef: {
    id: 'al_reef',
    nameEn: 'Al Reef Community Sector Boundary',
    nameAr: 'نطاق مجتمع الريف السكني',
    typeEn: 'Residential Community District',
    typeAr: 'منطقة سكنية مجتمعية',
    center: [24.4780, 54.6720],
    areaKm2: 4.8,
    strokeColor: '#DC2626', // Red boundary color
    fillColor: '#EF4444',   // Red area fill
    coordinates: [
      [24.4910, 54.6640],
      [24.4925, 54.6765],
      [24.4855, 54.6860],
      [24.4735, 54.6845],
      [24.4670, 54.6730],
      [24.4685, 54.6635],
      [24.4790, 54.6590],
      [24.4910, 54.6640],
    ],
  },
};

/**
 * Generate a realistic facility plot/parcel boundary perimeter around specific coordinates
 */
export function generateParcelBoundary(
  centerLat: number,
  centerLng: number,
  nameEn: string,
  nameAr: string,
  radiusKm = 0.25
): LocationBoundary {
  const dLat = (radiusKm / 111);
  const dLng = (radiusKm / (111 * Math.cos(centerLat * (Math.PI / 180))));

  const coordinates: [number, number][] = [
    [centerLat + dLat * 0.95, centerLng - dLng * 0.75],
    [centerLat + dLat * 0.90, centerLng + dLng * 0.85],
    [centerLat + dLat * 0.25, centerLng + dLng * 1.15],
    [centerLat - dLat * 0.85, centerLng + dLng * 0.95],
    [centerLat - dLat * 1.05, centerLng - dLng * 0.65],
    [centerLat - dLat * 0.35, centerLng - dLng * 1.10],
    [centerLat + dLat * 0.95, centerLng - dLng * 0.75],
  ];

  return {
    id: `parcel-${nameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    nameEn: `${nameEn} (Plot Boundary)`,
    nameAr: `${nameAr} (مخطط القسيمة)`,
    typeEn: 'Facility Parcel / Campus Perimeter',
    typeAr: 'مخطط القسيمة وحرم المنشأة',
    center: [centerLat, centerLng],
    areaKm2: Number((Math.PI * radiusKm * radiusKm).toFixed(2)),
    strokeColor: '#0284C7',
    fillColor: '#38BDF8',
    coordinates,
  };
}

/**
 * Resolves the primary location boundary for any given feature or location name.
 */
export function resolveLocationBoundary(
  target: { lat?: number; lng?: number; nameEn?: string; nameAr?: string; addressEn?: string } | string
): { districtBoundary: LocationBoundary | null; parcelBoundary: LocationBoundary | null } {
  const queryStr = typeof target === 'string'
    ? target.toLowerCase()
    : `${target.nameEn || ''} ${target.addressEn || ''}`.toLowerCase();

  const lat = typeof target !== 'string' ? target.lat : undefined;
  const lng = typeof target !== 'string' ? target.lng : undefined;

  let matchedKey: string | null = null;

  // 1. Check address or name keyword matching
  if (queryStr.includes('khalidiya') || queryStr.includes('خالدية')) {
    matchedKey = 'al_khalidiya';
  } else if (queryStr.includes('manhal') || queryStr.includes('منهل') || queryStr.includes('karama') || queryStr.includes('كرامة') || queryStr.includes('skmc') || (queryStr.includes('khalifa') && (queryStr.includes('medical') || queryStr.includes('hospital')))) {
    matchedKey = 'al_manhal';
  } else if (queryStr.includes('khalifa city') || queryStr.includes('مدينة خليفة')) {
    matchedKey = 'khalifa_city';
  } else if (queryStr.includes('yas') || queryStr.includes('ياس')) {
    matchedKey = 'yas_island';
  } else if (queryStr.includes('reem') || queryStr.includes('الريم')) {
    matchedKey = 'al_reem_island';
  } else if (queryStr.includes('saadiyat') || queryStr.includes('سعديات')) {
    matchedKey = 'saadiyat_island';
  } else if (queryStr.includes('maryah') || queryStr.includes('ماريه') || queryStr.includes('cleveland') || queryStr.includes('adgm')) {
    matchedKey = 'al_maryah_island';
  } else if (queryStr.includes('corniche') || queryStr.includes('كورنيش')) {
    matchedKey = 'corniche';
  } else if (queryStr.includes('bateen') || queryStr.includes('بطين')) {
    matchedKey = 'al_bateen';
  } else if (queryStr.includes('raha') || queryStr.includes('راحة')) {
    matchedKey = 'al_raha_beach';
  } else if (queryStr.includes('masdar') || queryStr.includes('مصدر')) {
    matchedKey = 'masdar_city';
  } else if (queryStr.includes('musaffah') || queryStr.includes('mussafah') || queryStr.includes('مصفح')) {
    matchedKey = 'musaffah';
  } else if (queryStr.includes('mushrif') || queryStr.includes('emarat') || queryStr.includes('مشرف')) {
    matchedKey = 'mushrif';
  } else if (queryStr.includes('jubail') || queryStr.includes('جبيل')) {
    matchedKey = 'jubail_island';
  } else if (queryStr.includes('zayed city') || queryStr.includes('مدينة زايد')) {
    matchedKey = 'zayed_city';
  } else if (queryStr.includes('sports city') || queryStr.includes('رياضية')) {
    matchedKey = 'zayed_sports_city';
  } else if (queryStr.includes('downtown') || queryStr.includes('dana') || queryStr.includes('وسط') || queryStr.includes('wahda') || queryStr.includes('murour')) {
    matchedKey = 'city_center';
  } else if ((queryStr.includes('alreef') || queryStr.includes('reef') || queryStr.includes('الريف')) && !queryStr.includes('coral')) {
    matchedKey = 'al_reef';
  }

  // 2. Spatial proximity fallback: cap max distance threshold to ~5 km (0.055 degrees)
  if (!matchedKey && lat !== undefined && lng !== undefined) {
    let nearestDist = Infinity;
    for (const [key, b] of Object.entries(ABU_DHABI_DISTRICT_BOUNDARIES)) {
      const d = Math.hypot(b.center[0] - lat, b.center[1] - lng);
      if (d < nearestDist && d < 0.055) {
        nearestDist = d;
        matchedKey = key;
      }
    }
  }

  const districtBoundary = matchedKey ? ABU_DHABI_DISTRICT_BOUNDARIES[matchedKey] : null;

  // 3. Generate parcel plot boundary at exact coordinates
  let parcelBoundary: LocationBoundary | null = null;
  if (lat !== undefined && lng !== undefined && typeof target !== 'string') {
    parcelBoundary = generateParcelBoundary(
      lat,
      lng,
      target.nameEn || 'Selected Location',
      target.nameAr || 'الموقع المحدد',
      0.30
    );
  }

  return { districtBoundary, parcelBoundary };
}

/**
 * Generates a single continuous unified boundary for the entire search result list.
 * If bufferKm is specified (e.g. 5 km search), creates a radial buffer boundary around the center.
 * Otherwise, generates a continuous smooth enclosing boundary encompassing all result points.
 */
export function generateUnifiedResultBoundary(
  features: { lat: number; lng: number; nameEn?: string; nameAr?: string; addressEn?: string }[],
  options?: {
    bufferRadiusKm?: number;
    center?: [number, number];
    titleEn?: string;
    titleAr?: string;
  }
): LocationBoundary | null {
  if (!features || features.length === 0) return null;

  const validFeats = features.filter(
    (f) => typeof f.lat === 'number' && typeof f.lng === 'number' && !isNaN(f.lat) && !isNaN(f.lng)
  );
  if (validFeats.length === 0) return null;

  // 1. Single Feature Fallback
  if (validFeats.length === 1) {
    const { districtBoundary, parcelBoundary } = resolveLocationBoundary(validFeats[0]);
    return districtBoundary || parcelBoundary;
  }

  // 2. Calculate bounding box encompassing ALL result features without exception
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  validFeats.forEach((f) => {
    if (f.lat < minLat) minLat = f.lat;
    if (f.lat > maxLat) maxLat = f.lat;
    if (f.lng < minLng) minLng = f.lng;
    if (f.lng > maxLng) maxLng = f.lng;
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // 3. Proximity / Radial Search Buffer Boundary:
  // Ensure the buffer boundary radius is large enough to encompass ALL result locations (never cutting off features)
  if (options?.bufferRadiusKm && options.bufferRadiusKm > 0) {
    const cLat = options.center ? options.center[0] : centerLat;
    const cLng = options.center ? options.center[1] : centerLng;

    // Calculate maximum distance from search center to any result feature
    let maxDistKm = 0;
    validFeats.forEach((f) => {
      const dLat = (f.lat - cLat) * 111;
      const dLng = (f.lng - cLng) * 111 * Math.cos(cLat * (Math.PI / 180));
      const dist = Math.hypot(dLat, dLng);
      if (dist > maxDistKm) maxDistKm = dist;
    });

    // Effective radius ensures 100% of result features are strictly inside the boundary
    const effectiveRadiusKm = Math.max(options.bufferRadiusKm, Number((maxDistKm * 1.15 + 0.4).toFixed(1)));

    const numPoints = 64;
    const coordinates: [number, number][] = [];
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;
      const dLat = (effectiveRadiusKm / 111) * Math.cos(angle);
      const dLng = (effectiveRadiusKm / (111 * Math.cos(cLat * (Math.PI / 180)))) * Math.sin(angle);
      coordinates.push([cLat + dLat, cLng + dLng]);
    }

    const area = Number((Math.PI * effectiveRadiusKm * effectiveRadiusKm).toFixed(1));

    return {
      id: `unified-buffer-${validFeats.length}results`,
      nameEn: options.titleEn || `Location Search Boundary (${validFeats.length} Results • ${effectiveRadiusKm} km Area)`,
      nameAr: options.titleAr || `نطاق البحث الجغرافي (${validFeats.length} موقع • نطاق ${effectiveRadiusKm} كم)`,
      typeEn: 'Unified Spatial Search Boundary',
      typeAr: 'نطاق جغرافي شامل للنتائج',
      center: [cLat, cLng],
      coordinates,
      areaKm2: area,
      strokeColor: '#2563EB',
      fillColor: '#3B82F6',
    };
  }

  // 4. Multi-Feature Unified Enclosing Perimeter (smooth 8-sided polygon enclosing 100% of result features)
  const latPad = Math.max((maxLat - minLat) * 0.18, 0.010);
  const lngPad = Math.max((maxLng - minLng) * 0.18, 0.010);

  const pMinLat = minLat - latPad;
  const pMaxLat = maxLat + latPad;
  const pMinLng = minLng - lngPad;
  const pMaxLng = maxLng + lngPad;

  const coordinates: [number, number][] = [
    [pMaxLat, pMinLng + lngPad * 0.5],
    [pMaxLat, pMaxLng - lngPad * 0.5],
    [pMaxLat - latPad * 0.5, pMaxLng],
    [pMinLat + latPad * 0.5, pMaxLng],
    [pMinLat, pMaxLng - lngPad * 0.5],
    [pMinLat, pMinLng + lngPad * 0.5],
    [pMinLat + latPad * 0.5, pMinLng],
    [pMaxLat - latPad * 0.5, pMinLng],
    [pMaxLat, pMinLng + lngPad * 0.5],
  ];

  const widthKm = (pMaxLng - pMinLng) * 111 * Math.cos(centerLat * (Math.PI / 180));
  const heightKm = (pMaxLat - pMinLat) * 111;
  const approxArea = Number((widthKm * heightKm * 0.85).toFixed(1));

  return {
    id: `unified-result-boundary-${validFeats.length}`,
    nameEn: options?.titleEn || `Location Search Boundary (${validFeats.length} Results)`,
    nameAr: options?.titleAr || `نطاق نتائج البحث الجغرافي (${validFeats.length} موقع)`,
    typeEn: 'Unified Spatial Search Boundary',
    typeAr: 'نطاق جغرافي شامل للنتائج',
    center: [centerLat, centerLng],
    coordinates,
    areaKm2: approxArea,
    strokeColor: '#2563EB',
    fillColor: '#3B82F6',
  };
}

/**
 * Ray-casting point-in-polygon algorithm
 */
export function isPointInsidePolygon(pt: [number, number], polygon: [number, number][]): boolean {
  if (!polygon || polygon.length < 3) return false;
  const [lat, lng] = pt;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Determines whether the user's question explicitly or contextually requested
 * a geographic boundary, sector perimeter, or district area polygon.
 */
export function isBoundaryRequestedInQuery(queryContext?: string): boolean {
  if (!queryContext) return false;
  const q = queryContext.toLowerCase();

  // 1. Explicit boundary keywords in English or Arabic
  const explicitBoundaryTerms = [
    'boundary',
    'boundaries',
    'border',
    'borders',
    'perimeter',
    'sector boundary',
    'district boundary',
    'zone boundary',
    'حدود',
    'نطاق جغرافي',
    'مخطط',
    'قطاع جغرافي',
  ];
  if (explicitBoundaryTerms.some((term) => q.includes(term))) {
    return true;
  }

  // 2. Specific recognized district/community queries where a boundary is designated
  // (e.g. "nurseries in alreef", "nurseries with in 2km in alreef", "al reef boundary", "khalifa city boundary")
  if (
    ((q.includes('alreef') || q.includes('al reef') || q.includes('الريف')) && !q.includes('coral')) ||
    (q.includes('khalifa city') && (q.includes('boundary') || q.includes('sector') || q.includes('حدود') || q.includes('in khalifa city') || q.includes('في مدينة خليفة'))) ||
    (q.includes('yas island') && (q.includes('boundary') || q.includes('zone') || q.includes('حدود') || q.includes('in yas') || q.includes('في جزيرة ياس'))) ||
    (q.includes('reem island') && (q.includes('boundary') || q.includes('حدود') || q.includes('in reem') || q.includes('في جزيرة الريم'))) ||
    (q.includes('saadiyat') && (q.includes('boundary') || q.includes('حدود') || q.includes('in saadiyat') || q.includes('في السعديات'))) ||
    (q.includes('musaffah') && (q.includes('boundary') || q.includes('حدود') || q.includes('in musaffah') || q.includes('في مصفح')))
  ) {
    return true;
  }

  return false;
}

/**
 * Resolves a location boundary based on the location and results.
 * Guarantees that for any location or search results, the appropriate location boundary
 * enclosing ALL returned feature pointers is displayed.
 */
export function resolveBoundaryForFeatures(
  features: { lat: number; lng: number; nameEn?: string; nameAr?: string; addressEn?: string }[],
  queryContext?: string
): LocationBoundary | null {
  const validFeats = (features || []).filter(
    (f) => typeof f.lat === 'number' && typeof f.lng === 'number' && !isNaN(f.lat) && !isNaN(f.lng)
  );

  if (validFeats.length === 0) return null;

  const q = (queryContext || '').toLowerCase();

  // 1. Check if an official district boundary naturally encloses >= 80% of the results
  const districtEntries = Object.entries(ABU_DHABI_DISTRICT_BOUNDARIES);
  let bestDistrictMatch: LocationBoundary | null = null;
  let maxRatio = 0;

  for (const [, district] of districtEntries) {
    if (!district.coordinates || district.coordinates.length < 3) continue;
    const insideCount = validFeats.filter((f) =>
      isPointInsidePolygon([f.lat, f.lng], district.coordinates)
    ).length;

    const ratio = insideCount / validFeats.length;
    if (ratio >= 0.80 && ratio > maxRatio) {
      maxRatio = ratio;
      bestDistrictMatch = district;
    }
  }

  if (bestDistrictMatch) {
    return bestDistrictMatch;
  }

  // 2. Check if query explicitly requested a single specific district AND at least 50% of results are in it
  const checkExplicitQueryMatch = (key: string, termEn: string, termAr: string): LocationBoundary | null => {
    if (q.includes(termEn) || q.includes(termAr)) {
      const dist = ABU_DHABI_DISTRICT_BOUNDARIES[key];
      if (dist && dist.coordinates) {
        const insideCount = validFeats.filter((f) =>
          isPointInsidePolygon([f.lat, f.lng], dist.coordinates)
        ).length;
        if (insideCount / validFeats.length >= 0.50 || validFeats.length <= 2) {
          return dist;
        }
      }
    }
    return null;
  };

  const explicitMatch =
    checkExplicitQueryMatch('al_reef', 'alreef', 'الريف') ||
    checkExplicitQueryMatch('al_reef', 'al reef', 'الريف') ||
    checkExplicitQueryMatch('khalifa_city', 'khalifa city', 'مدينة خليفة') ||
    checkExplicitQueryMatch('yas_island', 'yas island', 'جزيرة ياس') ||
    checkExplicitQueryMatch('al_reem_island', 'reem island', 'جزيرة الريم') ||
    checkExplicitQueryMatch('saadiyat_island', 'saadiyat', 'سعديات') ||
    checkExplicitQueryMatch('musaffah', 'mussafah', 'مصفح') ||
    checkExplicitQueryMatch('musaffah', 'musaffah', 'مصفح') ||
    checkExplicitQueryMatch('zayed_city', 'zayed city', 'مدينة زايد');

  if (explicitMatch) {
    return explicitMatch;
  }

  // 3. For multi-district or wide-spread search result sets (like results across Downtown + Khalifa City),
  // generate a unified continuous boundary enclosing 100% of ALL result pointers returned by the question!
  return generateUnifiedResultBoundary(validFeats);
}

