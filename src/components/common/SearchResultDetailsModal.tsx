import React, { useState, useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';
import type { GeoFeature } from '../../types';
import { GEO_FEATURES } from '../../data/mockAbuDhabiData';
import {
  X,
  MapPin,
  Building,
  Navigation,
  ExternalLink,
  Bookmark,
  Share2,
  Clock,
  Phone,
  Sparkles,
  Compass,
  FileText,
  ShieldCheck,
  Info,
  ChevronRight,
  Sliders,
  Car,
  Footprints,
  Sprout,
  Bus,
  Zap,
  Pill,
  Leaf,
  Shield,
  Landmark,
  Trees,
  GraduationCap,
  Building2,
} from 'lucide-react';

export interface SearchResultDetailsModalProps {
  feature?: GeoFeature | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export type DetailTab = 'overview' | 'nearby' | 'details' | 'related';

// Haversine distance calculation in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const SearchResultDetailsModal: React.FC<SearchResultDetailsModalProps> = ({
  feature: propFeature,
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const appState = useAppState();
  const language = appState.language;

  // Determine active feature & modal open status
  const currentFeature = propFeature !== undefined ? propFeature : appState.detailsModalFeature;
  const isModalOpen = propIsOpen !== undefined ? propIsOpen : appState.detailsModalOpen;
  const handleClose = propOnClose || appState.closeDetailsModal;

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(3);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isModalOpen || !currentFeature) return null;

  const color = '#215A9E';
  const name = language === 'ar' ? currentFeature.nameAr : currentFeature.nameEn;
  const address = language === 'ar' ? currentFeature.addressAr : currentFeature.addressEn;
  const isFav = appState.isFavorite(currentFeature.nameEn);
  const isPriv = currentFeature.nameEn.toLowerCase().includes('private') || currentFeature.nameEn.toLowerCase().includes('clinic');

  // Compute Nearby Features within radius
  const nearbyFeatures = useMemo(() => {
    return GEO_FEATURES.filter((f) => f.id !== currentFeature.id)
      .map((f) => {
        const dist = calculateDistance(currentFeature.lat, currentFeature.lng, f.lat, f.lng);
        return { ...f, calculatedDist: dist };
      })
      .filter((f) => f.calculatedDist <= nearbyRadiusKm)
      .sort((a, b) => a.calculatedDist - b.calculatedDist);
  }, [currentFeature, nearbyRadiusKm]);

  const handleShare = () => {
    const text = `${currentFeature.nameEn} - Abu Dhabi GeoVision SDI: https://geovision.ad.gov.ae/poi/${currentFeature.id}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    appState.showToast(language === 'ar' ? 'تم نسخ الرابط المكاني' : 'Spatial result link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div
          className="relative px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-4 text-white overflow-hidden shrink-0"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, #1e293b 100%)`,
          }}
        >
          {/* Subtle Background Pattern Accent */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-white shrink-0 mt-0.5 shadow-lg">
              {(() => {
                const sub = (currentFeature.subcategory || '').toLowerCase();
                const cat = (currentFeature.category || '').toLowerCase();
                const nm = (currentFeature.nameEn || '').toLowerCase();
                if (sub.includes('nurser') || nm.includes('nursery') || currentFeature.nameAr?.includes('مشتل')) return <Sprout className="w-6 h-6" />;
                if (sub.includes('charging') || sub.includes('ev_') || nm.includes('ev ')) return <Zap className="w-6 h-6" />;
                if (sub.includes('pharm') || nm.includes('pharmacy') || currentFeature.nameAr?.includes('صيدلية')) return <Pill className="w-6 h-6" />;
                if (sub.includes('tamm') || nm.includes('tamm')) return <ShieldCheck className="w-6 h-6" />;
                if (cat.includes('safety') || sub.includes('police') || sub.includes('civil')) return <Shield className="w-6 h-6" />;
                if (cat.includes('tour') || sub.includes('museum') || sub.includes('heritage')) return <Landmark className="w-6 h-6" />;
                if (cat.includes('env') || sub.includes('reserve') || sub.includes('mangrove')) return <Leaf className="w-6 h-6" />;
                if (cat.includes('trans') || sub.includes('bus')) return <Bus className="w-6 h-6" />;
                if (cat.includes('edu') || sub.includes('school')) return <GraduationCap className="w-6 h-6" />;
                if (cat.includes('park') || sub.includes('park')) return <Trees className="w-6 h-6" />;
                if (cat.includes('health') || sub.includes('hosp')) return <Building2 className="w-6 h-6" />;
                return <Building className="w-6 h-6" />;
              })()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  {currentFeature.category.toUpperCase()} • {currentFeature.subcategory.toUpperCase()}
                </span>

                {currentFeature.isAuthoritative && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/80 text-white flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{language === 'ar' ? 'موثوق SDI' : 'Verified SDI'}</span>
                  </span>
                )}

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isPriv ? 'bg-slate-700/80 text-white' : 'bg-blue-600/80 text-white'
                  }`}
                >
                  {isPriv ? (language === 'ar' ? 'خاص' : 'Private') : (language === 'ar' ? 'عام' : 'Public')}
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white leading-snug drop-shadow-sm truncate">
                {name}
              </h2>
              <p className="text-xs text-white/80 font-medium flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-white/90" />
                <span>{address}</span>
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                if (appState.user?.isGuest) {
                  appState.setGuestPromptOpen(true);
                  return;
                }
                if (isFav) {
                  const item = appState.favorites.find((f) => f.nameEn === currentFeature.nameEn);
                  if (item) appState.removeFavorite(item.id);
                } else {
                  appState.addFavorite({
                    nameEn: currentFeature.nameEn,
                    nameAr: currentFeature.nameAr,
                    categoryEn: currentFeature.category,
                    categoryAr: currentFeature.category,
                    lat: currentFeature.lat,
                    lng: currentFeature.lng,
                    type: 'location',
                  });
                }
              }}
              className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer ${
                isFav
                  ? 'bg-geovision-blue text-white border-blue-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={isFav ? 'Remove Favorite' : 'Save Favorite'}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={copiedLink ? 'Copied!' : 'Share Link'}
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-600 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Tabs Navigation Bar */}
        <div className="px-4 pt-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-geovision-blue text-geovision-blue dark:text-white bg-white dark:bg-slate-800 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Info className="w-4 h-4 text-geovision-blue dark:text-white" />
            <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('nearby')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'nearby'
                ? 'border-geovision-blue text-geovision-blue dark:text-white bg-white dark:bg-slate-800 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-geovision-blue dark:text-white" />
            <span>{language === 'ar' ? 'المرافق القريبة' : 'Nearby'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-blue-100 dark:bg-slate-800 text-geovision-blue dark:text-white font-extrabold">
              {nearbyFeatures.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === 'details'
                ? 'border-geovision-blue text-geovision-blue dark:text-white bg-white dark:bg-slate-800 shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 text-geovision-blue dark:text-white" />
            <span>{language === 'ar' ? 'التفاصيل والخصائص' : 'Details'}</span>
          </button>

        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Executive Spatial Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-geovision-blue dark:text-white uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-geovision-blue dark:text-white" />
                  <span>{language === 'ar' ? 'الملخص المكاني التنفيذي' : 'Executive Spatial Summary'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {language === 'ar'
                    ? `يعتبر ${currentFeature.nameAr} من المرافق الأساسية في إمارة أبوظبي ضمن فئة ${currentFeature.category}. موقع المعلم موثوق مكانياً وفق معايير مركز أبوظبي للنظم والمعلومات، مع إمكانية التحليل المباشر للخدمات المحيطة به ونطاق التغطية.`
                    : `${currentFeature.nameEn} represents a key facility within Abu Dhabi Emirate's ${currentFeature.category} spatial layer. It is fully registered in the Abu Dhabi SDI catalog with verified spatial coordinates, serving local communities with complete accessibility.`}
                </p>
              </div>

              {/* Key Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-geovision-blue dark:text-white flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-geovision-blue dark:text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {language === 'ar' ? 'المسافة من موقعك' : 'Distance'}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {currentFeature.distanceKm || 1.5} km
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {language === 'ar' ? 'حالة التشغيل' : 'Status'}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {currentFeature.openStatusEn || 'Open 24/7'}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-geovision-blue dark:text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-geovision-blue dark:text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {language === 'ar' ? 'تصنيف البيانات' : 'SDI Trust'}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-geovision-blue dark:text-white">
                      {currentFeature.isAuthoritative ? 'Level 1 Verified' : 'Standard SDI'}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-geovision-blue dark:text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-geovision-blue dark:text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {language === 'ar' ? 'الإحداثيات الجغرافية' : 'Coordinates'}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                      {currentFeature.lat.toFixed(3)}, {currentFeature.lng.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Quick Action Buttons */}
              <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات المكانية السريعة' : 'Spatial Quick Actions'}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentFeature.lat},${currentFeature.lng}`;
                      window.open(gmapsUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{language === 'ar' ? 'الاتجاهات عبر خرائط جوجل' : 'Directions on Google Maps'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleClose();
                      appState.setSelectedFeature(currentFeature);
                      appState.setBufferRadiusKm(3);
                      appState.setActiveTool('buffer');
                      appState.setCurrentView('map');
                      appState.showToast(`Applied 3 km spatial buffer around ${currentFeature.nameEn}`);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-geovision-blue hover:bg-[#063360] text-white text-xs font-black transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إنشاء نطاق تحليلي (3 كم)' : 'Create 3 km Buffer Zone'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEARBY */}
          {activeTab === 'nearby' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Distance Radius Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-geovision-blue dark:text-white" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? 'نطاق البحث القريب:' : 'Proximity Radius Filter:'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 5, 10].map((r) => (
                    <button
                      key={r}
                      onClick={() => setNearbyRadiusKm(r)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        nearbyRadiusKm === r
                          ? 'bg-geovision-blue text-white shadow-md'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Nearby Items List */}
              {nearbyFeatures.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-bold">
                  {language === 'ar'
                    ? `لا توجد معالم أو خدمات أخرى ضمن شعاع ${nearbyRadiusKm} كم.`
                    : `No other features found within ${nearbyRadiusKm} km radius.`}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {nearbyFeatures.map((feat) => {
                    const featName = language === 'ar' ? feat.nameAr : feat.nameEn;
                    const driveTime = Math.round(feat.calculatedDist * 2 + 2);
                    const walkTime = Math.round(feat.calculatedDist * 12);

                    return (
                      <div
                        key={feat.id}
                        onClick={() => {
                          appState.openDetailsModal(feat);
                        }}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/90 hover:border-geovision-blue dark:hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-2xs hover:shadow-md"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-geovision-blue flex items-center justify-center font-bold shrink-0 group-hover:bg-geovision-blue group-hover:text-white transition-colors">
                            <Building className="w-4.5 h-4.5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                              {featName}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-semibold truncate mt-0.5">
                              {feat.subcategory} • {feat.addressEn || feat.addressAr}
                            </p>
                          </div>
                        </div>

                        {/* Distances & Durations */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-geovision-blue dark:text-blue-300 font-extrabold text-xs">
                              <MapPin className="w-3 h-3" />
                              <span>{feat.calculatedDist} km</span>
                            </div>
                            <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400 font-bold mt-1">
                              <span className="flex items-center gap-0.5">
                                <Car className="w-3 h-3 text-slate-500" /> ~{driveTime} m
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Footprints className="w-3 h-3 text-slate-500" /> ~{walkTime} m
                              </span>
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-geovision-blue rtl:rotate-180 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Authoritative GIS Attributes Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-geovision-blue" />
                    <span>{language === 'ar' ? 'الخصائص المكانية الموثوقة (SDI Attributes)' : 'Authoritative SDI Attributes Table'}</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-slate-400">EPSG:4326 (WGS84)</span>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/80">
                  <table className="w-full text-xs text-left rtl:text-right">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                        <td className="px-4 py-2.5 font-extrabold text-slate-500 dark:text-slate-400 w-1/3">Feature ID</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white">{currentFeature.id}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-extrabold text-slate-500 dark:text-slate-400">Category / Subcategory</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">{currentFeature.category} / {currentFeature.subcategory}</td>
                      </tr>
                      <tr className="bg-slate-50/60 dark:bg-slate-800/40">
                        <td className="px-4 py-2.5 font-extrabold text-slate-500 dark:text-slate-400">Geographic Coordinates</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white">
                          Lat: {currentFeature.lat} N, Lng: {currentFeature.lng} E
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 font-extrabold text-slate-500 dark:text-slate-400">Grid Projection System</td>
                        <td className="px-4 py-2.5 font-mono font-bold text-slate-900 dark:text-white">UAE National Grid (UTM Zone 39N)</td>
                      </tr>
                      {currentFeature.metadata &&
                        Object.entries(currentFeature.metadata).map(([k, v]) => (
                          <tr key={k} className="bg-slate-50/60 dark:bg-slate-800/40">
                            <td className="px-4 py-2.5 font-extrabold text-slate-500 dark:text-slate-400">{k}</td>
                            <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">{String(v)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weekly Operating Hours & Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Operating Hours Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'ar' ? 'أوقات العمل الرسمية' : 'Official Operating Hours'}</span>
                  </div>

                  <div className="space-y-1.5 text-xs font-bold">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60 last:border-0">
                        <span className="text-slate-500 dark:text-slate-400">{day}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                          {day === 'Friday' ? '08:00 AM - 12:30 PM' : '07:30 AM - 09:00 PM'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Contact Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    <Phone className="w-4 h-4 text-geovision-blue" />
                    <span>{language === 'ar' ? 'معلومات الاتصال الموثوقة' : 'Verified Contact Information'}</span>
                  </div>

                  <div className="space-y-2.5 text-xs font-bold">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600">
                      <span className="text-slate-400">Phone Contact:</span>
                      <a href={`tel:${currentFeature.phone || '+9712800555'}`} className="text-geovision-blue dark:text-blue-400 font-black hover:underline">
                        {currentFeature.phone || '+971 2 800 555'}
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600">
                      <span className="text-slate-400">Official Portal:</span>
                      <a href={currentFeature.website || 'https://ad.gov.ae'} target="_blank" rel="noreferrer" className="text-geovision-blue dark:text-blue-400 font-black hover:underline truncate max-w-[180px]">
                        {currentFeature.website || 'https://ad.gov.ae'}
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600">
                      <span className="text-slate-400">SDI Provider:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-extrabold">Abu Dhabi Digital Authority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{language === 'ar' ? 'بيانات مكانية معتمدة لعام 2026 - أبوظبي' : 'Verified 2026 Spatial SDI Data • Abu Dhabi Government'}</span>
          </div>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-black transition-all cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close Details'}
          </button>
        </div>
      </div>
    </div>
  );
};
