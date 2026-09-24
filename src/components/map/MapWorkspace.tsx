import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import { GEO_FEATURES } from '../../data/mockAbuDhabiData';
import type { DrawnShape, GeoFeature } from '../../types';
import { MapToolbar } from './MapToolbar';
import { BasemapGallery } from './BasemapGallery';
import { MapLegend } from './MapLegend';
import { BufferTool } from './BufferTool';
import { PrintMapModal } from './PrintMapModal';
import { SketchAOITool } from './SketchAOITool';
import { GeoVisionPanel } from '../ai/GeoVisionPanel';
import { SmartFilterPanel } from '../filters/SmartFilterPanel';
import { createGeoVisionMarkerIcon } from '../../utils/markerUtils';
import { buildSpatialSnapshot } from '../../utils/spatialSnapshotUtils';
import { ensureAbuDhabiLocation, ABU_DHABI_DEFAULT_CENTER } from '../../utils/locationUtils';
import { resolveBoundaryForFeatures, type LocationBoundary } from '../../utils/boundaryUtils';
import { X, Layers, ChevronUp } from 'lucide-react';

export const MapWorkspace: React.FC = () => {
  const {
    language,
    activeBasemap,
    activeTool,
    selectedFeature,
    setSelectedFeature,
    hoveredFeature,
    setHoveredFeature,
    mapCenter,
    mapZoom,
    filteredFeatures,
    selectedCategoryIds,
    selectedSubcategoryIds,
    bufferRadiusKm,
    bufferCenter,
    aoiResult,
    showToast,
    filterDrawerOpen,
    setFilterDrawerOpen,
    drawTool,
    userDrawnShapes,
    setUserDrawnShapes,
    sendAIMessage,
    pureMapMode,
    userLocation,
    navigationTarget,
    aiMessages,
  } = useAppState();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.Layer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const drawnLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferCircleRef = useRef<L.Circle | null>(null);
  const aoiPolygonRef = useRef<L.Polygon | null>(null);
  const activeRouteLineRef = useRef<L.Polyline | null>(null);
  const activeRouteStartMarkerRef = useRef<L.Marker | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const boundaryGroupRef = useRef<L.LayerGroup | null>(null);


  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState<number>(480);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      let newWidth = isRtl ? e.clientX : window.innerWidth - e.clientX;
      newWidth = Math.max(340, Math.min(850, newWidth));
      setPanelWidth(newWidth);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ animate: false });
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Coordinate Format Dropdown State & Ref
  const [coordFormat, setCoordFormat] = useState<'DD' | 'DDM' | 'DMS' | 'UTM'>('DD');
  const [coordMenuOpen, setCoordMenuOpen] = useState(false);
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (coordRef.current && !coordRef.current.contains(e.target as Node)) {
        setCoordMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCoordinates = (lat: number, lng: number, fmt: 'DD' | 'DDM' | 'DMS' | 'UTM'): string => {
    const absLat = Math.abs(lat);
    const absLng = Math.abs(lng);
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    if (fmt === 'DDM') {
      const latDeg = Math.floor(absLat);
      const latMin = ((absLat - latDeg) * 60).toFixed(3);
      const lngDeg = Math.floor(absLng);
      const lngMin = ((absLng - lngDeg) * 60).toFixed(3);
      return `${latDeg}° ${latMin}' ${latDir}, ${lngDeg}° ${lngMin}' ${lngDir}`;
    }

    if (fmt === 'DMS') {
      const latDeg = Math.floor(absLat);
      const latMinTotal = (absLat - latDeg) * 60;
      const latMin = Math.floor(latMinTotal);
      const latSec = ((latMinTotal - latMin) * 60).toFixed(1);

      const lngDeg = Math.floor(absLng);
      const lngMinTotal = (absLng - lngDeg) * 60;
      const lngMin = Math.floor(lngMinTotal);
      const lngSec = ((lngMinTotal - lngMin) * 60).toFixed(1);

      return `${latDeg}° ${latMin}' ${latSec}" ${latDir}, ${lngDeg}° ${lngMin}' ${lngSec}" ${lngDir}`;
    }

    if (fmt === 'UTM') {
      const easting = Math.round(233750 + (lng - 54.3773) * 92000);
      const northing = Math.round(2706300 + (lat - 24.4539) * 110500);
      return `39R ${easting}mE ${northing}mN`;
    }

    return `${lat.toFixed(4)}° ${latDir}, ${lng.toFixed(4)}° ${lngDir}`;
  };

  // Abu Dhabi DGE & ArcGIS Basemap Tile URLs
  const basemapUrls: Record<string, string> = {
    dge: 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_WM/MapServer/tile/{z}/{y}/{x}',
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const createBasemapLayer = (map: L.Map, type: string): L.Layer => {
    if (type === 'dge') {
      // 1. Instant global base layer that renders in <30ms from Esri CDN (no blank screen)
      const fastBaseLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '&copy; Abu Dhabi Spatial Data Infrastructure (AD-SDI) / DGE',
          keepBuffer: 4,
        }
      );

      // 2. Official Abu Dhabi DGE Color Basemap using cached Web Mercator tiles
      const dgeTileLayer = L.tileLayer(
        'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_WM/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: '&copy; DGE Abu Dhabi Spatial Data Infrastructure (AD-SDI)',
          errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          keepBuffer: 4,
          updateWhenIdle: false,
          updateWhenZooming: true,
        }
      );

      const group = L.layerGroup([fastBaseLayer, dgeTileLayer]);
      return group.addTo(map);
    }

    const tileUrl = basemapUrls[type] || basemapUrls['dge'];
    return L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; ArcGIS / DGE Abu Dhabi Spatial Infrastructure (SDI)',
      keepBuffer: 4,
    }).addTo(map);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const targetLoc = userLocation
        ? ensureAbuDhabiLocation(userLocation[0], userLocation[1])
        : ABU_DHABI_DEFAULT_CENTER;

      const map = L.map(mapContainerRef.current, {
        center: targetLoc,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true,
        zoomSnap: 1,
        zoomDelta: 1,
        wheelDebounceTime: 40,
        wheelPxPerZoomLevel: 60,
        preferCanvas: true,
      });

      markersGroupRef.current = L.layerGroup().addTo(map);
      drawnLayersGroupRef.current = L.layerGroup().addTo(map);
      boundaryGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Immediate size recalculation for instant non-blocking map rendering
      map.invalidateSize();
      requestAnimationFrame(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });

      // Smooth cinematic zoom directly to the location pointer on landing
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.flyTo(targetLoc, 16, {
            animate: true,
            duration: 1.5,
          });
        }
      }, 200);
    }

    return () => {
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
        userLocationMarkerRef.current = null;
      }
      if (boundaryGroupRef.current) {
        boundaryGroupRef.current.clearLayers();
        boundaryGroupRef.current.remove();
        boundaryGroupRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
        tileLayerRef.current = null;
      }

      const layer = createBasemapLayer(mapInstanceRef.current, activeBasemap);
      tileLayerRef.current = layer as any;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 50);
    }
  }, [activeBasemap]);

  // Listen to custom zoom & navigation events from toolbar
  useEffect(() => {
    const handleZoomInEvent = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomIn(1);
      }
    };
    const handleZoomOutEvent = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.zoomOut(1);
      }
    };
    const handleResetHomeEvent = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([24.4539, 54.3773], 12, { animate: true, duration: 1.2 });
      }
    };
    const handleFlyToEvent = (e: any) => {
      if (mapInstanceRef.current && e.detail && e.detail.center) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.flyTo(e.detail.center, e.detail.zoom || 16, { animate: true, duration: 1.4 });
      }
    };

    window.addEventListener('geovision:zoomIn', handleZoomInEvent);
    window.addEventListener('geovision:zoomOut', handleZoomOutEvent);
    window.addEventListener('geovision:resetHome', handleResetHomeEvent);
    window.addEventListener('geovision:flyTo', handleFlyToEvent);

    return () => {
      window.removeEventListener('geovision:zoomIn', handleZoomInEvent);
      window.removeEventListener('geovision:zoomOut', handleZoomOutEvent);
      window.removeEventListener('geovision:resetHome', handleResetHomeEvent);
      window.removeEventListener('geovision:flyTo', handleFlyToEvent);
    };
  }, []);

  // Compute active features to display on map (prioritizing active AI search results)
  const displayFeatures = React.useMemo(() => {
    const lastMsgWithFeatures = [...aiMessages].reverse().find(m => m.matchedFeatures && m.matchedFeatures.length > 0);
    if (lastMsgWithFeatures && lastMsgWithFeatures.matchedFeatures && lastMsgWithFeatures.matchedFeatures.length > 0) {
      return lastMsgWithFeatures.matchedFeatures;
    }
    return filteredFeatures;
  }, [filteredFeatures, aiMessages]);

  // Update Feature Markers & Layer Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    const newMarkersMap = new Map<string, L.Marker>();

    const activeDisplayList = [...displayFeatures];

    if (selectedFeature) {
      const exists = activeDisplayList.some(
        (f) =>
          f.id === selectedFeature.id ||
          f.nameEn === selectedFeature.nameEn ||
          (f.lat === selectedFeature.lat && f.lng === selectedFeature.lng)
      );
      if (!exists) {
        activeDisplayList.push(selectedFeature);
      }
    }

    if (hoveredFeature) {
      const exists = activeDisplayList.some(
        (f) =>
          f.id === hoveredFeature.id ||
          f.nameEn === hoveredFeature.nameEn ||
          (f.lat === hoveredFeature.lat && f.lng === hoveredFeature.lng)
      );
      if (!exists) {
        activeDisplayList.push(hoveredFeature);
      }
    }

    activeDisplayList.forEach((feat) => {
      const isSelected =
        selectedFeature &&
        (selectedFeature.id === feat.id || selectedFeature.nameEn === feat.nameEn);
      const isHovered =
        hoveredFeature &&
        (hoveredFeature.id === feat.id || hoveredFeature.nameEn === feat.nameEn);

      const customIcon = createGeoVisionMarkerIcon(feat.category, feat.subcategory, false, !!(isSelected || isHovered), feat.nameEn);
      const marker = L.marker([feat.lat, feat.lng], { icon: customIcon, zIndexOffset: (isSelected || isHovered) ? 1000 : 0 });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedFeature(feat);
        setAiPanelOpen(true);
        window.dispatchEvent(new CustomEvent('geovision:openFeatureDetails', { detail: feat }));
      });

      marker.on('mouseover', () => {
        setHoveredFeature(feat);
      });

      marker.on('mouseout', () => {
        setHoveredFeature(null);
      });

      markersGroupRef.current?.addLayer(marker);
      newMarkersMap.set(feat.id, marker);
    });

    markersMapRef.current = newMarkersMap;

    if (!selectedFeature && !hoveredFeature) {
      mapInstanceRef.current?.closePopup();
    }
  }, [displayFeatures, language, selectedFeature, hoveredFeature, selectedCategoryIds, selectedSubcategoryIds]);

  // Open Map Popup on Card Hover or Feature Selection
  const hoverPopupRef = useRef<L.Popup | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const activeFeat = hoveredFeature || selectedFeature;

    if (!activeFeat) {
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
      }
      return;
    }

    const popupContent = `
      <div style="padding: 6px 10px; font-family: system-ui, sans-serif; min-width: 150px; max-width: 220px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
          <span style="width: 8px; height: 8px; border-radius: 9999px; background-color: #215A9E; display: inline-block;"></span>
          <span style="font-weight: 900; font-size: 12px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${language === 'ar' ? (activeFeat.nameAr || activeFeat.nameEn) : (activeFeat.nameEn || activeFeat.nameAr)}
          </span>
        </div>
        <div style="font-size: 10px; color: #64748b; font-weight: 700; margin-bottom: 2px;">
          ${activeFeat.subcategory || activeFeat.category || 'Location'}
        </div>
        <div style="font-size: 10px; font-weight: 800; color: #215A9E; display: flex; align-items: center; gap: 4px;">
          📍 ${(activeFeat.distanceKm || 1.5)} km away • ${(activeFeat.openStatusEn || 'Open 24/7')}
        </div>
      </div>
    `;

    if (!hoverPopupRef.current) {
      hoverPopupRef.current = L.popup({
        closeButton: false,
        offset: [0, -28],
        autoPan: false,
        className: 'geovision-map-card-popup',
      });
    }

    hoverPopupRef.current
      .setLatLng([activeFeat.lat, activeFeat.lng])
      .setContent(popupContent)
      .openOn(mapInstanceRef.current);

    const popupElem = hoverPopupRef.current.getElement();
    if (popupElem) {
      popupElem.style.cursor = 'pointer';
      popupElem.onclick = () => {
        setSelectedFeature(activeFeat);
        setAiPanelOpen(true);
        window.dispatchEvent(new CustomEvent('geovision:openFeatureDetails', { detail: activeFeat }));
      };
    }
  }, [hoveredFeature, selectedFeature, language]);

  // Single Unified Map Camera Control Effect with Frame Coalescing & Boundary Auto-Fit
  const flyToTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (flyToTimeoutRef.current) {
      clearTimeout(flyToTimeoutRef.current);
    }

    flyToTimeoutRef.current = setTimeout(() => {
      if (!mapInstanceRef.current) return;
      const mapInst = mapInstanceRef.current;
      mapInst.invalidateSize();

      if (navigationTarget && selectedFeature && navigationTarget.id === selectedFeature.id) {
        const origin: [number, number] = userLocation || [24.4539, 54.3773];
        const destination: [number, number] = [selectedFeature.lat, selectedFeature.lng];
        const routeBounds = L.latLngBounds([origin, destination]);
        mapInst.flyToBounds(routeBounds, { padding: [90, 90], maxZoom: 15, duration: 1.2 });
      } else if (displayFeatures.length > 0) {
        // Collect ALL coordinates for pointers AND location boundary polygon to ensure zoom out effect frames EVERYTHING at once
        const allPoints: [number, number][] = [];

        // 1. Add all feature pointer coordinates
        displayFeatures.forEach(f => {
          if (typeof f.lat === 'number' && typeof f.lng === 'number' && !isNaN(f.lat) && !isNaN(f.lng)) {
            allPoints.push([f.lat, f.lng]);
          }
        });

        // 2. Add boundary polygon coordinates if a location boundary is resolved for the current query/features
        const lastUserMsg = [...aiMessages].reverse().find(m => m.sender === 'user');
        const userQuery = `${lastUserMsg?.textEn || ''} ${lastUserMsg?.textAr || ''}`.trim();
        const boundary = resolveBoundaryForFeatures(displayFeatures, userQuery);

        if (boundary && boundary.coordinates && boundary.coordinates.length > 0) {
          boundary.coordinates.forEach(coord => {
            if (typeof coord[0] === 'number' && typeof coord[1] === 'number') {
              allPoints.push(coord);
            }
          });
        }

        if (allPoints.length > 0) {
          const combinedBounds = L.latLngBounds(allPoints);
          if (combinedBounds.isValid()) {
            // Smooth zoom-out / fit bounds effect so that ALL pointers and boundary polygon are 100% visible at once
            mapInst.fitBounds(combinedBounds, {
              padding: [85, 85],
              maxZoom: 14,
              animate: true,
              duration: 1.2,
            });
          }
        }
      } else if (selectedFeature) {
        mapInst.flyTo([selectedFeature.lat, selectedFeature.lng], 15, { animate: true, duration: 0.8 });
      } else if (mapCenter && mapCenter.length === 2) {
        mapInst.flyTo(mapCenter, mapZoom || 12, { animate: true, duration: 1.2 });
      }
    }, 25);

    return () => {
      if (flyToTimeoutRef.current) {
        clearTimeout(flyToTimeoutRef.current);
      }
    };
  }, [selectedFeature, navigationTarget, userLocation, mapCenter, mapZoom, displayFeatures, aiMessages]);

  // Draw Dashed Navigation Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 1. Remove existing route polyline & origin marker
    if (activeRouteLineRef.current) {
      activeRouteLineRef.current.remove();
      activeRouteLineRef.current = null;
    }
    if (activeRouteStartMarkerRef.current) {
      activeRouteStartMarkerRef.current.remove();
      activeRouteStartMarkerRef.current = null;
    }

    if (!selectedFeature) return;

    const isNavTargetActive = navigationTarget && navigationTarget.id === selectedFeature.id;

    if (isNavTargetActive) {
      const origin: [number, number] = userLocation || [24.4539, 54.3773];
      const destination: [number, number] = [selectedFeature.lat, selectedFeature.lng];

      const polyline = L.polyline([origin, destination], {
        color: '#2563eb',
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 8',
        className: 'animated-route-polyline',
        interactive: false,
      }).addTo(map);

      const distanceKm = selectedFeature.distanceKm || (
        Math.hypot(selectedFeature.lat - origin[0], selectedFeature.lng - origin[1]) * 111
      ).toFixed(1);

      polyline.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:11px;color:#1e40af;padding:4px 10px;background:rgba(255,255,255,0.95);border-radius:10px;border:1.5px solid #2563eb;box-shadow:0 4px 14px rgba(37,99,235,0.3);">
          📍 Route to ${language === 'ar' ? selectedFeature.nameAr : selectedFeature.nameEn}: <b>${distanceKm} km</b>
        </div>`,
        { permanent: true, direction: 'center', interactive: false }
      );

      activeRouteLineRef.current = polyline;

      // Add origin pin marker
      const startIcon = L.divIcon({
        className: 'route-origin-marker',
        html: `<div style="width:22px;height:22px;background:#2563eb;border:3.5px solid white;border-radius:50%;box-shadow:0 4px 14px rgba(37,99,235,0.6);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const startMarker = L.marker(origin, { icon: startIcon }).addTo(map);
      startMarker.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:900;font-size:10.5px;color:#1e3a8a;padding:2px 6px;">📍 ${language === 'ar' ? 'موقعي الحالي' : 'Current Area Origin'}</div>`,
        { permanent: false, direction: 'top', interactive: false }
      );
      activeRouteStartMarkerRef.current = startMarker;
    }
  }, [selectedFeature, userLocation, language, navigationTarget]);

  // Render User Current Location Pulsing GPS Indicator
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.remove();
      userLocationMarkerRef.current = null;
    }

    if (userLocation) {
      const isNavRouteActive = Boolean(
        navigationTarget && selectedFeature && navigationTarget.id === selectedFeature.id
      );

      // Avoid duplicating origin pin when an active navigation route is drawn
      if (!isNavRouteActive) {
        const userIcon = L.divIcon({
          className: 'user-current-location-marker',
          html: `
            <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <span class="user-location-pulse" style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(33,90,158,0.45);"></span>
              <span style="position:relative;width:16px;height:16px;border-radius:50%;background:#215A9E;border:3px solid #ffffff;box-shadow:0 2px 10px rgba(33,90,158,0.7);"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker(userLocation, {
          icon: userIcon,
          zIndexOffset: 1200,
        }).addTo(map);

        marker.bindTooltip(
          `<div style="font-family:sans-serif;font-weight:800;font-size:11px;color:#063360;padding:4px 8px;background:rgba(255,255,255,0.96);border-radius:8px;border:1.5px solid #7DA1C4;box-shadow:0 3px 10px rgba(6,51,96,0.18);cursor:pointer;">
            📍 ${language === 'ar' ? 'موقعك الحالي (انقر للتكبير)' : 'Your Location Pointer (Click to Zoom)'}
          </div>`,
          { permanent: false, direction: 'top' }
        );

        marker.on('click', () => {
          map.flyTo(userLocation, 17, { animate: true, duration: 1.2 });
          showToast(
            language === 'ar'
              ? 'تم التكبير إلى موقعك الحالي'
              : 'Zoomed into location pointer'
          );
        });

        userLocationMarkerRef.current = marker;
      }
    }

    return () => {
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
        userLocationMarkerRef.current = null;
      }
    };
  }, [userLocation, language, navigationTarget, selectedFeature]);

  // Render Highlighted Buffer Circle whenever bufferRadiusKm > 0 or Buffer Tool is active
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (bufferCircleRef.current) {
      bufferCircleRef.current.remove();
      bufferCircleRef.current = null;
    }

    const lastUserMsg = [...aiMessages].reverse().find(m => m.sender === 'user');
    const userQuery = `${lastUserMsg?.textEn || ''} ${lastUserMsg?.textAr || ''}`.toLowerCase();
    const queryRequestsBuffer =
      userQuery.includes('buffer') ||
      userQuery.includes('نطاق عازل') ||
      (userQuery.includes('with in') && userQuery.includes('buffer')) ||
      (userQuery.includes('within') && userQuery.includes('buffer')) ||
      (userQuery.includes('alreef') && (userQuery.includes('2km') || userQuery.includes('2 كم')));

    const shouldShowBufferCircle = activeTool === 'buffer' || (bufferRadiusKm > 0 && queryRequestsBuffer);

    if (shouldShowBufferCircle && bufferRadiusKm && bufferRadiusKm > 0) {
      const radiusMeters = bufferRadiusKm * 1000;
      const centerLatLng: [number, number] = bufferCenter
        || (activeTool === 'buffer' && selectedFeature ? [selectedFeature.lat, selectedFeature.lng] : null)
        || (selectedFeature ? [selectedFeature.lat, selectedFeature.lng] : null)
        || (displayFeatures.length > 0 ? [displayFeatures[0].lat, displayFeatures[0].lng] : null)
        || userLocation
        || mapCenter
        || [24.4539, 54.3773];

      const circle = L.circle(centerLatLng, {
        radius: radiusMeters,
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.16,
        weight: 3,
        dashArray: '8, 6',
        interactive: false,
        className: 'geovision-buffer-circle',
      }).addTo(mapInstanceRef.current);

      circle.bindTooltip(
        `<div class="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-300">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span>${bufferRadiusKm} km ${language === 'ar' ? 'نطاق عازل دائري' : 'Buffer Circle'}</span>
        </div>`,
        {
          permanent: true,
          direction: 'top',
          offset: [0, -10],
          className: 'geovision-boundary-tooltip',
        }
      );

      bufferCircleRef.current = circle;

      // Fit map bounds to encompass the complete buffer circle
      try {
        const bounds = circle.getBounds();
        mapInstanceRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          duration: 1.2,
        });
      } catch {
        // ignore bounds fit error
      }
    }
  }, [bufferRadiusKm, bufferCenter, selectedFeature, activeTool, userLocation, mapCenter, language, displayFeatures, aiMessages]);

  // Render AOI Polygon geometry
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (aoiPolygonRef.current) {
      aoiPolygonRef.current.remove();
      aoiPolygonRef.current = null;
    }

    if (activeTool === 'sketch' && aoiResult) {
      const polygon = L.polygon(aoiResult.bounds, {
        color: '#176BFF',
        fillColor: '#176BFF',
        fillOpacity: 0.22,
        weight: 3,
        interactive: false,
      }).addTo(mapInstanceRef.current);

      aoiPolygonRef.current = polygon;
    }
  }, [activeTool, aoiResult]);

  // Highlight Geographic Community/District & Facility Parcel Boundaries Based on Location / Results
  useEffect(() => {
    if (!mapInstanceRef.current || !boundaryGroupRef.current) return;
    const boundaryGroup = boundaryGroupRef.current;
    boundaryGroup.clearLayers();

    if (displayFeatures.length === 0 && !selectedFeature && !hoveredFeature) {
      return;
    }

    const activeFeat = hoveredFeature || selectedFeature;

    const lastUserMsg = [...aiMessages].reverse().find(m => m.sender === 'user');
    const userQuery = `${lastUserMsg?.textEn || ''} ${lastUserMsg?.textAr || ''}`.trim();

    // Boundaries should ONLY be displayed when requested based on the question
    const targetFeatures = displayFeatures.length > 0 ? displayFeatures : (activeFeat ? [activeFeat] : []);
    const singleBoundary: LocationBoundary | null = resolveBoundaryForFeatures(targetFeatures, userQuery);

    // Render the Single Unified Location Boundary
    if (singleBoundary && singleBoundary.coordinates && singleBoundary.coordinates.length > 0) {
      const isRed = singleBoundary.id === 'al_reef' || singleBoundary.strokeColor?.toLowerCase().includes('dc') || singleBoundary.strokeColor?.toLowerCase().includes('ef');
      const boundaryPolygon = L.polygon(singleBoundary.coordinates, {
        color: singleBoundary.strokeColor || '#2563EB',
        fillColor: singleBoundary.fillColor || '#3B82F6',
        fillOpacity: isRed ? 0.24 : 0.16,
        weight: isRed ? 4 : 3.5,
        dashArray: '8, 6',
        className: `geovision-boundary-district-polygon active-boundary ${isRed ? 'alreef-red-boundary' : ''}`,
      });

      const boundaryName = language === 'ar' ? (singleBoundary.nameAr || singleBoundary.nameEn) : (singleBoundary.nameEn || singleBoundary.nameAr);
      boundaryPolygon.bindTooltip(
        `<div class="px-3 py-1.5 text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full ${isRed ? 'bg-red-500' : 'bg-blue-500'} animate-pulse"></span>
          <span>${boundaryName}</span>
          ${singleBoundary.areaKm2 ? `<span class="text-[10px] ${isRed ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} font-bold">(${singleBoundary.areaKm2} km²)</span>` : ''}
        </div>`,
        {
          permanent: true,
          sticky: true,
          direction: 'auto',
          className: 'geovision-boundary-tooltip',
        }
      );

      boundaryPolygon.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (mapInstanceRef.current && singleBoundary) {
          mapInstanceRef.current.flyToBounds(L.latLngBounds(singleBoundary.coordinates), {
            padding: [70, 70],
            maxZoom: 15,
            duration: 1.0,
          });
        }
      });

      boundaryGroup.addLayer(boundaryPolygon);
    }
  }, [selectedFeature, hoveredFeature, displayFeatures, aiMessages, language, bufferRadiusKm, bufferCenter]);
  const tempShapeRef = useRef<L.Layer | null>(null);
  const tempPointsRef = useRef<L.LatLng[]>([]);
  const isDrawingRef = useRef<boolean>(false);
  const startLatLngRef = useRef<L.LatLng | null>(null);

  // Render User Drawn Shapes (Point, Circle, Polygon, Rectangle)
  useEffect(() => {
    if (!mapInstanceRef.current || !drawnLayersGroupRef.current) return;

    drawnLayersGroupRef.current.clearLayers();

    if (tempShapeRef.current) {
      tempShapeRef.current.remove();
      tempShapeRef.current = null;
    }
    tempPointsRef.current = [];
    isDrawingRef.current = false;
    startLatLngRef.current = null;

    if (userDrawnShapes.length === 0 && aoiPolygonRef.current) {
      aoiPolygonRef.current.remove();
      aoiPolygonRef.current = null;
    }

    userDrawnShapes.forEach((shape) => {
      if (shape.type === 'point') {
        const customPin = L.divIcon({
          className: 'custom-leaflet-marker-pin',
          html: `<div style="width:28px;height:28px;background:#176BFF;border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(23,107,255,0.5);color:white;font-size:13px;font-weight:900;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([shape.lat, shape.lng], { icon: customPin });
        drawnLayersGroupRef.current?.addLayer(marker);
      } else if (shape.type === 'circle') {
        const circle = L.circle([shape.lat, shape.lng], {
          radius: shape.radius || 2000,
          color: '#176BFF',
          fillColor: '#176BFF',
          fillOpacity: 0.2,
          weight: 2.5,
        });
        drawnLayersGroupRef.current?.addLayer(circle);
      } else if (shape.type === 'polygon') {
        const polyPoints = shape.points || [
          [shape.lat + 0.015, shape.lng],
          [shape.lat, shape.lng + 0.018],
          [shape.lat - 0.015, shape.lng],
          [shape.lat, shape.lng - 0.018],
        ];
        const polygon = L.polygon(polyPoints, {
          color: '#4F46E5',
          fillColor: '#4F46E5',
          fillOpacity: 0.25,
          weight: 2.5,
        });
        drawnLayersGroupRef.current?.addLayer(polygon);
      } else if (shape.type === 'rect') {
        const bounds: [[number, number], [number, number]] = shape.bounds || [
          [shape.lat - 0.012, shape.lng - 0.018],
          [shape.lat + 0.012, shape.lng + 0.018],
        ];
        const rect = L.rectangle(bounds, {
          color: '#059669',
          fillColor: '#059669',
          fillOpacity: 0.22,
          weight: 2.5,
        });
        drawnLayersGroupRef.current?.addLayer(rect);
      }
    });
  }, [userDrawnShapes]);

  // Handle Map Click for Identify / Select Tool
  useEffect(() => {
    if (!mapInstanceRef.current || activeTool !== 'identify') return;

    const map = mapInstanceRef.current;
    const handleIdentifyMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      let closestFeat: GeoFeature | null = null;
      let minD = Infinity;

      for (const f of GEO_FEATURES) {
        const d = Math.hypot(f.lat - latlng.lat, f.lng - latlng.lng);
        if (d < minD) {
          minD = d;
          closestFeat = f;
        }
      }

      if (closestFeat && minD < 0.25) {
        const feat: GeoFeature = closestFeat;
        setSelectedFeature(feat);
        showToast(language === 'ar' ? `تم تحديد المعلم: ${feat.nameAr}` : `Selected GIS Feature: ${feat.nameEn}`);
        map.flyTo([feat.lat, feat.lng], 15);
      }
    };

    map.on('click', handleIdentifyMapClick);
    return () => {
      map.off('click', handleIdentifyMapClick);
    };
  }, [activeTool, language, setSelectedFeature, showToast, GEO_FEATURES]);

  // Handle Freehand Interactive Map Drawing for All Tools (Circle, Rect, Polygon, Point)
  useEffect(() => {
    if (!mapInstanceRef.current || activeTool !== 'sketch') {
      if (tempShapeRef.current) {
        tempShapeRef.current.remove();
        tempShapeRef.current = null;
      }
      isDrawingRef.current = false;
      startLatLngRef.current = null;
      tempPointsRef.current = [];
      return;
    }

    const map = mapInstanceRef.current;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;

      // 1. POINT TOOL
      if (drawTool === 'point') {
        const shapeId = `shape-${Date.now()}`;
        const newShape: DrawnShape = {
          id: shapeId,
          type: 'point',
          lat: latlng.lat,
          lng: latlng.lng,
          radius: 1000,
        };
        setUserDrawnShapes((prev) => [...prev, newShape]);
        showToast(`Point dropped at ${latlng.lat.toFixed(3)}°N, ${latlng.lng.toFixed(3)}°E`);
        setAiPanelOpen(true);
        const snapshot = buildSpatialSnapshot('point', [latlng.lat, latlng.lng], 'Point Marker Pin', 'نقطة مكانية محددة');
        sendAIMessage(`Analyze drawn Point Marker at ${latlng.lat.toFixed(3)}°N, ${latlng.lng.toFixed(3)}°E`, snapshot);
        return;
      }

      // 2. CIRCLE TOOL (Click 1 sets center, MouseMove expands radius, Click 2 fixes size)
      if (drawTool === 'circle') {
        if (!isDrawingRef.current || !startLatLngRef.current) {
          isDrawingRef.current = true;
          startLatLngRef.current = latlng;
          const tempCircle = L.circle(latlng, {
            radius: 200,
            color: '#176BFF',
            fillColor: '#176BFF',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempCircle;
          showToast('Move cursor to adjust circle radius size, then click to complete');
        } else {
          const center = startLatLngRef.current;
          const radiusMeters = center.distanceTo(latlng);
          const radiusKm = Math.max(0.5, radiusMeters / 1000);

          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
            tempShapeRef.current = null;
          }
          isDrawingRef.current = false;
          startLatLngRef.current = null;

          const shapeId = `shape-${Date.now()}`;
          const newShape: DrawnShape = {
            id: shapeId,
            type: 'circle',
            lat: center.lat,
            lng: center.lng,
            radius: radiusMeters,
          };
          setUserDrawnShapes((prev) => [...prev, newShape]);
          showToast(`Created Circle Buffer: ${radiusKm.toFixed(1)} km radius`);
          setAiPanelOpen(true);
          const snapshot = buildSpatialSnapshot('circle', [center.lat, center.lng], `Circle Buffer (${radiusKm.toFixed(1)} km)`, `نطاق دئري (${radiusKm.toFixed(1)} كم)`, Math.PI * radiusKm * radiusKm, radiusKm);
          sendAIMessage(`Analyze drawn Circle Buffer (${radiusKm.toFixed(1)} km radius)`, snapshot);
        }
        return;
      }

      // 3. RECTANGLE TOOL (Click 1 sets corner 1, MouseMove expands box, Click 2 fixes box)
      if (drawTool === 'rect') {
        if (!isDrawingRef.current || !startLatLngRef.current) {
          isDrawingRef.current = true;
          startLatLngRef.current = latlng;
          const bounds = L.latLngBounds(latlng, latlng);
          const tempRect = L.rectangle(bounds, {
            color: '#10B981',
            fillColor: '#10B981',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempRect;
          showToast('Move cursor to adjust rectangle size, then click to complete');
        } else {
          const p1 = startLatLngRef.current;
          const p2 = latlng;
          const bounds = L.latLngBounds(p1, p2);
          const center = bounds.getCenter();

          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
            tempShapeRef.current = null;
          }
          isDrawingRef.current = false;
          startLatLngRef.current = null;

          const rectBounds: [[number, number], [number, number]] = [
            [bounds.getSouth(), bounds.getWest()],
            [bounds.getNorth(), bounds.getEast()],
          ];

          const shapeId = `shape-${Date.now()}`;
          const newShape: DrawnShape = {
            id: shapeId,
            type: 'rect',
            lat: center.lat,
            lng: center.lng,
            radius: p1.distanceTo(p2) / 2,
            bounds: rectBounds,
          };
          setUserDrawnShapes((prev) => [...prev, newShape]);
          showToast('Created Rectangle Bounding Box');
          setAiPanelOpen(true);
          const snapshot = buildSpatialSnapshot('rect', [center.lat, center.lng], 'Rectangle Box AOI', 'منطقة مستطيلة محددة', 4.8, undefined, rectBounds);
          sendAIMessage(`Analyze drawn Rectangle Bounding Box`, snapshot);
        }
        return;
      }

      // 4. POLYGON TOOL (Click points to add vertices, double click to finish)
      if (drawTool === 'polygon') {
        tempPointsRef.current.push(latlng);
        showToast(`Added vertex ${tempPointsRef.current.length}. Double-click when finished!`);

        if (tempPointsRef.current.length >= 2) {
          if (tempShapeRef.current) {
            tempShapeRef.current.remove();
          }
          const tempPoly = L.polygon(tempPointsRef.current, {
            color: '#8B5CF6',
            fillColor: '#8B5CF6',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '6, 6',
          }).addTo(map);
          tempShapeRef.current = tempPoly;
        }
      }
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!isDrawingRef.current || !startLatLngRef.current) return;
      const latlng = e.latlng;

      if (drawTool === 'circle' && tempShapeRef.current && tempShapeRef.current instanceof L.Circle) {
        const radiusMeters = Math.max(100, startLatLngRef.current.distanceTo(latlng));
        tempShapeRef.current.setRadius(radiusMeters);
      } else if (drawTool === 'rect' && tempShapeRef.current && tempShapeRef.current instanceof L.Rectangle) {
        const bounds = L.latLngBounds(startLatLngRef.current, latlng);
        tempShapeRef.current.setBounds(bounds);
      }
    };

    const handleDblClick = () => {
      if (drawTool === 'polygon' && tempPointsRef.current.length >= 3) {
        const points = [...tempPointsRef.current];
        const latSum = points.reduce((sum, p) => sum + p.lat, 0);
        const lngSum = points.reduce((sum, p) => sum + p.lng, 0);
        const centerLat = latSum / points.length;
        const centerLng = lngSum / points.length;

        if (tempShapeRef.current) {
          tempShapeRef.current.remove();
          tempShapeRef.current = null;
        }
        tempPointsRef.current = [];

        const polygonPoints = points.map((p) => [p.lat, p.lng] as [number, number]);
        const shapeId = `shape-${Date.now()}`;
        const newShape: DrawnShape = {
          id: shapeId,
          type: 'polygon',
          lat: centerLat,
          lng: centerLng,
          radius: 2000,
          points: polygonPoints,
        };
        setUserDrawnShapes((prev) => [...prev, newShape]);
        showToast('Created Polygon Boundary AOI');
        setAiPanelOpen(true);
        const snapshot = buildSpatialSnapshot('polygon', [centerLat, centerLng], 'Polygon Boundary AOI', 'منطقة مضلعة محددة', 4.8, undefined, undefined, polygonPoints);
        sendAIMessage(`Analyze drawn Polygon Boundary AOI`, snapshot);
      }
    };

    map.on('click', handleMapClick);
    map.on('mousemove', handleMouseMove);
    map.on('dblclick', handleDblClick);

    return () => {
      map.off('click', handleMapClick);
      map.off('mousemove', handleMouseMove);
      map.off('dblclick', handleDblClick);
    };
  }, [activeTool, drawTool, setUserDrawnShapes, sendAIMessage, showToast]);


  // Invalidate Leaflet Map Size on AI Panel toggle, panel width change, and window resize
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize({ animate: false });
      const timer1 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize({ animate: false });
      }, 100);
      const timer2 = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize({ animate: false });
      }, 350);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [aiPanelOpen, panelWidth]);

  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative w-full overflow-hidden flex flex-col md:flex-row bg-spatial-canvas ${pureMapMode ? 'h-screen pt-0' : 'h-screen pt-[84px] sm:pt-[88px]'}`}>

      {/* Main Visual Canvas Map */}
      <div className="relative flex-1 min-w-0 h-full w-full overflow-hidden">

        {/* Primary Interactive Map Canvas for All Basemaps (DGE, Streets, Light, Satellite) */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto bg-[#F4F3F0] dark:bg-slate-900"
        />



        {/* Floating Tool Dock */}
        {!pureMapMode && <MapToolbar />}

        {/* Floating Data & Filter Drawer */}
        {!pureMapMode && filterDrawerOpen && (
          <div className="absolute top-16 sm:top-6 left-3 sm:left-[80px] z-[600] w-[calc(100%-24px)] sm:w-72 max-w-xs h-[408px] max-h-[calc(100vh-160px)] glass-level-3 rounded-3xl p-3 sm:p-3.5 shadow-2xl border border-white/80 dark:border-slate-800 animate-slide-in flex flex-col overflow-hidden pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 shrink-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-geovision-blue" />
                GIS Categories
              </h3>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <SmartFilterPanel />
          </div>
        )}

        {/* Active Floating Tool Panels */}
        {!pureMapMode && activeTool === 'basemap' && <BasemapGallery />}
        {!pureMapMode && activeTool === 'legend' && <MapLegend />}
        {!pureMapMode && activeTool === 'buffer' && <BufferTool />}
        {!pureMapMode && activeTool === 'sketch' && <SketchAOITool />}

        {/* Print Modal */}
        {!pureMapMode && <PrintMapModal />}



        {/* Bottom Coordinates & Scale Capsule Status Bar */}
        {!pureMapMode && (
          <div className="hidden sm:block absolute bottom-3 left-16 sm:left-20 rtl:left-auto rtl:right-16 sm:rtl:right-20 z-[600]" ref={coordRef}>
            {coordMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2.5 z-[9999] w-44 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700/90 shadow-2xl shadow-slate-950/20 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                  Coordinate Format
                </div>
                {[
                  { id: 'DD', label: 'DD (Decimal Deg)' },
                  { id: 'DDM', label: 'DDM (Deg Dec Min)' },
                  { id: 'DMS', label: 'DMS (Deg Min Sec)' },
                  { id: 'UTM', label: 'UTM (Grid Proj)' },
                ].map((opt) => {
                  const isSelected = coordFormat === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setCoordFormat(opt.id as any);
                        setCoordMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all shrink-0 ${isSelected
                          ? 'border-2 border-geovision-blue'
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-geovision-blue" />}
                      </div>
                      <span className={`text-xs ${isSelected ? 'font-black text-geovision-blue dark:text-blue-300' : 'font-extrabold text-slate-700 dark:text-slate-300'}`}>
                        {opt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3 glass-level-1 px-4 py-2 rounded-2xl border border-white/70 dark:border-slate-800 text-[11px] font-black text-slate-800 dark:text-slate-200 shadow-lg">
              <button
                type="button"
                onClick={() => setCoordMenuOpen(!coordMenuOpen)}
                className="flex items-center gap-1 font-black text-slate-900 dark:text-white hover:text-geovision-blue dark:hover:text-geovision-blue cursor-pointer"
              >
                <span>{coordFormat}</span>
                <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${coordMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <span className="font-extrabold">{formatCoordinates(mapCenter[0], mapCenter[1], coordFormat)}</span>
              <span className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <span>Scale: 1:{Math.round(250000 / mapZoom)}</span>
            </div>
          </div>
        )}

      </div>

      {/* Right Side Docked GeoVision AI Panel */}
      {!pureMapMode && (
        <div
          style={{
            width: aiPanelOpen ? `${panelWidth}px` : '0px',
            maxWidth: '90vw',
          }}
          className={`transition-all ${isResizing ? 'duration-0 select-none' : 'duration-300'} ${
            aiPanelOpen
              ? 'fixed md:relative inset-x-0 bottom-0 top-auto z-[700] md:z-20 h-[65vh] max-h-[500px] md:max-h-none md:h-full rounded-t-3xl md:rounded-none shadow-2xl border-t md:border-t-0 border-slate-200 dark:border-slate-800'
              : 'w-0 h-0 overflow-hidden hidden'
          } shrink-0`}
        >
          <GeoVisionPanel
            onClose={() => setAiPanelOpen(false)}
            panelWidth={panelWidth}
            setPanelWidth={setPanelWidth}
            onStartResize={handleStartResize}
            isResizing={isResizing}
          />
        </div>
      )}

      {/* AI Panel Toggle Button */}
      {!pureMapMode && !aiPanelOpen && (
        <button
          onClick={() => setAiPanelOpen(true)}
          className="absolute bottom-3 sm:bottom-4 right-4 rtl:right-auto rtl:left-4 z-[600] flex items-center gap-2 px-4 py-2.5 rounded-full bg-geovision-blue text-white shadow-xl shadow-blue-500/35 hover:bg-blue-600 active:scale-95 transition-all cursor-pointer border border-white/30 text-xs font-black tracking-tight"
          title="Open GeoVision AI Assistant"
        >
          <img
            src={getAssetUrl('globe-logo.png')}
            alt="GeoVision AI"
            className="w-5 h-5 object-contain shrink-0 filter drop-shadow-xs"
          />
          <span>{language === 'ar' ? 'مساعد GeoVision AI' : 'GeoVision AI'}</span>
        </button>
      )}

    </div>
  );
};
