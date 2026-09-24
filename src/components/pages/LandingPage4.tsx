import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Layers,
  Map,
  BarChart3,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const LandingPage4: React.FC = () => {
  const { language, setCurrentView, sendAIMessage } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');

  const isRtl = language === 'ar';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      sendAIMessage(searchQuery.trim());
      setCurrentView('map');
    }
  };

  const handlePillClick = (queryEn: string, queryAr: string) => {
    const q = isRtl ? queryAr : queryEn;
    sendAIMessage(q);
    setCurrentView('map');
  };

  const FILTER_PILLS = [
    {
      id: 'land_use',
      labelEn: 'Land Use',
      labelAr: 'استخدامات الأراضي',
      queryEn: 'Show land use and zoning in Abu Dhabi',
      queryAr: 'عرض استخدامات الأراضي والمخطط الرئيسي في أبوظبي',
    },
    {
      id: 'buildings',
      labelEn: 'Buildings',
      labelAr: 'المباني',
      queryEn: 'Show prominent buildings and government facilities in Abu Dhabi',
      queryAr: 'عرض المباني البارزة والمرافق الحكومية في أبوظبي',
    },
    {
      id: 'road_network',
      labelEn: 'Road Network',
      labelAr: 'شبكة الطرق',
      queryEn: 'Show major road network and transit corridors in Abu Dhabi',
      queryAr: 'عرض شبكة الطرق الرئيسية ومسارات النقل في أبوظبي',
    },
    {
      id: 'admin_boundaries',
      labelEn: 'Administrative Boundaries',
      labelAr: 'الحدود الإدارية',
      queryEn: 'Show administrative boundaries and districts in Abu Dhabi',
      queryAr: 'عرض الحدود الإدارية والقطاعات والمناطق في أبوظبي',
    },
    {
      id: 'environment',
      labelEn: 'Environment',
      labelAr: 'البيئة',
      queryEn: 'Show environmental reserves, protected habitats and green spaces in Abu Dhabi',
      queryAr: 'عرض المحميات الطبيعية والبيئية والمساحات الخضراء في أبوظبي',
    },
  ];

  const ACTION_CARDS = [
    {
      id: 'explore_data',
      titleEn: 'Explore Data',
      titleAr: 'استكشاف البيانات',
      descEn: 'Access authoritative geospatial datasets and layers.',
      descAr: 'الوصول إلى مجموعات البيانات والطبقات المكانية الموثوقة.',
      icon: Layers,
      iconBg: 'bg-indigo-500/25 border border-indigo-300/40 text-indigo-200 shadow-[0_0_16px_rgba(99,102,241,0.35)] backdrop-blur-md',
      action: () => setCurrentView('categories'),
    },
    {
      id: 'interactive_map',
      titleEn: 'Interactive Map',
      titleAr: 'الخريطة التفاعلية',
      descEn: 'Visualize and explore Abu Dhabi spatial data.',
      descAr: 'استعرض واستكشف البيانات المكانية لإمارة أبوظبي.',
      icon: Map,
      iconBg: 'bg-emerald-500/25 border border-emerald-300/40 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.35)] backdrop-blur-md',
      action: () => setCurrentView('map'),
    },
    {
      id: 'analyze_insights',
      titleEn: 'Analyze Insights',
      titleAr: 'تحليل الرؤى',
      descEn: 'Generate insights when you need them.',
      descAr: 'توليد الرؤى والتحليلات المكانية عند الحاجة إليها.',
      icon: BarChart3,
      iconBg: 'bg-purple-500/25 border border-purple-300/40 text-purple-200 shadow-[0_0_16px_rgba(168,85,247,0.35)] backdrop-blur-md',
      action: () => {
        sendAIMessage(isRtl ? 'تحليل التوزيع المكاني والمرافق في أبوظبي' : 'Analyze spatial distribution and facilities across Abu Dhabi');
        setCurrentView('map');
      },
    },
    {
      id: 'build_plan',
      titleEn: 'Build & Plan',
      titleAr: 'البناء والتخطيط',
      descEn: 'Support smarter decisions with trusted geospatial data.',
      descAr: 'دعم القرارات الذكية ببيانات مكانية موثوقة ومحدثة.',
      icon: LayoutGrid,
      iconBg: 'bg-amber-500/25 border border-amber-300/40 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.35)] backdrop-blur-md',
      action: () => {
        sendAIMessage(isRtl ? 'عرض المخطط العمراني ومشاريع التطوير في أبوظبي' : 'Show urban development projects and planning masterplan in Abu Dhabi');
        setCurrentView('map');
      },
    },
  ];

  return (
    <div className="relative w-full min-h-screen pt-24 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-between overflow-y-auto overflow-x-hidden">
      
      {/* Background Image Layer - using public/newbg.jpg for BOTH light and dark themes */}
      <img
        src={getAssetUrl('newbg.jpg')}
        alt="GeoVision Abu Dhabi Spatial Intelligence"
        className="absolute inset-0 w-full h-full object-cover object-right lg:object-center pointer-events-none z-0"
      />

      {/* Elegant Left-Side Vignette/Scrim to ensure 100% crisp typography without interfering with the skyline */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-r from-[#021327]/85 via-[#021327]/55 to-transparent pointer-events-none z-0 rtl:left-auto rtl:right-0 rtl:bg-gradient-to-l" />

      {/* Mobile Ambient Scrim */}
      <div className="absolute inset-0 bg-[#021327]/40 sm:hidden pointer-events-none z-0" />

      {/* Main Hero & Search Launchpad Section */}
      <div className="relative z-10 w-full max-w-4xl text-left rtl:text-right my-auto space-y-4 sm:space-y-5">
        
        {/* GeoVision Brand Title with Smooth Morphing Animated Map Pointer for 'o' */}
        <div className="inline-flex items-center select-none pt-1">
          <div className="flex items-baseline text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black font-sans leading-none tracking-tight">
            {/* 'Ge' */}
            <span className="text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              Ge
            </span>

            {/* Morphing 'o' <-> Map Pointer with Exact Font Glyph Baseline & X-Height Alignment */}
            <span className="relative inline-block select-none -mx-[0.02em] shrink-0 self-baseline">
              {/* Invisible ghost 'o' matches font's exact x-height, baseline, and width */}
              <span className="invisible select-none pointer-events-none" aria-hidden="true">
                o
              </span>

              {/* Overlay SVG matching the ghost 'o' bounding box */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_0_16px_rgba(56,189,248,0.75)]"
                fill="none"
              >
                <defs>
                  <linearGradient id="geoPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="40%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <radialGradient id="geoPulseGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Radar Ground Wave beneath the pin tip */}
                <ellipse cx="50" cy="152" rx="2" ry="1" fill="url(#geoPulseGrad)">
                  <animate
                    attributeName="rx"
                    dur="4s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.32; 0.48; 0.65; 0.75; 1"
                    values="2; 2; 26; 30; 2; 2"
                  />
                  <animate
                    attributeName="ry"
                    dur="4s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.32; 0.48; 0.65; 0.75; 1"
                    values="1; 1; 6; 7; 1; 1"
                  />
                  <animate
                    attributeName="opacity"
                    dur="4s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.32; 0.44; 0.65; 0.75; 1"
                    values="0; 0; 0.95; 0; 0; 0"
                  />
                </ellipse>

                {/* Main Morphing Path: 'O' <---> 'Map Pointer' */}
                <path
                  fill="url(#geoPinGrad)"
                  fillRule="evenodd"
                  d="M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z"
                >
                  <animate
                    attributeName="d"
                    dur="4s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.26; 0.48; 0.70; 0.88; 1"
                    values="
                      M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
                      M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
                      M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 88, 72 126, 50 150 C 28 126, 2 88, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
                      M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 88, 72 126, 50 150 C 28 126, 2 88, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
                      M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z ;
                      M 50 2 C 76.51 2, 98 23.49, 98 50 C 98 76.51, 76.51 98, 50 98 C 23.49 98, 2 76.51, 2 50 C 2 23.49, 23.49 2, 50 2 Z M 50 28 C 62.15 28, 72 37.85, 72 50 C 72 62.15, 62.15 72, 50 72 C 37.85 72, 28 62.15, 28 50 C 28 37.85, 37.85 28, 50 28 Z
                    "
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
                  />
                </path>

                {/* Sparkling pin tip dot highlight */}
                <circle cx="50" cy="150" r="2.5" fill="#FFFFFF">
                  <animate
                    attributeName="opacity"
                    dur="4s"
                    repeatCount="indefinite"
                    keyTimes="0; 0.40; 0.48; 0.68; 0.72; 1"
                    values="0; 0; 1; 0.8; 0; 0"
                  />
                </circle>
              </svg>
            </span>

            {/* 'Vision' */}
            <span className="bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              Vision
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.15rem] font-bold text-white tracking-tight leading-[1.08] select-none drop-shadow-md">
          {isRtl ? (
            <>
              الذكاء المكاني <br />
              لإمارة أبوظبي <br />
              <span className="text-[#4DA3FF] drop-shadow-[0_0_24px_rgba(77,163,255,0.45)]">
                بين يديك
              </span>
            </>
          ) : (
            <>
              Abu Dhabi’s <br />
              Geospatial Intelligence <br />
              <span className="text-[#4DA3FF] drop-shadow-[0_0_24px_rgba(77,163,255,0.45)]">
                at Your Fingertips
              </span>
            </>
          )}
        </h1>

        {/* Description Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl font-normal leading-relaxed drop-shadow-sm">
          {isRtl
            ? 'ابحث واستعرض واكتشف البيانات المكانية الموثوقة لفهم وتخطيط وبناء أبوظبي أكثر ذكاءً.'
            : 'Search, visualize and discover authoritative location data to understand, plan and build a smarter Abu Dhabi.'}
        </p>

        {/* Prominent Frosted Glass Search Bar */}
        <div className="pt-2 w-full max-w-3xl">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full max-w-2xl rounded-full bg-slate-900/40 hover:bg-slate-900/50 backdrop-blur-xl border border-white/30 hover:border-white/50 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] transition-all duration-300 py-1.5 px-3 sm:px-4 pl-4 sm:pl-5 rtl:pl-3 rtl:pr-4 rtl:sm:pr-5"
          >
            {/* Search Icon */}
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 shrink-0" />

            {/* Search Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRtl
                  ? 'ابحث عن الأماكن أو الطبقات أو البيانات أو اطرح سؤالاً...'
                  : 'Search places, layers, data or ask a question...'
              }
              className="w-full bg-transparent border-0 outline-none text-white placeholder:text-white/70 text-sm sm:text-base font-normal px-3 py-2 sm:py-2.5"
            />

            {/* Blue Circular Submit Button with Arrow */}
            <button
              type="submit"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={isRtl ? 'بحث' : 'Search'}
            >
              {isRtl ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Filter Pills Row below Search - Fits on single line on desktop */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handlePillClick(pill.queryEn, pill.queryAr)}
                className="px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-medium text-white/90 bg-slate-900/45 hover:bg-slate-800/70 backdrop-blur-md border border-white/25 hover:border-sky-400/80 hover:text-white transition-all shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
              >
                {isRtl ? pill.labelAr : pill.labelEn}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom 4 Navigation Cards Row */}
      <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 pt-4">
        {ACTION_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className="relative bg-white/15 hover:bg-white/25 dark:bg-slate-900/40 dark:hover:bg-slate-900/55 backdrop-blur-2xl border border-white/30 dark:border-white/20 hover:border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.4),inset_0_1px_2px_0_rgba(255,255,255,0.5)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 select-none"
            >
              {/* Icon & Text Left Column */}
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${card.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug drop-shadow-sm">
                    {isRtl ? card.titleAr : card.titleEn}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 group-hover:text-white font-normal leading-relaxed mt-0.5 line-clamp-2 drop-shadow-xs transition-colors">
                    {isRtl ? card.descAr : card.descEn}
                  </p>
                </div>
              </div>

              {/* Right Chevron Arrow */}
              {isRtl ? (
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white group-hover:-translate-x-1 transition-all shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default LandingPage4;
