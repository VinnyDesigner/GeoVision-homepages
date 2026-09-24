import React, { useState } from 'react';
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
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
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

interface CategoryChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryChecklistDrawer: React.FC<CategoryChecklistDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    language,
    selectedCategoryIds,
    setSelectedCategoryIds,
    selectedSubcategoryIds,
    toggleSubcategorySelection,
    setSelectedSubcategoryIds,
    showToast,
  } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([
    'education',
    'healthcare',
    'transport',
    'government',
    'parks',
    'utilities',
  ]);

  if (!isOpen) return null;

  const toggleExpand = (catId: string) => {
    if (expandedCatIds.includes(catId)) {
      setExpandedCatIds(expandedCatIds.filter((id) => id !== catId));
    } else {
      setExpandedCatIds([...expandedCatIds, catId]);
    }
  };

  // Check if all subcategories of a parent category are checked
  const isCategoryFullyChecked = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return false;
    return cat.subcategories.every((s) => selectedSubcategoryIds.includes(s.id));
  };

  // Toggle all subcategories under a parent category
  const toggleSelectAllSubcategories = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;

    const allSubIds = cat.subcategories.map((s) => s.id);
    const fullyChecked = isCategoryFullyChecked(catId);

    if (fullyChecked) {
      // Uncheck all subcategories of this category
      setSelectedSubcategoryIds(
        selectedSubcategoryIds.filter((id) => !allSubIds.includes(id))
      );
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      // Check all subcategories of this category
      const merged = Array.from(new Set([...selectedSubcategoryIds, ...allSubIds]));
      setSelectedSubcategoryIds(merged);
      if (!selectedCategoryIds.includes(catId)) {
        setSelectedCategoryIds([...selectedCategoryIds, catId]);
      }
    }
  };

  const handleClearAllGlobally = () => {
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    showToast('Category selection cleared');
  };

  const filteredCategories = CATEGORIES.filter((cat) => {
    const name = (language === 'ar' ? cat.nameAr : cat.nameEn).toLowerCase();
    const matchCat = name.includes(searchTerm.toLowerCase());
    const matchSub = cat.subcategories.some((sub) =>
      (language === 'ar' ? sub.nameAr : sub.nameEn).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchCat || matchSub;
  });

  return (
    <div className="absolute top-16 sm:top-20 left-16 sm:left-18 z-[600] w-64 sm:w-72 md:w-76 h-[405px] sm:h-[415px] max-h-[415px] pointer-events-auto flex flex-col animate-slide-in">
      <div className="relative w-full h-full glass-level-3 bg-[#f5f4ee]/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[24px] p-3 sm:p-3.5 shadow-2xl border border-white/80 dark:border-slate-800 flex flex-col space-y-2.5 glow-blue overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 pb-0.5">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Browse
          </h2>

          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Browse Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input & CLEAR ALL Action */}
        <div className="space-y-1 shrink-0">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subcategories..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-[11px] font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue placeholder-slate-400 shadow-xs"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between px-1 pt-0.5">
            <button
              onClick={() => {
                const allCats = CATEGORIES.map((c) => c.id);
                const allSubs = CATEGORIES.flatMap((c) => c.subcategories.map((s) => s.id));
                setSelectedCategoryIds(allCats);
                setSelectedSubcategoryIds(allSubs);
                showToast('All spatial categories selected');
              }}
              className="text-[10px] font-black uppercase tracking-wider text-geovision-blue dark:text-blue-400 hover:underline cursor-pointer"
            >
              SELECT ALL
            </button>

            <button
              onClick={handleClearAllGlobally}
              className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              CLEAR ALL
            </button>
          </div>
        </div>

        {/* Scrollable Category Accordion Cards */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0 custom-scrollbar">
          {filteredCategories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Activity;
            const isFullyChecked = isCategoryFullyChecked(cat.id);
            const isExpanded = expandedCatIds.includes(cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white/85 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-200/70 dark:border-slate-700/60 space-y-2 transition-all shadow-2xs"
              >
                {/* Category Header Row */}
                <div
                  className="flex items-center justify-between gap-2 cursor-pointer select-none"
                  onClick={() => toggleExpand(cat.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0c2e5c] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {language === 'ar' ? cat.nameAr : cat.nameEn}
                    </h4>
                  </div>

                  <button className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Subcategories Checklist Checkboxes */}
                {isExpanded && (
                  <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectAllSubcategories(cat.id);
                        }}
                        className="text-[10px] font-black uppercase tracking-wider text-[#0c2e5c] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {isFullyChecked ? 'DESELECT ALL' : 'SELECT ALL'}
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      {cat.subcategories.map((sub) => {
                        const isSubChecked = selectedSubcategoryIds.includes(sub.id);

                        return (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubcategorySelection(sub.id)}
                            className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-700/50 cursor-pointer transition-colors select-none"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                  isSubChecked
                                    ? 'bg-geovision-blue border-geovision-blue text-white'
                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                                }`}
                              >
                                {isSubChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                                {language === 'ar' ? sub.nameAr : sub.nameEn}
                              </span>
                            </div>

                            <span className="text-[9px] font-bold text-slate-400">
                              {sub.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
