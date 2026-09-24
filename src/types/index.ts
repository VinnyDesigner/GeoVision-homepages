export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  descriptionEn: string;
  descriptionAr: string;
  count: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  nameEn: string;
  nameAr: string;
  count: number;
  parentId: string;
}

export interface GeoFeature {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string; // e.g. 'healthcare', 'education', etc.
  subcategory: string; // e.g. 'hospitals', 'clinics', 'schools'
  lat: number;
  lng: number;
  addressEn: string;
  addressAr: string;
  rating?: number;
  openStatusEn?: string;
  openStatusAr?: string;
  phone?: string;
  website?: string;
  distanceKm?: number;
  metadata?: Record<string, string | number>;
  isAuthoritative?: boolean;
}

export interface SmartFilterState {
  categories: string[];
  locationName: string;
  distanceKm: number | null;
  openNowOnly: boolean;
  minRating: number | null;
}

export interface ConversationContext {
  language: 'en' | 'ar';
  currentIntent: string | null;
  category: string | null;
  featureType: string | null;
  location: string | null;
  resolvedLocation: string | null;
  radius: number | null;
  radiusUnit: string;
  attributes: Record<string, any>;
  resultCount: number;
  currentResults: GeoFeature[];
  previousResults: GeoFeature[];
  selectedFeature: GeoFeature | null;
  selectedCategories: string[];
  selectedDatasets: string[];
  activeFilters: string[];
  mapExtent: { center: [number, number]; zoom: number } | null;
  userLocation: [number, number] | null;
  locationPermission: 'unknown' | 'prompt' | 'granted' | 'denied';
  pendingClarification: any | null;
  lastUserQuery: string | null;
  lastAIResponse: string | null;
}

export interface AttachedSpatialSnapshot {
  shapeType: 'point' | 'circle' | 'polygon' | 'rect' | 'map_extent';
  titleEn: string;
  titleAr: string;
  center: [number, number];
  areaKm2?: number;
  radiusKm?: number;
  bounds?: [[number, number], [number, number]];
  points?: [number, number][];
  previewUrl?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  textEn: string;
  textAr: string;
  timestamp: string;
  isArabicPrompt?: boolean;
  attachedSpatialSnapshot?: AttachedSpatialSnapshot;
  recommendationsEn?: string[];
  recommendationsAr?: string[];
  datasetChips?: string[];
  appliedFilters?: Partial<SmartFilterState>;
  matchedFeatures?: GeoFeature[];
  trustLevel?: 'authoritative' | 'external';
  queryInterpretation?: {
    titleEn: string;
    titleAr: string;
    chips: { labelEn: string; labelAr: string; key: string; isUpdated?: boolean }[];
  };
  countCardData?: {
    count: number;
    titleEn: string;
    titleAr: string;
    scopeEn: string;
    scopeAr: string;
  };
  disambiguationOptions?: { labelEn: string; labelAr: string; query: string }[];
  unsupportedAction?: { actionType: 'open_explore'; labelEn: string; labelAr: string };
  noResultsSuggestions?: { labelEn: string; labelAr: string; query: string }[];
  locationPromptRequired?: boolean;
  detailsFeatureId?: string;
  detailsFeature?: GeoFeature;
  showPrivateListAction?: boolean;
  showResultsList?: boolean;
  categoryBreakdown?: {
    locationNameEn: string;
    locationNameAr: string;
    totalCount: number;
    items: { categoryId: string; nameEn: string; nameAr: string; count: number; query: string }[];
  };
  openHoursBreakdown?: {
    titleEn: string;
    titleAr: string;
    openNowCount: number;
    closedCount: number;
  };
  comparisonData?: {
    titleEn?: string;
    titleAr?: string;
    subtitleEn?: string;
    subtitleAr?: string;
    metricNameEn?: string;
    metricNameAr?: string;
    entityA?: { nameEn: string; nameAr: string; totalEmissions: string; badge: string; color?: string };
    entityB?: { nameEn: string; nameAr: string; totalEmissions: string; badge: string; color?: string };
    metrics?: {
      labelEn?: string;
      labelAr?: string;
      metricNameEn?: string;
      metricNameAr?: string;
      valA?: string;
      valB?: string;
      percentA?: number;
      percentB?: number;
      unit?: string;
      highlight?: 'A' | 'B' | 'neutral';
    }[];
    entities?: any[];
    takeawayEn?: string;
    takeawayAr?: string;
  };
  comparisonChartData?: any;
  riskBreakdownData?: {
    facilityNameEn?: string;
    facilityNameAr?: string;
    zoneEn?: string;
    zoneAr?: string;
    overallScore?: number;
    riskLevel?: 'High' | 'Medium' | 'Low';
    primaryReasonEn?: string;
    primaryReasonAr?: string;
    highRiskCount?: number;
    mediumRiskCount?: number;
    lowRiskCount?: number;
    totalAnalyzed?: number;
    factors?: {
      categoryEn: string;
      categoryAr: string;
      score: number;
      weight: string;
      detailEn: string;
      detailAr: string;
      status: 'critical' | 'warning' | 'acceptable';
    }[];
    complianceInfo?: {
      authorityEn: string;
      authorityAr: string;
      cemsStatusEn: string;
      cemsStatusAr: string;
      auditDate: string;
    };
  };
  mapAction?: {
    type: 'zoom_and_filter' | 'highlight' | 'buffer' | 'aoi_summary';
    locationName?: string;
    center?: [number, number];
    zoom?: number;
    bufferKm?: number;
  };
  aoiSummaryData?: AOIResult;
  datasetProvenance?: DatasetProvenance;
  aiUnderstanding?: AIUnderstanding;
  contextUpdate?: AIContextState;
  structuredGisRequest?: {
    theme: string;
    operation: string;
    layer: string;
    distance?: string;
    location?: string;
  };
  crossLayerData?: {
    titleEn: string;
    titleAr: string;
    targetLayerEn?: string;
    targetLayerAr?: string;
    referenceLayerEn?: string;
    referenceLayerAr?: string;
    primaryLayerNameEn?: string;
    primaryLayerNameAr?: string;
    secondaryLayerNameEn?: string;
    secondaryLayerNameAr?: string;
    intersectionCount?: number;
    totalPrimaryCount?: number;
    bufferDistance?: string;
    bufferKm?: number;
    totalFound?: number;
    items?: {
      nameEn: string;
      nameAr: string;
      distFromRefEn: string;
      distFromRefAr: string;
      refNameEn?: string;
      refNameAr?: string;
    }[];
  };
}

export interface DatasetProvenance {
  layersUsedEn: string[];
  layersUsedAr: string[];
  spatialOperationEn: string;
  spatialOperationAr: string;
  sourceProviderEn: string;
  sourceProviderAr: string;
  aiExplanationEn: string;
  aiExplanationAr: string;
}

export interface AIUnderstanding {
  facilityEn: string;
  facilityAr: string;
  locationEn: string;
  locationAr: string;
  distanceEn: string;
  distanceAr: string;
  datasetSelectedEn: string;
  datasetSelectedAr: string;
  intentEn?: string;
  intentAr?: string;
  gisLayersEn?: string[];
  gisLayersAr?: string[];
}

export interface AIContextState {
  locationEn?: string;
  locationAr?: string;
  selectedDatasetsEn?: string[];
  selectedDatasetsAr?: string[];
  activeFiltersEn?: string[];
  activeFiltersAr?: string[];
  radiusKm?: number;
  previousResultCount?: number;
}

export interface SavedSearchItem {
  id: string;
  titleEn: string;
  titleAr: string;
  query: string;
  date: string;
  resultCount: number;
  notes?: string;
  mapCenter: [number, number];
  mapZoom: number;
  activeCategoryIds: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

export interface FavoriteItem {
  id: string;
  type: 'location' | 'dataset' | 'search';
  nameEn: string;
  nameAr: string;
  categoryEn?: string;
  categoryAr?: string;
  lat?: number;
  lng?: number;
  savedAt: string;
}

export interface ConversationSession {
  id: string;
  titleEn: string;
  titleAr: string;
  date: string;
  queryCount: number;
  messages: AIMessage[];
  isPinned?: boolean;
}

export type BasemapType = 'dge' | 'light' | 'dark' | 'satellite';

export type ActiveTool = 'none' | 'identify' | 'basemap' | 'legend' | 'buffer' | 'print' | 'sketch' | 'coordinates';

export interface LocationSearchResult {
  id: string;
  nameEn: string;
  nameAr: string;
  typeEn: string;
  typeAr: string;
  lat: number;
  lng: number;
  zoom: number;
}

export interface AOIResult {
  bounds: [number, number][];
  totalAreaKm2: number;
  breakdown: {
    category: string;
    count: number;
    nameEn: string;
    nameAr: string;
  }[];
  insightEn: string;
  insightAr: string;
  recommendationsEn: string[];
  recommendationsAr: string[];
}

export interface DrawnShape {
  id: string;
  type: 'point' | 'circle' | 'polygon' | 'rect';
  lat: number;
  lng: number;
  radius?: number;
  bounds?: [[number, number], [number, number]];
  points?: [number, number][];
  label?: string;
}
