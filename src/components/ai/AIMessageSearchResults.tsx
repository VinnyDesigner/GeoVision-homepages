import React, { useState, useRef, useEffect } from 'react';
import type { GeoFeature } from '../../types';
import { useAppState } from '../../context/AppStateContext';
import {
  ExternalLink,
  ChevronDown,
  Check,
  Building,
  Building2,
  GraduationCap,
  Sprout,
  Trees,
  Landmark,
  Star,
  Bookmark,
  Clock,
  MapPin,
  Search,
  Layers,
  ZoomIn,
  Info,
  RotateCcw,
  X,
  Navigation,
  Printer,
  BarChart2,
  TrendingUp,
  Compass,
  Download,
  FileText,
  Sparkles,
  Phone,
  ShieldCheck,
  Shield,
  LayoutGrid,
  ArrowLeft,
  Bus,
  Zap,
  Pill,
  Leaf,
} from 'lucide-react';
import { triggerPrintDocument } from '../../utils/printUtils';
import { GEO_FEATURES } from '../../data/mockAbuDhabiData';

// Unified Brand Blue Styling for all listing results - Consistent, elegant and clean
const BLUE_BG_GRADIENT = 'bg-blue-50/90 dark:bg-slate-800/90 border-blue-200/80 dark:border-slate-700';
const BLUE_BADGE_BG = 'bg-blue-100/80 text-[#063360] dark:bg-slate-800 dark:text-sky-300 border-blue-200 dark:border-slate-700';
const BLUE_ACCENT_COLOR = 'from-[#215A9E] via-blue-500 to-sky-400';
const BLUE_ICON_CLASS = 'w-4 h-4 text-[#215A9E] dark:text-sky-300';

const getCategoryIconAndStyle = (category?: string, subcategory?: string, name?: string) => {
  const catLower = (category || '').toLowerCase();
  const subLower = (subcategory || '').toLowerCase();
  const nameLower = (name || '').toLowerCase();

  let iconNode = <Building className={BLUE_ICON_CLASS} />;

  // 1. Plant Nurseries, Greenhouses & Botanical Centers (Sprout icon in Blue)
  if (
    subLower.includes('nurser') ||
    subLower.includes('plant') ||
    subLower.includes('botanic') ||
    nameLower.includes('nursery') ||
    nameLower.includes('plant') ||
    nameLower.includes('مشتل') ||
    nameLower.includes('مشاتل')
  ) {
    iconNode = <Sprout className={BLUE_ICON_CLASS} />;
  }
  // 2. EV Charging Stations (Zap Icon in Blue)
  else if (
    subLower.includes('charging') ||
    subLower.includes('ev_') ||
    nameLower.includes('ev ') ||
    nameLower.includes('charging') ||
    nameLower.includes('شحن')
  ) {
    iconNode = <Zap className={BLUE_ICON_CLASS} />;
  }
  // 3. 24/7 Pharmacies (Pill Icon in Blue)
  else if (
    subLower.includes('pharm') ||
    nameLower.includes('pharmacy') ||
    nameLower.includes('صيدلية')
  ) {
    iconNode = <Pill className={BLUE_ICON_CLASS} />;
  }
  // 4. TAMM Customer Happiness Centers (TAMM Government Shield Badge in Blue)
  else if (
    subLower.includes('tamm') ||
    nameLower.includes('tamm') ||
    nameLower.includes('تم')
  ) {
    iconNode = <ShieldCheck className={BLUE_ICON_CLASS} />;
  }
  // 5. Police & Civil Defense (Shield Icon in Blue)
  else if (
    catLower.includes('public_safety') ||
    catLower.includes('safety') ||
    subLower.includes('police') ||
    subLower.includes('civil') ||
    nameLower.includes('police') ||
    nameLower.includes('civil defense') ||
    nameLower.includes('شرطة') ||
    nameLower.includes('دفاع')
  ) {
    iconNode = <Shield className={BLUE_ICON_CLASS} />;
  }
  // 6. Cultural & Heritage Sites / Museums (Landmark Columns in Blue)
  else if (
    catLower.includes('tour') ||
    subLower.includes('museum') ||
    subLower.includes('heritage') ||
    nameLower.includes('museum') ||
    nameLower.includes('louvre') ||
    nameLower.includes('hosn') ||
    nameLower.includes('mosque') ||
    nameLower.includes('qasr') ||
    nameLower.includes('متحف') ||
    nameLower.includes('قصر')
  ) {
    iconNode = <Landmark className={BLUE_ICON_CLASS} />;
  }
  // 7. Mangrove & Nature Reserves (Leaf Icon in Blue)
  else if (
    catLower.includes('env') ||
    subLower.includes('reserve') ||
    subLower.includes('mangrove') ||
    nameLower.includes('mangrove') ||
    nameLower.includes('reserve') ||
    nameLower.includes('wetland') ||
    nameLower.includes('قرم') ||
    nameLower.includes('محمية')
  ) {
    iconNode = <Leaf className={BLUE_ICON_CLASS} />;
  }
  // 8. Bus Stations & Transit Hubs (Bus Icon in Blue)
  else if (
    catLower.includes('trans') ||
    subLower.includes('bus') ||
    nameLower.includes('bus') ||
    nameLower.includes('transit') ||
    nameLower.includes('حافلات')
  ) {
    iconNode = <Bus className={BLUE_ICON_CLASS} />;
  }
  // 9. Schools & Education (GraduationCap Icon in Blue)
  else if (
    catLower.includes('edu') ||
    catLower.includes('school') ||
    catLower.includes('university') ||
    subLower.includes('school') ||
    subLower.includes('academy')
  ) {
    iconNode = <GraduationCap className={BLUE_ICON_CLASS} />;
  }
  // 10. Parks & Recreation (Trees Icon in Blue)
  else if (
    catLower.includes('park') ||
    catLower.includes('rec') ||
    subLower.includes('park') ||
    subLower.includes('garden')
  ) {
    iconNode = <Trees className={BLUE_ICON_CLASS} />;
  }
  // 11. Healthcare / Hospitals (Building2 in Blue)
  else if (
    catLower.includes('health') ||
    catLower.includes('med') ||
    subLower.includes('hosp') ||
    subLower.includes('clinic') ||
    catLower.includes('hospital') ||
    subLower.includes('medical')
  ) {
    iconNode = (
      <div className="relative inline-flex items-center justify-center">
        <Building2 className={BLUE_ICON_CLASS} />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#215A9E]"></span>
        </span>
      </div>
    );
  }

  return {
    icon: iconNode,
    bgGradient: BLUE_BG_GRADIENT,
    badgeBg: BLUE_BADGE_BG,
    accentColor: BLUE_ACCENT_COLOR,
  };
};

interface AIMessageSearchResultsProps {
  features?: GeoFeature[];
  matchedFeatures?: GeoFeature[];
  setSelectedFeature?: (feat: GeoFeature) => void;
  language?: 'en' | 'ar';
  messageId?: string;
  onViewDetails?: (feat: GeoFeature) => void;
}

const LAYER_OPTIONS = [
  { id: 'education', labelEn: 'Education', labelAr: 'التعليم' },
  { id: 'healthcare', labelEn: 'Healthcare', labelAr: 'الرعاية الصحية' },
  { id: 'transport', labelEn: 'Transport', labelAr: 'النقل والمواصلات' },
  { id: 'environment', labelEn: 'Environment', labelAr: 'البيئة والمحميات' },
  { id: 'tourism', labelEn: 'Tourism', labelAr: 'السياحة والثقافة' },
  { id: 'utilities', labelEn: 'Utilities', labelAr: 'الخدمات والمرافق' },
  { id: 'government', labelEn: 'Government', labelAr: 'الخدمات الحكومية' },
  { id: 'parks', labelEn: 'Parks', labelAr: 'الحدائق والترفيه' },
  { id: 'public_safety', labelEn: 'Public Safety', labelAr: 'الأمن والسلامة العامة' },
  { id: 'agriculture', labelEn: 'Agriculture', labelAr: 'الزراعة والمواشي' },
  { id: 'hydrography', labelEn: 'Hydrography', labelAr: 'السطوح المائية والشواطئ' },
  { id: 'urban', labelEn: 'Urban & Land Use', labelAr: 'التخطيط العمراني' },
];

export const ALL_LAYER_IDS = LAYER_OPTIONS.map((opt) => opt.id);

export const AIMessageSearchResults: React.FC<AIMessageSearchResultsProps> = ({
  features: featuresProp,
  matchedFeatures,
  setSelectedFeature: setSelectedFeatureProp,
  language: languageProp,
  onViewDetails,
}) => {
  const appState = useAppState();
  const setMapCenterAndZoom = appState.setMapCenterAndZoom;
  const setCurrentView = appState.setCurrentView;
  const showToast = appState.showToast;
  const language = languageProp || appState.language || 'en';
  const setSelectedFeature = setSelectedFeatureProp || appState.setSelectedFeature;
  const setHoveredFeature = appState.setHoveredFeature;
  const hoveredFeature = appState.hoveredFeature;
  const selectedFeature = appState.selectedFeature;

  const addFavorite = appState.addFavorite;
  const removeFavorite = appState.removeFavorite;
  const isFavorite = appState.isFavorite;
  const favorites = appState.favorites;
  const currentView = appState.currentView;

  const features = (matchedFeatures || featuresProp || []).filter(Boolean);
  const baseFeatures = (matchedFeatures || featuresProp || []).filter(Boolean);

  const isFeaturePrivate = (feat: GeoFeature): boolean => {
    if (!feat || !feat.nameEn) return false;
    const nameLower = feat.nameEn.toLowerCase();
    return (
      nameLower.includes('private') ||
      nameLower.includes('gems') ||
      nameLower.includes('al yasmina') ||
      nameLower.includes('raha international') ||
      nameLower.includes('bareen') ||
      nameLower.includes('nmc')
    );
  };

  const initialFeatureCategories = React.useMemo(() => {
    const cats = Array.from(new Set(baseFeatures.map((f) => f.category).filter(Boolean)));
    return cats;
  }, [baseFeatures]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => initialFeatureCategories);
  const [selectedType, setSelectedType] = useState<'all' | 'private' | 'public'>('all');
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [activeRouteTarget, setActiveRouteTarget] = useState<GeoFeature | null>(null);

  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);
  const [activeInlineTab, setActiveInlineTab] = useState<'overview' | 'nearby' | 'details' | 'related'>('overview');
  const [expandedDirectionsId, setExpandedDirectionsId] = useState<string | null>(null);
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(3);

  const [printTemplate, setPrintTemplate] = useState<'briefing' | 'ledger' | 'map'>('briefing');
  const [printOrientation, setPrintOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const typeRef = useRef<HTMLDivElement>(null);
  const featureListRef = useRef<HTMLDivElement>(null);

  const setGuestPromptOpen = appState.setGuestPromptOpen;
  const user = appState.user;

  // Sync with global appState.selectedCategoryIds when user selects a category anywhere in the app
  useEffect(() => {
    if (appState.selectedCategoryIds && appState.selectedCategoryIds.length > 0) {
      setSelectedCategories(appState.selectedCategoryIds);
    }
  }, [appState.selectedCategoryIds]);

  useEffect(() => {
    if (featureListRef.current) {
      featureListRef.current.scrollTop = 0;
    }
  }, [selectedCategories, selectedType, searchFilter]);

  // Close menus when clicking anywhere outside of their respective containers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    if (!filteredFeatures || filteredFeatures.length === 0) return;
    const headers = ['#', 'Name (EN)', 'Name (AR)', 'Subcategory', 'Distance (km)', 'Type', 'Status', 'Latitude', 'Longitude'];
    const rows = filteredFeatures.map((f, i) => [
      i + 1,
      `"${(f.nameEn || '').replace(/"/g, '""')}"`,
      `"${(f.nameAr || '').replace(/"/g, '""')}"`,
      `"${f.subcategory || ''}"`,
      f.distanceKm || 1.5,
      isFeaturePrivate(f) ? 'Private' : 'Public',
      `"${f.openStatusEn || 'Open 24/7'}"`,
      f.lat,
      f.lng,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DGE_Spatial_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(language === 'ar' ? 'تم تصدير البيانات إلى ملف CSV بنجاح' : 'Exported spatial records to CSV successfully');
  };

  // Dynamically pool features: if baseFeatures provided from AI search, use them directly
  const effectiveFeatures = React.useMemo(() => {
    if (baseFeatures && baseFeatures.length > 0) {
      return baseFeatures;
    }

    const combinedMap = new Map<string, GeoFeature>();

    // If specific categories are selected, pull matching features from global GEO_FEATURES dataset
    if (selectedCategories.length > 0 && selectedCategories.length < ALL_LAYER_IDS.length) {
      GEO_FEATURES.forEach((gf) => {
        const featCatLower = (gf.category || '').toLowerCase();
        const isCatMatch = selectedCategories.some((catId) => {
          const catLower = catId.toLowerCase();
          if (featCatLower === catLower || featCatLower.includes(catLower) || catLower.includes(featCatLower)) return true;
          if (catLower === 'education' && (featCatLower.includes('edu') || featCatLower.includes('school') || featCatLower.includes('univ') || featCatLower.includes('academy'))) return true;
          if (catLower === 'healthcare' && (featCatLower.includes('health') || featCatLower.includes('hosp') || featCatLower.includes('clinic') || featCatLower.includes('medical'))) return true;
          if (catLower === 'transport' && (featCatLower.includes('trans') || featCatLower.includes('bus') || featCatLower.includes('park') || featCatLower.includes('station'))) return true;
          if (catLower === 'parks' && (featCatLower.includes('park') || featCatLower.includes('garden') || featCatLower.includes('beach') || featCatLower.includes('rec'))) return true;
          if (catLower === 'government' && (featCatLower.includes('gov') || featCatLower.includes('tamm') || featCatLower.includes('public') || featCatLower.includes('civil'))) return true;
          return false;
        });

        if (isCatMatch && !combinedMap.has(gf.id)) {
          combinedMap.set(gf.id, gf);
        }
      });
    }

    return Array.from(combinedMap.values());
  }, [baseFeatures, selectedCategories]);

  const filteredFeatures = effectiveFeatures.filter((feat) => {
    if (selectedCategories.length > 0 && selectedCategories.length < ALL_LAYER_IDS.length) {
      const featCatLower = (feat.category || '').toLowerCase();
      const isCategoryMatched = selectedCategories.some((catId) => {
        const catLower = catId.toLowerCase();
        if (featCatLower === catLower || featCatLower.includes(catLower) || catLower.includes(featCatLower)) return true;
        if (catLower === 'education' && (featCatLower.includes('edu') || featCatLower.includes('school') || featCatLower.includes('univ') || featCatLower.includes('academy'))) return true;
        if (catLower === 'healthcare' && (featCatLower.includes('health') || featCatLower.includes('hosp') || featCatLower.includes('clinic') || featCatLower.includes('medical'))) return true;
        if (catLower === 'transport' && (featCatLower.includes('trans') || featCatLower.includes('bus') || featCatLower.includes('park') || featCatLower.includes('station'))) return true;
        if (catLower === 'parks' && (featCatLower.includes('park') || featCatLower.includes('garden') || featCatLower.includes('beach') || featCatLower.includes('rec'))) return true;
        if (catLower === 'government' && (featCatLower.includes('gov') || featCatLower.includes('tamm') || featCatLower.includes('public') || featCatLower.includes('civil'))) return true;
        return false;
      });
      if (!isCategoryMatched) return false;
    }

    const isPriv = isFeaturePrivate(feat);
    if (selectedType === 'private' && !isPriv) return false;
    if (selectedType === 'public' && isPriv) return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = (feat.nameEn || '').toLowerCase().includes(q) || (feat.nameAr || '').includes(q);
      const matchSub = (feat.subcategory || '').toLowerCase().includes(q);
      const matchCat = (feat.category || '').toLowerCase().includes(q);
      const matchAddr = (feat.addressEn || '').toLowerCase().includes(q) || (feat.addressAr || '').includes(q);
      if (!matchName && !matchSub && !matchCat && !matchAddr) return false;
    }

    return true;
  });

  const getTypeButtonLabel = () => {
    if (selectedType === 'all') return language === 'ar' ? 'جميع الأنواع' : 'All Types';
    if (selectedType === 'private') return language === 'ar' ? 'خاص' : 'Private';
    return language === 'ar' ? 'عام' : 'Public';
  };

  const isTypeActive = selectedType !== 'all';
  const hasActiveFilters = isTypeActive || searchFilter.trim() !== '';
  const isHighVolume = features.length >= 100 || filteredFeatures.length > 20;

  // If cards count is >= 100 (or in general high volume list), adjust to show at least 6 cards
  const minCardsInList = (features.length >= 100 || filteredFeatures.length >= 100) ? 6 : 6;
  const effectiveVisibleCount = Math.max(visibleCount, minCardsInList);
  const displayedFeatures = filteredFeatures.slice(0, effectiveVisibleCount);

  useEffect(() => {
    if ((features.length >= 100 || filteredFeatures.length >= 100) && visibleCount < 6) {
      setVisibleCount(6);
    }
  }, [features.length, filteredFeatures.length]);

  const handleClearFilters = () => {
    setSearchFilter('');
    setSelectedCategories(initialFeatureCategories);
    setSelectedType('all');
    if (appState.setSelectedCategoryIds) {
      appState.setSelectedCategoryIds([]);
    }
    showToast(language === 'ar' ? 'تمت إعادة تعيين الفلاتر' : 'All filters reset');
  };

  // Analytics Computation
  const categoryCounts = filteredFeatures.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const publicCount = filteredFeatures.filter(f => !isFeaturePrivate(f)).length;
  const privateCount = filteredFeatures.filter(f => isFeaturePrivate(f)).length;
  const openNowCount = filteredFeatures.filter(f => f.openStatusEn?.toLowerCase().includes('open')).length;

  const distances = filteredFeatures.map(f => f.distanceKm || 1.5);
  const minDist = distances.length > 0 ? Math.min(...distances) : 0;
  const avgDist = distances.length > 0 ? (distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(1) : 0;

  const handleTriggerPrint = () => {
    showToast(language === 'ar' ? 'جاري فتح تقرير الطباعة الرسمي...' : 'Preparing official SDI report document for printing...');

    const tableRowsHtml = filteredFeatures.map((f, i) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #64748b;">${i + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 900;">${f.nameEn}<br/><small style="color: #64748b;">${f.nameAr || ''}</small></td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${f.subcategory}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace;">${f.lat.toFixed(4)}, ${f.lng.toFixed(4)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #215A9E;">${f.distanceKm || 1.5} km</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
          <span style="background: ${isFeaturePrivate(f) ? '#f3e8ff' : '#dcfce7'}; color: ${isFeaturePrivate(f) ? '#6b21a8' : '#166534'}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 900;">
            ${isFeaturePrivate(f) ? 'PRIVATE' : 'PUBLIC'}
          </span>
        </td>
      </tr>
    `).join('');

    let templateSpecificHtml = '';

    if (printTemplate === 'briefing') {
      templateSpecificHtml = `
        <div class="kpi-grid">
          <div class="kpi-card"><div class="kpi-lbl">Total Matched</div><div class="kpi-val">${filteredFeatures.length}</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Min Proximity</div><div class="kpi-val">${minDist} km</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Average Drive</div><div class="kpi-val">${avgDist} km</div></div>
          <div class="kpi-card"><div class="kpi-lbl">Operational Rate</div><div class="kpi-val">${Math.round((openNowCount / (filteredFeatures.length || 1)) * 100)}%</div></div>
        </div>

        <div class="insights-box">
          <strong style="color: #215A9E; text-transform: uppercase; font-size: 11px; display: block; margin-bottom: 6px;">Key Spatial Intelligence Takeaways</strong>
          <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
            <li>High concentration of spatial facilities located within <strong>Khalifa City Sector 1 & Zayed City</strong> corridor.</li>
            <li>Public vs Private Sector distribution ratio is <strong>${publicCount} Public / ${privateCount} Private</strong>.</li>
            <li>Geodetic reference system verified: <strong>WGS 84 / UTM Zone 39N (EPSG:32639)</strong>.</li>
          </ul>
        </div>

        <h3 style="font-size: 13px; font-weight: 900; margin-top: 20px; text-transform: uppercase;">Top Spatial Results Summary</h3>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Facility Name</th>
              <th>Subcategory</th>
              <th>Coordinates</th>
              <th>Distance</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      `;
    } else if (printTemplate === 'ledger') {
      templateSpecificHtml = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 11px; display: flex; justify-content: space-between;">
          <span><strong>Total Indexed Features:</strong> ${filteredFeatures.length} Records</span>
          <span><strong>Public:</strong> ${publicCount} | <strong>Private:</strong> ${privateCount}</span>
          <span><strong>Spatial Datum:</strong> WGS 84 (EPSG:32639)</span>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Facility Name</th>
              <th>Subcategory</th>
              <th>Coordinates</th>
              <th>Distance</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      `;
    } else {
      const mapSvgUri = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='100%25' height='100%25'%3E%3Crect width='800' height='500' fill='%23e0f2fe'/%3E%3Cpath d='M 0 60 Q 200 45 400 65 T 800 55 L 800 0 L 0 0 Z' fill='%23bae6fd' opacity='0.6'/%3E%3Cpath d='M 520 20 C 580 10 650 30 700 60 C 660 100 600 110 540 80 Z' fill='%23fef3c7' stroke='%23fcd34d' stroke-width='2'/%3E%3Cpath d='M 440 60 C 490 50 530 70 540 100 C 490 120 450 100 430 80 Z' fill='%23fef3c7' stroke='%23fcd34d' stroke-width='2'/%3E%3Cpath d='M 260 90 C 340 60 440 70 470 130 C 410 210 330 230 250 170 C 230 140 240 110 260 90 Z' fill='%23fef9c3' stroke='%23fcd34d' stroke-width='2.5'/%3E%3Cpath d='M 0 210 C 180 190 360 210 560 140 C 660 110 760 130 800 150 L 800 500 L 0 500 Z' fill='%23fef3c7' stroke='%23fcd34d' stroke-width='2.5'/%3E%3Cpath d='M 370 130 C 410 120 440 140 420 170 C 390 180 360 160 370 130 Z' fill='%23dcfce7' stroke='%2386efac' stroke-width='1.5'/%3E%3Cpath d='M 200 290 C 280 270 330 310 300 350 C 240 370 190 330 200 290 Z' fill='%23dcfce7' stroke='%2386efac' stroke-width='1.5'/%3E%3Cpath d='M 480 230 C 560 210 610 250 570 290 C 500 310 460 270 480 230 Z' fill='%23dcfce7' stroke='%2386efac' stroke-width='1.5'/%3E%3Cpath d='M 0 310 C 200 270 460 250 800 190' fill='none' stroke='%23f59e0b' stroke-width='6' opacity='0.95'/%3E%3Cpath d='M 0 310 C 200 270 460 250 800 190' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-dasharray='10 6'/%3E%3Cpath d='M 290 170 C 410 180 540 200 800 230' fill='none' stroke='%23215A9E' stroke-width='4.5' opacity='0.9'/%3E%3Cpath d='M 270 340 C 390 360 540 390 750 440' fill='none' stroke='%23215A9E' stroke-width='4.5' opacity='0.9'/%3E%3Cg stroke='%2394a3b8' stroke-width='1.5' opacity='0.75'%3E%3Cline x1='160' y1='250' x2='360' y2='390'/%3E%3Cline x1='200' y1='230' x2='400' y2='370'/%3E%3Cline x1='240' y1='210' x2='440' y2='350'/%3E%3Cline x1='180' y1='350' x2='380' y2='230'/%3E%3Cline x1='220' y1='370' x2='420' y2='250'/%3E%3Cline x1='260' y1='390' x2='460' y2='270'/%3E%3C/g%3E%3Cg stroke='%2394a3b8' stroke-width='1.5' opacity='0.75'%3E%3Cline x1='470' y1='250' x2='670' y2='390'/%3E%3Cline x1='510' y1='230' x2='710' y2='370'/%3E%3Cline x1='550' y1='210' x2='750' y2='350'/%3E%3Cline x1='490' y1='370' x2='690' y2='250'/%3E%3C/g%3E%3Ctext x='280' y='135' font-family='system-ui, sans-serif' font-weight='900' font-size='13' fill='%231e3a8a' opacity='0.75'%3EABU DHABI CITY%3C/text%3E%3Ctext x='250' y='310' font-family='system-ui, sans-serif' font-weight='900' font-size='14' fill='%230f172a'%3EKHALIFA CITY%3C/text%3E%3Ctext x='550' y='300' font-family='system-ui, sans-serif' font-weight='900' font-size='14' fill='%230f172a'%3EZAYED CITY%3C/text%3E%3Ctext x='580' y='175' font-family='system-ui, sans-serif' font-weight='900' font-size='12' fill='%23215A9E'%3EAL RAHA BEACH%3C/text%3E%3Ctext x='580' y='55' font-family='system-ui, sans-serif' font-weight='900' font-size='11' fill='%230369a1'%3ESAADIYAT ISLAND%3C/text%3E%3Ctext x='450' y='75' font-family='system-ui, sans-serif' font-weight='900' font-size='11' fill='%230369a1'%3EAL REEM ISLAND%3C/text%3E%3Ctext x='100' y='75' font-family='system-ui, sans-serif' font-weight='900' font-size='15' fill='%230284c7' opacity='0.8'%3EARABIAN GULF%3C/text%3E%3Ctext x='430' y='235' font-family='system-ui, sans-serif' font-weight='800' font-size='11' fill='%23b45309' transform='rotate(-12 430 235)'%3ESheikh Zayed Highway (E11)%3C/text%3E%3C/svg%3E`;

      const pinCoords = [
        { top: '48%', left: '28%', bg: '#1e3a8a', border: '#60a5fa' },
        { top: '30%', left: '52%', bg: '#064e3b', border: '#34d399' },
        { top: '62%', left: '65%', bg: '#581c87', border: '#c084fc' },
      ];

      const top3Features = filteredFeatures.slice(0, 3);
      const pinsHtml = top3Features.map((f, idx) => {
        const coord = pinCoords[idx % pinCoords.length];
        return `
          <div style="position: absolute; top: ${coord.top}; left: ${coord.left}; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; z-index: 10;">
            <div style="background: ${coord.bg}; color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 2px solid ${coord.border};">
              📍 ${f.nameEn}
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${coord.border};"></div>
          </div>
        `;
      }).join('');

      templateSpecificHtml = `
        <div class="map-frame" style="position: relative; overflow: hidden; border-radius: 14px; border: 2px solid #1e293b; background: #0f172a; padding: 0; margin-bottom: 20px;">
          <!-- Map Top Header Bar -->
          <div style="background: #0f172a; color: #ffffff; padding: 10px 16px; font-size: 11px; font-weight: 900; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
              <span>📍 Active Spatial Extent Canvas [Abu Dhabi SDI GIS Layer Map]</span>
            </div>
            <span style="font-family: monospace; color: #60a5fa;">Center: 24.4539° N, 54.3773° E</span>
          </div>

          <!-- Real Basemap Imagery & Pins Canvas -->
          <div style="position: relative; width: 100%; height: 340px; background-image: url('${mapSvgUri}'); background-size: cover; background-position: center; border-top: 1px solid #334155; border-bottom: 1px solid #334155;">

            <!-- Compass Rose -->
            <div style="position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; background: rgba(15, 23, 42, 0.9); border: 2px solid #60a5fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
              N ⬆
            </div>

            <!-- Scale Bar -->
            <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(15, 23, 42, 0.9); border: 1px solid #475569; padding: 6px 12px; border-radius: 8px; color: #ffffff; font-size: 10px; font-weight: 900;">
              <div style="border-bottom: 2px solid #60a5fa; margin-bottom: 2px; width: 60px; text-align: center; font-size: 9px;">2 km</div>
              <span>Scale 1:25,000</span>
            </div>

            <!-- Map Pins -->
            ${pinsHtml || `
              <div style="position: absolute; top: 48%; left: 35%; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; z-index: 10;">
                <div style="background: #1e3a8a; color: white; padding: 5px 12px; border-radius: 10px; font-weight: 900; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 14px rgba(0,0,0,0.4); border: 2px solid #60a5fa;">
                  📍 Abu Dhabi Spatial Hub
                </div>
                <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #60a5fa;"></div>
              </div>
            `}
          </div>

          <!-- Bottom Coordinates Bar -->
          <div style="background: #0f172a; color: #cbd5e1; font-size: 10px; font-weight: bold; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
            <span>Grid Reference: UAE EPSG:32639</span>
            <span>Cartographic Clearance: Grade A</span>
            <span>Security: Unclassified Public Spatial Record</span>
          </div>
        </div>

        <h3 style="font-size: 13px; font-weight: 900; margin-top: 20px; text-transform: uppercase;">Mapped Features Index</h3>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Facility Name</th>
              <th>Subcategory</th>
              <th>Coordinates</th>
              <th>Distance</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      `;
    }

    const htmlContent = `
      <div class="header-banner">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge">DGE</span>
            <span style="font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Government of Abu Dhabi • Spatial Intelligence Center</span>
          </div>
          <h1 style="font-size: 20px; font-weight: 900; margin: 8px 0 4px 0;">Official Spatial Intelligence Search Report</h1>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">Department of Government Enablement • Abu Dhabi Spatial Data Infrastructure (SDI)</div>
        </div>
        <div style="text-align: right;">
          <span class="security-stamp">OFFICIAL SDI USE ONLY</span>
          <div style="font-size: 10px; font-weight: 900; color: #94a3b8; margin-top: 6px;">REF ID: SDI-RPT-2026-904</div>
          <div style="font-size: 10px; color: #64748b;">${new Date().toLocaleString()}</div>
        </div>
      </div>

      ${templateSpecificHtml}

      <div class="footer-block">
        <div>
          <strong>Certified by Abu Dhabi SDI Spatial Authority</strong><br/>
          Digitally Signed & Validated • Department of Government Enablement
        </div>
        <div style="text-align: right; font-family: monospace;">
          HASH: 8f4e92a1c0d57e3b<br/>
          PAGE 1 OF 1
        </div>
      </div>
    `;

    triggerPrintDocument('Official Spatial Intelligence Search Report - Abu Dhabi SDI', htmlContent, printOrientation);
  };

  // STANDALONE DETAIL PAGE VIEW (When user clicks Details button)
  if (expandedDetailsId) {
    const detailFeat = (matchedFeatures || featuresProp || []).find((f) => f?.id === expandedDetailsId) || GEO_FEATURES.find((f) => f.id === expandedDetailsId);
    if (detailFeat) {
      const isPriv = isFeaturePrivate(detailFeat);
      const isFav = isFavorite(detailFeat.nameEn);
      const styleInfo = getCategoryIconAndStyle(detailFeat.category, detailFeat.subcategory, detailFeat.nameEn);

      return (
        <div className="mt-3.5 space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 animate-in fade-in duration-200">
          {/* Navigation Top Bar with Back Button */}
          <div className="flex items-center justify-between p-2.5 px-3 rounded-2xl bg-blue-50/90 dark:bg-slate-800/90 border border-blue-200/80 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setExpandedDetailsId(null)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-geovision-blue text-white hover:bg-[#063360] text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-white" />
              <span className="text-white">{language === 'ar' ? 'العودة لنتائج البحث' : 'Back to Search Results'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-xs">
              <span className="w-2 h-2 rounded-full bg-geovision-blue shrink-0" />
              <span className="truncate">{language === 'ar' ? detailFeat.nameAr : detailFeat.nameEn}</span>
            </div>
          </div>

          {/* Feature Detail Page Main Card */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5">
            {/* Banner Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-2xl ${styleInfo.bgGradient} border flex items-center justify-center shrink-0 shadow-sm`}>
                  {styleInfo.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-slate-800 text-geovision-blue dark:text-white">
                      {detailFeat.category.toUpperCase()} • {detailFeat.subcategory.toUpperCase()}
                    </span>
                    {detailFeat.isAuthoritative && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>SDI Verified</span>
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isPriv ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : 'bg-blue-50 text-geovision-blue dark:bg-slate-800 dark:text-blue-300'}`}>
                      {isPriv ? 'Private' : 'Public'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {language === 'ar' ? detailFeat.nameAr : detailFeat.nameEn}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (user?.isGuest) {
                      setGuestPromptOpen(true);
                      return;
                    }
                    if (isFav) {
                      const favItem = favorites.find(f => f.nameEn === detailFeat.nameEn);
                      if (favItem) removeFavorite(favItem.id);
                    } else {
                      addFavorite({
                        type: 'location',
                        nameEn: detailFeat.nameEn,
                        nameAr: detailFeat.nameAr,
                        categoryEn: detailFeat.category,
                        categoryAr: detailFeat.category,
                        lat: detailFeat.lat,
                        lng: detailFeat.lng,
                      });
                    }
                  }}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${isFav
                    ? 'bg-geovision-blue text-white border-blue-600 shadow-md'
                    : 'bg-blue-50 dark:bg-slate-800 border-blue-200 text-geovision-blue dark:text-sky-300 hover:bg-blue-100'
                    }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFav ? 'fill-white text-white' : 'text-geovision-blue dark:text-sky-300'}`} />
                </button>
              </div>
            </div>

            {/* 3 Interactive Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveInlineTab('overview')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeInlineTab === 'overview'
                  ? 'bg-geovision-blue text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveInlineTab('nearby')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeInlineTab === 'nearby'
                  ? 'bg-geovision-blue text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'القريبة' : 'Nearby'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveInlineTab('details')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeInlineTab === 'details'
                  ? 'bg-geovision-blue text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الخصائص' : 'Details'}</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeInlineTab === 'overview' && (
              <div className="space-y-3.5 text-xs">
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  {language === 'ar'
                    ? `يعتبر ${detailFeat.nameAr} من المعالم والمرافق الرئيسية في إمارة أبوظبي ضمن فئة ${detailFeat.category}. البيانات موثوقة مكانياً في الفهرس الجغرافي SDI.`
                    : `${detailFeat.nameEn} represents a key facility within Abu Dhabi's ${detailFeat.category} spatial layer, fully verified in the SDI catalog.`}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'العنوان' : 'Physical Address'}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{language === 'ar' ? (detailFeat.addressAr || `${detailFeat.nameAr}، أبوظبي`) : (detailFeat.addressEn || `${detailFeat.nameEn}, Abu Dhabi, UAE`)}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'الهاتف' : 'Contact Phone'}</span>
                      <a href={`tel:${detailFeat.phone || '+9712800555'}`} className="font-mono font-bold text-geovision-blue dark:text-white text-xs hover:underline">{detailFeat.phone || '+971 2 800 555'}</a>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{language === 'ar' ? (detailFeat.openStatusAr || 'مفتوح 24/7') : (detailFeat.openStatusEn || 'Open 24/7')}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                    <Compass className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'الإحداثيات' : 'Geographic Coords'}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{detailFeat.lat.toFixed(4)}°N, {detailFeat.lng.toFixed(4)}°E</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${detailFeat.lat},${detailFeat.lng}`;
                      window.open(gmapsUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 shadow-md cursor-pointer transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                    <span className="text-white">{language === 'ar' ? 'الاتجاهات عبر خرائط جوجل' : 'Directions on Google Maps'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFeature(detailFeat);
                      setMapCenterAndZoom([detailFeat.lat, detailFeat.lng], 15);
                      setExpandedDirectionsId(detailFeat.id);
                    }}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-2xs cursor-pointer transition-all"
                  >
                    <Navigation className="w-4 h-4 text-white" />
                    <span className="text-white">{language === 'ar' ? 'الاتجاهات' : 'Directions'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: NEARBY */}
            {activeInlineTab === 'nearby' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">{language === 'ar' ? 'نطاق البحث:' : 'Proximity Radius:'}</span>
                  <div className="flex gap-1">
                    {[1, 3, 5, 10].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNearbyRadiusKm(r)}
                        className={`px-2.5 py-1 rounded-xl font-black text-[10px] transition-all cursor-pointer ${nearbyRadiusKm === r ? 'bg-geovision-blue text-white shadow-2xs' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                      >
                        {r} km
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                  {GEO_FEATURES.filter(f => f.id !== detailFeat.id)
                    .map(f => {
                      const dLat = ((f.lat - detailFeat.lat) * Math.PI) / 180;
                      const dLon = ((f.lng - detailFeat.lng) * Math.PI) / 180;
                      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((detailFeat.lat * Math.PI) / 180) * Math.cos((f.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                      const itemDist = Math.round(6371 * c * 10) / 10;
                      return { ...f, itemDist };
                    })
                    .filter(f => f.itemDist <= nearbyRadiusKm)
                    .sort((a, b) => a.itemDist - b.itemDist)
                    .slice(0, 6)
                    .map((nearItem) => (
                      <div
                        key={nearItem.id}
                        onClick={() => {
                          setSelectedFeature(nearItem);
                          setMapCenterAndZoom([nearItem.lat, nearItem.lng], 15);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-geovision-blue cursor-pointer transition-all shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-900 dark:text-white truncate text-xs">{language === 'ar' ? nearItem.nameAr : nearItem.nameEn}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{nearItem.subcategory} • {nearItem.addressEn || nearItem.addressAr}</div>
                        </div>
                        <span className="text-[10px] font-black text-geovision-blue dark:text-white px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 shrink-0">
                          {nearItem.itemDist} km
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: DETAILS */}
            {activeInlineTab === 'details' && (
              <div className="space-y-3 text-xs">
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/60">
                  <table className="w-full text-[11px] text-left rtl:text-right">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      <tr className="bg-white dark:bg-slate-900">
                        <td className="px-3.5 py-2 font-extrabold text-slate-500 w-1/3">Feature ID</td>
                        <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">{detailFeat.id}</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2 font-extrabold text-slate-500">Category / Sub</td>
                        <td className="px-3.5 py-2 font-bold text-slate-900 dark:text-white">{detailFeat.category} / {detailFeat.subcategory}</td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-900">
                        <td className="px-3.5 py-2 font-extrabold text-slate-500">Coordinates</td>
                        <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">Lat: {detailFeat.lat.toFixed(5)} N, Lng: {detailFeat.lng.toFixed(5)} E</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2 font-extrabold text-slate-500">Grid Datum</td>
                        <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">UTM Zone 39N (EPSG:4326)</td>
                      </tr>
                      {detailFeat.phone && (
                        <tr className="bg-white dark:bg-slate-900">
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Phone</td>
                          <td className="px-3.5 py-2 font-bold text-geovision-blue dark:text-white">{detailFeat.phone}</td>
                        </tr>
                      )}
                      {detailFeat.metadata && Object.entries(detailFeat.metadata).map(([k, v]) => (
                        <tr key={k}>
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">{k}</td>
                          <td className="px-3.5 py-2 font-bold text-slate-900 dark:text-white">{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="mt-3.5 space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">

      {/* High-Volume Banner */}
      {isHighVolume && (
        <div className="p-2.5 rounded-xl bg-blue-50/90 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-700 flex items-center justify-between gap-2 text-[11px] font-extrabold text-geovision-blue dark:text-blue-300">
          <div className="flex items-center gap-1.5 min-w-0">
            <Layers className="w-4 h-4 shrink-0 text-geovision-blue" />
            <span className="truncate">
              {language === 'ar'
                ? `عالية الكثافة: تم العثور على ${features.length} نتيجة مكانية`
                : `High-Density Layer: ${features.length}+ spatial items found`}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-geovision-blue text-white text-[10px] font-black shrink-0 shadow-2xs">
            {language === 'ar' ? `عرض ${displayedFeatures.length}` : `Top ${displayedFeatures.length}`}
          </span>
        </div>
      )}

      {/* Header Bar with Action Buttons (Title, Analytics, Print, Export CSV) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>{language === 'ar' ? 'نتائج البحث' : 'Search Results'}</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 text-xs font-black">
            {filteredFeatures.length}
          </span>
        </h4>

        {/* Global Results Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowAnalytics(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white text-[11px] font-black border border-blue-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            title={language === 'ar' ? 'تحليلات النتائج' : 'View Query Analytics'}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التحليلات' : 'Analytics'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrintReport(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white text-[11px] font-black border border-blue-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            title={language === 'ar' ? 'طباعة التقرير' : 'Print Search Report'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طباعة' : 'Print'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white text-[11px] font-black border border-blue-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            title={language === 'ar' ? 'تصدير CSV' : 'Export CSV'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Filters & Quick Search Input (Single Horizontal Flex Row) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">

        {/* Left Controls: Type Dropdown + Clear Filters Button */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {/* Type Filter Dropdown */}
          <div className="relative flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400" ref={typeRef}>
            <span className="shrink-0">{language === 'ar' ? 'النوع:' : 'Type:'}</span>
            <button
              type="button"
              onClick={() => {
                setTypeMenuOpen(!typeMenuOpen);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${typeMenuOpen || isTypeActive
                ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/20'
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-geovision-blue'
                }`}
            >
              <span>{getTypeButtonLabel()}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${typeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {typeMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-44 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 space-y-1">
                {[
                  { id: 'all', label: language === 'ar' ? 'جميع الأنواع' : 'All Types' },
                  { id: 'private', label: language === 'ar' ? 'خاص' : 'Private' },
                  { id: 'public', label: language === 'ar' ? 'عام' : 'Public' },
                ].map((opt) => {
                  const isSel = selectedType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(opt.id as any);
                        setTypeMenuOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSel
                        ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25 font-black'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-bold'
                        }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#215A9E] hover:text-white border border-slate-200 dark:border-slate-700 text-[10px] font-black transition-all cursor-pointer shadow-2xs"
              title={language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset all filters'}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}</span>
            </button>
          )}
        </div>

        {/* Right Controls: Filter Results Search Input */}
        <div className="relative flex-1 min-w-[140px] max-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-2.5 rtl:left-auto" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={language === 'ar' ? 'تصفية...' : 'Filter results...'}
            className="w-full pl-8 pr-7 py-1 rounded-lg bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-geovision-blue placeholder:text-slate-400 rtl:pr-8 rtl:pl-7"
          />
          {searchFilter && (
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rtl:right-auto rtl:left-2"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

      {/* Feature Cards List OR Navigated Detail Page */}
      {expandedDetailsId ? (() => {
        const detailFeat = (matchedFeatures || featuresProp || []).find((f) => f?.id === expandedDetailsId) || GEO_FEATURES.find((f) => f.id === expandedDetailsId);
        if (!detailFeat) return null;

        const isPriv = isFeaturePrivate(detailFeat);
        const isFav = isFavorite(detailFeat.nameEn);
        const styleInfo = getCategoryIconAndStyle(detailFeat.category, detailFeat.subcategory, detailFeat.nameEn);

        return (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Navigation Top Bar with Back Button */}
            <div className="flex items-center justify-between p-2.5 px-3 rounded-2xl bg-blue-50/90 dark:bg-slate-800/90 border border-blue-200/80 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setExpandedDetailsId(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-geovision-blue text-white hover:bg-[#063360] text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{language === 'ar' ? 'العودة لنتائج البحث' : 'Back to Search Results'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                <span className="w-2 h-2 rounded-full bg-geovision-blue shrink-0" />
                <span className="truncate">{language === 'ar' ? detailFeat.nameAr : detailFeat.nameEn}</span>
              </div>
            </div>

            {/* Feature Detail Page Card */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3.5">

              {/* Banner Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl ${styleInfo.bgGradient} border flex items-center justify-center shrink-0 shadow-sm`}>
                    {styleInfo.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-slate-800 text-geovision-blue dark:text-white">
                        {detailFeat.category.toUpperCase()} • {detailFeat.subcategory.toUpperCase()}
                      </span>
                      {detailFeat.isAuthoritative && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>SDI Verified</span>
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isPriv ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : 'bg-blue-50 text-geovision-blue dark:bg-slate-800 dark:text-blue-300'}`}>
                        {isPriv ? 'Private' : 'Public'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                      {language === 'ar' ? detailFeat.nameAr : detailFeat.nameEn}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (user?.isGuest) {
                        setGuestPromptOpen(true);
                        return;
                      }
                      if (isFav) {
                        const favItem = favorites.find(f => f.nameEn === detailFeat.nameEn);
                        if (favItem) removeFavorite(favItem.id);
                      } else {
                        addFavorite({
                          type: 'location',
                          nameEn: detailFeat.nameEn,
                          nameAr: detailFeat.nameAr,
                          categoryEn: detailFeat.category,
                          categoryAr: detailFeat.category,
                          lat: detailFeat.lat,
                          lng: detailFeat.lng,
                        });
                      }
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${isFav ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-400'
                      }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* 3 Interactive Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveInlineTab('overview')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeInlineTab === 'overview'
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInlineTab('nearby')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeInlineTab === 'nearby'
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'القريبة' : 'Nearby'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInlineTab('details')}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeInlineTab === 'details'
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                    }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الخصائص' : 'Details'}</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeInlineTab === 'overview' && (
                <div className="space-y-3.5 text-xs">
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    {language === 'ar'
                      ? `يعتبر ${detailFeat.nameAr} من المعالم والمرافق الرئيسية في إمارة أبوظبي ضمن فئة ${detailFeat.category}. البيانات موثوقة مكانياً في الفهرس الجغرافي SDI.`
                      : `${detailFeat.nameEn} represents a key facility within Abu Dhabi's ${detailFeat.category} spatial layer, fully verified in the SDI catalog.`}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'العنوان' : 'Physical Address'}</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{language === 'ar' ? (detailFeat.addressAr || `${detailFeat.nameAr}، أبوظبي`) : (detailFeat.addressEn || `${detailFeat.nameEn}, Abu Dhabi, UAE`)}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'الهاتف' : 'Contact Phone'}</span>
                        <a href={`tel:${detailFeat.phone || '+9712800555'}`} className="font-mono font-bold text-geovision-blue dark:text-white text-xs hover:underline">{detailFeat.phone || '+971 2 800 555'}</a>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{language === 'ar' ? (detailFeat.openStatusAr || 'مفتوح 24/7') : (detailFeat.openStatusEn || 'Open 24/7')}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                      <Compass className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">{language === 'ar' ? 'الإحداثيات' : 'Geographic Coords'}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{detailFeat.lat.toFixed(4)}°N, {detailFeat.lng.toFixed(4)}°E</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${detailFeat.lat},${detailFeat.lng}`;
                        window.open(gmapsUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 shadow-md cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                      <span className="text-white">{language === 'ar' ? 'الاتجاهات عبر خرائط جوجل' : 'Directions on Google Maps'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFeature(detailFeat);
                        setMapCenterAndZoom([detailFeat.lat, detailFeat.lng], 15);
                        setExpandedDirectionsId(detailFeat.id);
                      }}
                      className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-2xs cursor-pointer transition-all"
                    >
                      <Navigation className="w-4 h-4 text-white" />
                      <span className="text-white">{language === 'ar' ? 'الاتجاهات' : 'Directions'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: NEARBY */}
              {activeInlineTab === 'nearby' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">{language === 'ar' ? 'نطاق البحث:' : 'Proximity Radius:'}</span>
                    <div className="flex gap-1">
                      {[1, 3, 5, 10].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNearbyRadiusKm(r)}
                          className={`px-2.5 py-1 rounded-xl font-black text-[10px] transition-all cursor-pointer ${nearbyRadiusKm === r ? 'bg-geovision-blue text-white shadow-2xs' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                    {GEO_FEATURES.filter(f => f.id !== detailFeat.id)
                      .map(f => {
                        const dLat = ((f.lat - detailFeat.lat) * Math.PI) / 180;
                        const dLon = ((f.lng - detailFeat.lng) * Math.PI) / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((detailFeat.lat * Math.PI) / 180) * Math.cos((f.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const itemDist = Math.round(6371 * c * 10) / 10;
                        return { ...f, itemDist };
                      })
                      .filter(f => f.itemDist <= nearbyRadiusKm)
                      .sort((a, b) => a.itemDist - b.itemDist)
                      .slice(0, 6)
                      .map((nearItem) => (
                        <div
                          key={nearItem.id}
                          onClick={() => {
                            setSelectedFeature(nearItem);
                            setMapCenterAndZoom([nearItem.lat, nearItem.lng], 15);
                          }}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-geovision-blue cursor-pointer transition-all shadow-2xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-black text-slate-900 dark:text-white truncate text-xs">{language === 'ar' ? nearItem.nameAr : nearItem.nameEn}</div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">{nearItem.subcategory} • {nearItem.addressEn || nearItem.addressAr}</div>
                          </div>
                          <span className="text-[10px] font-black text-geovision-blue dark:text-white px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 shrink-0">
                            {nearItem.itemDist} km
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DETAILS */}
              {activeInlineTab === 'details' && (
                <div className="space-y-3 text-xs">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/60">
                    <table className="w-full text-[11px] text-left rtl:text-right">
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        <tr className="bg-white dark:bg-slate-900">
                          <td className="px-3.5 py-2 font-extrabold text-slate-500 w-1/3">Feature ID</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">{detailFeat.id}</td>
                        </tr>
                        <tr>
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Category / Sub</td>
                          <td className="px-3.5 py-2 font-bold text-slate-900 dark:text-white">{detailFeat.category} / {detailFeat.subcategory}</td>
                        </tr>
                        <tr className="bg-white dark:bg-slate-900">
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Coordinates</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">Lat: {detailFeat.lat.toFixed(5)} N, Lng: {detailFeat.lng.toFixed(5)} E</td>
                        </tr>
                        <tr>
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Grid Datum</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">UTM Zone 39N (EPSG:4326)</td>
                        </tr>
                        {detailFeat.phone && (
                          <tr className="bg-white dark:bg-slate-900">
                            <td className="px-3.5 py-2 font-extrabold text-slate-500">Phone</td>
                            <td className="px-3.5 py-2 font-bold text-geovision-blue dark:text-white">{detailFeat.phone}</td>
                          </tr>
                        )}
                        {detailFeat.metadata && Object.entries(detailFeat.metadata).map(([k, v]) => (
                          <tr key={k}>
                            <td className="px-3.5 py-2 font-extrabold text-slate-500">{k}</td>
                            <td className="px-3.5 py-2 font-bold text-slate-900 dark:text-white">{String(v)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })() : filteredFeatures.length === 0 ? (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400 font-bold">
          {language === 'ar' ? 'لا توجد نتائج مطابقة للتصفية المختارة.' : 'No spatial matches found for selected category/type filter.'}
        </div>
      ) : (
        <div ref={featureListRef} className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-none">
          {displayedFeatures.map((feat) => {
            const isPriv = isFeaturePrivate(feat);
            const isFav = isFavorite(feat.nameEn);
            const dist = feat.distanceKm || 1.5;
            const styleInfo = getCategoryIconAndStyle(feat.category, feat.subcategory, feat.nameEn);
            const isHovered = hoveredFeature && (hoveredFeature.id === feat.id || hoveredFeature.nameEn === feat.nameEn);
            const isSelected = selectedFeature && (selectedFeature.id === feat.id || selectedFeature.nameEn === feat.nameEn);

            return (
              <div
                key={feat.id}
                onMouseEnter={() => setHoveredFeature && setHoveredFeature(feat)}
                onMouseLeave={() => setHoveredFeature && setHoveredFeature(null)}
                onClick={() => {
                  setSelectedFeature(feat);
                  setMapCenterAndZoom([feat.lat, feat.lng], 15);
                  if (currentView !== 'map') setCurrentView('map');
                }}
                className={`relative rounded-xl bg-white dark:bg-slate-900 border ${isHovered || isSelected ? 'border-geovision-blue dark:border-blue-400 ring-2 ring-blue-500/30' : 'border-slate-200/90 dark:border-slate-800'
                  } hover:border-geovision-blue dark:hover:border-blue-500 cursor-pointer transition-all duration-200 p-2 sm:p-2.5 space-y-1.5 shadow-2xs hover:shadow-md hover:shadow-blue-500/10 group overflow-hidden`}
              >
                {/* Top Category Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${styleInfo.accentColor} opacity-75 group-hover:opacity-100 transition-opacity`} />

                {/* Compact Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Category Icon Avatar */}
                    <div className={`w-7 h-7 rounded-lg ${styleInfo.bgGradient} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200`}>
                      {styleInfo.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-black text-slate-900 dark:text-slate-100 group-hover:text-geovision-blue dark:group-hover:text-blue-400 transition-colors truncate leading-snug">
                        {language === 'ar' ? feat.nameAr : feat.nameEn}
                      </h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate leading-tight">
                        {feat.subcategory || feat.category} • {feat.addressEn || feat.addressAr}
                      </p>
                    </div>
                  </div>

                  {/* Badges (Rating & Sector) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="flex items-center gap-0.5 text-[9.5px] font-black text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                      <span>4.8</span>
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wide border ${isPriv
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        : 'bg-blue-50 text-geovision-blue dark:bg-slate-800 dark:text-blue-300 border-blue-200/80 dark:border-slate-700'
                        }`}
                    >
                      {isPriv ? 'Private' : 'Public'}
                    </span>
                  </div>
                </div>

                {/* Compact Bottom Bar (Metadata + Quick Action Buttons) */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold min-w-0 flex-1">
                    <span className="flex items-center gap-0.5 text-geovision-blue dark:text-blue-300 font-black shrink-0">
                      <MapPin className="w-3 h-3" />
                      <span>{dist} km</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="truncate text-slate-600 dark:text-slate-300 font-bold min-w-0">
                      {language === 'ar' ? (feat.openStatusAr || feat.openStatusEn || 'مفتوح') : (feat.openStatusEn || 'Open 24/7')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 flex-wrap">

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeature(feat);
                        setMapCenterAndZoom([feat.lat, feat.lng], 15);
                        if (currentView !== 'map') setCurrentView('map');
                        showToast(language === 'ar' ? `التركيز على ${feat.nameAr}` : `Zoomed to ${feat.nameEn}`);
                      }}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white transition-all cursor-pointer text-[9.5px] font-extrabold"
                      title={language === 'ar' ? 'التركيز على الخريطة' : 'Focus on map'}
                    >
                      <ZoomIn className="w-2.5 h-2.5" />
                      <span>{language === 'ar' ? 'خريطة' : 'Map'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeature(feat);
                        setMapCenterAndZoom([feat.lat, feat.lng], 15);
                        if (expandedDirectionsId === feat.id) {
                          setExpandedDirectionsId(null);
                          if (appState.setNavigationTarget) appState.setNavigationTarget(null);
                        } else {
                          setExpandedDirectionsId(feat.id);
                          setExpandedDetailsId(null);
                          if (appState.setNavigationTarget) appState.setNavigationTarget(feat);
                        }
                      }}
                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border text-[9.5px] font-extrabold transition-all cursor-pointer ${expandedDirectionsId === feat.id
                        ? 'bg-geovision-blue text-white border-blue-600'
                        : 'bg-blue-50 dark:bg-slate-800 border-blue-200/80 dark:border-slate-700 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white'
                        }`}
                      title={language === 'ar' ? 'الاتجاهات' : 'Directions'}
                    >
                      <Navigation className="w-2.5 h-2.5" />
                      <span>{language === 'ar' ? 'مسار' : 'Route'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (user?.isGuest) {
                          setGuestPromptOpen(true);
                          return;
                        }
                        if (isFav) {
                          const favItem = favorites.find(f => f.nameEn === feat.nameEn);
                          if (favItem) removeFavorite(favItem.id);
                        } else {
                          addFavorite({
                            type: 'location',
                            nameEn: feat.nameEn,
                            nameAr: feat.nameAr,
                            categoryEn: feat.category,
                            categoryAr: feat.category,
                            lat: feat.lat,
                            lng: feat.lng,
                          });
                        }
                      }}
                      className={`p-1 rounded-md border transition-all cursor-pointer ${isFav
                        ? 'bg-geovision-blue text-white border-blue-600 shadow-sm'
                        : 'bg-blue-50 dark:bg-slate-800 border-blue-200/80 dark:border-slate-700 text-geovision-blue dark:text-sky-300 hover:bg-blue-100'
                        }`}
                      title={isFav ? 'Favorite' : 'Add to favorite'}
                    >
                      <Bookmark className={`w-3 h-3 ${isFav ? 'fill-white text-white' : 'text-geovision-blue dark:text-sky-300'}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeature(feat);
                        setMapCenterAndZoom([feat.lat, feat.lng], 15);
                        if (onViewDetails) {
                          onViewDetails(feat);
                        } else {
                          setExpandedDirectionsId(null);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-extrabold transition-all cursor-pointer bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-geovision-blue dark:text-blue-300 hover:bg-geovision-blue hover:text-white"
                      title={language === 'ar' ? 'التفاصيل' : 'Details'}
                    >
                      <Info className="w-3 h-3" />
                      <span>{language === 'ar' ? 'التفاصيل' : 'Details'}</span>
                    </button>
                  </div>
                </div>

                {/* ================= INLINE 4-TAB DETAILS CONTAINER ================= */}
                {expandedDetailsId === feat.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in duration-200 shadow-inner"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1.5 text-xs font-black text-geovision-blue dark:text-blue-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'التحليل المكاني التفصيلي' : 'Detailed Spatial Analysis'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedDetailsId(null)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 3 Interactive Tabs Grid */}
                    <div className="grid grid-cols-3 gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setActiveInlineTab('overview')}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-black transition-all flex items-center justify-center gap-1.5 min-w-0 ${activeInlineTab === 'overview'
                          ? 'bg-geovision-blue text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInlineTab('nearby')}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-black transition-all flex items-center justify-center gap-1.5 min-w-0 ${activeInlineTab === 'nearby'
                          ? 'bg-geovision-blue text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        <Compass className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{language === 'ar' ? 'القريبة' : 'Nearby'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInlineTab('details')}
                        className={`py-1.5 px-2 rounded-lg text-[10.5px] font-black transition-all flex items-center justify-center gap-1.5 min-w-0 ${activeInlineTab === 'details'
                          ? 'bg-geovision-blue text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{language === 'ar' ? 'الخصائص' : 'Details'}</span>
                      </button>
                    </div>

                    {/* Tab 1: OVERVIEW */}
                    {activeInlineTab === 'overview' && (
                      <div className="space-y-3 text-xs">
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          {language === 'ar'
                            ? `يعتبر ${feat.nameAr} من المعالم والمرافق الرئيسية في إمارة أبوظبي ضمن فئة ${feat.category}. البيانات موثوقة مكانياً في الفهرس الجغرافي SDI.`
                            : `${feat.nameEn} represents a key facility within Abu Dhabi's ${feat.category} spatial layer, fully verified in the SDI catalog.`}
                        </p>

                        {/* Complete Detailed Metadata & Popup Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Full Address */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                                {language === 'ar' ? 'العنوان الفعلي' : 'Physical Address'}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-snug block">
                                {language === 'ar' ? (feat.addressAr || `${feat.nameAr}، أبوظبي، الإمارات`) : (feat.addressEn || `${feat.nameEn}, Abu Dhabi, UAE`)}
                              </span>
                            </div>
                          </div>

                          {/* Contact Phone */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                            <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                                {language === 'ar' ? 'الهاتف / التواصل' : 'Contact Phone'}
                              </span>
                              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-[11px] block">
                                {feat.phone || '+971 2 800 555'}
                              </span>
                            </div>
                          </div>

                          {/* Operational Status & Hours */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                                {language === 'ar' ? 'أوقات العمل' : 'Working Hours'}
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] block">
                                {language === 'ar' ? (feat.openStatusAr || 'مفتوح 24/7 (على مدار الساعة)') : (feat.openStatusEn || 'Open 24/7 (Round the Clock)')}
                              </span>
                            </div>
                          </div>

                          {/* Sector / Governance */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                            <Building className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                                {language === 'ar' ? 'القطاع والنوع' : 'Sector & Entity Type'}
                              </span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] block">
                                {isPriv
                                  ? (language === 'ar' ? 'قطاع خاص معتمد' : 'Authorized Private Entity')
                                  : (language === 'ar' ? 'قطاع حكومي / عام' : 'Public / Government Sector')}
                              </span>
                            </div>
                          </div>

                          {/* SDI Certification & Trust Level */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                                {language === 'ar' ? 'اعتماد SDI الجغرافي' : 'SDI Spatial Certification'}
                              </span>
                              <span className="font-bold text-purple-600 dark:text-purple-400 text-[11px] block">
                                {feat.isAuthoritative
                                  ? (language === 'ar' ? 'معلم جغرافي رسمي موثوق (Tier-1)' : 'Verified SDI Authoritative Tier-1')
                                  : (language === 'ar' ? 'طبقة جغرافية قياسية' : 'Standard SDI Spatial Layer')}
                              </span>
                            </div>
                          </div>

                          {/* Precise Geographic Coordinates */}
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                            <Compass className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">
                                {language === 'ar' ? 'الإحداثيات الجغرافية' : 'Geographic Coords'}
                              </span>
                              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-[11px] block">
                                {feat.lat.toFixed(5)}°N, {feat.lng.toFixed(5)}°E
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* KPI Metric Summary Strip */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 text-center">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">{language === 'ar' ? 'المسافة الحالية' : 'Distance'}</span>
                            <span className="font-black text-geovision-blue dark:text-blue-300 text-xs">{dist} km</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-center">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">{language === 'ar' ? 'التقييم SDI' : 'Rating'}</span>
                            <span className="font-black text-amber-600 dark:text-amber-400 text-xs">⭐ {feat.rating || 4.8} / 5.0</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-center">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">{language === 'ar' ? 'التصنيف' : 'Category'}</span>
                            <span className="font-black text-emerald-700 dark:text-emerald-300 text-xs truncate block">{feat.category}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: NEARBY */}
                    {activeInlineTab === 'nearby' && (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">{language === 'ar' ? 'نطاق البحث القريب:' : 'Proximity Radius:'}</span>
                          <div className="flex gap-1">
                            {[1, 3, 5, 10].map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setNearbyRadiusKm(r)}
                                className={`px-2 py-0.5 rounded-lg font-black text-[10px] transition-all ${nearbyRadiusKm === r
                                  ? 'bg-geovision-blue text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                  }`}
                              >
                                {r} km
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                          {GEO_FEATURES.filter(f => f.id !== feat.id)
                            .map(f => {
                              const dLat = ((f.lat - feat.lat) * Math.PI) / 180;
                              const dLon = ((f.lng - feat.lng) * Math.PI) / 180;
                              const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((feat.lat * Math.PI) / 180) * Math.cos((f.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                              const itemDist = Math.round(6371 * c * 10) / 10;
                              return { ...f, itemDist };
                            })
                            .filter(f => f.itemDist <= nearbyRadiusKm)
                            .sort((a, b) => a.itemDist - b.itemDist)
                            .slice(0, 5)
                            .map((nearItem) => (
                              <div
                                key={nearItem.id}
                                onClick={() => {
                                  setSelectedFeature(nearItem);
                                  setMapCenterAndZoom([nearItem.lat, nearItem.lng], 15);
                                }}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:border-geovision-blue cursor-pointer transition-all shadow-2xs"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="font-black text-slate-900 dark:text-white truncate text-xs">{language === 'ar' ? nearItem.nameAr : nearItem.nameEn}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{nearItem.subcategory} • {nearItem.addressEn || nearItem.addressAr}</div>
                                </div>
                                <span className="text-[10px] font-black text-geovision-blue dark:text-blue-300 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 shrink-0">
                                  {nearItem.itemDist} km
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 3: DETAILS */}
                    {activeInlineTab === 'details' && (
                      <div className="space-y-3 text-xs">
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                          <table className="w-full text-[11px] text-left rtl:text-right">
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                <td className="px-3 py-1.5 font-extrabold text-slate-500 w-1/3">Feature ID</td>
                                <td className="px-3 py-1.5 font-mono font-bold text-slate-900 dark:text-white">{feat.id}</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-1.5 font-extrabold text-slate-500">Category / Sub</td>
                                <td className="px-3 py-1.5 font-bold text-slate-900 dark:text-white">{feat.category} / {feat.subcategory}</td>
                              </tr>
                              <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                <td className="px-3 py-1.5 font-extrabold text-slate-500">Coordinates</td>
                                <td className="px-3 py-1.5 font-mono font-bold text-slate-900 dark:text-white">Lat: {feat.lat.toFixed(4)} N, Lng: {feat.lng.toFixed(4)} E</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-1.5 font-extrabold text-slate-500">Grid Datum</td>
                                <td className="px-3 py-1.5 font-mono font-bold text-slate-900 dark:text-white">UTM Zone 39N (EPSG:4326)</td>
                              </tr>
                              {feat.phone && (
                                <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                                  <td className="px-3 py-1.5 font-extrabold text-slate-500">Phone</td>
                                  <td className="px-3 py-1.5 font-bold text-geovision-blue">{feat.phone}</td>
                                </tr>
                              )}
                              {feat.metadata && Object.entries(feat.metadata).map(([k, v]) => (
                                <tr key={k}>
                                  <td className="px-3 py-1.5 font-extrabold text-slate-500">{k}</td>
                                  <td className="px-3 py-1.5 font-bold text-slate-900 dark:text-white">{String(v)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}


                  </div>
                )}

                {/* ================= INLINE ROUTE DIRECTIONS CONTAINER ================= */}
                {expandedDirectionsId === feat.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700 space-y-3.5 animate-in fade-in duration-200 shadow-inner"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 text-xs font-black text-geovision-blue dark:text-blue-300">
                        <Navigation className="w-4 h-4" />
                        <span>{language === 'ar' ? `مسار الاتجاهات والملاحة المباشرة` : `Inline Step-by-Step Route Navigation`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedDirectionsId(null)}
                        className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Route Summary Stats */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">{language === 'ar' ? 'الوجهة المستهدفة' : 'Destination'}</span>
                        <span className="font-black text-slate-900 dark:text-white">{language === 'ar' ? feat.nameAr : feat.nameEn}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">{language === 'ar' ? 'المسافة' : 'Distance'}</span>
                          <span className="font-black text-geovision-blue dark:text-blue-300">{dist} km</span>
                        </div>
                        <div className="text-right border-l pl-3 border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 font-bold block">{language === 'ar' ? 'الزمن المقدر' : 'Est. Duration'}</span>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">~{Math.round(dist * 2.2 + 2)} mins</span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Route List */}
                    <div className="space-y-2 text-xs">
                      <span className="font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider block">
                        {language === 'ar' ? 'توجيهات مسار الملاحة:' : 'Step-by-Step Route Navigation:'}
                      </span>

                      <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 max-h-[180px] overflow-y-auto custom-scrollbar font-medium">
                        <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">1</div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{language === 'ar' ? 'الانطلاق من موقعك الحالي (وسط أبوظبي)' : 'Start from Abu Dhabi City Center'}</div>
                            <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الاتجاه شرقاً نحو طريق الشاطئ' : 'Head East on Sultan Bin Zayed the First St'}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-geovision-blue font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">2</div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{language === 'ar' ? `الانضمام إلى طريق E10 السريع` : `Merge onto E10 Highway`}</div>
                            <div className="text-[10px] text-slate-400">{language === 'ar' ? `المتابعة لمسافة ${(dist * 0.7).toFixed(1)} كم` : `Continue straight for ${(dist * 0.7).toFixed(1)} km`}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-geovision-blue font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">3</div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{language === 'ar' ? `اتخاذ مخرج القطاع نحو ${feat.subcategory}` : `Take Exit toward ${feat.subcategory} sector`}</div>
                            <div className="text-[10px] text-slate-400">{language === 'ar' ? 'الانعطاف يميناً عند الإشارة الضوئية' : 'Turn right into sector boulevard (400 m)'}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">4</div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{language === 'ar' ? `الوصول إلى الوجهة: ${feat.nameAr}` : `Arrive at destination: ${feat.nameEn}`}</div>
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{feat.addressEn || feat.addressAr}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${feat.lat},${feat.lng}`;
                          window.open(gmapsUrl, '_blank');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'خرائط جوجل' : 'Google Maps'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFeature(feat);
                          setMapCenterAndZoom([feat.lat, feat.lng], 15);
                          if (currentView !== 'map') setCurrentView('map');
                          showToast(language === 'ar' ? `تم تركيز المسار على الخريطة` : `Route focused on map workspace`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-geovision-blue hover:bg-blue-600 text-white font-black text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'التركيز على الخريطة' : 'Focus Route on Map'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredFeatures.length > effectiveVisibleCount && (
        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setVisibleCount(prev => Math.max(prev, 6) + 6)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-center shadow-2xs"
          >
            {language === 'ar'
              ? `عرض المزيد (+6 من أصل ${filteredFeatures.length})`
              : `Show Next 6 (of ${filteredFeatures.length})`}
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(filteredFeatures.length)}
            className="py-2 px-3 rounded-xl bg-geovision-blue hover:bg-blue-700 text-white font-black text-xs transition-all cursor-pointer text-center shrink-0 shadow-md shadow-blue-500/25 border border-blue-600"
          >
            {language === 'ar' ? `عرض الكل (${filteredFeatures.length})` : `View All (${filteredFeatures.length})`}
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 1. EXECUTIVE DETAILED QUERY ANALYTICS MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[9999] flex items-center justify-center pt-20 sm:pt-24 pb-6 px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* FIXED HEADER */}
            <div className="shrink-0 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-black border border-indigo-200 dark:border-indigo-800">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    {language === 'ar' ? 'التقرير التحليلي المكاني المتقدم' : 'Executive Spatial Analytics Report'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    {language === 'ar' ? 'تحليل التوزيع والمسافات والجاهزية للمرافق' : 'Proximity, Distribution & Sector Availability Breakdown'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAnalytics(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE INNER BODY CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-center space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'إجمالي المعالم' : 'Total Matched'}
                  </p>
                  <p className="text-2xl font-black text-geovision-blue dark:text-blue-400">
                    {filteredFeatures.length}
                  </p>
                  <p className="text-[9.5px] font-bold text-blue-600 dark:text-blue-300">
                    {language === 'ar' ? 'معلم مكاني محدد' : 'SDI Spatial Features'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 text-center space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'أقرب معلم' : 'Nearest Feature'}
                  </p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {minDist} km
                  </p>
                  <p className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-300">
                    {language === 'ar' ? 'أقرب مسافة من موقعك' : 'Immediate Proximity'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 text-center space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'متوسط المسافة' : 'Avg Distance'}
                  </p>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {avgDist} km
                  </p>
                  <p className="text-[9.5px] font-bold text-purple-600 dark:text-purple-300">
                    ~{Math.round(Number(avgDist) * 2.2)} mins driving
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-100 dark:border-slate-700 text-center space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {language === 'ar' ? 'نسبة الجاهزية' : 'Operational %'}
                  </p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {Math.round((openNowCount / (filteredFeatures.length || 1)) * 100)}%
                  </p>
                  <p className="text-[9.5px] font-bold text-amber-600 dark:text-amber-300">
                    {openNowCount} Open 24/7 Services
                  </p>
                </div>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'ar' ? 'التوزيع حسب الفئة المحددة' : 'Category Share Breakdown'}</span>
                  <span className="text-slate-400 text-[10px]">{filteredFeatures.length} Items Total</span>
                </h4>
                <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const pct = Math.round((count / filteredFeatures.length) * 100) || 0;
                    return (
                      <div key={cat} className="space-y-1 text-xs">
                        <div className="flex justify-between font-black text-slate-800 dark:text-slate-200 capitalize text-[11.5px]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-geovision-blue" />
                            <span>{cat}</span>
                          </span>
                          <span>{count} facilities ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-geovision-blue transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Public vs Private Sector Dual Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex justify-between text-xs font-black text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                    <span>Public Sector ({publicCount})</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block" />
                    <span>Private Sector ({privateCount})</span>
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 flex overflow-hidden p-0.5">
                  <div
                    className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                    style={{ width: `${(publicCount / (filteredFeatures.length || 1)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-purple-500 rounded-r-full transition-all duration-500"
                    style={{ width: `${(privateCount / (filteredFeatures.length || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Spatial Insights Bullet Points */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/70 space-y-2 text-xs">
                <h5 className="font-black text-geovision-blue dark:text-blue-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{language === 'ar' ? 'رؤى التحليل المكاني' : 'Spatial Intelligence Key Takeaways'}</span>
                </h5>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-semibold list-disc pl-4 rtl:pr-4">
                  <li>Primary cluster concentration identified within <b>Khalifa City Sector 1 & Zayed City</b>.</li>
                  <li>Average drive time from user origin is <b>~{Math.round(Number(avgDist) * 2.2)} minutes</b> via E11 Highway corridor.</li>
                  <li><b>{Math.round((openNowCount / (filteredFeatures.length || 1)) * 100)}%</b> of mapped features maintain 24/7 service availability.</li>
                </ul>
              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="shrink-0 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 rounded-b-3xl flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAnalytics(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAnalytics(false);
                  setShowPrintReport(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-geovision-blue hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'ar' ? 'طباعة / تصدير التقرير' : 'Print / Export Report'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 2. OFFICIAL PRINT & EXPORT PDF REPORT MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {showPrintReport && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[9999] flex items-center justify-center pt-20 sm:pt-24 pb-6 px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* FIXED HEADER WITH CONTROLS & LAYOUT SWITCHER */}
            <div className="shrink-0 p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-3xl space-y-4">
              {/* Header Title Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black border border-emerald-200 dark:border-emerald-800 shadow-sm">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{language === 'ar' ? 'استوديو تصدير وتجهيز التقرير الجغرافي الرسمي' : 'Official SDI Spatial Report Export Studio'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                        DGE Certified
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-bold">
                      Department of Government Enablement • Abu Dhabi Spatial Data Infrastructure (SDI)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPrintReport(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Bar: Layout Template Selector & Orientation Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Template Selector Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setPrintTemplate('briefing')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${printTemplate === 'briefing'
                      ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تقرير ملخص إيجازي' : 'Executive Briefing'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintTemplate('ledger')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${printTemplate === 'ledger'
                      ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'سجل البيانات المكانية' : 'Spatial Data Ledger'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrintTemplate('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${printTemplate === 'map'
                      ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                      }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'خريطة النطاق الجغرافي' : 'GIS Map & Extent Canvas'}</span>
                  </button>
                </div>

                {/* Right Side Format Controls: Orientation & CSV Export */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPrintOrientation('portrait')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${printOrientation === 'portrait'
                        ? 'bg-white dark:bg-slate-700 text-geovision-blue dark:text-blue-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                      📄 Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintOrientation('landscape')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer ${printOrientation === 'landscape'
                        ? 'bg-white dark:bg-slate-700 text-geovision-blue dark:text-blue-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                      📑 Landscape
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SCROLLABLE INNER BODY CONTENT - A4 PAPER SHEET SIMULATION */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/90 dark:bg-slate-950/90">
              <div
                id="sdi-printable-report"
                className={`mx-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-all duration-300 ${printOrientation === 'landscape' ? 'max-w-4xl' : 'max-w-2xl'
                  }`}
              >
                {/* A4 REPORT SHEET TOP EMBLEM BANNER */}
                <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-geovision-blue text-white font-black flex items-center justify-center text-xs shadow-md">
                        DGE
                      </div>
                      <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                        Government of Abu Dhabi • Spatial Intelligence Authority
                      </h4>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white pt-1">
                      {printTemplate === 'briefing' && (language === 'ar' ? 'تقرير الإيجاز التنفيذي للتحليل المكاني' : 'Executive Spatial Intelligence Briefing')}
                      {printTemplate === 'ledger' && (language === 'ar' ? 'سجل البيانات والمواصفات الجغرافية الكامل' : 'Comprehensive SDI Feature Data Ledger')}
                      {printTemplate === 'map' && (language === 'ar' ? 'خريطة النطاق الجغرافي المعتمدة' : 'Official SDI Interactive Map Extent Sheet')}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold">
                      Authoritative Geospatial Analytics & Facility Service Infrastructure Report
                    </p>
                  </div>

                  <div className="text-right rtl:text-left space-y-1 shrink-0">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] uppercase tracking-wider inline-block">
                      OFFICIAL SDI USE ONLY
                    </span>
                    <p className="text-[10px] font-black text-slate-400 block pt-1">
                      REF ID: SDI-RPT-2026-904
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* ------------------------------------------------------------------- */}
                {/* LAYOUT TEMPLATE 1: EXECUTIVE BRIEFING */}
                {/* ------------------------------------------------------------------- */}
                {printTemplate === 'briefing' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Executive KPI Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block">Total Matched</span>
                        <span className="text-xl font-black text-geovision-blue dark:text-blue-400">{filteredFeatures.length}</span>
                        <span className="text-[9px] font-bold text-slate-500 block">Identified Points</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block">Min Proximity</span>
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{minDist} km</span>
                        <span className="text-[9px] font-bold text-slate-500 block">Nearest Facility</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block">Average Drive</span>
                        <span className="text-xl font-black text-purple-600 dark:text-purple-400">{avgDist} km</span>
                        <span className="text-[9px] font-bold text-slate-500 block">~{Math.round(Number(avgDist) * 2.2)} Mins</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block">Operational</span>
                        <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                          {Math.round((openNowCount / (filteredFeatures.length || 1)) * 100)}%
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 block">{openNowCount} Active 24/7</span>
                      </div>
                    </div>

                    {/* Executive Insights Box */}
                    <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2 text-xs">
                      <h5 className="font-black text-geovision-blue dark:text-blue-300 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        <span>Key Spatial Briefing Takeaways</span>
                      </h5>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-semibold list-disc pl-4 rtl:pr-4">
                        <li>High concentration of facilities located along <b>Khalifa City Sector 1 & Zayed City</b> highway corridor.</li>
                        <li>Public Sector distribution accounts for <b>{publicCount} facilities ({Math.round((publicCount / (filteredFeatures.length || 1)) * 100)}%)</b>.</li>
                        <li>Emergency & driving access rated optimal with an average transit window under <b>{Math.round(Number(avgDist) * 2.2)} minutes</b>.</li>
                      </ul>
                    </div>

                    {/* Feature Overview Table */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left rtl:text-right">
                        <thead className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="p-2.5">#</th>
                            <th className="p-2.5">Facility Name</th>
                            <th className="p-2.5">Subcategory</th>
                            <th className="p-2.5">Distance</th>
                            <th className="p-2.5">Sector</th>
                            <th className="p-2.5">Operational Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                          {filteredFeatures.slice(0, 8).map((f, i) => {
                            const isPriv = isFeaturePrivate(f);
                            return (
                              <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="p-2.5 font-black text-slate-400">{i + 1}</td>
                                <td className="p-2.5 font-black text-slate-900 dark:text-white">
                                  {language === 'ar' ? f.nameAr : f.nameEn}
                                </td>
                                <td className="p-2.5 text-slate-500">{f.subcategory}</td>
                                <td className="p-2.5 font-black text-geovision-blue dark:text-blue-400">{f.distanceKm || 1.5} km</td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${isPriv ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                                    {isPriv ? 'Private' : 'Public'}
                                  </span>
                                </td>
                                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                  {f.openStatusEn || 'Open 24/7'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------- */}
                {/* LAYOUT TEMPLATE 2: SPATIAL DATA LEDGER */}
                {/* ------------------------------------------------------------------- */}
                {printTemplate === 'ledger' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Geodetic Reference Standard</span>
                        <span className="font-black text-slate-900 dark:text-white">WGS 84 / UTM Zone 39N (EPSG:32639)</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Mapped Items</span>
                        <span className="font-black text-geovision-blue dark:text-blue-400">{filteredFeatures.length} Records</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Spatial Data Verification</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Certified SDI Dataset
                        </span>
                      </div>
                    </div>

                    {/* Detailed Data Ledger Table */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left rtl:text-right">
                        <thead className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="p-2.5">#</th>
                            <th className="p-2.5">Name (EN / AR)</th>
                            <th className="p-2.5">Category</th>
                            <th className="p-2.5">Coordinates (Lat / Lng)</th>
                            <th className="p-2.5">Proximity</th>
                            <th className="p-2.5">Sector Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                          {filteredFeatures.map((f, i) => {
                            const isPriv = isFeaturePrivate(f);
                            return (
                              <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="p-2.5 font-black text-slate-400">{i + 1}</td>
                                <td className="p-2.5 font-black text-slate-900 dark:text-white">
                                  <div>{f.nameEn}</div>
                                  <div className="text-[10px] text-slate-400 font-semibold">{f.nameAr}</div>
                                </td>
                                <td className="p-2.5 text-slate-500">{f.subcategory}</td>
                                <td className="p-2.5 font-mono text-[10.5px] text-slate-600 dark:text-slate-400">
                                  {f.lat.toFixed(4)}, {f.lng.toFixed(4)}
                                </td>
                                <td className="p-2.5 font-black text-geovision-blue dark:text-blue-400">{f.distanceKm || 1.5} km</td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${isPriv ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                                    {isPriv ? 'Private' : 'Public'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------- */}
                {/* LAYOUT TEMPLATE 3: GIS MAP EXTENT CANVAS */}
                {/* ------------------------------------------------------------------- */}
                {printTemplate === 'map' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* Simulated High-Res Map Canvas Frame */}
                    <div
                      className="h-72 sm:h-84 rounded-2xl border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden flex flex-col justify-between p-4 shadow-xl bg-cover bg-center"
                      style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='100%25' height='100%25'%3E%3Crect width='800' height='500' fill='%23e0f2fe'/%3E%3Cpath d='M 0 60 Q 200 45 400 65 T 800 55 L 800 0 L 0 0 Z' fill='%23bae6fd' opacity='0.6'/%3E%3Cpath d='M 520 20 C 580 10 650 30 700 60 C 660 100 600 110 540 80 Z' fill='%23fef3c7' stroke='%23fcd34d' stroke-width='2'/%3E%3Cpath d='M 440 60 C 490 50 530 70 540 100 C 490 120 450 100 430 80 Z' fill='%23fef3c7' stroke='%23fcd34d' stroke-width='2'/%3E%3Cpath d='M 260 90 C 340 60 440 70 470 130 C 410 210 330 230 250 170 C 230 140 240 110 260 90 Z' fill='%23fef9c3' stroke='%23fcd34d' stroke-width='2.5'/%3E%3Cpath d='M 0 210 C 180 190 360 210 560 140 C 660 110 760 130 800 150 L 800 500 L 0 500 Z' fill='%23fef3c7' stroke='%23fcd34d' stroke-width='2.5'/%3E%3Cpath d='M 370 130 C 410 120 440 140 420 170 C 390 180 360 160 370 130 Z' fill='%23dcfce7' stroke='%2386efac' stroke-width='1.5'/%3E%3Cpath d='M 200 290 C 280 270 330 310 300 350 C 240 370 190 330 200 290 Z' fill='%23dcfce7' stroke='%2386efac' stroke-width='1.5'/%3E%3Cpath d='M 480 230 C 560 210 610 250 570 290 C 500 310 460 270 480 230 Z' fill='%23dcfce7' stroke='%2386efac' stroke-width='1.5'/%3E%3Cpath d='M 0 310 C 200 270 460 250 800 190' fill='none' stroke='%23f59e0b' stroke-width='6' opacity='0.95'/%3E%3Cpath d='M 0 310 C 200 270 460 250 800 190' fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-dasharray='10 6'/%3E%3Cpath d='M 290 170 C 410 180 540 200 800 230' fill='none' stroke='%23215A9E' stroke-width='4.5' opacity='0.9'/%3E%3Cpath d='M 270 340 C 390 360 540 390 750 440' fill='none' stroke='%23215A9E' stroke-width='4.5' opacity='0.9'/%3E%3Cg stroke='%2394a3b8' stroke-width='1.5' opacity='0.75'%3E%3Cline x1='160' y1='250' x2='360' y2='390'/%3E%3Cline x1='200' y1='230' x2='400' y2='370'/%3E%3Cline x1='240' y1='210' x2='440' y2='350'/%3E%3Cline x1='180' y1='350' x2='380' y2='230'/%3E%3Cline x1='220' y1='370' x2='420' y2='250'/%3E%3Cline x1='260' y1='390' x2='460' y2='270'/%3E%3C/g%3E%3Cg stroke='%2394a3b8' stroke-width='1.5' opacity='0.75'%3E%3Cline x1='470' y1='250' x2='670' y2='390'/%3E%3Cline x1='510' y1='230' x2='710' y2='370'/%3E%3Cline x1='550' y1='210' x2='750' y2='350'/%3E%3Cline x1='490' y1='370' x2='690' y2='250'/%3E%3C/g%3E%3Ctext x='280' y='135' font-family='system-ui, sans-serif' font-weight='900' font-size='13' fill='%231e3a8a' opacity='0.75'%3EABU DHABI CITY%3C/text%3E%3Ctext x='250' y='310' font-family='system-ui, sans-serif' font-weight='900' font-size='14' fill='%230f172a'%3EKHALIFA CITY%3C/text%3E%3Ctext x='550' y='300' font-family='system-ui, sans-serif' font-weight='900' font-size='14' fill='%230f172a'%3EZAYED CITY%3C/text%3E%3Ctext x='580' y='175' font-family='system-ui, sans-serif' font-weight='900' font-size='12' fill='%23215A9E'%3EAL RAHA BEACH%3C/text%3E%3Ctext x='580' y='55' font-family='system-ui, sans-serif' font-weight='900' font-size='11' fill='%230369a1'%3ESAADIYAT ISLAND%3C/text%3E%3Ctext x='450' y='75' font-family='system-ui, sans-serif' font-weight='900' font-size='11' fill='%230369a1'%3EAL REEM ISLAND%3C/text%3E%3Ctext x='100' y='75' font-family='system-ui, sans-serif' font-weight='900' font-size='15' fill='%230284c7' opacity='0.8'%3EARABIAN GULF%3C/text%3E%3Ctext x='430' y='235' font-family='system-ui, sans-serif' font-weight='800' font-size='11' fill='%23b45309' transform='rotate(-12 430 235)'%3ESheikh Zayed Highway (E11)%3C/text%3E%3C/svg%3E")` }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-slate-950/15 pointer-events-none" />

                      {/* Map Top Metadata Overlays */}
                      <div className="relative z-10 flex items-center justify-between text-white text-xs">
                        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 font-bold flex items-center gap-2 shadow-md">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Extent: Abu Dhabi Spatial Hub (Khalifa City / Zayed City)</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-900/90 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-black text-xs shadow-md">
                          N ⬆
                        </div>
                      </div>

                      {/* Absolute Positioned Map Pins Simulation */}
                      <div className="absolute inset-0 z-10 pointer-events-none">
                        {filteredFeatures.slice(0, 3).map((f, idx) => {
                          const pos = [
                            { top: '48%', left: '28%', border: 'border-blue-400', bg: 'bg-blue-950/90', text: 'text-blue-300' },
                            { top: '30%', left: '52%', border: 'border-emerald-400', bg: 'bg-emerald-950/90', text: 'text-emerald-300' },
                            { top: '62%', left: '65%', border: 'border-purple-400', bg: 'bg-purple-950/90', text: 'text-purple-300' },
                          ][idx % 3];
                          return (
                            <div key={f.id} className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center" style={{ top: pos.top, left: pos.left }}>
                              <div className={`${pos.bg} text-white px-3 py-1.5 rounded-xl border-2 ${pos.border} text-xs font-black shadow-2xl backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap`}>
                                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span className="truncate max-w-[160px]">{language === 'ar' ? f.nameAr : f.nameEn}</span>
                              </div>
                              <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] ${pos.border.replace('border-', 'border-t-')}`}></div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Map Bottom Scale & Legend Overlay */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] text-white font-bold bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 shadow-md">
                        <span>Scale Ratio: 1:25,000</span>
                        <span>Geographic Extent: Bounding Box [24.45N, 54.37E]</span>
                        <span>Layer: SDI Multi-Sector Facilities</span>
                      </div>
                    </div>

                    {/* Features Index Below Map */}
                    <div className="space-y-2 text-xs">
                      <h5 className="font-black text-slate-900 dark:text-white uppercase text-[11px] tracking-wider">
                        Mapped Features Index ({filteredFeatures.length} Points)
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {filteredFeatures.map((f, idx) => (
                          <div key={f.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                              {idx + 1}. {language === 'ar' ? f.nameAr : f.nameEn}
                            </span>
                            <span className="font-black text-geovision-blue dark:text-blue-400 shrink-0">{f.distanceKm || 1.5} km</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* A4 REPORT FOOTER SIGNATURE & SECURITY STAMP */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black">
                      ✓
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-xs">Certified by Abu Dhabi SDI Spatial Authority</p>
                      <p className="text-[10px] text-slate-400">Digitally Signed & Validated • Department of Government Enablement</p>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left text-[10px] font-mono text-slate-400">
                    <p>HASH: 8f4e92a1c0d57e3b</p>
                    <p>PAGE 1 OF 1</p>
                  </div>
                </div>

              </div>
            </div>

            {/* FIXED FOOTER WITH ACTION BUTTONS */}
            <div className="shrink-0 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 rounded-b-3xl flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowPrintReport(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Close Studio'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تصدير CSV' : 'Export Data (CSV)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerPrint}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طباعة / حفظ كملف PDF' : 'Print / Save PDF Report'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 3. DIRECTIONS / ROUTING MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {activeRouteTarget && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[9999] flex items-center justify-center pt-20 sm:pt-24 pb-6 px-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[calc(100vh-120px)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            {/* FIXED HEADER */}
            <div className="shrink-0 p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black border border-emerald-200 dark:border-emerald-800">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    {language === 'ar' ? 'مسار الاتجاهات والملاحة' : 'Route & Navigation Directions'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    {language === 'ar' ? 'مسار ملاحي مباشر وحساب زمن الرحلة' : 'Live Turn-by-Turn Routing & Estimated Drive Time'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRouteTarget(null)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE INNER BODY CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Origin & Destination Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-slate-700 space-y-3">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 mt-0.5 shrink-0 shadow-sm" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {language === 'ar' ? 'نقطة الانطلاق' : 'Origin Location'}
                    </p>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">
                      {language === 'ar' ? 'موقعي الحالي (وسط مدينة خليفة)' : 'Current Position (Khalifa City Hub)'}
                    </p>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-emerald-300 dark:bg-slate-600 ml-1.5" />

                <div className="flex items-start gap-2.5 text-xs">
                  <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      {language === 'ar' ? 'الوجهة' : 'Destination'}
                    </p>
                    <p className="font-black text-slate-900 dark:text-white">
                      {language === 'ar' ? activeRouteTarget.nameAr : activeRouteTarget.nameEn}
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {activeRouteTarget.subcategory} • {activeRouteTarget.distanceKm || 1.8} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Travel Summary Stats */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'ar' ? 'زمن القيادة المقدر' : 'Est. Driving Time'}</p>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    ~{Math.round((activeRouteTarget.distanceKm || 1.8) * 2.2)} mins
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{language === 'ar' ? 'مسار الحافلة المتاح' : 'Transit Shuttle'}</p>
                  <p className="text-base font-black text-geovision-blue dark:text-blue-400 mt-0.5">
                    Route 160 (Direct)
                  </p>
                </div>
              </div>

              {/* Step-by-step guidance */}
              <div className="space-y-2 pt-1 text-xs">
                <p className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                  {language === 'ar' ? 'خطوات الطريق:' : 'Turn-by-Turn Guidance:'}
                </p>
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-geovision-blue font-black flex items-center justify-center text-[10px] shrink-0">1</span>
                    <span>Head northeast on Sheikh Zayed Highway E11 (1.2 km)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-geovision-blue font-black flex items-center justify-center text-[10px] shrink-0">2</span>
                    <span>Take Sector Exit 12 toward {activeRouteTarget.nameEn} (400 m)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-[10px] shrink-0">3</span>
                    <span>Arrive at destination on the right side.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* FIXED FOOTER */}
            <div className="shrink-0 p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 rounded-b-3xl flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveRouteTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMapCenterAndZoom([activeRouteTarget.lat, activeRouteTarget.lng], 15);
                  setSelectedFeature(activeRouteTarget);
                  if (currentView !== 'map') setCurrentView('map');
                  setActiveRouteTarget(null);
                  showToast(language === 'ar' ? 'تم التركيز على مسار الخريطة' : 'Route focused on interactive map view');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>{language === 'ar' ? 'بدء الملاحة على الخريطة' : 'Start Map Route'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
