import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Map,
  Layers,
} from 'lucide-react';

/**
 * Determines theme based on system time:
 * - Sunrise (06:00) to Sunset (18:00): 'light'
 * - Sunset (18:00) to Sunrise (06:00): 'dark'
 */
export const getSystemTimeTheme = (): 'light' | 'dark' => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sunriseMinutes = 6 * 60; // 06:00 (6:00 AM)
  const sunsetMinutes = 18 * 60; // 18:00 (6:00 PM)

  return currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes ? 'light' : 'dark';
};

export const LandingPage: React.FC = () => {
  const { language, theme, setTheme, setCurrentView, sendAIMessage } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllExamples, setShowAllExamples] = useState(false);

  // Track if user has manually toggled the theme so the automatic sync doesn't overwrite manual choice
  const hasManualOverrideRef = useRef(false);
  const lastThemeRef = useRef(theme);

  // Sync with system time upon mounting and on periodic check
  useEffect(() => {
    const systemTheme = getSystemTimeTheme();
    if (!hasManualOverrideRef.current && theme !== systemTheme) {
      setTheme(systemTheme);
      lastThemeRef.current = systemTheme;
    } else {
      lastThemeRef.current = theme;
    }

    const intervalId = setInterval(() => {
      if (!hasManualOverrideRef.current) {
        const currentSystemTheme = getSystemTimeTheme();
        if (currentSystemTheme !== lastThemeRef.current) {
          setTheme(currentSystemTheme);
          lastThemeRef.current = currentSystemTheme;
        }
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Detect manual theme toggle (e.g. from the header toggle button)
  useEffect(() => {
    if (theme !== lastThemeRef.current) {
      hasManualOverrideRef.current = true;
      lastThemeRef.current = theme;
    }
  }, [theme]);

  // Set view-home class on root html element for responsive viewport lock
  useEffect(() => {
    document.documentElement.classList.add('view-home');
    return () => {
      document.documentElement.classList.remove('view-home');
    };
  }, []);

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

  const SUGGESTED_QUESTIONS = [
    {
      id: 'parks',
      labelEn: 'Parks near me',
      labelAr: 'الحدائق القريبة مني',
      queryEn: 'Show public parks near me in Abu Dhabi',
      queryAr: 'عرض الحدائق العامة القريبة مني في أبوظبي',
    },
    {
      id: 'schools',
      labelEn: 'Schools near bus stations',
      labelAr: 'المدارس القريبة من محطات الحافلات',
      queryEn: 'Show schools near bus stations in Abu Dhabi',
      queryAr: 'عرض المدارس بالقرب من محطات الحافلات في أبوظبي',
    },
    {
      id: 'hospitals',
      labelEn: 'Hospitals near me',
      labelAr: 'المستشفيات القريبة مني',
      queryEn: 'Find hospitals near me in Abu Dhabi',
      queryAr: 'عرض المستشفيات القريبة مني في أبوظبي',
    },
    {
      id: 'tamm',
      labelEn: 'Where are TAMM centers?',
      labelAr: 'أين توجد مراكز تم؟',
      queryEn: 'Show TAMM customer happiness centers in Abu Dhabi',
      queryAr: 'عرض مراكز تم لخدمة المتعاملين في أبوظبي',
    },
    {
      id: 'charging',
      labelEn: 'EV charging stations',
      labelAr: 'محطات شحن السيارات الكهربائية',
      queryEn: 'Show EV charging stations in Abu Dhabi',
      queryAr: 'عرض محطات شحن المركبات الكهربائية في أبوظبي',
    },
  ];

  const BOTTOM_CARDS = [
    {
      id: 'ask_geovision',
      titleEn: 'Ask GeoVision',
      titleAr: 'اسأل GeoVision',
      descEn: 'Get instant answers about places, services and spatial data.',
      descAr: 'احصل على إجابات فورية حول الأماكن والخدمات والبيانات المكانية.',
      icon: Sparkles,
      iconContainerLight: 'bg-blue-50 border border-blue-200/90 text-blue-600',
      iconContainerDark: 'dark:bg-blue-500/20 dark:border-blue-400/50 dark:text-blue-300 dark:shadow-[0_0_20px_rgba(59,130,246,0.35)]',
      action: () => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        input?.focus();
      },
    },
    {
      id: 'explore_map',
      titleEn: 'Explore Map',
      titleAr: 'استكشف الخريطة',
      descEn: 'Browse, search and analyse data across Abu Dhabi.',
      descAr: 'تصفح وابحث وحلل البيانات في جميع أنحاء أبوظبي.',
      icon: Map,
      iconContainerLight: 'bg-cyan-50 border border-cyan-200/90 text-cyan-600',
      iconContainerDark: 'dark:bg-cyan-500/20 dark:border-cyan-400/50 dark:text-cyan-300 dark:shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      action: () => setCurrentView('map'),
    },
    {
      id: 'discover_data',
      titleEn: 'Discover Data',
      titleAr: 'اكتشف البيانات',
      descEn: 'Find and explore authoritative public datasets.',
      descAr: 'ابحث واستكشف مجموعات البيانات العامة والموثوقة.',
      icon: Layers,
      iconContainerLight: 'bg-emerald-50 border border-emerald-200/90 text-emerald-600',
      iconContainerDark: 'dark:bg-emerald-500/20 dark:border-emerald-400/50 dark:text-emerald-300 dark:shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      action: () => setCurrentView('categories'),
    },
  ];

  return (
    <div className="home-viewport home5-viewport relative w-full h-full min-h-full pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center overflow-hidden">
      
      {/* Background Image Layer - using public/newbg2-dark.jpg for dark theme and newbg2.jpg for light theme */}
      <img
        src={getAssetUrl(theme === 'dark' ? 'newbg2-dark.jpg' : 'newbg2.jpg')}
        alt="GeoVision Abu Dhabi Spatial Intelligence"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
      />

      {/* Clean, natural subtle scrim - Abu Dhabi skyline remains vivid and clear while text remains crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/35 dark:from-[#021327]/55 dark:via-[#021327]/25 dark:to-[#021327]/55 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent dark:from-transparent dark:via-[#021327]/15 dark:to-transparent pointer-events-none z-0" />

      {/* Main Hero & Search Launchpad Section - Centered Layout */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl xl:max-w-5xl mx-auto text-center my-auto flex flex-col items-center">
        
        {/* Top Block: GeoVision Brand Title & Hero Headline — Shifted 15px top */}
        <div
          className="w-full flex flex-col items-center -translate-y-[15px]"
          style={{ transform: 'translateY(-15px)' }}
        >
          {/* GeoVision Brand Title - One Seamless Word with Precision-Aligned Morphing Map Pointer 'o' */}
          <div className="inline-flex items-center justify-center select-none mb-3 sm:mb-4 md:mb-5">
            <div
              className="flex items-baseline text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[3.75rem] font-black font-brand geovision-brand-title leading-none tracking-tight"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
              data-brand="geovision"
            >
              <span className="text-[#0A192F] dark:text-white drop-shadow-xs dark:drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">Ge</span><span
                className="inline-block relative shrink-0"
                style={{
                  width: '0.58em',
                  height: '0.54em',
                  marginLeft: '0.01em',
                  marginRight: '-0.06em',
                  transform: 'translateY(-0.01em)',
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="geoPinGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="40%" stopColor="#00E5FF" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                    <radialGradient id="geoPulseGrad5" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                      <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                    </radialGradient>
                  </defs>

                  {/* Radar Ground Wave beneath the pin tip */}
                  <ellipse cx="50" cy="152" rx="2" ry="1" fill="url(#geoPulseGrad5)">
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
                    fill="url(#geoPinGrad5)"
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
              </span><span className="text-[#0A192F] dark:text-white drop-shadow-xs dark:drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">Vision</span>
            </div>
          </div>

          {/* Hero Headline - Compact, Balanced, Single Consistent Font Color with Deliberate Pause Below */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold text-[#0A192F] dark:text-white tracking-tight leading-tight select-none drop-shadow-xs dark:drop-shadow-md text-center max-w-3xl lg:max-w-4xl mx-auto mb-7 sm:mb-9 md:mb-10 lg:mb-11">
            {isRtl ? (
              <>
                الذكاء المكاني لإمارة أبوظبي <br className="hidden sm:inline" /> بين يديك
              </>
            ) : (
              <>
                Abu Dhabi’s Geospatial Intelligence <br className="hidden sm:inline" /> at Your Fingertips
              </>
            )}
          </h1>
        </div>

        {/* Primary Interaction: Prominent, Centered Frosted Search Bar + Immediate Example Chips — Vertically Centered */}
        <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-3xl xl:max-w-[48rem] mx-auto flex flex-col items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full rounded-full bg-white dark:bg-slate-900/90 hover:dark:bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-white/20 hover:border-blue-400/90 dark:hover:border-sky-400/70 focus-within:border-blue-500 dark:focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-blue-500/15 dark:focus-within:ring-sky-400/25 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_14px_40px_-6px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.12)] transition-all duration-300 py-2 sm:py-2.5 px-3.5 sm:px-4.5 pl-4.5 sm:pl-6 rtl:pl-3.5 rtl:pr-4.5 rtl:sm:pr-6"
          >
            {/* Search Icon */}
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 dark:text-sky-400 shrink-0" />

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
              className="w-full !bg-transparent dark:!bg-transparent border-0 !border-none outline-none !outline-none !shadow-none focus:!shadow-none focus:!ring-0 text-[#0A192F] dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm sm:text-base md:text-[17px] font-normal px-3 sm:px-4 py-2 sm:py-2.5 text-left rtl:text-right"
              style={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}
            />

            {/* Prominent Blue Circular Submit Button with Arrow */}
            <button
              type="submit"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-geovision-blue hover:bg-geovision-blue-dark text-white flex items-center justify-center shrink-0 shadow-md sm:shadow-lg shadow-[#215A9E]/35 hover:shadow-[#215A9E]/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label={isRtl ? 'بحث' : 'Search'}
            >
              {isRtl ? (
                <ArrowLeft className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={2.2} />
              ) : (
                <ArrowRight className="w-5 h-5 sm:w-5.5 sm:h-5.5" strokeWidth={2.2} />
              )}
            </button>
          </form>

          {/* Suggested Questions Chips Row - Fixed layout footprint so section placements never shift */}
          <div className="relative w-full h-8 sm:h-9 mt-3.5 sm:mt-4">
            <div className="absolute top-0 left-0 right-0 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 z-20">
              {(showAllExamples ? SUGGESTED_QUESTIONS : SUGGESTED_QUESTIONS.slice(0, 3)).map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => handlePillClick(pill.queryEn, pill.queryAr)}
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium text-slate-800 hover:text-blue-700 dark:text-white/95 dark:hover:text-white bg-white/95 hover:bg-white dark:bg-slate-900/75 dark:hover:bg-slate-800/90 backdrop-blur-md border border-slate-300/80 hover:border-blue-400 dark:border-white/20 dark:hover:border-sky-400/80 transition-all shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                >
                  {isRtl ? pill.labelAr : pill.labelEn}
                </button>
              ))}

              {SUGGESTED_QUESTIONS.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllExamples((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold text-blue-600 dark:text-sky-300 hover:text-blue-700 dark:hover:text-white bg-blue-50/90 hover:bg-blue-100/90 dark:bg-sky-950/70 dark:hover:bg-sky-900/90 backdrop-blur-md border border-blue-200/90 dark:border-sky-500/30 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                  aria-expanded={showAllExamples}
                >
                  <span>
                    {showAllExamples
                      ? (isRtl ? 'عرض أقل' : 'Less')
                      : (isRtl ? 'المزيد +' : 'More +')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3 Modern Glass Quick-Launch Cards — Shifted 15px down */}
        <div
          className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-9 sm:mt-11 md:mt-13 lg:mt-14 translate-y-[15px]"
          style={{ transform: 'translateY(15px)' }}
        >
        {BOTTOM_CARDS.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className="relative group bg-white/85 hover:bg-white/95 dark:bg-slate-900/55 dark:hover:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/90 hover:border-sky-400/80 dark:border-white/25 dark:hover:border-sky-400/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:shadow-[0_12px_36px_0_rgba(56,189,248,0.15)] dark:hover:shadow-[0_12px_36px_0_rgba(56,189,248,0.2)] rounded-2xl p-3 sm:p-3.5 lg:p-4 flex items-center gap-3 sm:gap-3.5 text-left rtl:text-right cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              {/* Modern Ambient Icon Container - Clear and crisp in both light and dark mode */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${card.iconContainerLight} ${card.iconContainerDark} flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:text-blue-700 dark:group-hover:text-white transition-all duration-300 shrink-0`}
              >
                <IconComp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.2} />
              </div>

              {/* Text Column - Left aligned */}
              <div className="min-w-0 flex-1 text-left rtl:text-right">
                <h3 className="text-sm sm:text-base font-bold text-[#0A192F] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-300 transition-colors leading-snug drop-shadow-xs dark:drop-shadow-sm">
                  {isRtl ? card.titleAr : card.titleEn}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 group-hover:text-slate-800 dark:text-white/75 dark:group-hover:text-white/95 font-medium leading-relaxed mt-0.5 line-clamp-2 transition-colors">
                  {isRtl ? card.descAr : card.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>


      </div>

    </div>
  );
};

export default LandingPage;
