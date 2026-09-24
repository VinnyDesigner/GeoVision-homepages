import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import {
  Activity,
  GraduationCap,
  Bus,
  Building2,
  Trees,
  Zap,
  Shield,
  Compass,
  Leaf,
  Wheat,
  Waves,
  Building,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Activity,
  GraduationCap,
  Bus,
  Building2,
  Trees,
  Zap,
  Shield,
  Compass,
  Leaf,
  Wheat,
  Waves,
  Building,
  healthcare: Building2,
  education: GraduationCap,
  transport: Bus,
  government: Building2,
  parks: Trees,
  utilities: Zap,
  public_safety: Shield,
  tourism: Compass,
  environment: Leaf,
  agriculture: Wheat,
  hydrography: Waves,
  urban: Building,
};

export const QuickCategories: React.FC = () => {
  const { language, toggleCategorySelection, selectedCategoryIds, setCurrentView, t } = useAppState();

  const handleCategoryClick = (catId: string) => {
    toggleCategorySelection(catId);
    setCurrentView('map');
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      <div className="flex items-center justify-between w-full max-w-4xl px-2">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {t('categories.quickTitle')}
        </h3>
        <button
          onClick={() => setCurrentView('categories')}
          className="text-xs font-semibold text-geovision-blue hover:underline flex items-center gap-1"
        >
          {t('categories.viewAll')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 w-full max-w-4xl">
        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Activity;
          const isSelected = selectedCategoryIds.includes(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl glass-panel text-center transition-all duration-200 transform hover:-translate-y-1 ${
                isSelected
                  ? 'border-2 border-geovision-blue shadow-lg shadow-blue-500/10 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-geovision-blue text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <IconComp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {language === 'ar' ? cat.nameAr : cat.nameEn}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {cat.count} datasets
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
