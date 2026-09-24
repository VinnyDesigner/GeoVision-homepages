import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  ArrowRight,
  Compass,
  X,
  GraduationCap,
  Stethoscope,
  ShieldCheck,
  Bus,
  Leaf,
  Zap,
  Building,
  Landmark,
  Waves,
  Mountain,
  Grid,
  Building2,
  Trees,
} from 'lucide-react';
import { VoiceSearchOverlay } from './VoiceSearchOverlay';

interface AISearchBarProps {
  compact?: boolean;
  hideThemes?: boolean;
}

export const AISearchBar: React.FC<AISearchBarProps> = ({ compact = false, hideThemes = false }) => {
  const { sendAIMessage, language } = useAppState();
  const [queryText, setQueryText] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const SPATIAL_THEMES = [
    {
      id: 'education',
      labelEn: 'Education',
      labelAr: 'التعليم',
      icon: GraduationCap,
      queryEn: 'Show all schools in Abu Dhabi.',
      queryAr: 'عرض جميع المدارس في أبوظبي.',
    },
    {
      id: 'healthcare',
      labelEn: 'Healthcare',
      labelAr: 'الرعاية الصحية',
      icon: Stethoscope,
      queryEn: 'Show all hospitals in Abu Dhabi.',
      queryAr: 'عرض جميع المستشفيات في أبوظبي.',
    },
    {
      id: 'public_safety',
      labelEn: 'Public Safety',
      labelAr: 'الأمن والسلامة العامة',
      icon: ShieldCheck,
      queryEn: 'Show police stations near me.',
      queryAr: 'عرض مراكز الشرطة في أبوظبي.',
    },
    {
      id: 'transportation',
      labelEn: 'Transportation',
      labelAr: 'النقل والمواصلات',
      icon: Bus,
      queryEn: 'Show bus stops near me.',
      queryAr: 'عرض محطات الحافلات في أبوظبي.',
    },
    {
      id: 'environment',
      labelEn: 'Environment',
      labelAr: 'البيئة والمحميات',
      icon: Leaf,
      queryEn: 'Show protected areas in Abu Dhabi.',
      queryAr: 'عرض المحميات الطبيعية في أبوظبي.',
    },
    {
      id: 'tourism',
      labelEn: 'Tourism',
      labelAr: 'السياحة والثقافة',
      icon: Compass,
      queryEn: 'Show tourist attractions near me.',
      queryAr: 'عرض الوجهات السياحية في أبوظبي.',
    },
    {
      id: 'utilities',
      labelEn: 'Utilities',
      labelAr: 'الخدمات والمرافق',
      icon: Zap,
      queryEn: 'Show petrol stations near me.',
      queryAr: 'عرض محطات الوقود في أبوظبي.',
    },
    {
      id: 'urban',
      labelEn: 'Urban',
      labelAr: 'التخطيط العمراني',
      icon: Building,
      queryEn: 'Show urban development projects.',
      queryAr: 'عرض مشاريع التطوير العمراني.',
    },
    {
      id: 'administrative',
      labelEn: 'Administrative',
      labelAr: 'الحدود الإدارية',
      icon: Landmark,
      queryEn: 'Show Abu Dhabi municipality boundaries.',
      queryAr: 'عرض حدود بلديات أبوظبي.',
    },
    {
      id: 'hydrography',
      labelEn: 'Hydrography',
      labelAr: 'السطوح المائية',
      icon: Waves,
      queryEn: 'Show water-related features in this area.',
      queryAr: 'عرض المعالم المائية والهيدروغرافية.',
    },
    {
      id: 'geology',
      labelEn: 'Geology',
      labelAr: 'الجيولوجيا',
      icon: Mountain,
      queryEn: 'Show geological features for this selected area.',
      queryAr: 'عرض المعالم الجيولوجية.',
    },
    {
      id: 'land_use',
      labelEn: 'Land Use',
      labelAr: 'استخدامات الأراضي',
      icon: Grid,
      queryEn: 'Show the land-use categories in this district.',
      queryAr: 'عرض تصنيفات استخدامات الأراضي.',
    },
    {
      id: 'government_services',
      labelEn: 'Government Services',
      labelAr: 'الخدمات الحكومية',
      icon: Building2,
      queryEn: 'Show TAMM customer happiness centers in Abu Dhabi.',
      queryAr: 'عرض مراكز خدمة تم الحكومية في أبوظبي.',
    },
    {
      id: 'parks_public_spaces',
      labelEn: 'Parks & Public Spaces',
      labelAr: 'الحدائق والمساحات العامة',
      icon: Trees,
      queryEn: 'Show public parks in Abu Dhabi.',
      queryAr: 'عرض الحدائق العامة في أبوظبي.',
    },
  ];

  // Rotating placeholder prompts matching screenshot design
  const placeholders = language === 'ar' ? [
    'اسأل GeoVision... مثلاً: عرض جميع المستشفيات في أبوظبي...',
    'اسأل GeoVision... مثلاً: عرض جميع المدارس في أبوظبي...',
    'اسأل GeoVision... مثلاً: عرض المحميات الطبيعية في أبوظبي...',
    'اسأل GeoVision... مثلاً: عرض الوجهات السياحية في أبوظبي...',
    'اسأل GeoVision... مثلاً: عرض محطات الحافلات في أبوظبي...',
    'اسأل GeoVision... مثلاً: عرض الحدائق العامة في أبوظبي...',
  ] : [
    'Ask GeoVision... e.g. Show all hospitals in Abu Dhabi...',
    'Ask GeoVision... e.g. Show all schools in Abu Dhabi...',
    'Ask GeoVision... e.g. Show protected areas in Abu Dhabi...',
    'Ask GeoVision... e.g. Show tourist attractions near me...',
    'Ask GeoVision... e.g. Show bus stops near me...',
    'Ask GeoVision... e.g. Show public parks in Abu Dhabi...',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      sendAIMessage(queryText);
      setQueryText('');
    }
  };

  const handleThemeClick = (theme: typeof SPATIAL_THEMES[0]) => {
    const query = language === 'ar' ? theme.queryAr : theme.queryEn;
    sendAIMessage(query);
  };

  return (
    <div ref={searchContainerRef} className="w-full flex flex-col items-center gap-3 relative">
      {/* Voice Search Overlay Modal */}
      <VoiceSearchOverlay isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />

      {/* Main Floating AI Command Bar */}
      <form
        onSubmit={handleSubmit}
        className={`relative w-full glass-panel rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border transition-all duration-200 focus-within:ring-2 focus-within:ring-[#215A9E] focus-within:border-[#215A9E] glow-blue bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl ${
          compact ? 'p-1.5' : 'py-2.5 px-3 sm:py-3 sm:px-4 min-h-[56px] sm:min-h-[58px]'
        }`}
      >
        <div className="flex items-center gap-3 px-1 sm:px-2 h-full">
          {/* AI Sparkle Icon matching user design */}
          <div className={`flex items-center justify-center shrink-0 ${compact ? 'w-7 h-7' : 'w-9 sm:w-10 h-9 sm:h-10'}`}>
            <svg
              className={`text-[#457DF5] dark:text-[#5B92FF] shrink-0 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Central Outlined 4-Pointed Star */}
              <path
                d="M12 3C12 7.5 15.5 12 20 12C15.5 12 12 16.5 12 21C12 16.5 8.5 12 4 12C8.5 12 12 7.5 12 3Z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Top-Left Small Star */}
              <path
                d="M4.5 2C4.5 3.4 3.4 4.5 2 4.5C3.4 4.5 4.5 5.6 4.5 7C4.5 5.6 5.6 4.5 7 4.5C5.6 4.5 4.5 3.4 4.5 2Z"
                fill="currentColor"
              />
              {/* Top-Right Small Star */}
              <path
                d="M19.5 2C19.5 3.4 18.4 4.5 17 4.5C18.4 4.5 19.5 5.6 19.5 7C19.5 5.6 20.6 4.5 22 4.5C20.6 4.5 19.5 3.4 19.5 2Z"
                fill="currentColor"
              />
              {/* Bottom-Left Small Star */}
              <path
                d="M4.5 17C4.5 18.4 3.4 19.5 2 19.5C3.4 19.5 4.5 20.6 4.5 22C4.5 20.6 5.6 19.5 7 19.5C5.6 19.5 4.5 18.4 4.5 17Z"
                fill="currentColor"
              />
              {/* Bottom-Right Small Star */}
              <path
                d="M19.5 17C19.5 18.4 18.4 19.5 17 19.5C18.4 19.5 19.5 20.6 19.5 22C19.5 20.6 20.6 19.5 22 19.5C20.6 19.5 19.5 18.4 19.5 17Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Text Input with live focus */}
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            className="w-full bg-transparent text-[#063360] dark:text-white placeholder-[#545860] dark:placeholder-slate-400 text-xs xs:text-sm sm:text-base font-semibold focus:outline-hidden truncate"
          />

          {/* Clear text button if present */}
          {queryText && (
            <button
              type="button"
              onClick={() => setQueryText('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Arrow Button */}
          <button
            type="submit"
            disabled={!queryText.trim()}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl bg-[#215A9E] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#063360] shadow-md sm:shadow-lg shadow-[#215A9E]/30 transition-all shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rtl:rotate-180" />
          </button>
        </div>
      </form>

      {/* Spatial Themes Pills */}
      {!compact && !hideThemes && (
        <div className="w-full flex flex-wrap items-center justify-start gap-2 mt-1">
          <span className="text-xs font-black text-[#063360] dark:text-slate-200 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#215A9E]" />
            {language === 'ar' ? 'القطاعات والموضوعات المكانية:' : 'Spatial Themes:'}
          </span>
          {SPATIAL_THEMES.map((theme) => {
            const IconComponent = theme.icon;
            const label = language === 'ar' ? theme.labelAr : theme.labelEn;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeClick(theme)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#7DA1C4]/10 dark:bg-slate-900/90 text-[#063360] dark:text-[#7DA1C4] border border-[#7DA1C4]/30 dark:border-slate-700 hover:border-[#215A9E] hover:bg-[#215A9E] hover:text-white dark:hover:bg-[#215A9E] dark:hover:text-white shadow-2xs transition-all transform hover:-translate-y-0.5 backdrop-blur-md cursor-pointer"
              >
                <IconComponent className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;

