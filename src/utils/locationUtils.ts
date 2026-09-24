export const ABU_DHABI_DEFAULT_CENTER: [number, number] = [24.4539, 54.3773]; // Khalifa City / Abu Dhabi

// Abu Dhabi Emirate Geographical Bounding Box
export const ABU_DHABI_BOUNDS = {
  minLat: 22.5,
  maxLat: 25.2,
  minLng: 51.5,
  maxLng: 56.0,
};

export function isWithinAbuDhabi(lat: number, lng: number): boolean {
  return (
    lat >= ABU_DHABI_BOUNDS.minLat &&
    lat <= ABU_DHABI_BOUNDS.maxLat &&
    lng >= ABU_DHABI_BOUNDS.minLng &&
    lng <= ABU_DHABI_BOUNDS.maxLng
  );
}

/**
 * Ensures coordinate is strictly within Abu Dhabi emirate.
 * If user is outside Abu Dhabi (e.g. testing remotely), returns Abu Dhabi center
 * so that the official DGE Basemap and SDI datasets are always loaded.
 */
export function ensureAbuDhabiLocation(lat: number, lng: number): [number, number] {
  if (isWithinAbuDhabi(lat, lng)) {
    return [lat, lng];
  }
  return ABU_DHABI_DEFAULT_CENTER;
}

