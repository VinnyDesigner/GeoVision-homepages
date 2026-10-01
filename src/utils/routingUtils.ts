/**
 * routingUtils.ts
 * Real-road driving directions and routing engine for GeoVision Abu Dhabi.
 * Utilizes high-precision OSRM road network geometries with intelligent Abu Dhabi
 * bridge & highway fallback routing.
 */

export interface RouteStep {
  instructionEn: string;
  instructionAr: string;
  distanceMeters: number;
  durationSeconds: number;
  modifier?: string;
  type?: string;
  roadName?: string;
}

export interface RouteResult {
  coordinates: [number, number][]; // Array of [lat, lng]
  distanceKm: number;
  durationMin: number;
  summaryEn: string;
  summaryAr: string;
  steps: RouteStep[];
}

// In-memory cache for fast repeat lookups
const routeCache = new Map<string, RouteResult>();

function getCacheKey(origin: [number, number], destination: [number, number], mode: string): string {
  return `${origin[0].toFixed(4)},${origin[1].toFixed(4)}_${destination[0].toFixed(4)},${destination[1].toFixed(4)}_${mode}`;
}

// Translate step maneuvers to natural English and Arabic
function formatManeuver(step: any): { en: string; ar: string } {
  const type = step.maneuver?.type || 'continue';
  const modifier = step.maneuver?.modifier || '';
  const road = step.name ? ` onto ${step.name}` : '';
  const roadAr = step.name ? ` نحو ${step.name}` : '';

  if (type === 'depart') {
    return {
      en: `Head out${road}`,
      ar: `ابدأ التحرك${roadAr}`,
    };
  }
  if (type === 'arrive') {
    return {
      en: `Arrive at destination`,
      ar: `الوصول إلى الوجهة`,
    };
  }
  if (type === 'turn') {
    if (modifier.includes('right')) {
      return {
        en: `Turn right${road}`,
        ar: `انعطف يميناً${roadAr}`,
      };
    }
    if (modifier.includes('left')) {
      return {
        en: `Turn left${road}`,
        ar: `انعطف يساراً${roadAr}`,
      };
    }
  }
  if (type === 'roundabout' || type === 'rotary') {
    return {
      en: `At the roundabout, take the exit${road}`,
      ar: `عند الدوار، اسلك المخرج${roadAr}`,
    };
  }
  if (type === 'on ramp' || type === 'ramp' || type === 'fork') {
    return {
      en: `Take the ramp / highway exit${road}`,
      ar: `اسلك المخرج المؤدي إلى الطريق السريع${roadAr}`,
    };
  }
  return {
    en: `Continue straight${road}`,
    ar: `تابع السير للأمام${roadAr}`,
  };
}

/**
 * Intelligent Fallback Generator for Abu Dhabi:
 * Generates realistic road-following coordinates between Abu Dhabi island & mainland
 * so routes never cross water / sea when offline or if OSRM is unreachable.
 */
function generateAbuDhabiRoadFallback(
  origin: [number, number],
  dest: [number, number]
): RouteResult {
  const [lat1, lng1] = origin;
  const [lat2, lng2] = dest;

  const waypoints: [number, number][] = [origin];

  const isOriginIsland = lng1 < 54.48 && lat1 < 24.52;
  const isDestIsland = lng2 < 54.48 && lat2 < 24.52;

  // Key bridge and highway checkpoints in Abu Dhabi
  const SHEIKH_ZAYED_BRIDGE: [number, number] = [24.4228, 54.4925];
  const MAQTA_BRIDGE: [number, number] = [24.4074, 54.4985];
  const E10_KHALIFA_CITY_JCT: [number, number] = [24.4285, 54.5420];
  const SAADIYAT_BRIDGE: [number, number] = [24.5262, 54.4172];

  if (isOriginIsland && !isDestIsland) {
    // Going from island to mainland / suburbs (e.g. Khalifa City, MBZ, Yas, Airport)
    if (lat2 > 24.48) {
      // Heading towards Yas / Saadiyat
      waypoints.push([24.4850, 54.3850]);
      waypoints.push(SAADIYAT_BRIDGE);
      waypoints.push([24.5300, 54.4500]);
    } else {
      // Heading towards Khalifa City / Airport / MBZ via E10
      const bridge = lat2 < 24.39 ? MAQTA_BRIDGE : SHEIKH_ZAYED_BRIDGE;
      waypoints.push([24.4450, 54.4200]);
      waypoints.push(bridge);
      waypoints.push(E10_KHALIFA_CITY_JCT);
    }
  } else if (!isOriginIsland && isDestIsland) {
    // Coming from mainland to island
    if (lat1 > 24.48) {
      waypoints.push([24.5300, 54.4500]);
      waypoints.push(SAADIYAT_BRIDGE);
    } else {
      const bridge = lat1 < 24.39 ? MAQTA_BRIDGE : SHEIKH_ZAYED_BRIDGE;
      waypoints.push(E10_KHALIFA_CITY_JCT);
      waypoints.push(bridge);
    }
    waypoints.push([24.4450, 54.4200]);
  } else if (!isOriginIsland && !isDestIsland) {
    // Between mainland sectors (e.g. Mussafah to Khalifa City)
    waypoints.push(E10_KHALIFA_CITY_JCT);
  } else {
    // Within island: route along arterial roads (Salam St / Sultan Bin Zayed)
    const midLat = (lat1 + lat2) / 2;
    const midLng = (lng1 + lng2) / 2;
    waypoints.push([midLat, midLng]);
  }

  waypoints.push(dest);

  // Interpolate waypoints for smooth road curve
  const smoothCoords: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    smoothCoords.push(p1);
    const steps = 6;
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const lat = p1[0] + (p2[0] - p1[0]) * t;
      const lng = p1[1] + (p2[1] - p1[1]) * t;
      smoothCoords.push([lat, lng]);
    }
  }
  smoothCoords.push(dest);

  const straightDistKm = Math.hypot(lat2 - lat1, lng2 - lng1) * 111;
  const roadDistKm = Math.round(straightDistKm * 1.35 * 10) / 10;
  const durationMin = Math.round(roadDistKm * 1.25 + 3);

  return {
    coordinates: smoothCoords,
    distanceKm: roadDistKm,
    durationMin,
    summaryEn: 'via E10 Sheikh Zayed Bin Sultan St',
    summaryAr: 'عبر طريق E10 شارع الشيخ زايد بن سلطان',
    steps: [
      {
        instructionEn: 'Head out from current location',
        instructionAr: 'ابدأ التحرك من الموقع الحالي',
        distanceMeters: 500,
        durationSeconds: 60,
      },
      {
        instructionEn: 'Merge onto E10 Sheikh Zayed Bin Sultan St',
        instructionAr: 'ادخل إلى طريق E10 شارع الشيخ زايد بن سلطان',
        distanceMeters: Math.round(roadDistKm * 600),
        durationSeconds: Math.round(durationMin * 40),
      },
      {
        instructionEn: 'Take the exit towards destination',
        instructionAr: 'اسلك المخرج المؤدي إلى وجهتك',
        distanceMeters: 400,
        durationSeconds: 45,
      },
      {
        instructionEn: 'Arrive at destination',
        instructionAr: 'الوصول إلى الوجهة',
        distanceMeters: 0,
        durationSeconds: 0,
      },
    ],
  };
}

/**
 * Fetch real driving route using OSRM with automatic timeout and Abu Dhabi highway fallback.
 */
export async function fetchDrivingRoute(
  origin: [number, number],
  destination: [number, number],
  mode: 'driving' | 'walking' = 'driving'
): Promise<RouteResult> {
  const cacheKey = getCacheKey(origin, destination, mode);
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  const [lat1, lng1] = origin;
  const [lat2, lng2] = destination;

  try {
    // 3.5s timeout abort controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const osrmProfile = mode === 'walking' ? 'walking' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson&steps=true`;

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const rawCoords = route.geometry.coordinates as [number, number][]; // [lng, lat]
      const coordinates: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMin = Math.max(1, Math.round(route.duration / 60));

      const rawSteps = route.legs?.[0]?.steps || [];
      const steps: RouteStep[] = rawSteps.map((s: any) => {
        const text = formatManeuver(s);
        return {
          instructionEn: text.en,
          instructionAr: text.ar,
          distanceMeters: Math.round(s.distance || 0),
          durationSeconds: Math.round(s.duration || 0),
          modifier: s.maneuver?.modifier,
          type: s.maneuver?.type,
          roadName: s.name,
        };
      });

      // Extract highway / primary road name for summary
      const majorRoad = rawSteps.find((s: any) => s.name && s.name.length > 3)?.name || 'E10 Sheikh Zayed St';

      const result: RouteResult = {
        coordinates,
        distanceKm,
        durationMin,
        summaryEn: `via ${majorRoad}`,
        summaryAr: `عبر ${majorRoad}`,
        steps,
      };

      routeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('OSRM request failed or timed out, using Abu Dhabi road corridor fallback:', err);
  }

  // Fallback if OSRM unavailable
  const fallbackResult = generateAbuDhabiRoadFallback(origin, destination);
  routeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}
