import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { GEO_FEATURES } from '../../data/mockAbuDhabiData';
import { ensureAbuDhabiLocation } from '../../utils/locationUtils';
import {
  Compass,
  Pencil,
  Layers,
  List,
  Plus,
  Minus,
  Home,
  Crosshair,
  Navigation,
  MousePointer2,
  Menu,
  ChevronUp,
  Printer,
} from 'lucide-react';

export const MapToolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    filterDrawerOpen,
    setFilterDrawerOpen,
    printModalOpen,
    setPrintModalOpen,
    mapCenter,
    mapZoom,
    setMapCenterAndZoom,
    showToast,
    language,
    selectedFeature,
    setSelectedFeature,
    filteredFeatures,
    userLocation,
    setUserLocation,
  } = useAppState();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleExploreToggle = () => {
    setActiveTool('none');
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleDrawToggle = () => {
    setFilterDrawerOpen(false);
    setActiveTool(activeTool === 'sketch' ? 'none' : 'sketch');
  };

  const handleBasemapToggle = () => {
    setFilterDrawerOpen(false);
    setActiveTool(activeTool === 'basemap' ? 'none' : 'basemap');
  };

  const handleLegendToggle = () => {
    setFilterDrawerOpen(false);
    setActiveTool(activeTool === 'legend' ? 'none' : 'legend');
  };

  const handlePrintToggle = () => {
    setFilterDrawerOpen(false);
    setActiveTool('none');
    setPrintModalOpen(!printModalOpen);
  };

  const handleZoomIn = () => {
    window.dispatchEvent(new CustomEvent('geovision:zoomIn'));
    const nextZoom = Math.min(Math.floor(mapZoom) + 1, 19);
    showToast(language === 'ar' ? `مستوى التكبير: ${nextZoom}` : `Zoom level: ${nextZoom}`);
  };

  const handleZoomOut = () => {
    window.dispatchEvent(new CustomEvent('geovision:zoomOut'));
    const nextZoom = Math.max(Math.ceil(mapZoom) - 1, 3);
    showToast(language === 'ar' ? `مستوى التكبير: ${nextZoom}` : `Zoom level: ${nextZoom}`);
  };

  const handleHomeClick = () => {
    window.dispatchEvent(new CustomEvent('geovision:resetHome'));
    showToast(language === 'ar' ? 'تمت إعادة ضبط الخريطة إلى النطاق الافتراضي لأبوظبي' : 'Map reset to Abu Dhabi default extent');
  };

  const handleLocateClick = () => {
    showToast(language === 'ar' ? 'جاري تحديد موقعك الحالي...' : 'Locating your current position...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const validLoc = ensureAbuDhabiLocation(pos.coords.latitude, pos.coords.longitude);
          setUserLocation(validLoc);
          setMapCenterAndZoom(validLoc, 16);
          window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: validLoc, zoom: 16 } }));
          showToast(language === 'ar' ? 'تم التكبير إلى موقعك الحالي بنجاح' : 'Zoomed to your current location successfully');
        },
        () => {
          const fallback: [number, number] = userLocation
            ? ensureAbuDhabiLocation(userLocation[0], userLocation[1])
            : [24.4539, 54.3773];
          setUserLocation(fallback);
          setMapCenterAndZoom(fallback, 16);
          window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: fallback, zoom: 16 } }));
          showToast(language === 'ar' ? 'تم التكبير إلى موقعك في أبوظبي' : 'Zoomed to your Abu Dhabi location');
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const fallback: [number, number] = userLocation
        ? ensureAbuDhabiLocation(userLocation[0], userLocation[1])
        : [24.4539, 54.3773];
      setUserLocation(fallback);
      setMapCenterAndZoom(fallback, 16);
      window.dispatchEvent(new CustomEvent('geovision:flyTo', { detail: { center: fallback, zoom: 16 } }));
      showToast(language === 'ar' ? 'خدمة تحديد الموقع غير مدعومة' : 'Geolocation is not supported');
    }
  };

  const handleCompassClick = () => {
    setMapCenterAndZoom(mapCenter, mapZoom);
    showToast(language === 'ar' ? 'تم توجيه الخريطة إلى الشمال (0°)' : 'Map orientation set to North (0°)');
  };

  const handleSelectToggle = () => {
    setFilterDrawerOpen(false);
    const nextTool = activeTool === 'identify' ? 'none' : 'identify';
    setActiveTool(nextTool);
    if (nextTool === 'identify') {
      const featToSelect = selectedFeature || (filteredFeatures.length > 0 ? filteredFeatures[0] : GEO_FEATURES[0]);
      if (featToSelect) {
        setSelectedFeature(featToSelect);
      }
      showToast(
        language === 'ar'
          ? 'أداة التحديد نشطة: انقر على أي معلم في الخريطة لمعاينة التفاصيل'
          : 'Select Tool active: Click any feature marker on map to inspect details'
      );
    }
  };

  const isAnyMenuToolActive = filterDrawerOpen || printModalOpen || activeTool !== 'none';

  // High-Contrast Vivid Solid Blue Active Highlight
  const getToolBtnStyle = (isActive: boolean) => {
    return isActive
      ? 'bg-geovision-blue text-white shadow-xl shadow-blue-500/40 scale-105 font-black border border-geovision-blue'
      : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-geovision-blue border border-transparent';
  };

  return (
    <div className="absolute top-4 sm:top-6 left-3 sm:left-4 rtl:left-auto rtl:right-3 sm:rtl:right-4 z-[600] flex flex-col items-center">
      {/* Single Unified Capsule Group */}
      <div className="glass-level-3 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl p-1 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 flex flex-col items-center gap-1 w-12 sm:w-13 transition-all duration-300">
        
        {/* Zoom In (+ icon only) */}
        <button
          onClick={handleZoomIn}
          className="w-full py-1 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title={language === 'ar' ? 'تكبير (+)' : 'Zoom In (+)'}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Zoom Out (- icon only) */}
        <button
          onClick={handleZoomOut}
          className="w-full py-1 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title={language === 'ar' ? 'تصغير (-)' : 'Zoom Out (-)'}
        >
          <Minus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
          title={language === 'ar' ? 'العودة إلى النطاق الرئيسي' : 'Return to Home Extent'}
        >
          <Home className="w-3.5 h-3.5 stroke-[2]" />
          <span className="text-[8px] font-bold tracking-tight leading-none">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* Menu Button Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`relative w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            menuOpen
              ? 'bg-geovision-blue text-white shadow-md font-black border border-geovision-blue'
              : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-geovision-blue border border-transparent'
          }`}
          title={menuOpen ? (language === 'ar' ? 'إغلاق القائمة' : 'Close Menu') : (language === 'ar' ? 'فتح القائمة' : 'Expand Menu')}
        >
          {menuOpen ? (
            <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <Menu className="w-3.5 h-3.5 stroke-[2]" />
          )}
          <span className="text-[8px] font-bold tracking-tight leading-none">{language === 'ar' ? 'القائمة' : 'Menu'}</span>

          {/* Active dot indicator when menu is closed but a tool inside is active */}
          {!menuOpen && isAnyMenuToolActive && (
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-geovision-blue animate-pulse" />
          )}
        </button>

        {/* Expandable Menu Section */}
        {menuOpen && (
          <div className="w-full flex flex-col items-center gap-1 pt-1 border-t border-slate-200/80 dark:border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Explore */}
            <button
              onClick={handleExploreToggle}
              className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
                filterDrawerOpen
              )}`}
              title={language === 'ar' ? 'استكشاف معالم GIS والتصفية' : 'Explore GIS Datasets & Filters'}
            >
              <Compass className="w-4 h-4 stroke-[2]" />
              <span className="text-[8px] font-extrabold tracking-tight leading-none">{language === 'ar' ? 'استكشاف' : 'Explore'}</span>
            </button>

            {/* Draw */}
            <button
              onClick={handleDrawToggle}
              className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
                activeTool === 'sketch'
              )}`}
              title={language === 'ar' ? 'رسم منطقة الاهتمام' : 'Draw AOI Polygon'}
            >
              <Pencil className="w-4 h-4 stroke-[2]" />
              <span className="text-[8px] font-extrabold tracking-tight leading-none">{language === 'ar' ? 'رسم' : 'Draw'}</span>
            </button>

            {/* Basemap */}
            <button
              onClick={handleBasemapToggle}
              className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
                activeTool === 'basemap'
              )}`}
              title={language === 'ar' ? 'تغيير خريطة الأساس' : 'Change Basemap Tiles'}
            >
              <Layers className="w-4 h-4 stroke-[2]" />
              <span className="text-[8px] font-extrabold tracking-tight leading-none">{language === 'ar' ? 'الخريطة' : 'Basemap'}</span>
            </button>

            {/* Legend */}
            <button
              onClick={handleLegendToggle}
              className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
                activeTool === 'legend'
              )}`}
              title={language === 'ar' ? 'عرض مفتاح الخريطة' : 'View Map Legend'}
            >
              <List className="w-4 h-4 stroke-[2]" />
              <span className="text-[8px] font-extrabold tracking-tight leading-none">{language === 'ar' ? 'المفتاح' : 'Legend'}</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrintToggle}
              className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
                printModalOpen
              )}`}
              title={language === 'ar' ? 'طباعة وتصدير الخريطة' : 'Print / Export Map'}
            >
              <Printer className="w-4 h-4 stroke-[2]" />
              <span className="text-[8px] font-extrabold tracking-tight leading-none">{language === 'ar' ? 'طباعة' : 'Print'}</span>
            </button>

            {/* Divider */}
            <div className="w-5 h-px bg-slate-200 dark:bg-slate-700 my-0.5" />

            {/* Locate */}
            <button
              onClick={handleLocateClick}
              className="w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
              title={language === 'ar' ? 'تحديد الموقع الحالي' : 'Locate Current Position'}
            >
              <Crosshair className="w-3.5 h-3.5 stroke-[2]" />
              <span className="text-[8px] font-bold tracking-tight leading-none">{language === 'ar' ? 'تحديد' : 'Locate'}</span>
            </button>

            {/* Compass */}
            <button
              onClick={handleCompassClick}
              className="w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-geovision-blue transition-all cursor-pointer"
              title={language === 'ar' ? 'توجيه الخريطة إلى الشمال' : 'Map Orientation (North)'}
            >
              <Navigation className="w-3.5 h-3.5 stroke-[2]" />
              <span className="text-[8px] font-bold tracking-tight leading-none">{language === 'ar' ? 'البوصلة' : 'Compass'}</span>
            </button>

            {/* Divider */}
            <div className="w-5 h-px bg-slate-200 dark:bg-slate-700 my-0.5" />

            {/* Select */}
            <button
              onClick={handleSelectToggle}
              className={`w-full py-1 px-0.5 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${getToolBtnStyle(
                activeTool === 'identify'
              )}`}
              title={language === 'ar' ? 'تحديد ومعاينة المعالم' : 'Select / Inspect Feature'}
            >
              <MousePointer2 className="w-3.5 h-3.5 stroke-[2]" />
              <span className="text-[8px] font-bold tracking-tight leading-none">{language === 'ar' ? 'تحديد' : 'Select'}</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
