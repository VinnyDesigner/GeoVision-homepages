import React, { useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { ensureAbuDhabiLocation, isWithinAbuDhabi, ABU_DHABI_DEFAULT_CENTER } from '../../utils/locationUtils';

const PERMISSION_KEY = 'geovision_location_permission_handled';

export const LocationPermissionPopup: React.FC = () => {
  const { currentView, userLocation, setUserLocation, setMapCenterAndZoom, showToast, language } = useAppState();
  const prevViewRef = useRef<string | null>(null);
  const userLocationRef = useRef(userLocation);
  userLocationRef.current = userLocation;

  useEffect(() => {
    // Only execute when user lands on Explore Map view
    if (currentView !== 'map') {
      prevViewRef.current = currentView;
      return;
    }

    const wasJustNavigated = prevViewRef.current !== 'map';
    prevViewRef.current = currentView;

    if (!wasJustNavigated) return;

    // If userLocation was already resolved, ensure it's in Abu Dhabi and land on it
    if (userLocationRef.current) {
      const validPreLoc = ensureAbuDhabiLocation(userLocationRef.current[0], userLocationRef.current[1]);
      setMapCenterAndZoom(validPreLoc, 16);
      window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: validPreLoc, zoom: 16 } }));
    }

    // Trigger device geolocation to get fresh current position
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          try {
            localStorage.setItem(PERMISSION_KEY, 'allowed');
          } catch {}

          const rawLat = pos.coords.latitude;
          const rawLng = pos.coords.longitude;
          const isRealAbuDhabi = isWithinAbuDhabi(rawLat, rawLng);
          const validLoc = ensureAbuDhabiLocation(rawLat, rawLng);

          setUserLocation(validLoc);
          setMapCenterAndZoom(validLoc, 16);
          window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: validLoc, zoom: 16 } }));

          if (isRealAbuDhabi) {
            showToast(
              language === 'ar'
                ? 'تم التكبير إلى موقعك الحالي بنجاح في أبوظبي'
                : 'Zoomed to your current Abu Dhabi location'
            );
          } else {
            showToast(
              language === 'ar'
                ? 'تم التكبير إلى مركز أبوظبي - نطاق خريطة تمكين المعتمدة (DGE)'
                : 'Zoomed to Abu Dhabi (Official DGE Basemap Coverage)'
            );
          }
        },
        (err) => {
          try {
            localStorage.setItem(PERMISSION_KEY, 'denied');
          } catch {}

          const defaultLoc = ABU_DHABI_DEFAULT_CENTER;
          setUserLocation(defaultLoc);
          setMapCenterAndZoom(defaultLoc, 16);
          window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: defaultLoc, zoom: 16 } }));

          if (err.code !== err.PERMISSION_DENIED) {
            showToast(
              language === 'ar'
                ? 'تم التكبير لمركز الخريطة الافتراضي لأبوظبي'
                : 'Zoomed to Abu Dhabi default location'
            );
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } else if (!userLocationRef.current) {
      const defaultLoc = ABU_DHABI_DEFAULT_CENTER;
      setUserLocation(defaultLoc);
      setMapCenterAndZoom(defaultLoc, 16);
      window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: defaultLoc, zoom: 16 } }));
    }
  }, [currentView, setUserLocation, setMapCenterAndZoom, showToast, language]);

  return null;
};
