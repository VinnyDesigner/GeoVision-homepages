import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import { CategoryChecklistDrawer } from './CategoryChecklistDrawer';
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
  Check,
  Plus,
  Filter,
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

export const MapCategoryDock: React.FC = () => {
  const { language, selectedCategoryIds, selectedSubcategoryIds, toggleCategorySelection } = useAppState();
  const [checklistOpen, setChecklistOpen] = useState(false);

  return (
    <>
      {/* Category Checklist Modal Drawer */}
      <CategoryChecklistDrawer isOpen={checklistOpen} onClose={() => setChecklistOpen(false)} />

      {/* Floating Map Category Capsule Dock */}
      <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-[500] max-w-[calc(100vw-2rem)] sm:max-w-[720px] w-full sm:w-max pointer-events-auto px-2">
        <div className="glass-level-3 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl p-1.5 px-3 rounded-full shadow-2xl border border-white/80 dark:border-slate-700/80 flex items-center gap-1.5 max-w-full glow-blue">
          
          {/* Fixed Section: Checklist & Plus Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Explore Trigger Button (Renamed from Checklist) */}
            <button
              onClick={() => setChecklistOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#215A9E] text-white shadow-md shadow-[#215A9E]/25 hover:bg-[#063360] active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Explore Datasets & Categories"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? `استكشاف (${selectedSubcategoryIds.length})`
                  : `Explore (${selectedSubcategoryIds.length})`}
              </span>
            </button>

            {/* Plus / More Categories Button */}
            <button
              onClick={() => setChecklistOpen(true)}
              className="p-1.5 rounded-full text-[#545860] dark:text-slate-200 hover:text-[#063360] hover:bg-[#7DA1C4]/20 transition-colors shrink-0 cursor-pointer"
              title="Explore Category Checklist"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Vertical Divider */}
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700/80 shrink-0 mx-0.5" />
          </div>

          {/* Scrollable Categories List */}
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none min-w-0 py-0.5">
            {CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Activity;
              const isSelected = selectedCategoryIds.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategorySelection(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#215A9E]/15 dark:bg-white/15 text-[#215A9E] dark:text-white border border-[#215A9E]/40 dark:border-white/30 shadow-2xs font-extrabold'
                      : 'text-[#545860] dark:text-slate-200 hover:bg-[#7DA1C4]/15 dark:hover:bg-slate-800/90 hover:text-[#063360] dark:hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#215A9E] dark:text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

