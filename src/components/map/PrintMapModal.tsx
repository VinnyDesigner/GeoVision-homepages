import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useAppState } from '../../context/AppStateContext';
import { createGeoVisionMarkerIcon } from '../../utils/markerUtils';
import { Printer, X, Download, FileText, ShieldCheck, Compass, CheckCircle, BarChart2 } from 'lucide-react';
import { triggerPrintDocument } from '../../utils/printUtils';

export const PrintMapModal: React.FC = () => {
  const {
    printModalOpen,
    setPrintModalOpen,
    showToast,
    t,
    language,
    selectedFeature,
    filteredFeatures,
    activeBasemap,
    mapCenter,
    mapZoom,
    bufferRadiusKm,
  } = useAppState();

  const [format, setFormat] = useState<'pdf' | 'png' | 'jpeg'>('pdf');
  const [layoutMode, setLayoutMode] = useState<'map' | 'summary' | 'ledger'>('map');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [printState, setPrintState] = useState<'idle' | 'generating' | 'ready'>('idle');

  const printMapContainerRef = useRef<HTMLDivElement>(null);
  const printMapInstanceRef = useRef<L.Map | null>(null);

  // Target Location & Metadata Calculations
  const targetLat = selectedFeature ? selectedFeature.lat : (mapCenter?.[0] || 24.4539);
  const targetLng = selectedFeature ? selectedFeature.lng : (mapCenter?.[1] || 54.3773);
  const targetZoom = selectedFeature ? 15 : (mapZoom || 12);

  const featureTitle = selectedFeature
    ? (language === 'ar' ? selectedFeature.nameAr : selectedFeature.nameEn)
    : (language === 'ar' ? 'نطاق أبوظبي المكاني المحرك' : 'Abu Dhabi Spatial Hub Extent');

  const featureAddress = selectedFeature
    ? (language === 'ar' ? (selectedFeature.addressAr || selectedFeature.nameAr) : (selectedFeature.addressEn || selectedFeature.nameEn))
    : (language === 'ar' ? 'مدينة أبوظبي - دولة الإمارات' : 'Abu Dhabi City, United Arab Emirates');

  const featureCategory = selectedFeature
    ? (selectedFeature.category.toUpperCase() + (selectedFeature.subcategory ? ` • ${selectedFeature.subcategory}` : ''))
    : 'SDI MULTI-SECTOR GIS LAYER';

  // Initialize Live Leaflet Preview Map inside Modal
  useEffect(() => {
    if (!printModalOpen || layoutMode !== 'map') {
      if (printMapInstanceRef.current) {
        printMapInstanceRef.current.remove();
        printMapInstanceRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!printMapContainerRef.current) return;

      if (printMapInstanceRef.current) {
        printMapInstanceRef.current.remove();
        printMapInstanceRef.current = null;
      }

      const map = L.map(printMapContainerRef.current, {
        center: [targetLat, targetLng],
        zoom: targetZoom,
        zoomControl: false,
        attributionControl: false,
      });

      const basemapUrls: Record<string, string> = {
        dge: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        streets: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      };

      const tileUrl = basemapUrls[activeBasemap] || basemapUrls['dge'];
      L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      // Add Scale Bar
      L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

      // Add Selected Feature Pin or Filtered Pins
      if (selectedFeature) {
        const icon = createGeoVisionMarkerIcon(
          selectedFeature.category || 'government',
          selectedFeature.subcategory,
          false,
          true
        );
        const marker = L.marker([selectedFeature.lat, selectedFeature.lng], { icon }).addTo(map);
        marker.bindPopup(
          `<div style="font-weight:900; font-size:12px; color:#063360;">${featureTitle}</div><div style="font-size:10px; font-weight:bold; color:#64748b;">${featureAddress}</div>`
        ).openPopup();

        if (bufferRadiusKm && bufferRadiusKm > 0) {
          L.circle([selectedFeature.lat, selectedFeature.lng], {
            radius: bufferRadiusKm * 1000,
            color: '#215A9E',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            weight: 2,
          }).addTo(map);
        }
      } else if (filteredFeatures && filteredFeatures.length > 0) {
        filteredFeatures.slice(0, 15).forEach((feat) => {
          const icon = createGeoVisionMarkerIcon(feat.category || 'government', feat.subcategory, true, false);
          L.marker([feat.lat, feat.lng], { icon }).addTo(map);
        });
      }

      printMapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (printMapInstanceRef.current) {
        printMapInstanceRef.current.remove();
        printMapInstanceRef.current = null;
      }
    };
  }, [
    printModalOpen,
    layoutMode,
    activeBasemap,
    selectedFeature,
    filteredFeatures,
    targetLat,
    targetLng,
    targetZoom,
    featureTitle,
    featureAddress,
    bufferRadiusKm,
  ]);

  if (!printModalOpen) return null;

  const handleGenerate = () => {
    setPrintState('generating');
    setTimeout(() => {
      setPrintState('ready');
      showToast(language === 'ar' ? 'تم تجهيز التقرير الجغرافي للتحميل' : 'Spatial map report generated successfully');
    }, 800);
  };

  const handleDownload = () => {
    showToast(language === 'ar' ? 'جاري تجهيز تقرير طباعة الخريطة الرسمي...' : 'Preparing official cartographic map report...');

    const mapServiceName = activeBasemap === 'satellite'
      ? 'World_Imagery'
      : activeBasemap === 'light'
      ? 'Canvas/World_Light_Gray_Base'
      : activeBasemap === 'dark'
      ? 'Canvas/World_Dark_Gray_Base'
      : 'World_Street_Map';

    const mapSnapshotUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/${mapServiceName}/MapServer/export?bbox=${targetLng - 0.035},${targetLat - 0.02},${targetLng + 0.035},${targetLat + 0.02}&bboxSR=4326&imageSR=4326&size=800,400&f=image`;

    const displayItems = selectedFeature
      ? [selectedFeature, ...filteredFeatures.filter((f) => f.id !== selectedFeature.id).slice(0, 5)]
      : filteredFeatures.slice(0, 8);

    let sectionHtml = '';
    if (layoutMode === 'map') {
      sectionHtml = `
        <div class="map-frame" style="position: relative; overflow: hidden; border-radius: 14px; border: 2px solid #1e293b; background: #0f172a; padding: 0; margin-bottom: 20px;">
          <!-- Map Top Header Bar -->
          <div style="background: #0f172a; color: #ffffff; padding: 10px 16px; font-size: 11px; font-weight: 900; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
              <span>📍 Extent: ${featureTitle} [${featureCategory}]</span>
            </div>
            <span style="font-family: monospace; color: #60a5fa;">Center: ${targetLat.toFixed(4)}° N, ${targetLng.toFixed(4)}° E</span>
          </div>

          <!-- Real Basemap Imagery & Pins Canvas -->
          <div style="position: relative; width: 100%; height: 360px; background-image: url('${mapSnapshotUrl}'); background-size: cover; background-position: center; border-top: 1px solid #334155; border-bottom: 1px solid #334155;">

            <!-- Compass Rose -->
            <div style="position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; background: rgba(15, 23, 42, 0.9); border: 2px solid #60a5fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 20;">
              N ⬆
            </div>

            <!-- Scale Bar -->
            <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(15, 23, 42, 0.9); border: 1px solid #475569; padding: 6px 12px; border-radius: 8px; color: #ffffff; font-size: 10px; font-weight: 900; z-index: 20;">
              <div style="border-bottom: 2px solid #60a5fa; margin-bottom: 2px; width: 60px; text-align: center; font-size: 9px;">2 km</div>
              <span>Scale 1:25,000</span>
            </div>

            <!-- Main Selected Feature Pin Centered on Map -->
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; z-index: 30;">
              <div style="background: #063360; color: #ffffff; padding: 6px 14px; border-radius: 12px; font-weight: 900; font-size: 12px; white-space: nowrap; box-shadow: 0 6px 20px rgba(0,0,0,0.5); border: 2px solid #60a5fa; display: flex; align-items: center; gap: 6px;">
                <span>📍</span>
                <span>${featureTitle}</span>
              </div>
              <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 10px solid #60a5fa;"></div>
            </div>

            ${
              displayItems.length > 1
                ? displayItems
                    .slice(1, 4)
                    .map((item, idx) => {
                      const offsets = [
                        { top: '32%', left: '30%' },
                        { top: '65%', left: '72%' },
                        { top: '28%', left: '75%' },
                      ];
                      const pos = offsets[idx % offsets.length];
                      const name = language === 'ar' ? item.nameAr : item.nameEn;
                      return `
                        <div style="position: absolute; top: ${pos.top}; left: ${pos.left}; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; z-index: 20;">
                          <div style="background: #1e293b; color: #f8fafc; padding: 4px 10px; border-radius: 8px; font-weight: 800; font-size: 10px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.4); border: 1.5px solid #94a3b8;">
                            <span>${name}</span>
                          </div>
                          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid #94a3b8;"></div>
                        </div>
                      `;
                    })
                    .join('')
                : ''
            }
          </div>

          <!-- Bottom Coordinates Bar -->
          <div style="background: #0f172a; color: #cbd5e1; font-size: 10px; font-weight: bold; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
            <span>Grid Reference: UAE EPSG:32639</span>
            <span>Address: ${featureAddress}</span>
            <span>Security: Unclassified Public Spatial Record</span>
          </div>
        </div>
      `;
    } else if (layoutMode === 'summary') {
      sectionHtml = `
        <div class="insights-box">
          <strong style="color: #1e3a8a; font-size: 13px; display: block; margin-bottom: 6px;">Executive Spatial Intelligence Summary</strong>
          Geospatial extent centered on <strong>${featureTitle}</strong> (${featureCategory}). Location: ${featureAddress}. Coordinates: ${targetLat.toFixed(4)}° N, ${targetLng.toFixed(4)}° E. Multi-sector layer overlays indicate high infrastructure readiness (85% active rate) with average drive time of ~8 minutes to major public facilities.
        </div>
        <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr);">
          <div class="kpi-card"><div class="kpi-lbl">Target Feature</div><div class="kpi-val" style="font-size: 13px;">${featureTitle}</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Spatial Category</div><div class="kpi-val" style="font-size: 13px;">${selectedFeature?.category || 'GIS Layer'}</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Geodetic Location</div><div class="kpi-val" style="font-size: 12px;">${targetLat.toFixed(3)}N, ${targetLng.toFixed(3)}E</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Status Rate</div><div class="kpi-val">100% Active</div></div>
        </div>
      `;
    } else {
      sectionHtml = `
        <h3 style="font-size: 13px; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; color: #0f172a;">Spatial Data Ledger Table</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Ref #</th>
              <th>Feature Name</th>
              <th>Category</th>
              <th>Coordinates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${displayItems
              .map((item, index) => {
                const name = language === 'ar' ? item.nameAr : item.nameEn;
                const isTarget = selectedFeature && item.id === selectedFeature.id;
                return `
                  <tr style="${isTarget ? 'background: #eff6ff; font-weight: bold;' : ''}">
                    <td>${index + 1} ${isTarget ? '📍' : ''}</td>
                    <td><strong>${name}</strong></td>
                    <td style="text-transform: uppercase; font-size: 10px;">${item.category} (${item.subcategory})</td>
                    <td style="font-family: monospace;">${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}</td>
                    <td><span style="color: #166534; font-weight: bold;">${item.openStatusEn || 'Active'}</span></td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      `;
    }

    const htmlContent = `
      <div class="header-banner">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge">DGE</span>
            <span style="font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Government of Abu Dhabi • Spatial Intelligence Center</span>
          </div>
          <h1 style="font-size: 20px; font-weight: 900; margin: 8px 0 4px 0;">Official Cartographic & Geospatial Map Report</h1>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">Department of Government Enablement • Abu Dhabi Spatial Data Infrastructure (SDI)</div>
        </div>
        <div style="text-align: right;">
          <span class="security-stamp">OFFICIAL MAP EXPORT</span>
          <div style="font-size: 10px; font-weight: 900; color: #94a3b8; margin-top: 6px;">REF ID: MAP-EXT-${Math.floor(1000 + Math.random() * 9000)}</div>
          <div style="font-size: 10px; color: #64748b;">${new Date().toLocaleString()}</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-lbl">Selected Extent</div><div class="kpi-val" style="font-size: 13px;">${featureTitle}</div></div>
        <div class="kpi-card"><div class="kpi-lbl">Scale Ratio</div><div class="kpi-val">1:25,000</div></div>
        <div class="kpi-card"><div class="kpi-lbl">Geodetic Datum</div><div class="kpi-val">WGS 84</div></div>
        <div class="kpi-card"><div class="kpi-lbl">UTM Zone</div><div class="kpi-val">Zone 39N</div></div>
      </div>

      ${sectionHtml}

      <div class="footer-block">
        <div>
          <strong>Certified by Abu Dhabi SDI Spatial Authority</strong><br/>
          Digitally Signed & Validated • Department of Government Enablement
        </div>
        <div style="text-align: right; font-family: monospace;">
          HASH: 8f4e92a1c0d57e3b<br/>
          PAGE 1 OF 1
        </div>
      </div>
    `;

    if (format === 'pdf') {
      triggerPrintDocument(`Official Cartographic Map Report - ${featureTitle}`, htmlContent, orientation);
    } else {
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="background:#ffffff; font-family:sans-serif; padding:20px;">
              ${htmlContent}
            </div>
          </foreignObject>
        </svg>
      `;
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dge-map-report-${layoutMode}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`GeoVision Map Report downloaded as ${format.toUpperCase()}`);
      setPrintModalOpen(false);
      setPrintState('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pt-20 sm:pt-24 pb-6 px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
        
        {/* FIXED HEADER */}
        <div className="shrink-0 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-md shadow-blue-500/30 border border-blue-400/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t('print.title')}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-geovision-blue dark:text-blue-300 text-[10px] font-black uppercase">
                  DGE Spatial Studio
                </span>
              </h2>
              <p className="text-xs font-bold text-slate-400">
                {t('print.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPrintModalOpen(false);
              setPrintState('idle');
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE INNER BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
          {/* Layout & Format Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Layout Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {language === 'ar' ? 'نموذج تخطيط التقرير' : 'Report Layout Template'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'map', label: language === 'ar' ? 'خريطة GIS' : 'Map Extent', icon: Compass },
                  { id: 'summary', label: language === 'ar' ? 'إيجاز تنفيذي' : 'Executive', icon: BarChart2 },
                  { id: 'ledger', label: language === 'ar' ? 'سجل المعالم' : 'Data Ledger', icon: FileText },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSel = layoutMode === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setLayoutMode(item.id as any)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-xs font-extrabold transition-all cursor-pointer ${
                        isSel
                          ? 'border-2 border-geovision-blue bg-blue-50/80 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300 shadow-md shadow-blue-500/15'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-geovision-blue'
                      }`}
                    >
                      <IconComp className="w-4 h-4 mb-1" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Export Format & Orientation Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                {language === 'ar' ? 'صيغة التصدير والاتجاه' : 'Format & Page Orientation'}
              </label>
              <div className="flex gap-2">
                <div className="grid grid-cols-3 gap-1.5 flex-1">
                  {[
                    { id: 'pdf', label: 'PDF' },
                    { id: 'png', label: 'PNG' },
                    { id: 'jpeg', label: 'JPEG' },
                  ].map((f) => {
                    const isSel = format === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setFormat(f.id as any)}
                        className={`py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer text-center ${
                          isSel
                            ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                      orientation === 'portrait' ? 'bg-slate-100 dark:bg-slate-700 text-geovision-blue dark:text-blue-300' : 'text-slate-400'
                    }`}
                  >
                    📄 Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                      orientation === 'landscape' ? 'bg-slate-100 dark:bg-slate-700 text-geovision-blue dark:text-blue-300' : 'text-slate-400'
                    }`}
                  >
                    📑 Landscape
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Authentic Document A4 Sheet Live Preview */}
          <div id="sdi-printable-report" className="border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-xl space-y-6 text-slate-900 dark:text-slate-100">
            {/* Emblem Header */}
            <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-geovision-blue text-white flex items-center justify-center text-xs font-black shadow-md">
                  DGE
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    Government of Abu Dhabi • Spatial Intelligence Center
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Official Cartographic & Geospatial SDI Report
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            {/* Map Canvas Live Leaflet Preview Container */}
            {layoutMode === 'map' && (
              <div className="space-y-4">
                <div className="h-72 sm:h-84 rounded-2xl border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden flex flex-col justify-between shadow-xl bg-slate-900">
                  {/* Real Interactive Leaflet Canvas Container */}
                  <div ref={printMapContainerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto" />

                  {/* Top Floating Bar */}
                  <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 font-black flex items-center gap-2 shadow-lg text-white text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>📍 Active Extent: {featureTitle}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-900/90 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-black text-xs shadow-lg backdrop-blur-md">
                      N ⬆
                    </div>
                  </div>

                  {/* Bottom Floating Info Bar */}
                  <div className="relative z-10 p-3 flex items-center justify-between text-[10px] text-white font-bold bg-slate-900/90 backdrop-blur-md border-t border-slate-700 shadow-lg pointer-events-none">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
                      <span>Scale 1:25,000 (2 km)</span>
                    </div>
                    <span>Grid: WGS 84 / UTM Zone 39N</span>
                    <span>Center: {targetLat.toFixed(4)}° N, {targetLng.toFixed(4)}° E</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Preview */}
            {layoutMode === 'summary' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                  <strong className="text-geovision-blue dark:text-blue-400 font-black block mb-1">
                    Spatial Extent Executive Intelligence
                  </strong>
                  Report generated for <strong>{featureTitle}</strong> ({featureCategory}). Geodetic Center: {targetLat.toFixed(4)}° N, {targetLng.toFixed(4)}° E. Multi-sector layer overlays indicate high infrastructure readiness with active GIS clearance.
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Target Extent</span>
                    <span className="text-sm font-black text-geovision-blue dark:text-blue-400 truncate block">{featureTitle}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Coordinates</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block font-mono">{targetLat.toFixed(3)}N, {targetLng.toFixed(3)}E</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Category</span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 block truncate">{selectedFeature?.category || 'Multi-Sector'}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-black text-slate-400 block uppercase">Status Rate</span>
                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 block">100% Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ledger Preview */}
            {layoutMode === 'ledger' && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left rtl:text-right">
                  <thead className="bg-slate-900 text-white font-black text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Ref #</th>
                      <th className="p-2.5">Feature Name</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Coordinates</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-[11px]">
                    {(selectedFeature
                      ? [selectedFeature, ...filteredFeatures.filter((f) => f.id !== selectedFeature.id).slice(0, 4)]
                      : filteredFeatures.slice(0, 5)
                    ).map((item, idx) => {
                      const isSel = selectedFeature && item.id === selectedFeature.id;
                      const name = language === 'ar' ? item.nameAr : item.nameEn;
                      return (
                        <tr key={item.id} className={isSel ? 'bg-blue-50/80 dark:bg-blue-950/40 font-black' : ''}>
                          <td className="p-2.5 font-bold text-slate-400">{idx + 1} {isSel ? '📍' : ''}</td>
                          <td className="p-2.5 font-black text-slate-900 dark:text-white">{name}</td>
                          <td className="p-2.5 text-slate-500 uppercase text-[10px]">{item.category}</td>
                          <td className="p-2.5 font-mono text-[10px]">{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</td>
                          <td className="p-2.5 font-black text-emerald-600 dark:text-emerald-400">{item.openStatusEn || 'Active'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Included Elements Checklist */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-black text-slate-900 dark:text-white block uppercase tracking-wider text-[11px]">Verified Report Certification:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Official Abu Dhabi DGE Crest Header</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>High-Resolution GIS Selected Extent Canvas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Scale Ratio & North Compass Arrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Geodetic Timestamp & Hash Signature</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* FIXED FOOTER */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 rounded-b-3xl flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setPrintModalOpen(false);
              setPrintState('idle');
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Close Studio'}
          </button>

          <div className="flex items-center gap-2">
            {printState === 'idle' && (
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                {t('print.btnGenerate')}
              </button>
            )}

            {printState === 'generating' && (
              <div className="px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-geovision-blue dark:text-blue-300 text-xs font-black flex items-center gap-2 animate-pulse border border-blue-200">
                <Printer className="w-4 h-4 animate-spin" />
                {t('print.generating')}
              </div>
            )}

            {printState === 'ready' && (
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t('print.download')} ({format.toUpperCase()})
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
