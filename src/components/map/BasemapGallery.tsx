import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import type { BasemapType } from '../../types';
import { Layers, Sun, Moon, Globe, X, ShieldCheck } from 'lucide-react';

export const BasemapGallery: React.FC = () => {
  const { activeBasemap, setActiveBasemap, setActiveTool, language, t } = useAppState();

  const basemaps: { id: BasemapType; labelKey: string; icon: React.FC<{ className?: string }>; descEn: string; descAr: string; badge?: string }[] = [
    { id: 'dge', labelKey: 'basemap.dge', icon: ShieldCheck, descEn: 'Official DGE Map (SDI)', descAr: 'خريطة تمكين المعتمدة (DGE)', badge: 'Default' },
    { id: 'light', labelKey: 'basemap.light', icon: Sun, descEn: 'Light Grey Canvas', descAr: 'خريطة رمادية فاتحة' },
    { id: 'dark', labelKey: 'basemap.dark', icon: Moon, descEn: 'Dark Grey Canvas', descAr: 'خريطة رمادية داكنة' },
    { id: 'satellite', labelKey: 'basemap.satellite', icon: Globe, descEn: 'High resolution imagery', descAr: 'صور أقمار صناعية بدقة عالية' },
  ];

  return (
    <div className="absolute top-20 left-18 sm:left-20 rtl:left-auto rtl:right-18 sm:rtl:right-20 z-[600] w-80 glass-level-3 rounded-3xl p-5 shadow-2xl border border-white/80 dark:border-slate-800 animate-fade-in glow-blue">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-geovision-blue text-white flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {t('tool.basemap')}
          </h3>
        </div>
        <button
          onClick={() => setActiveTool('none')}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {basemaps.map((bm) => {
          const IconComp = bm.icon;
          const isActive = activeBasemap === bm.id;

          return (
            <button
              key={bm.id}
              onClick={() => setActiveBasemap(bm.id)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                isActive
                  ? 'border-2 border-geovision-blue bg-blue-50/60 dark:bg-blue-950/60 text-geovision-blue font-bold shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-900/50'
              }`}
            >
              {bm.badge && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[8px] font-black uppercase rounded-full bg-emerald-500 text-white shadow-sm">
                  {bm.badge}
                </span>
              )}
              <IconComp className="w-6 h-6 mb-1.5" />
              <span className="text-xs font-extrabold">{t(bm.labelKey)}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-300 font-semibold">
                {language === 'ar' ? bm.descAr : bm.descEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
