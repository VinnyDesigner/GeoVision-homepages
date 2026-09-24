import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CATEGORIES } from '../../data/mockAbuDhabiData';
import {
  RotateCcw,
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
  ChevronDown,
  ChevronUp,
  Search,
  X,
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

export const SmartFilterPanel: React.FC = () => {
  const {
    language,
    selectedCategoryIds,
    setSelectedCategoryIds,
    toggleCategorySelection,
    selectedSubcategoryIds,
    setSelectedSubcategoryIds,
    toggleSubcategorySelection,
    clearSmartFilters,
    showToast,
  } = useAppState();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([
    'healthcare',
    'education',
    'transport',
    'government',
    'parks',
    'utilities',
  ]);

  const toggleExpand = (catId: string) => {
    if (expandedCatIds.includes(catId)) {
      setExpandedCatIds(expandedCatIds.filter((id) => id !== catId));
    } else {
      setExpandedCatIds([...expandedCatIds, catId]);
    }
  };

  const isCategoryFullyChecked = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return false;
    return cat.subcategories.every((s) => selectedSubcategoryIds.includes(s.id));
  };

  const toggleSelectAllSubcategories = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;

    const allSubIds = cat.subcategories.map((s) => s.id);
    const fullyChecked = isCategoryFullyChecked(catId);

    if (fullyChecked) {
      setSelectedSubcategoryIds(
        selectedSubcategoryIds.filter((id) => !allSubIds.includes(id))
      );
      setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== catId));
    } else {
      const merged = Array.from(new Set([...selectedSubcategoryIds, ...allSubIds]));
      setSelectedSubcategoryIds(merged);
      if (!selectedCategoryIds.includes(catId)) {
        setSelectedCategoryIds([...selectedCategoryIds, catId]);
      }
    }
  };

  const handleClearAll = () => {
    clearSmartFilters();
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setSearchTerm('');
    showToast(language === 'ar' ? 'تمت إعادة تعيين التحديد' : 'Category selection cleared');
  };

  const filteredCategories = CATEGORIES.map((cat) => {
    if (!searchTerm.trim()) return cat;

    const term = searchTerm.toLowerCase();
    const catNameEn = cat.nameEn.toLowerCase();
    const catNameAr = cat.nameAr.toLowerCase();
    const matchCat = catNameEn.includes(term) || catNameAr.includes(term);

    const matchingSubs = cat.subcategories.filter(
      (sub) =>
        sub.nameEn.toLowerCase().includes(term) ||
        sub.nameAr.toLowerCase().includes(term)
    );

    if (matchCat) {
      return cat;
    } else if (matchingSubs.length > 0) {
      return {
        ...cat,
        subcategories: matchingSubs,
      };
    }
    return null;
  }).filter((cat): cat is (typeof CATEGORIES)[0] => cat !== null);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 space-y-2 text-slate-900 dark:text-slate-100">

      {/* Sub-header with Category count & Clear All button */}
      <div className="flex items-center justify-between pb-0.5 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {filteredCategories.length} Categories
        </span>

        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-geovision-blue hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          {language === 'ar' ? 'إلغاء الكل' : 'Clear All'}
        </button>
      </div>

      {/* Category Search Input */}
      <div className="relative shrink-0">
        <Search className="w-3.5 h-3.5 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={language === 'ar' ? 'البحث عن فئة أو خدمة...' : 'Search categories...'}
          className="w-full pl-8 pr-7 rtl:pr-8 rtl:pl-7 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-geovision-blue transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Categories Accordions with Subcategory Checklist & Smooth Scrolling */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0 custom-scrollbar">
        {filteredCategories.length === 0 ? (
          <div className="p-4 text-center text-xs font-semibold text-slate-400">
            {language === 'ar' ? 'لم يتم العثور على فئات مطابقة' : 'No matching categories found'}
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Activity;
            const isSelected = selectedCategoryIds.includes(cat.id);
            const isExpanded = expandedCatIds.includes(cat.id) || Boolean(searchTerm.trim());
            const isFullyChecked = isCategoryFullyChecked(cat.id);

            return (
              <div
                key={cat.id}
                className={`rounded-2xl p-2.5 border transition-all ${isSelected
                  ? 'bg-blue-50/80 dark:bg-slate-800/90 border-geovision-blue/50 shadow-2xs'
                  : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60'
                  }`}
              >
                {/* Category Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                    onClick={() => toggleCategorySelection(cat.id)}
                  >
                    <div className="w-6 h-6 rounded-lg bg-geovision-blue text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {language === 'ar' ? cat.nameAr : cat.nameEn}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-geovision-blue stroke-[3]" />}
                  </div>

                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                    title="Toggle Subcategories"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Subcategory Checklist */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/60 space-y-1.5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleSelectAllSubcategories(cat.id)}
                        className="text-[9px] font-black uppercase tracking-wider text-geovision-blue dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {isFullyChecked ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      {cat.subcategories.map((sub) => {
                        const isSubChecked = selectedSubcategoryIds.includes(sub.id);

                        return (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubcategorySelection(sub.id)}
                            className="flex items-center justify-between py-1 px-2 rounded-xl hover:bg-white/90 dark:hover:bg-slate-700/60 cursor-pointer transition-colors select-none"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isSubChecked
                                  ? 'bg-geovision-blue border-geovision-blue text-white'
                                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                                  }`}
                              >
                                {isSubChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
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
          })
        )}
      </div>

    </div>
  );
};









