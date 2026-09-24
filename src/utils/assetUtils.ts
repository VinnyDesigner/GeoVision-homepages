/**
 * Resolves a public asset path relative to Vite's base deployment URL.
 * Ensures image, video, and logo paths work correctly when deployed
 * under sub-directories (e.g., /smart-map-phase2-D3/).
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Strip leading slash or dot-slash
  const cleanPath = path.replace(/^(\.\/|\/)/, '');

  if (typeof window !== 'undefined') {
    // If running in browser and navigating deep paths like /home2, /home3 or /home4, strip the sub-route so assets load from base
    let basePath = window.location.pathname
      .replace(/\/home[234](\.html|\/index\.html|\/)?$/, '')
      .replace(/\/index\.html$/, '');
    if (!basePath.endsWith('/')) {
      basePath += '/';
    }
    return basePath + cleanPath;
  }

  const baseUrl = import.meta.env.BASE_URL || './';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  return normalizedBase + cleanPath;
};




