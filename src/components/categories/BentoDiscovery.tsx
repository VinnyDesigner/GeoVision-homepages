import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import { Activity, GraduationCap, Bus, Trees, ArrowRight, Sparkles } from 'lucide-react';

export const BentoDiscovery: React.FC = () => {
  const { language, toggleCategorySelection, setCurrentView } = useAppState();

  const handleCategorySelect = (catId: string) => {
    toggleCategorySelection(catId);
    setCurrentView('map');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-geovision-blue" />
            Explore Abu Dhabi Geospatial Datasets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authoritative thematic layers curated by the Department of Government Enablement.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('categories')}
          className="text-xs font-bold text-geovision-blue hover:underline flex items-center gap-1 shrink-0"
        >
          View all categories →
        </button>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Healthcare — Large Tile */}
        {CATEGORIES[0] && (
          <div
            onClick={() => handleCategorySelect(CATEGORIES[0].id)}
            className="group relative sm:col-span-2 lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-geovision-blue dark:hover:border-geovision-blue transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-geovision-blue dark:bg-blue-950/80 dark:text-blue-300">
                  {CATEGORIES[0].count} Authoritative Layers
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-geovision-blue transition-colors">
                  {language === 'ar' ? CATEGORIES[0].nameAr : CATEGORIES[0].nameEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                  {language === 'ar' ? CATEGORIES[0].descriptionAr : CATEGORIES[0].descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-geovision-blue group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                <span>Explore Healthcare Layers</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </div>

            {/* Subtle Abstract Spatial Visual Circle */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-blue-400/10 pointer-events-none blur-2xl group-hover:bg-blue-400/20 transition-colors" />
          </div>
        )}

        {/* Education — Medium Tile */}
        {CATEGORIES[1] && (
          <div
            onClick={() => handleCategorySelect(CATEGORIES[1].id)}
            className="group relative glass-panel rounded-3xl p-6 overflow-hidden cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-geovision-blue dark:hover:border-geovision-blue transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-indigo-50/40 via-white to-indigo-100/20 dark:from-slate-900 dark:to-indigo-950/30"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  {CATEGORIES[1].count} Layers
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-geovision-blue transition-colors">
                  {language === 'ar' ? CATEGORIES[1].nameAr : CATEGORIES[1].nameEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {language === 'ar' ? CATEGORIES[1].descriptionAr : CATEGORIES[1].descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Explore Education</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </div>
          </div>
        )}

        {/* Transport — Medium Tile */}
        {CATEGORIES[2] && (
          <div
            onClick={() => handleCategorySelect(CATEGORIES[2].id)}
            className="group relative glass-panel rounded-3xl p-6 overflow-hidden cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-geovision-blue dark:hover:border-geovision-blue transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-amber-50/40 via-white to-amber-100/20 dark:from-slate-900 dark:to-amber-950/30"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                  <Bus className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                  {CATEGORIES[2].count} Layers
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-geovision-blue transition-colors">
                  {language === 'ar' ? CATEGORIES[2].nameAr : CATEGORIES[2].nameEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {language === 'ar' ? CATEGORIES[2].descriptionAr : CATEGORIES[2].descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Explore Transport</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </div>
          </div>
        )}

        {/* Parks & Recreation — Wide Tile */}
        {CATEGORIES[4] && (
          <div
            onClick={() => handleCategorySelect(CATEGORIES[4].id)}
            className="group relative sm:col-span-2 lg:col-span-2 glass-panel rounded-3xl p-6 overflow-hidden cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-geovision-blue dark:hover:border-geovision-blue transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-100/20 dark:from-slate-900 dark:to-emerald-950/30"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                  <Trees className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                  {CATEGORIES[4].count} Parks & Beaches
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-geovision-blue transition-colors">
                  {language === 'ar' ? CATEGORIES[4].nameAr : CATEGORIES[4].nameEn}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {language === 'ar' ? CATEGORIES[4].descriptionAr : CATEGORIES[4].descriptionEn}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Explore Parks & Recreation</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
