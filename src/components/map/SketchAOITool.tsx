import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  MapPin,
  Circle,
  Hexagon,
  Square,
  Trash2,
  X,
  Sparkles,
  BarChart2,
  Activity,
  GraduationCap,
  Trees,
  Building2,
} from 'lucide-react';
import type { AOIResult } from '../../types';

import { buildSpatialSnapshot } from '../../utils/spatialSnapshotUtils';

export const SketchAOITool: React.FC = () => {
  const {
    language,
    setActiveTool,
    drawTool,
    setDrawTool,
    setUserDrawnShapes,
    clearUserDrawnShapes,
    userDrawnShapes,
    aoiResult,
    setAoiResult,
    sendAIMessage,
    showToast,
    t,
  } = useAppState();

  const [sketchState, setSketchState] = useState<'drawing' | 'drawn' | 'analyzed'>('drawing');

  const getHelpText = () => {
    switch (drawTool) {
      case 'point':
        return language === 'ar'
          ? '📍 انقر في أي مكان على الخريطة لإسقاط نقطة'
          : '📍 Click anywhere on the map to drop a point pin';
      case 'circle':
        return language === 'ar'
          ? '⭕ انقر لتحديد المركز ثم حرّك الماوس وانقر لتأكيد حجم الدائرة'
          : '⭕ Click center point on map, move cursor to adjust circle radius, click again to lock';
      case 'rect':
        return language === 'ar'
          ? '█ انقر لتحديد الزاوية الأولى ثم حرّك الماوس وانقر لتأكيد حجم المستطيل'
          : '█ Click start corner on map, move cursor to expand box, click again to lock';
      case 'polygon':
        return language === 'ar'
          ? '⬡ انقر على الخريطة لإضافة النقاط. انقر مرتين لإكمال حدود المضلع'
          : '⬡ Click points on map to add vertices. Double-click to complete boundary';
    }
  };

  const handleSimulateShapeDraw = () => {
    setSketchState('drawn');

    const shapeId = `shape-${Date.now()}`;
    const centerLat = 24.4539;
    const centerLng = 54.3773;

    let newShape: any;
    if (drawTool === 'point') {
      newShape = { id: shapeId, type: 'point', lat: centerLat, lng: centerLng, radius: 1000 };
    } else if (drawTool === 'circle') {
      newShape = { id: shapeId, type: 'circle', lat: centerLat, lng: centerLng, radius: 2500 };
    } else if (drawTool === 'polygon') {
      newShape = {
        id: shapeId,
        type: 'polygon',
        lat: centerLat,
        lng: centerLng,
        radius: 2000,
        points: [
          [24.465, 54.377],
          [24.455, 54.395],
          [24.442, 54.385],
          [24.445, 54.365],
          [24.460, 54.362],
        ],
      };
    } else {
      newShape = {
        id: shapeId,
        type: 'rect',
        lat: centerLat,
        lng: centerLng,
        radius: 2000,
        bounds: [
          [24.440, 54.360],
          [24.468, 54.395],
        ],
      };
    }

    // Check if user already drew a shape on map
    const existingShape = userDrawnShapes.length > 0 ? userDrawnShapes[userDrawnShapes.length - 1] : newShape;
    if (userDrawnShapes.length === 0) {
      setUserDrawnShapes((prev) => [...prev, newShape]);
    }

    showToast(`${drawTool.toUpperCase()} spatial drawing created on map`);

    const labelName =
      drawTool === 'point'
        ? 'Point Marker'
        : drawTool === 'circle'
        ? 'Circle Buffer'
        : drawTool === 'polygon'
        ? 'Polygon Boundary'
        : 'Rectangle Box';

    const centerPos: [number, number] = [existingShape.lat, existingShape.lng];
    const snapshot = buildSpatialSnapshot(
      drawTool,
      centerPos,
      `Captured ${labelName}`,
      `منطقة رسم مكانية (${labelName})`,
      4.8,
      existingShape.radius ? existingShape.radius / 1000 : 1.5,
      existingShape.bounds
    );

    sendAIMessage(`Analyze drawn ${labelName}`, snapshot);
  };

  const handleAnalyzeAOI = () => {
    setSketchState('analyzed');

    const res: AOIResult = {
      bounds: [
        [24.49, 54.39],
        [24.5, 54.41],
        [24.48, 54.41],
      ],
      totalAreaKm2: 4.8,
      breakdown: [
        { category: 'healthcare', count: 14, nameEn: 'Healthcare Facilities', nameAr: 'المراكز الصحية' },
        { category: 'education', count: 23, nameEn: 'Educational Facilities', nameAr: 'المنشآت التعليمية' },
        { category: 'parks', count: 6, nameEn: 'Parks & Green Spaces', nameAr: 'الحدائق العامة' },
        { category: 'government', count: 4, nameEn: 'Government Centers', nameAr: 'الخدمات الحكومية' },
      ],
      insightEn:
        'Healthcare services are concentrated in the northern part of the selected area, while educational facilities show a more even geographic distribution.',
      insightAr:
        'تتركز الخدمات الصحية في الجزء الشمالي من المنطقة المحددة، بينما تظهر المنشآت التعليمية توزيعاً جغرافياً متساوياً.',
      recommendationsEn: [
        'Show only hospitals in this AOI',
        'Create 2 km buffer around high-density zone',
        'Print this spatial analysis',
      ],
      recommendationsAr: [
        'عرض المستشفيات فقط في هذه المنطقة',
        'إنشاء نطاق 2 كم حول منطقة الكثافة العليا',
        'طباعة هذا التحليل المكاني',
      ],
    };

    setAoiResult(res);
    showToast('GeoVision Smart Insights generated!');

    const labelName =
      drawTool === 'point'
        ? 'Point Marker'
        : drawTool === 'circle'
        ? 'Circle Buffer'
        : drawTool === 'polygon'
        ? 'Polygon Boundary'
        : 'Rectangle Box';

    const lastShape = userDrawnShapes.length > 0 ? userDrawnShapes[userDrawnShapes.length - 1] : null;
    const centerPos: [number, number] = lastShape ? [lastShape.lat, lastShape.lng] : [24.4539, 54.3773];

    const snapshot = buildSpatialSnapshot(
      drawTool,
      centerPos,
      `Captured ${labelName} AOI`,
      `المنطقة المحددة (${labelName})`,
      4.8,
      lastShape?.radius ? lastShape.radius / 1000 : 1.5,
      lastShape?.bounds
    );

    sendAIMessage(`Analyze drawn ${labelName} (4.8 km²)`, snapshot);
  };

  const handleClearDrawings = () => {
    setSketchState('drawing');
    setAoiResult(null);
    clearUserDrawnShapes();
    showToast(language === 'ar' ? 'تم مسح جميع الرسومات والمناطق المكانية' : 'All spatial drawings & shapes cleared');
  };

  return (
    <div className="absolute top-4 sm:top-6 left-16 sm:left-20 rtl:left-auto rtl:right-16 sm:rtl:right-20 z-[600] w-80 sm:w-[370px] max-h-[calc(100vh-140px)] glass-level-3 rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/80 dark:border-slate-800 animate-fade-in flex flex-col overflow-hidden glow-blue pointer-events-auto">
      
      {/* Header (Fixed) */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3 shrink-0">
        <h3 className="text-base font-black text-slate-900 dark:text-white">
          Draw
        </h3>
        <button
          onClick={() => setActiveTool('none')}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1.5 space-y-4">

      {/* DRAWING TOOL Section */}
      <div className="space-y-3">
        <span className="text-[11px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-wider block">
          DRAWING TOOL
        </span>

        {/* 4 Segmented Tool Buttons */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl">
          {/* Point */}
          <button
            onClick={() => setDrawTool('point')}
            className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
              drawTool === 'point'
                ? 'bg-white dark:bg-slate-800 text-geovision-blue dark:text-white font-extrabold shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Point</span>
          </button>

          {/* Circle */}
          <button
            onClick={() => setDrawTool('circle')}
            className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
              drawTool === 'circle'
                ? 'bg-white dark:bg-slate-800 text-geovision-blue dark:text-white font-extrabold shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Circle className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Circle</span>
          </button>

          {/* Polygon */}
          <button
            onClick={() => setDrawTool('polygon')}
            className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
              drawTool === 'polygon'
                ? 'bg-white dark:bg-slate-800 text-geovision-blue dark:text-white font-extrabold shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Hexagon className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Polygon</span>
          </button>

          {/* Rectangle */}
          <button
            onClick={() => setDrawTool('rect')}
            className={`py-2 px-1 rounded-xl text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
              drawTool === 'rect'
                ? 'bg-white dark:bg-slate-800 text-geovision-blue dark:text-white font-extrabold shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Square className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Rectangle</span>
          </button>
        </div>

        {/* Dynamic Help Text */}
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium py-1">
          {getHelpText()}
        </p>
      </div>

      {/* Simulate Shape Completion Button */}
      {sketchState === 'drawing' && (
        <button
          onClick={handleSimulateShapeDraw}
          className="w-full py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-extrabold hover:opacity-90 transition-opacity shadow-md cursor-pointer"
        >
          Complete {drawTool.toUpperCase()} Drawing
        </button>
      )}

      {/* Analyze & Clear Action Options */}
      {sketchState === 'drawn' && (
        <div className="space-y-2">
          <button
            onClick={handleAnalyzeAOI}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Spatial Area
          </button>
        </div>
      )}

      {/* Smart Insights Results Display */}
      {sketchState === 'analyzed' && aoiResult && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-geovision-blue" />
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {t('aoi.summaryTitle')} ({aoiResult.totalAreaKm2} km²)
            </h4>
          </div>

          {/* 4 Metric Tiles Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-red-50/70 dark:bg-red-950/40 border border-red-200/60 dark:border-red-800/40 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">14</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">Healthcare</p>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">23</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">Education</p>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-2">
              <Trees className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">6</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">Parks</p>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">4</p>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-300">Government</p>
              </div>
            </div>
          </div>

          {/* AI Spatial Insight Quote */}
          <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-black text-geovision-blue uppercase tracking-wider block">
              GeoVision AI Insight:
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium italic leading-relaxed">
              "{language === 'ar' ? aoiResult.insightAr : aoiResult.insightEn}"
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleClearDrawings}
        className="w-full py-3 rounded-2xl glass-level-1 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
        <span>Clear drawings{userDrawnShapes.length > 0 ? ` (${userDrawnShapes.length})` : ''}</span>
      </button>

      </div>
    </div>
  );
};
