import React, { useState, useEffect, useRef } from 'react';
import { AISearchBar } from '../ai/AISearchBar';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import {
  MapPin,
  GraduationCap,
  BarChart3,
  Building2,
  Trees,
  Bus,
  ShieldCheck,
  Landmark,
  Zap,
  Compass,
  Stethoscope,
  ChevronDown,
  ChevronUp,
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

export const LandingPage2: React.FC = () => {
  const { language, theme, setTheme, setCurrentView, sendAIMessage } = useAppState();

  const [examplesExpanded, setExamplesExpanded] = useState(false);

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

  const EXAMPLE_QUESTIONS = [
    {
      id: 'parks',
      icon: Trees,
      textEn: 'Parks near me',
      textAr: 'الحدائق القريبة مني',
      queryEn: 'Show public parks near me in Abu Dhabi',
      queryAr: 'عرض الحدائق العامة القريبة مني في أبوظبي',
    },
    {
      id: 'schools',
      icon: GraduationCap,
      textEn: 'Schools near bus stations',
      textAr: 'المدارس القريبة من محطات الحافلات',
      queryEn: 'Show schools near bus stations in Abu Dhabi',
      queryAr: 'عرض المدارس بالقرب من محطات الحافلات في أبوظبي',
    },
    {
      id: 'compare',
      icon: BarChart3,
      textEn: 'Compare facilities by district',
      textAr: 'مقارنة المرافق حسب المنطقة',
      queryEn: 'Compare facilities by district in Abu Dhabi',
      queryAr: 'مقارنة المرافق والخدمات حسب القطاع والمنطقة في أبوظبي',
    },
    {
      id: 'tamm',
      icon: Building2,
      textEn: 'TAMM customer centers',
      textAr: 'مراكز تم الحكومية',
      queryEn: 'Show TAMM customer happiness centers in Abu Dhabi',
      queryAr: 'عرض مراكز تم لخدمة المتعاملين في أبوظبي',
    },
    {
      id: 'hospitals',
      icon: MapPin,
      textEn: 'Hospitals near me',
      textAr: 'المستشفيات القريبة مني',
      queryEn: 'Find hospitals near me in Abu Dhabi',
      queryAr: 'عرض المستشفيات القريبة مني في أبوظبي',
    },
    {
      id: 'transit',
      icon: Bus,
      textEn: 'Bus stations & transit hubs',
      textAr: 'محطات الحافلات ومراكز النقل',
      queryEn: 'Show bus stations and transit hubs in Abu Dhabi',
      queryAr: 'عرض محطات الحافلات ومراكز النقل في أبوظبي',
    },
    {
      id: 'safety',
      icon: ShieldCheck,
      textEn: 'Police & civil defense',
      textAr: 'مراكز الشرطة والدفاع المدني',
      queryEn: 'Show police and civil defense stations in Abu Dhabi',
      queryAr: 'عرض مراكز الشرطة والدفاع المدني في أبوظبي',
    },
    {
      id: 'culture',
      icon: Landmark,
      textEn: 'Cultural & heritage sites',
      textAr: 'المعالم الثقافية والتراثية',
      queryEn: 'Show cultural and heritage landmarks in Abu Dhabi',
      queryAr: 'عرض المعالم الثقافية والتراثية في أبوظبي',
    },
    {
      id: 'charging',
      icon: Zap,
      textEn: 'EV charging stations',
      textAr: 'محطات شحن السيارات الكهربائية',
      queryEn: 'Show EV charging stations in Abu Dhabi',
      queryAr: 'عرض محطات شحن المركبات الكهربائية في أبوظبي',
    },
    {
      id: 'nature',
      icon: Compass,
      textEn: 'Mangrove & nature reserves',
      textAr: 'محميات القرم والطبيعة',
      queryEn: 'Show mangrove parks and nature reserves in Abu Dhabi',
      queryAr: 'عرض منتزهات القرم والمحميات الطبيعية في أبوظبي',
    },
    {
      id: 'pharmacy',
      icon: Stethoscope,
      textEn: '24/7 pharmacies',
      textAr: 'صيدليات تعمل 24 ساعة',
      queryEn: 'Show 24/7 pharmacies in Abu Dhabi',
      queryAr: 'عرض الصيدليات التي تعمل 24 ساعة في أبوظبي',
    },
  ];

  const displayedExamples = examplesExpanded ? EXAMPLE_QUESTIONS : EXAMPLE_QUESTIONS.slice(0, 3);

  const handleExampleClick = (queryEn: string, queryAr: string) => {
    const q = language === 'ar' ? queryAr : queryEn;
    sendAIMessage(q);
    setCurrentView('map');
  };

  return (
    <div className="relative w-full min-h-screen pt-20 sm:pt-20 lg:pt-22 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center sm:items-start rtl:sm:items-start justify-between bg-spatial-canvas dark:bg-[#041F3B] overflow-y-auto overflow-x-hidden">
      
      {/* Crisp Homepage Background Image Layer - Home2 variant using im1 and im2 */}
      <img
        src={getAssetUrl(theme === 'dark' ? 'homepage2-bg-dark.jpg' : 'homepage2-bg-light.jpg')}
        alt="GeoVision Abu Dhabi Spatial Canvas"
        className={`absolute inset-0 w-full h-full object-cover object-right sm:object-center transition-all duration-500 pointer-events-none z-0 opacity-100 ${
          language === 'ar' ? '-scale-x-100' : ''
        }`}
      />

      {/* Refined Mobile Ambient Scrim - Soft gradient keeping background photo crisp outside the card */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 dark:from-[#020b18]/60 dark:via-[#041F3B]/30 dark:to-[#020b18]/60 sm:hidden pointer-events-none z-0" />

      {/* Hero & Search Launchpad */}
      <div className="relative z-10 w-full max-w-5xl text-center sm:text-left rtl:sm:text-right space-y-3 sm:space-y-4 my-auto flex flex-col items-center sm:items-start rtl:sm:items-start">
        
        {/* Mobile Frosted Glass Card: Solves overlap with a sleek, translucent glass surface while keeping Abu Dhabi skyline glowing */}
        <div className="w-full max-w-xl mx-auto rounded-3xl p-4 xs:p-5 sm:p-0 bg-white/80 dark:bg-[#041F3B]/80 sm:bg-transparent sm:dark:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border border-white/60 dark:border-white/15 sm:border-0 shadow-2xl sm:shadow-none flex flex-col items-center sm:items-start rtl:sm:items-start space-y-3 sm:space-y-4">
        
        {/* GeoVision Hero Brand Logo with Dynamic Animated Globe & Tagline */}
        <div className="flex flex-col items-center sm:items-start rtl:sm:items-start w-full py-1">
          {/* Main GeoVision Title with Exact Reference Gradient Color Palette */}
          <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-start flex-nowrap text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-sans tracking-tight select-none leading-none min-w-0">
            {/* "Ge" text */}
            <span className="geovision-title-ge relative z-10 shrink-0">
              Ge
            </span>

            {/* Custom UAE Globe Logo - Clean without white shadow */}
            <div className="relative inline-flex items-center justify-center -ml-0.5 sm:-ml-1 md:-ml-1.5 -mr-1.5 sm:-mr-2.5 md:-mr-3 shrink-0 w-[1.08em] h-[1.08em] self-center">
              <img
                src={getAssetUrl('globe-logo.png')}
                alt="GeoVision UAE Globe Logo"
                className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
              />
            </div>

            {/* "Vision" text */}
            <span className="geovision-title-vision shrink-0">
              Vision
            </span>
          </div>

          {/* Tagline Strip in vibrant blue color with white glow blur effect */}
          <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-start gap-1.5 sm:gap-3 w-full max-w-xl sm:max-w-2xl mt-2.5 sm:mt-3 mx-auto sm:mx-0">
            <div
              className="flex-1 h-[2px] rounded-full opacity-90 bg-gradient-to-r from-transparent via-[#012661] to-[#215A9E] dark:via-[#38BDF8] dark:to-[#60A5FA]"
            />
            <span className="shrink-0 text-[10px] xs:text-xs sm:text-xs md:text-sm font-black uppercase tracking-[0.14em] xs:tracking-[0.20em] sm:tracking-[0.28em] text-[#012661] dark:text-[#38BDF8] drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]">
              {language === 'ar' ? 'الذكاء المكاني لغدٍ أكثر ذكاءً' : 'SPATIAL INTELLIGENCE FOR A SMARTER TOMORROW'}
            </span>
            <div
              className="flex-1 h-[2px] rounded-full opacity-90 bg-gradient-to-r from-[#215A9E] via-[#00B3C2] to-transparent dark:from-[#60A5FA] dark:via-[#38BDF8]"
            />
          </div>
        </div>

        {/* Small Elegant Sub-Headline */}
        <h2 className="text-center sm:text-left rtl:sm:text-right text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#063360] dark:text-white tracking-tight drop-shadow-sm mt-1 sm:mt-2 w-full">
          {language === 'ar' ? (
            <>
              استكشف البيانات المكانية في <span className="text-[#215A9E] dark:text-[#38BDF8] font-black underline underline-offset-4 decoration-[#7DA1C4]">أبوظبي</span>
            </>
          ) : (
            <>
              Explore Public Data Across <span className="text-[#215A9E] dark:text-[#38BDF8] font-black underline underline-offset-4 decoration-[#7DA1C4]">Abu Dhabi</span>
            </>
          )}
        </h2>

        {/* Description Subtitle */}
        <p className="text-center sm:text-left rtl:sm:text-right text-xs sm:text-sm text-[#545860] dark:text-slate-200 max-w-2xl font-semibold leading-relaxed drop-shadow-xs mx-auto sm:mx-0">
          {language === 'ar'
            ? 'ابحث عن أسئلة باللغة الطبيعية، واكتشف البيانات المكانية الموثوقة، واستكشف الخرائط التفاعلية في جميع أنحاء الإمارة.'
            : 'Search natural language questions, discover authoritative public datasets, and explore interactive maps across the emirate.'}
        </p>

        {/* Main Glass AI Search Bar - Prominent & Centered */}
        <div className="pt-1 sm:pt-0.5 w-full max-w-2xl sm:max-w-none mx-auto">
          <AISearchBar hideThemes={true} />
        </div>

        {/* Try an example Section with Expandable Options */}
        <div className="w-full space-y-1.5 pt-0.5 flex flex-col items-center sm:items-start rtl:sm:items-start">
          <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-start gap-2 text-xs font-bold text-[#063360] dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <span>{language === 'ar' ? 'جرب مثالاً:' : 'Try an example:'}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-900/60 text-[#215A9E] dark:text-sky-300">
                {examplesExpanded ? EXAMPLE_QUESTIONS.length : `3 of ${EXAMPLE_QUESTIONS.length}`}
              </span>
            </span>
          </div>

          <div className={`flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-start gap-1.5 sm:gap-2 transition-all duration-300 ${
            examplesExpanded ? 'max-h-48 sm:max-h-56 overflow-y-auto pr-1 py-0.5' : ''
          }`}>
            {displayedExamples.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleExampleClick(item.queryEn, item.queryAr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold bg-white/75 dark:bg-slate-900/80 text-[#063360] dark:text-slate-100 border border-sky-200/70 dark:border-slate-700/80 hover:border-[#215A9E] hover:bg-white dark:hover:bg-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                >
                  <IconComp className="w-3.5 h-3.5 text-[#215A9E] dark:text-sky-400 shrink-0" />
                  <span>{language === 'ar' ? item.textAr : item.textEn}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setExamplesExpanded(prev => !prev)}
              className="inline-flex items-center gap-1 px-3 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold text-[#215A9E] dark:text-sky-300 bg-sky-50/80 dark:bg-sky-950/60 border border-dashed border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/80 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              {examplesExpanded ? (
                <>
                  <span>{language === 'ar' ? 'عرض أقل' : 'Show less'}</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>{language === 'ar' ? `المزيد (${EXAMPLE_QUESTIONS.length - 3}+)...` : `More (${EXAMPLE_QUESTIONS.length - 3}+)...`}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
        </div>

        {/* 3 Main Quick-Launch Cards Row (Compact 3-column launcher on mobile to save vertical space, full cards on desktop) */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-1.5">
          
          {/* Card 1: Ask GeoVision */}
          <div
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              input?.focus();
            }}
            className="relative glass-panel rounded-xl sm:rounded-3xl p-2 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right min-h-[58px] sm:min-h-[92px] bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-white/70 dark:border-white/10 shadow-xs hover:shadow-md cursor-pointer select-none transition-all active:scale-[0.98]"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 w-full">
              <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h3 className="text-[11px] xs:text-xs sm:text-base font-extrabold text-[#063360] dark:text-white leading-tight">
                  {language === 'ar' ? 'اسأل GeoVision' : 'Ask GeoVision'}
                </h3>
                <p className="hidden md:block text-[11px] sm:text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug">
                  {language === 'ar'
                    ? 'احصل على إجابات فورية للأماكن والخدمات والبيانات المكانية.'
                    : 'Get instant answers about places, services and spatial data.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Explore Map */}
          <div
            onClick={() => setCurrentView('map')}
            className="relative glass-panel rounded-xl sm:rounded-3xl p-2 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right min-h-[58px] sm:min-h-[92px] bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-white/70 dark:border-white/10 shadow-xs hover:shadow-md cursor-pointer select-none transition-all active:scale-[0.98]"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 w-full">
              <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Map className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h3 className="text-[11px] xs:text-xs sm:text-base font-extrabold text-[#063360] dark:text-white leading-tight">
                  {language === 'ar' ? 'استكشاف الخريطة' : 'Explore Map'}
                </h3>
                <p className="hidden md:block text-[11px] sm:text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug">
                  {language === 'ar'
                    ? 'تصفح وابحث وحلل البيانات في كافة أنحاء أبوظبي.'
                    : 'Browse, search and analyse data across Abu Dhabi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Discover Data */}
          <div
            onClick={() => setCurrentView('categories')}
            className="relative glass-panel rounded-xl sm:rounded-3xl p-2 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right min-h-[58px] sm:min-h-[92px] bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-white/70 dark:border-white/10 shadow-xs hover:shadow-md cursor-pointer select-none transition-all active:scale-[0.98]"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-1 sm:gap-3.5 w-full">
              <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br from-[#1E6ADB] via-[#215A9E] to-[#0A3B73] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Layers className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h3 className="text-[11px] xs:text-xs sm:text-base font-extrabold text-[#063360] dark:text-white leading-tight">
                  {language === 'ar' ? 'اكتشاف البيانات' : 'Discover Data'}
                </h3>
                <p className="hidden md:block text-[11px] sm:text-xs font-semibold text-[#545860] dark:text-slate-300 leading-snug">
                  {language === 'ar'
                    ? 'ابحث واستكشف المجموعات الموثوقة للبيانات العامة.'
                    : 'Find and explore authoritative public datasets.'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LandingPage2;
