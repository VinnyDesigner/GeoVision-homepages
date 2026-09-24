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
  Plus,
  Check,
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

export const HomeCategoryDock: React.FC = () => {
  const { language, selectedCategoryIds, selectedSubcategoryIds, toggleCategorySelection, setCurrentView } = useAppState();

  const handleCategoryClick = (catId: string) => {
    toggleCategorySelection(catId);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
        <span>Explore by Category</span>
      </div>

      {/* Horizontal Glass Category Dock */}
      <div className="w-full max-w-4xl px-2">
        <div className="glass-level-2 p-1.5 px-3 rounded-full border border-white/60 dark:border-slate-800 flex items-center gap-2 max-w-full">
          
          {/* Explore Trigger Button (Fixed First on Left) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentView('categories')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#215A9E] text-white shadow-md shadow-[#215A9E]/25 hover:bg-[#063360] active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? `استكشاف (${selectedSubcategoryIds.length})`
                  : `Explore (${selectedSubcategoryIds.length})`}
              </span>
            </button>

            <button
              onClick={() => setCurrentView('categories')}
              className="p-1 rounded-full text-[#545860] dark:text-slate-200 hover:text-[#063360] hover:bg-[#7DA1C4]/20 transition-colors shrink-0 cursor-pointer"
              title="Explore All Categories"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 shrink-0 mx-0.5" />
          </div>

          {/* Scrollable Categories List */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 min-w-0">
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Activity;
              const isSelected = selectedCategoryIds.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#215A9E] text-white shadow-md shadow-blue-500/30 scale-105'
                      : 'bg-white/70 dark:bg-slate-900/90 text-[#545860] dark:text-slate-200 hover:bg-[#7DA1C4]/20 dark:hover:bg-slate-800 hover:text-[#063360] dark:hover:text-white border border-transparent dark:border-slate-800'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
