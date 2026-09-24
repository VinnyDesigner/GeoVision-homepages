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
  ChevronDown,
  ChevronRight,
  Check,
  Search,
  ArrowRight,
  Sparkles,
  CheckSquare,
  Square,
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

export const CategoryExplorer: React.FC = () => {
  const {
    language,
    selectedCategoryIds,
    setSelectedCategoryIds,
    selectedSubcategoryIds,
    setSelectedSubcategoryIds,
    toggleSubcategorySelection,
    setCurrentView,
    showToast,
  } = useAppState();

  const [expandedCatIds, setExpandedCatIds] = useState<string[]>([
    'healthcare',
    'education',
    'transport',
    'government',
    'parks',
    'utilities',
  ]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleApplyToMap = () => {
    showToast(`${selectedSubcategoryIds.length} spatial datasets applied to GeoVision Map`);
    setCurrentView('map');
  };

  const handleSelectAllGlobally = () => {
    const allCatIds = CATEGORIES.map((c) => c.id);
    const allSubIds = CATEGORIES.flatMap((c) => c.subcategories.map((s) => s.id));
    setSelectedCategoryIds(allCatIds);
    setSelectedSubcategoryIds(allSubIds);
    showToast('All spatial categories and datasets selected');
  };

  const handleClearAllGlobally = () => {
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    showToast('Checklist cleared');
  };

  const filteredCategories = CATEGORIES.filter((cat) => {
    const name = (language === 'ar' ? cat.nameAr : cat.nameEn).toLowerCase();
    const desc = (language === 'ar' ? cat.descriptionAr : cat.descriptionEn).toLowerCase();
    const matchCat = name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchSub = cat.subcategories.some((sub) =>
      (language === 'ar' ? sub.nameAr : sub.nameEn).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchCat || matchSub;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 sm:pt-28 pb-16 space-y-6 bg-spatial-canvas min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black glass-level-1 text-geovision-blue mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authoritative SDI Catalog Checklist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Abu Dhabi Spatial Datasets & Categories Checklist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Check individual sub-datasets or entire thematic categories to visualize on the map workspace.
          </p>
        </div>

        <button
          onClick={handleApplyToMap}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all shrink-0"
        >
          <span>Apply {selectedSubcategoryIds.length} Datasets to Map</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>

      {/* Search Input & Global Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories, subcategories or datasets..."
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl glass-level-2 border border-white/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue placeholder-slate-400"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSelectAllGlobally}
            className="px-4 py-2.5 rounded-xl text-xs font-black glass-level-1 text-geovision-blue hover:bg-geovision-blue hover:text-white border border-white/70 transition-all shadow-2xs"
          >
            Select All Datasets
          </button>
          <button
            onClick={handleClearAllGlobally}
            className="px-4 py-2.5 rounded-xl text-xs font-black glass-level-1 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 border border-white/70 transition-all"
          >
            Clear Checklist
          </button>
        </div>
      </div>

      {/* Category Hierarchical Checklist Cards */}
      <div className="space-y-4">
        {filteredCategories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Activity;
          const isFullyChecked = isCategoryFullyChecked(cat.id);
          const isExpanded = expandedCatIds.includes(cat.id);
          const activeSubCount = cat.subcategories.filter((s) =>
            selectedSubcategoryIds.includes(s.id)
          ).length;

          return (
            <div
              key={cat.id}
              className="glass-level-2 rounded-3xl p-5 border border-white/80 dark:border-slate-700/80 space-y-4 transition-all shadow-md hover:shadow-lg"
            >
              {/* Category Header Row */}
              <div className="flex items-center justify-between gap-4 cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25 shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        {language === 'ar' ? cat.nameAr : cat.nameEn}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100/80 text-geovision-blue dark:bg-blue-950/90 dark:text-blue-300">
                        {activeSubCount} of {cat.subcategories.length} datasets checked
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-300 font-semibold mt-0.5">
                      {language === 'ar' ? cat.descriptionAr : cat.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectAllSubcategories(cat.id);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isFullyChecked
                        ? 'bg-geovision-blue text-white shadow-md'
                        : 'glass-level-1 text-slate-700 dark:text-slate-200 border border-white/60 dark:border-slate-700 hover:border-geovision-blue'
                    }`}
                  >
                    {isFullyChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{isFullyChecked ? 'Category Checked ✓' : 'Check Category'}</span>
                  </button>

                  <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl cursor-pointer">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rtl:rotate-180" />}
                  </button>
                </div>

              </div>

              {/* Subcategories Multiple Checklist Grid */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.subcategories.map((sub) => {
                    const isSubChecked = selectedSubcategoryIds.includes(sub.id);

                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleSubcategorySelection(sub.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSubChecked
                            ? 'bg-blue-50/90 dark:bg-blue-950/80 border-geovision-blue text-geovision-blue dark:text-blue-300 font-extrabold shadow-2xs'
                            : 'glass-level-1 border-white/70 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-geovision-blue'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              isSubChecked
                                ? 'bg-geovision-blue border-geovision-blue text-white'
                                : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900'
                            }`}
                          >
                            {isSubChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-extrabold">
                            {language === 'ar' ? sub.nameAr : sub.nameEn}
                          </span>
                        </div>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400">
                          {sub.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
