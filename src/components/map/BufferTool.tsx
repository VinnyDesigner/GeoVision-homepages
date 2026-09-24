import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Circle, X, Check, Sparkles } from 'lucide-react';

export const BufferTool: React.FC = () => {
  const {
    bufferRadiusKm,
    setBufferRadiusKm,
    setActiveTool,
    sendAIMessage,
    showToast,
    filteredFeatures,
    language,
    t,
  } = useAppState();

  const [applied, setApplied] = useState(false);
  const [targetType, setTargetType] = useState<'feature' | 'point' | 'aoi'>('feature');

  const handleApply = () => {
    setApplied(true);
    showToast(
      language === 'ar'
        ? `تم تطبيق النطاق المكانى ${bufferRadiusKm} كم (تم العثور على ${filteredFeatures.length} معلم)`
        : `${bufferRadiusKm} km Buffer spatial filter applied (${filteredFeatures.length} features found)`
    );
  };

  const handleClear = () => {
    setApplied(false);
    showToast(language === 'ar' ? 'تم إزالة حلقة النطاق' : 'Buffer ring cleared');
  };

  const handleAskAIBuffer = () => {
    sendAIMessage(
      language === 'ar'
        ? `تحليل جميع المعالم في نطاق ${bufferRadiusKm} كم من مدينة خليفة.`
        : `Analyze all features within ${bufferRadiusKm} km radius of Khalifa City.`
    );
  };

  return (
    <div className="absolute top-4 sm:top-6 left-16 sm:left-20 rtl:left-auto rtl:right-16 sm:rtl:right-20 z-[600] w-80 sm:w-96 max-h-[calc(100vh-140px)] glass-level-3 rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/80 dark:border-slate-800 animate-fade-in flex flex-col overflow-hidden glow-blue pointer-events-auto">
      {/* Header (Fixed) */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-geovision-blue text-white flex items-center justify-center font-bold">
            <Circle className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {t('buffer.title')}
          </h3>
        </div>
        <button
          onClick={() => setActiveTool('none')}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1.5 space-y-4">

      {/* Step 1: Select Target */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {t('buffer.step1')}
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
          {(['feature', 'point', 'aoi'] as const).map((tType) => {
            const label =
              tType === 'feature'
                ? (language === 'ar' ? 'معلم' : 'Feature')
                : tType === 'point'
                ? (language === 'ar' ? 'نقطة' : 'Point')
                : (language === 'ar' ? 'منطقة' : 'AOI');
            return (
              <button
                key={tType}
                onClick={() => setTargetType(tType)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  targetType === tType
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Distance Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {t('buffer.step2')}
          </label>
          <span className="text-xs font-black text-geovision-blue">
            {bufferRadiusKm} {language === 'ar' ? 'كم' : 'km'}
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="20"
          value={bufferRadiusKm}
          onChange={(e) => setBufferRadiusKm(Number(e.target.value))}
          className="w-full accent-geovision-blue cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-300 font-extrabold">
          <span>1 {language === 'ar' ? 'كم' : 'km'}</span>
          <span>5 {language === 'ar' ? 'كم' : 'km'}</span>
          <span>10 {language === 'ar' ? 'كم' : 'km'}</span>
          <span>20 {language === 'ar' ? 'كم' : 'km'}</span>
        </div>
      </div>

      {/* Step 3: Apply & Results */}
      {!applied ? (
        <button
          onClick={handleApply}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all"
        >
          <Check className="w-4 h-4" />
          {t('buffer.apply')}
        </button>
      ) : (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 text-center">
            <span className="text-sm font-black text-geovision-blue dark:text-white block">
              {filteredFeatures.length} {t('buffer.resultsFound')}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-300">
              {language === 'ar' ? `نطاق المسافة: ${bufferRadiusKm} كم` : `Proximity Radius: ${bufferRadiusKm} km`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAskAIBuffer}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-bold hover:bg-blue-600 shadow-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ar' ? 'اسأل الذكاء الاصطناعي' : 'Ask GeoVision'}
            </button>
            <button
              onClick={handleClear}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('buffer.clear')}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
