import React, { useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const ArcGISMapView: React.FC = () => {
  const { mapCenter, mapZoom, activeBasemap } = useAppState();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const viewInstanceRef = useRef<any>(null);
  const activeTileLayerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    // Load ArcGIS JS API CSS
    const cssId = 'arcgis-js-api-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://js.arcgis.com/4.30/esri/themes/light/main.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapContainerRef.current || viewInstanceRef.current || !isMounted) return;

      const windowObj = window as any;
      if (!windowObj.require) return;

      windowObj.require(
        ['esri/Map', 'esri/views/MapView', 'esri/layers/TileLayer', 'esri/layers/MapImageLayer'],
        (EsriMap: any, MapView: any, TileLayer: any, MapImageLayer: any) => {
          if (!isMounted || !mapContainerRef.current) return;

          const getLayerForBasemap = (type: string, mapInstance?: any) => {
            if (type === 'satellite') {
              return new TileLayer({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                title: 'ArcGIS Satellite Imagery',
              });
            }
            if (type === 'light') {
              return new TileLayer({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer',
                title: 'ArcGIS Light Gray Canvas',
              });
            }
            if (type === 'streets') {
              return new TileLayer({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
                title: 'ArcGIS World Street Map',
              });
            }
            // Default DGE Color Basemap GCS (Abu Dhabi Official SDI)
            const dgeLayer = new TileLayer({
              url: 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer',
              title: 'DGE Color Basemap GCS',
            });
            const fallbackLayer = new TileLayer({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
              title: 'ArcGIS World Street Map',
            });

            dgeLayer.on('layerview-create-error', () => {
              const targetMap = mapInstance || map;
              if (targetMap && isMounted) {
                try {
                  targetMap.remove(dgeLayer);
                  const dynamicLayer = new MapImageLayer({
                    url: 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer',
                    title: 'DGE Color Basemap GCS Dynamic',
                  });
                  dynamicLayer.on('layerview-create-error', () => {
                    try {
                      targetMap.remove(dynamicLayer);
                      targetMap.add(fallbackLayer, 0);
                    } catch {
                      // ignore
                    }
                  });
                  targetMap.add(dynamicLayer, 0);
                } catch {
                  try {
                    targetMap.add(fallbackLayer, 0);
                  } catch {
                    // ignore
                  }
                }
              }
            });
            return dgeLayer;
          };

          const initialLayer = getLayerForBasemap(activeBasemap);
          activeTileLayerRef.current = initialLayer;

          const map = new EsriMap({
            layers: [initialLayer],
          });

          const view = new MapView({
            container: mapContainerRef.current,
            map: map,
            center: [mapCenter[1], mapCenter[0]], // [Longitude, Latitude]
            zoom: mapZoom,
            ui: {
              components: ['zoom', 'compass'],
            },
          });

          viewInstanceRef.current = view;
        }
      );
    };

    const scriptId = 'arcgis-js-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!(window as any).require) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://js.arcgis.com/4.30/';
        script.onload = () => {
          initMap();
        };
        document.body.appendChild(script);
      } else {
        script.addEventListener('load', initMap);
      }
    } else {
      initMap();
    }

    return () => {
      isMounted = false;
      if (viewInstanceRef.current) {
        try {
          viewInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        viewInstanceRef.current = null;
      }
    };
  }, []);

  // Dynamically update active basemap layer inside ArcGIS JS API
  useEffect(() => {
    if (viewInstanceRef.current && (window as any).require) {
      (window as any).require(['esri/layers/TileLayer', 'esri/layers/MapImageLayer'], (TileLayer: any, MapImageLayer: any) => {
        const map = viewInstanceRef.current.map;
        if (!map) return;

        if (activeTileLayerRef.current) {
          try {
            map.remove(activeTileLayerRef.current);
          } catch {
            // ignore
          }
        }

        let newLayer: any;
        if (activeBasemap === 'satellite') {
          newLayer = new TileLayer({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
            title: 'ArcGIS Satellite Imagery',
          });
        } else if (activeBasemap === 'light') {
          newLayer = new TileLayer({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer',
            title: 'ArcGIS Light Gray Canvas',
          });
        } else if ((activeBasemap as string) === 'streets') {
          newLayer = new TileLayer({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
            title: 'ArcGIS World Street Map',
          });
        } else {
          newLayer = new TileLayer({
            url: 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer',
            title: 'DGE Color Basemap GCS',
          });
          const fallback = new TileLayer({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
            title: 'ArcGIS World Street Map',
          });
          newLayer.on('layerview-create-error', () => {
            try {
              map.remove(newLayer);
              const dynamicLayer = new MapImageLayer({
                url: 'https://arcgis.sdi.abudhabi.ae/agshost/rest/services/Basemap/DGE_Color_Basemap_GCS/MapServer',
                title: 'DGE Color Basemap GCS Dynamic',
              });
              dynamicLayer.on('layerview-create-error', () => {
                try {
                  map.remove(dynamicLayer);
                  map.add(fallback, 0);
                } catch {
                  // ignore
                }
              });
              map.add(dynamicLayer, 0);
            } catch {
              try {
                map.add(fallback, 0);
              } catch {
                // ignore
              }
            }
          });
        }

        activeTileLayerRef.current = newLayer;
        map.add(newLayer, 0);
      });
    }
  }, [activeBasemap]);

  // Sync center and zoom safely
  useEffect(() => {
    const view = viewInstanceRef.current;
    if (view && view.ready) {
      try {
        view.goTo(
          {
            center: [mapCenter[1], mapCenter[0]],
            zoom: mapZoom,
          },
          { animate: false }
        ).catch(() => {
          // ignore async navigation rejections
        });
      } catch {
        // ignore sync navigation errors
      }
    }
  }, [mapCenter, mapZoom]);

  return (
    <div className="relative w-full h-full min-h-screen">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default ArcGISMapView;
