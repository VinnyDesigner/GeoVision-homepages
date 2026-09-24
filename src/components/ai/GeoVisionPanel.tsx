import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import type { GeoFeature } from '../../types';
import { GEO_FEATURES } from '../../data/mockAbuDhabiData';
import {
  Sparkles,
  Send,
  X,
  ChevronRight,
  Plus,
  History,
  BarChart2,
  Mic,
  GraduationCap,
  Building2,
  Bookmark,
  MapPin,
  Shield,
  Compass,
  Leaf,
  Wheat,
  Waves,
  Building,
  Layers,
  Cpu,
  GripVertical,
  Pencil,
  ArrowLeft,
  ShieldCheck,
  LayoutGrid,
  Clock,
  Phone,
  Navigation,
  FileText,
  Crop,
  ExternalLink,
} from 'lucide-react';
import { AIMessageSearchResults } from './AIMessageSearchResults';
import { buildSpatialSnapshot } from '../../utils/spatialSnapshotUtils';
import type { AttachedSpatialSnapshot } from '../../types';

interface GeoVisionPanelProps {
  onClose?: () => void;
  panelWidth?: number;
  setPanelWidth?: (width: number) => void;
  onStartResize?: (e: React.MouseEvent) => void;
  isResizing?: boolean;
}

export const GEOAI_THEMES = [
  { id: 'education', labelEn: 'Education', labelAr: 'التعليم', icon: GraduationCap, count: 8 },
  { id: 'healthcare', labelEn: 'Healthcare', labelAr: 'الرعاية الصحية', icon: Building2, count: 8 },
  { id: 'public_safety', labelEn: 'Public Safety', labelAr: 'الأمن والسلامة', icon: Shield, count: 8 },
  { id: 'transportation', labelEn: 'Transportation', labelAr: 'النقل والفيزياء', icon: MapPin, count: 8 },
  { id: 'tourism', labelEn: 'Tourism & Culture', labelAr: 'السياحة والثقافة', icon: Compass, count: 8 },
  { id: 'environment', labelEn: 'Environment & Nature', labelAr: 'البيئة والمحميات', icon: Leaf, count: 8 },
  { id: 'utilities', labelEn: 'Utilities & Services', labelAr: 'الخدمات والمرافق', icon: Building2, count: 8 },
  { id: 'urban', labelEn: 'Urban & Real Estate', labelAr: 'التخطيط العمراني', icon: Building, count: 8 },
  { id: 'administrative', labelEn: 'Government & TAMM', labelAr: 'الخدمات الحكومية', icon: Building2, count: 8 },
  { id: 'agriculture', labelEn: 'Agriculture & Farming', labelAr: 'الزراعة والمواشي', icon: Wheat, count: 8 },
  { id: 'hydrography', labelEn: 'Hydrography & Coastal', labelAr: 'الموانئ والمياه', icon: Waves, count: 8 },
  { id: 'landuse', labelEn: 'Land Use & Zoning', labelAr: 'استخدام الأراضي', icon: Layers, count: 8 },
  { id: 'cross_layer', labelEn: 'Cross-Layer Spatial Prompts (1-25)', labelAr: 'الأسئلة المكانية متقاطعة الطبقات (1-25)', icon: Layers, count: 25 },
  { id: 'multi_layer_agg', labelEn: 'Multi-Layer & Aggregate Statistics (26-55)', labelAr: 'الأسئلة الإحصائية التجميعية (26-55)', icon: BarChart2, count: 30 },
  { id: 'advanced_geoai_65', labelEn: 'Advanced GeoAI Analytics (56-65)', labelAr: 'الأسئلة التحليلية المتقدمة (56-65)', icon: Cpu, count: 10 },
  { id: 'crosstheme', labelEn: 'Cross-theme & Gap Analysis', labelAr: 'التحليل المتعدد والفجوات', icon: BarChart2, count: 4 },
];

export const GEOAI_PROMPT_LIBRARY: Record<string, { en: string; ar: string }[]> = {
  education: [
    { en: 'Show all schools in Abu Dhabi', ar: 'عرض جميع المدارس في أبوظبي' },
    { en: 'Show public schools in Abu Dhabi', ar: 'عرض المدارس الحكومية في أبوظبي' },
    { en: 'Show private schools in Khalifa City', ar: 'عرض المدارس الخاصة في مدينة خليفة' },
    { en: 'Show universities and higher education campuses', ar: 'عرض الجامعات ومؤسسات التعليم العالي' },
    { en: 'Find schools near my location', ar: 'البحث عن مدارس بالقرب من موقعي' },
    { en: 'Find schools within 2 km of bus stations in Khalifa City', ar: 'البحث عن مدارس على بعد 2 كم من محطات الحافلات في مدينة خليفة' },
    { en: 'Count schools by community', ar: 'إحصاء المدارس حسب المنطقة السكنية' },
    { en: 'Which district has the highest number of schools?', ar: 'ما هي المنطقة التي تضم أكبر عدد من المدارس؟' },
  ],
  healthcare: [
    { en: 'Show all hospitals and healthcare facilities in Abu Dhabi', ar: 'عرض جميع المستشفيات والمراكز الصحية في أبوظبي' },
    { en: 'Show hospitals near my location', ar: 'عرض المستشفيات القريبة من موقعي' },
    { en: 'Show pharmacies near me', ar: 'عرض الصيدليات القريبة مني' },
    { en: 'Find hospitals within 5 km', ar: 'البحث عن مستشفيات على بعد 5 كم' },
    { en: 'Which hospitals have pharmacies nearby?', ar: 'ما هي المستشفيات التي تتوفر صيدليات بالقرب منها؟' },
    { en: 'Show specialized trauma centers in Abu Dhabi', ar: 'عرض مراكز الإصابات والطوارئ التخصصية في أبوظبي' },
    { en: 'How many hospitals are in each district?', ar: 'كم عدد المستشفيات في كل منطقة؟' },
    { en: 'Which area has the highest number of healthcare facilities?', ar: 'ما هي المنطقة التي تضم أكبر عدد من المنشآت الصحية؟' },
  ],
  public_safety: [
    { en: 'Show all police stations in Abu Dhabi', ar: 'عرض جميع مراكز الشرطة في أبوظبي' },
    { en: 'Show civil defense fire stations in Al Ain and Abu Dhabi', ar: 'عرض محطات الدفاع المدني والإطفاء في العين وأبوظبي' },
    { en: 'Find police stations near my current location', ar: 'البحث عن مراكز الشرطة القريبة من موقعي الحالي' },
    { en: 'Show emergency response centers within 5 km', ar: 'عرض مراكز الاستجابة للطوارئ على بعد 5 كم' },
    { en: 'Which district has the most public safety centers?', ar: 'ما هي المنطقة التي تضم أكثر مراكز السلامة العامة؟' },
    { en: 'Analyse public safety coverage in Khalifa City', ar: 'تحليل تغطية الأمن والسلامة في مدينة خليفة' },
    { en: 'Show emergency response hubs within 2 km of highways', ar: 'عرض مراكز الطوارئ على بعد 2 كم من الطرق الرئيسية' },
    { en: 'Compare public safety facilities between Zayed City and Yas Island', ar: 'مقارنة مرافق السلامة العامة بين مدينة زايد وجزيرة ياس' },
  ],
  transportation: [
    { en: 'Show all bus stations and transit hubs', ar: 'عرض جميع محطات الحافلات ومراكز النقل' },
    { en: 'Show public parking zones near Al Maryah Island', ar: 'عرض مواقف السيارات العامة بالقرب من جزيرة الماريه' },
    { en: 'Show airports and airport terminals in Abu Dhabi', ar: 'عرض المطارات ومباني الركاب في أبوظبي' },
    { en: 'Find bus stops within 500m of my location', ar: 'البحث عن محطات الحافلات على بعد 500 متر من موقعي' },
    { en: 'Show schools within 500m of bus stops', ar: 'عرض المدارس على بعد 500 متر من محطات الحافلات' },
    { en: 'Compare transport accessibility between two districts', ar: 'مقارنة سهولة الوصول بالنقل بين منطقتين' },
    { en: 'Which community has the highest density of transit hubs?', ar: 'ما هي المنطقة السكنية التي تضم أعلى كثافة لمراكز النقل؟' },
    { en: 'Find parking facilities near TAMM government centers', ar: 'البحث عن مواقف السيارات بالقرب من مراكز خدمة تم' },
  ],
  tourism: [
    { en: 'Show tourist attractions near me', ar: 'عرض الوجهات السياحية القريبة مني' },
    { en: 'Show cultural landmarks and museums on Saadiyat Island', ar: 'عرض المعالم الثقافية والمتاحف في جزيرة السعديات' },
    { en: 'Show heritage sites and museums in Abu Dhabi', ar: 'عرض المواقع التراثية والمتاحف في أبوظبي' },
    { en: 'Find hotels within 2 km of Yas Island theme parks', ar: 'البحث عن فنادق على بعد 2 كم من المدن الترفيهية في جزيرة ياس' },
    { en: 'Which district has the most tourist facilities?', ar: 'ما هي المنطقة التي تضم أكثر المرافق السياحية؟' },
    { en: 'Summarize tourist facilities in this area', ar: 'تلخيص المرافق السياحية في هذه المنطقة' },
    { en: 'Find beaches and parks near Saadiyat Cultural District', ar: 'البحث عن الشواطئ والحدائق بالقرب من المنطقة الثقافية بالسعديات' },
    { en: 'Rank top tourist attraction hubs in Abu Dhabi by density', ar: 'ترتيب أهم مراكز الجذب السياحي في أبوظبي حسب الكثافة' },
  ],
  environment: [
    { en: 'Show protected areas in Abu Dhabi', ar: 'عرض المحميات الطبيعية في أبوظبي' },
    { en: 'Show mangrove reserves and coastal protected zones', ar: 'عرض محميات القرم والمناطق الساحلية المحمية' },
    { en: 'Show air quality monitoring stations in Abu Dhabi', ar: 'عرض محطات رصد جودة الهواء في أبوظبي' },
    { en: 'Find protected areas within 10 km of industrial zones', ar: 'البحث عن المحميات على بعد 10 كم من المناطق الصناعية' },
    { en: 'Summarize environmental protection zones in Al Dhafra', ar: 'تلخيص مناطق الحماية البيئية في منطقة الظفرة' },
    { en: 'Show noise and air quality monitoring sensors near Mussafah', ar: 'عرض أجهزة رصد الضوضاء وجودة الهواء بالقرب من مصفح' },
    { en: 'Which district has the largest area of protected nature reserves?', ar: 'ما هي المنطقة التي تضم أكبر مساحة من المحميات الطبيعية؟' },
    { en: 'Compare air quality index across industrial vs residential districts', ar: 'مقارنة مؤشر جودة الهواء بين المناطق الصناعية والسكنية' },
  ],
  utilities: [
    { en: 'Show power substations and electrical hubs', ar: 'عرض محطات الكهرباء الفرعية ومراكز التوزيع' },
    { en: 'Show waste management and recycling centers', ar: 'عرض مراكز إدارة النفايات وإعادة التدوير' },
    { en: 'Show water desalination plants in Abu Dhabi', ar: 'عرض محطات تحلية المياه في أبوظبي' },
    { en: 'Find recycling facilities within 5 km of residential areas', ar: 'البحث عن مراكز التدوير على بعد 5 كم من المناطق السكنية' },
    { en: 'Show high-risk manufacturing facilities in Abu Dhabi', ar: 'عرض المنشآت الصناعية عالية الخطورة في أبوظبي' },
    { en: 'Compare emissions between Mussafah and KIZAD', ar: 'مقارنة الانبعاثات بين مصفح وكيزاد' },
    { en: 'Analyse power distribution network coverage in Zayed City', ar: 'تحليل تغطية شبكة توزيع الكهرباء في مدينة زايد' },
    { en: 'Which industrial zone has the highest concentration of utilities?', ar: 'ما هي المنطقة الصناعية التي تضم أعلى تركيز للمرافق؟' },
  ],
  urban: [
    { en: 'Show residential communities in Khalifa City and Yas Island', ar: 'عرض المجمعات السكنية في مدينة خليفة وجزيرة ياس' },
    { en: 'Show commercial hubs and business parks on Al Reem Island', ar: 'عرض المراكز التجارية ومجمعات الأعمال في جزيرة الريم' },
    { en: 'Show mixed-use urban development zones', ar: 'عرض مناطق التطوير العمراني متعددة الاستخدامات' },
    { en: 'Summarize urban facilities in Khalifa City', ar: 'تلخيص المرافق العمرانية في مدينة خليفة' },
    { en: 'Find residential zones within 1 km of public parks', ar: 'البحث عن المناطق السكنية على بعد 1 كم من الحدائق العامة' },
    { en: 'Compare population density and urban land availability', ar: 'مقارنة الكثافة السكانية وتوفر الأراضي العمرانية' },
    { en: 'Which urban community has the highest growth rate?', ar: 'ما هو المجمع العمراني صاحب أعلى معدل نمو؟' },
    { en: 'Analyse urban sprawl and commercial development in Zayed City', ar: 'تحليل التمدد العمراني والتطوير التجاري في مدينة زايد' },
  ],
  administrative: [
    { en: 'Show TAMM government customer happiness centers', ar: 'عرض مراكز تم لخدمة المتعاملين الحكومية' },
    { en: 'Show municipality offices and public registries', ar: 'عرض مكاتب البلديات والمراكز التوثيقية' },
    { en: 'Find TAMM centers within 5 km of my location', ar: 'البحث عن مراكز تم على بعد 5 كم من موقعي' },
    { en: 'Show vehicle inspection centers near Mussafah and Khalifa City', ar: 'عرض مراكز فحص المركبات بالقرب من مصفح ومدينة خليفة' },
    { en: 'Which district has the most government service hubs?', ar: 'ما هي المنطقة التي تضم أكثر مراكز الخدمات الحكومية؟' },
    { en: 'Analyse administrative service coverage across Abu Dhabi', ar: 'تحليل تغطية الخدمات الإدارية في جميع أنحاء أبوظبي' },
    { en: 'Find municipal offices within 2 km of major highways', ar: 'البحث عن مكاتب البلدية على بعد 2 كم من الطرق الرئيسية' },
    { en: 'Compare TAMM center density between Abu Dhabi City and Al Ain', ar: 'مقارنة كثافة مراكز تم بين مدينة أبوظبي والعين' },
  ],
  agriculture: [
    { en: 'Show agricultural farms and palm plantations in Al Ain', ar: 'عرض المزارع الإنتاجية ومزارع النخيل في العين' },
    { en: 'Show agricultural research centers in Al Dhafra', ar: 'عرض مراكز الأبحاث الزراعية في منطقة الظفرة' },
    { en: 'Show livestock markets and veterinary centers', ar: 'عرض أسواق المواشي والمراكز البيطرية' },
    { en: 'Find agricultural zones within 5 km of water wells', ar: 'البحث عن المناطق الزراعية على بعد 5 كم من آبار المياه' },
    { en: 'Summarize agricultural land use in Al Dhafra region', ar: 'تلخيص استخدام الأراضي الزراعية في منطقة الظفرة' },
    { en: 'Compare farm density between Al Ain and Western Region', ar: 'مقارنة كثافة المزارع بين العين والمنطقة الغربية' },
    { en: 'Which district has the largest area of organic farms?', ar: 'ما هي المنطقة التي تضم أكبر مساحة من المزارع العضوية؟' },
    { en: 'Analyse irrigation utility network coverage across agricultural hubs', ar: 'تحليل تغطية شبكة الري في المراكز الزراعية' },
  ],
  hydrography: [
    { en: 'Show ports, harbors and breakwaters in Abu Dhabi', ar: 'عرض الموانئ والمراسي وكواسر الأمواج في أبوظبي' },
    { en: 'Show marine protected reserves and marine sanctuaries', ar: 'عرض المحميات البحرية والملاذات الطبيعية' },
    { en: 'Show coastal canals and waterfront promenades', ar: 'عرض القنوات الساحلية والممرات المائية' },
    { en: 'Find marine ferry terminals near Al Reem and Saadiyat', ar: 'البحث عن محطات العبّارات البحرية بالقرب من الريم والسعديات' },
    { en: 'Summarize hydrographic features around Yas and Saadiyat islands', ar: 'تلخيص المعالم المائية حول جزيرتي ياس والسعديات' },
    { en: 'Which island has the longest coastline and marina coverage?', ar: 'أي جزيرة تمتلك أطول خط ساحلي وتغطية للمراسي؟' },
    { en: 'Show coastal flood monitoring stations along Corniche', ar: 'عرض محطات رصد الفيضانات الساحلية على طول الكورنيش' },
    { en: 'Compare marine protected zones between Yasat and Marawah reserves', ar: 'مقارنة المناطق البحرية المحمية بين الياسات ومروّح' },
  ],
  landuse: [
    { en: 'Show industrial land use zones in Mussafah and KIZAD', ar: 'عرض مناطق استخدام الأراضي الصناعية في مصفح وكيزاد' },
    { en: 'Show commercial land use zones in Abu Dhabi City', ar: 'عرض مناطق استخدام الأراضي التجارية في مدينة أبوظبي' },
    { en: 'Show recreational and green belt land use areas', ar: 'عرض مناطق استخدام الأراضي الترفيهية والحزام الأخضر' },
    { en: 'Find industrial land use zones within 2 km of residential areas', ar: 'البحث عن المناطق الصناعية على بعد 2 كم من المناطق السكنية' },
    { en: 'Summarize land use breakdown in Khalifa City', ar: 'تلخيص توزيع استخدامات الأراضي في مدينة خليفة' },
    { en: 'Compare industrial vs green land use percentage across districts', ar: 'مقارنة نسبة الأراضي الصناعية مقابل الخضراء حسب المنطقة' },
    { en: 'Which community has the highest proportion of public green space?', ar: 'ما هو المجمع السكني صاحب أعلى نسبة للمساحات الخضراء؟' },
    { en: 'Analyse zoning compliance for high-risk industrial facilities', ar: 'تحليل الامتثال للتنظيم العمراني للمنشآت الصناعية' },
  ],
  cross_layer: [
    { en: 'Show schools within 500 m of bus stops.', ar: 'عرض المدارس على بعد 500 متر من محطات الحافلات' },
    { en: 'Find hospitals within 1 km of major roads.', ar: 'البحث عن مستشفيات على بعد 1 كم من الطرق الرئيسية' },
    { en: 'Show schools within 2 km of hospitals.', ar: 'عرض المدارس على بعد 2 كم من المستشفيات' },
    { en: 'Find parks within 1 km of residential communities.', ar: 'البحث عن حدائق على بعد 1 كم من المجمعات السكنية' },
    { en: 'Show pharmacies within 500 m of hospitals.', ar: 'عرض الصيدليات على بعد 500 متر من المستشفيات' },
    { en: 'Find schools without a bus stop within 500 m.', ar: 'البحث عن مدارس لا تتوفر محطة حافلات على بعد 500 متر منها' },
    { en: 'Show hospitals without an ambulance station within 3 km.', ar: 'عرض المستشفيات التي لا تتوفر محطة إسعاف على بعد 3 كم منها' },
    { en: 'Find police stations within 2 km of schools.', ar: 'البحث عن مراكز الشرطة على بعد 2 كم من المدارس' },
    { en: 'Show healthcare facilities near major roads.', ar: 'عرض المنشآت الصحية بالقرب من الطرق الرئيسية' },
    { en: 'Find urban development projects intersecting protected areas.', ar: 'البحث عن مشاريع التطوير العمراني المتقاطعة مع المحميات' },
    { en: 'Show communities containing at least one hospital.', ar: 'عرض المجتمعات السكنية التي تضم مستشفى واحد على الأقل' },
    { en: 'Find schools located inside each district.', ar: 'البحث عن المدارس الواقعة داخل كل منطقة' },
    { en: 'Show bus stops near tourist attractions.', ar: 'عرض محطات الحافلات بالقرب من الوجهات السياحية' },
    { en: 'Find parks close to schools.', ar: 'البحث عن الحدائق القريبة من المدارس' },
    { en: 'Show groundwater wells located inside protected areas.', ar: 'عرض آبار المياه الجوفية الواقعة داخل المحميات' },
    { en: 'Find schools that have a bus stop and healthcare facility within 1 km.', ar: 'البحث عن مدارس يتوفر بالقرب منها محطة حافلات ومنشأة صحية في حدود 1 كم' },
    { en: 'Show communities having schools, hospitals and parks.', ar: 'عرض المجتمعات السكنية التي تضم مدارس ومستشفيات وحدائق' },
    { en: 'Find hospitals that have an ambulance station and major road within 2 km.', ar: 'البحث عن مستشفيات يتوفر بالقرب منها محطة إسعاف وطريق رئيسي على بعد 2 كم' },
    { en: 'Show schools with nearby parks, bus stops and healthcare facilities.', ar: 'عرض المدارس القريبة من الحدائق ومحطات الحافلات والمنشآت الصحية' },
    { en: 'Find communities with schools and hospitals but no nearby police station.', ar: 'البحث عن مجتمعات تضم مدارس ومستشفيات دون مركز شرطة قريب' },
    { en: 'Show tourist attractions having parking and bus stops within 1 km.', ar: 'عرض المعالم السياحية التي تتوفر مواقف سيارات ومحطات حافلات على بعد 1 كم' },
    { en: 'Find residential communities with parks, schools and healthcare facilities nearby.', ar: 'البحث عن مجمعات سكنية يتوفر بالقرب منها حدائق ومدارس ومرافق صحية' },
    { en: 'Show development projects near roads but outside protected environmental areas.', ar: 'عرض مشاريع التطوير بالقرب من الطرق وخارج المحميات البيئية' },
    { en: 'Find hospitals accessible from major roads and having nearby parking.', ar: 'البحث عن مستشفيات يسهل الوصول إليها من الطرق الرئيسية وتضم مواقف سيارات' },
    { en: 'Show schools that have bus stops within 500 m and parks within 1 km.', ar: 'عرض المدارس التي تضم محطات حافلات على بعد 500 م وحدائق على بعد 1 كم' },
  ],
  multi_layer_agg: [
    { en: 'How many schools are in each district?', ar: 'كم عدد المدارس في كل منطقة؟' },
    { en: 'Count hospitals by community.', ar: 'إحصاء المستشفيات حسب المنطقة السكنية' },
    { en: 'Count schools by municipality.', ar: 'إحصاء المدارس حسب البلدية' },
    { en: 'Which district has the most schools?', ar: 'ما هي المنطقة التي تضم أكبر عدد من المدارس؟' },
    { en: 'Which community has the highest number of healthcare facilities?', ar: 'ما هي المنطقة السكنية التي تضم أكبر عدد من المنشآت الصحية؟' },
    { en: 'Count hospitals, clinics and pharmacies by district.', ar: 'إحصاء المستشفيات والعيادات والصيدليات حسب المنطقة' },
    { en: 'Show the top 10 communities by number of schools.', ar: 'عرض أفضل 10 مجتمعات سكنية حسب عدد المدارس' },
    { en: 'Which districts have the fewest healthcare facilities?', ar: 'ما هي المناطق التي تضم أقل عدد من المنشآت الصحية؟' },
    { en: 'Calculate the number of bus stops around each hospital.', ar: 'حساب عدد محطات الحافلات حول كل مستشفى' },
    { en: 'Count parks within 1 km of each school.', ar: 'إحصاء الحدائق على بعد 1 كم من كل مدرسة' },
    { en: 'Which hospital has the most bus stops within 1 km?', ar: 'ما هو المستشفى الذي يضم أكبر عدد من محطات الحافلات على بعد 1 كم؟' },
    { en: 'How many schools are within 2 km of each hospital?', ar: 'كم عدد المدارس الواقعة على بعد 2 كم من كل مستشفى؟' },
    { en: 'Compare public and private schools by district.', ar: 'مقارنة المدارس الحكومية والخاصة حسب المنطقة' },
    { en: 'Compare healthcare facilities across municipalities.', ar: 'مقارنة المنشآت الصحية عبر البلديات' },
    { en: 'Give me a district-wise summary of schools, hospitals and parks.', ar: 'ملخص حسب المناطق للمدارس والمستشفيات والحدائق' },
    { en: 'Which districts have the highest percentage of schools with a bus stop within 500 metres?', ar: 'ما هي المناطق التي تضم أعلى نسبة من المدارس القريبة من محطة حافلات على بعد 500 متر؟' },
    { en: 'Which communities have more than 5 schools but no ambulance station within 3 km?', ar: 'ما هي المجتمعات التي تضم أكثر من 5 مدارس دون محطة إسعاف على بعد 3 كم؟' },
    { en: 'Find districts with more than 10,000 residential units but fewer than 5 schools.', ar: 'البحث عن مناطق تضم أكثر من 10,000 وحدة سكنية وأقل من 5 مدارس' },
    { en: 'Show communities that contain more than 10 schools but fewer than 2 healthcare facilities.', ar: 'عرض المجتمعات التي تضم أكثر من 10 مدارس وأقل من منشأتين صحيتين' },
    { en: 'Rank districts based on the total number of schools, hospitals, parks and bus stops.', ar: 'ترتيب المناطق حسب إجمالي المدارس والمستشفيات والحدائق ومحطات الحافلات' },
    { en: 'Compare schools, healthcare facilities, public-safety facilities and public transport across municipalities.', ar: 'مقارنة المدارس والمنشآت الصحية والسلامة العامة والنقل عبر البلديات' },
    { en: 'For every district, provide the number of schools, hospitals, pharmacies, parks and bus stops.', ar: 'تقديم عدد المدارس والمستشفيات والصيدليات والحدائق ومحطات الحافلات لكل منطقة' },
    { en: 'Which communities have above-average numbers of schools but below-average healthcare facilities?', ar: 'ما هي المجتمعات التي تضم عدداً أعلى من المتوسط من المدارس وأقل من المتوسط من المرافق الصحية؟' },
    { en: 'Find communities where schools and hospitals are available but public transport coverage is comparatively low.', ar: 'البحث عن مجتمعات تتوفر فيها المدارس والمستشفيات مع انخفاض تغطية النقل العام' },
    { en: 'Rank communities by number of schools within 500 m of bus stops.', ar: 'ترتيب المجتمعات حسب عدد المدارس الواقعة على بعد 500 متر من محطات الحافلات' },
    { en: 'Which districts contain the highest number of schools within 2 km of hospitals?', ar: 'ما هي المناطق التي تضم أكبر عدد من المدارس على بعد 2 كم من المستشفيات؟' },
    { en: 'Compare the number of parks within 1 km of schools across districts.', ar: 'مقارنة عدد الحدائق على بعد 1 كم من المدارس عبر المناطق' },
    { en: 'Which communities contain hospitals but have no ambulance station within 5 km?', ar: 'ما هي المجتمعات التي تضم مستشفيات دون محطة إسعاف على بعد 5 كم؟' },
    { en: 'Calculate the percentage of schools in each district that have a bus stop within 500 m.', ar: 'حساب نسبة المدارس في كل منطقة التي تتوفر محطة حافلات على بعد 500 متر منها' },
  ],
  advanced_geoai_65: [
    { en: 'Identify communities with relatively low access to schools, healthcare facilities and public transport based on the available datasets.', ar: 'تحديد المجتمعات السكنية التي تعاني من انخفاض الوصول المدمج للمدارس والرعاية الصحية والنقل' },
    { en: 'Compare education and healthcare accessibility across districts using proximity to facilities.', ar: 'مقارنة إمكانية الوصول للتعليم والرعاية الصحية عبر المناطق باستخدام المسافة القريبة للمنشآت' },
    { en: 'Identify areas where schools are concentrated but healthcare facilities are comparatively limited.', ar: 'تحديد المناطق التي تتركز فيها المدارس مع انخفاض المنشآت الصحية' },
    { en: 'Find communities where healthcare facilities exist but public transport access is comparatively low.', ar: 'البحث عن مجتمعات تتوفر فيها المرافق الصحية مع انخفاض الوصول لوسائل النقل العام' },
    { en: 'Identify schools that are relatively far from hospitals, bus stops and public-safety facilities.', ar: 'تحديد المدارس البعيدة نسبياً عن المستشفيات ومحطات الحافلات ومرافق السلامة العامة' },
    { en: 'Compare two selected districts based on education, healthcare, transport, parks and public-safety facilities.', ar: 'مقارنة منطقتين محددتين بناءً على التعليم والصحة والنقل والحدائق والسلامة العامة' },
    { en: 'Analyse the selected community and provide counts and proximity indicators for schools, hospitals, parks, police stations and bus stops.', ar: 'تحليل المنطقة المحددة وتقديم مؤشرات الأعداد والقرب للمدارس والمستشفيات والحدائق والشرطة والحافلات' },
    { en: 'Which communities have the strongest combination of education, healthcare and transport availability based on the selected GIS indicators?', ar: 'أي المجتمعات تتمتع بأقوى تركيبة مدمجة من خدمات التعليم والصحة والنقل المتاحة؟' },
    { en: 'Identify spatial clusters of healthcare facilities and show communities outside those clusters.', ar: 'تحديد التجمعات المكانية لمرافق الرعاية الصحية وإظهار المجتمعات الواقعة خارج تلك التجمعات' },
    { en: 'Identify communities where multiple essential-service categories are comparatively less represented.', ar: 'تحديد المجتمعات التي تفتقر لتمثيل فئات متعددة من الخدمات الأساسية' },
  ],
  crosstheme: [
    { en: 'Show schools within 500m of bus stops', ar: 'عرض المدارس على بعد 500 متر من محطات الحافلات' },
    { en: 'Which hospitals have pharmacies nearby?', ar: 'ما هي المستشفيات التي تتوفر صيدليات بالقرب منها؟' },
    { en: 'Find schools that have both a bus stop and healthcare facility within 1 km', ar: 'البحث عن مدارس يتوفر بالقرب منها محطة حافلات ومنشأة صحية في حدود 1 كم' },
    { en: 'Which communities have limited access to education, healthcare and public transport?', ar: 'ما هي المجتمعات السكنية التي تعاني من محدودية الوصول للتعليم والرعاية الصحية والنقل العام؟' },
  ],
};

export const GeoVisionPanel: React.FC<GeoVisionPanelProps> = ({
  onClose,
  panelWidth: _panelWidth,
  setPanelWidth: _setPanelWidth,
  onStartResize,
  isResizing,
}) => {
  const {
    language,
    aiMessages,
    sendAIMessage,
    aiProcessing,
    aiStepState,
    startNewConversation,
    user,
    setCurrentView,
    setGuestPromptOpen,
    showToast,
    t,
    setSelectedFeature,
    mapCenter,
    setMapCenterAndZoom,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    currentView,
    setNavigationTarget,
  } = useAppState();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);

  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const [activeDetailFeature, setActiveDetailFeature] = useState<GeoFeature | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'nearby' | 'details'>('overview');
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(3);

  // Automatically open feature details page in chat when user clicks a pointer on the map
  useEffect(() => {
    const handleOpenDetails = (e: Event) => {
      const customEvt = e as CustomEvent<GeoFeature>;
      if (customEvt.detail) {
        setActiveDetailFeature(customEvt.detail);
        setActiveDetailTab('overview');
      }
    };
    window.addEventListener('geovision:openFeatureDetails', handleOpenDetails);
    return () => {
      window.removeEventListener('geovision:openFeatureDetails', handleOpenDetails);
    };
  }, []);

  const handleStartEdit = (msgId: string, currentText: string) => {
    setEditingMsgId(msgId);
    setEditingText(currentText);
  };

  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditingText('');
  };

  const handleSubmitEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingText.trim() || aiProcessing) return;
    const newQuery = editingText.trim();
    setEditingMsgId(null);
    setEditingText('');
    sendAIMessage(newQuery);
  };

  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    setActiveDetailFeature(null);
    startNewConversation();
    setInputVal('');
    setEditingMsgId(null);
    setEditingText('');
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  const scrollToStartOfLatestQuery = () => {
    if (!chatContainerRef.current) return;

    // Find latest user message to scroll to the start of the user's query and result
    const lastUserMsg = [...aiMessages].reverse().find((m) => m.sender === 'user');
    const targetId = lastUserMsg
      ? `msg-${lastUserMsg.id}`
      : aiMessages.length > 0
      ? `msg-${aiMessages[aiMessages.length - 1].id}`
      : null;

    if (targetId) {
      const targetEl = chatContainerRef.current.querySelector(`#${targetId}`) as HTMLElement;
      if (targetEl) {
        const targetTop = targetEl.offsetTop - 12;
        chatContainerRef.current.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });
        return;
      }
    }

    chatContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToStartOfLatestQuery();
    const timer1 = setTimeout(scrollToStartOfLatestQuery, 60);
    const timer2 = setTimeout(scrollToStartOfLatestQuery, 200);
    const timer3 = setTimeout(scrollToStartOfLatestQuery, 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [aiMessages.length, aiProcessing, aiMessages]);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      if (isListening) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'ar' ? 'ar-AE' : 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          showToast(language === 'ar' ? 'جاري الاستماع... تحدّث الآن' : 'Listening... Speak your spatial query now');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputVal(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          runVoiceSimulation();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        runVoiceSimulation();
      }
    } else {
      runVoiceSimulation();
    }
  };

  const runVoiceSimulation = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    showToast(language === 'ar' ? 'جاري الاستماع... (محاكاة الصوت)' : 'Listening... (Voice AI Input)');

    const sampleQueriesEn = [
      'Show hospitals near my location',
      'Show public schools in Abu Dhabi',
      'Find schools near my location',
      'Find hospitals within 5 km',
      'Show schools within 500m of bus stops',
      'Which communities have limited access to education, healthcare and public transport?',
    ];
    const sampleQueriesAr = [
      'عرض المستشفيات القريبة من موقعي',
      'عرض المدارس الحكومية في أبوظبي',
      'البحث عن مدارس بالقرب من موقعي',
    ];

    const queries = language === 'ar' ? sampleQueriesAr : sampleQueriesEn;
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    setTimeout(() => {
      setInputVal(randomQuery);
      setIsListening(false);
      sendAIMessage(randomQuery);
      setInputVal('');
    }, 1800);
  };

  const [pendingAttachment, setPendingAttachment] = useState<AttachedSpatialSnapshot | null>(null);

  const handleCaptureMapExtent = () => {
    const center = mapCenter || [24.4539, 54.3773];
    const snapshot = buildSpatialSnapshot(
      'map_extent',
      center,
      'Captured Spatial Map View',
      'منطقة الخريطة الجغرافية',
      4.8
    );
    setPendingAttachment(snapshot);
    showToast(language === 'ar' ? 'تم التقاط لقطة الخريطة وإرفاقها بمحادثة AI' : 'Captured spatial map area image attached!');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputVal.trim() && !pendingAttachment) || aiProcessing) return;
    const queryText = inputVal.trim() || (language === 'ar' ? 'تحليل المنطقة المكانية المرفقة' : 'Analyze attached spatial map area');
    sendAIMessage(queryText, pendingAttachment || undefined);
    setInputVal('');
    setPendingAttachment(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-slate-800 shadow-2xl relative z-[700] overflow-hidden group">
      
      {/* Left Edge Drag Resizer Handle */}
      {onStartResize && (
        <div
          onMouseDown={onStartResize}
          className={`hidden md:flex absolute top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 w-3 hover:w-4 z-50 items-center justify-center cursor-col-resize transition-all group/handle ${
            isResizing ? 'bg-geovision-blue/30 w-4' : 'bg-transparent hover:bg-geovision-blue/20'
          }`}
          title="Drag to extend or reduce panel width (Slider)"
        >
          <div className="w-1.5 h-10 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/handle:bg-geovision-blue transition-colors flex items-center justify-center shadow-xs">
            <GripVertical className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover/handle:text-white" />
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={getAssetUrl('globe-logo.png')}
            alt="GeoVision Globe Logo"
            className="w-8 h-8 object-contain shrink-0 drop-shadow-xs"
          />
          <div className="min-w-0">
            <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">
              Smart Maps AI Assistant
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              if (user?.isGuest) {
                setGuestPromptOpen(true);
              } else {
                setCurrentView('favorites');
              }
            }}
            className="p-1.5 sm:p-2 text-[#545860] hover:text-[#063360] dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-[#7DA1C4]/15 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={t('nav.favorites')}
          >
            <Bookmark className="w-4 h-4 text-geovision-blue dark:text-sky-400 fill-geovision-blue/20 dark:fill-sky-400/20" />
          </button>

          <button
            onClick={() => {
              if (user?.isGuest) {
                setGuestPromptOpen(true);
              } else {
                setCurrentView('history');
              }
            }}
            className="p-1.5 sm:p-2 text-[#545860] hover:text-[#063360] dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-[#7DA1C4]/15 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={t('nav.history')}
          >
            <History className="w-4 h-4 text-[#215A9E] dark:text-sky-300" />
          </button>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#215A9E] dark:bg-sky-600 text-white hover:bg-[#063360] dark:hover:bg-sky-500 font-extrabold text-xs shadow-md shadow-[#215A9E]/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title={language === 'ar' ? 'محادثة جديدة' : 'New Chat'}
          >
            <Plus className="w-3.5 h-3.5 shrink-0 text-white" />
            <span className="whitespace-nowrap text-white">{language === 'ar' ? 'محادثة جديدة' : 'New Chat'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Close AI Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Panel Content: Standalone Full Page Detail View OR Chat Messages Stream + Input Footer */}
      {activeDetailFeature ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/80 dark:bg-slate-900 animate-in fade-in duration-200">
          {/* Top Sub-Bar Navigation with Back Button */}
          <div className="p-3 px-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 shadow-2xs z-10">
            <button
              type="button"
              onClick={() => {
                setActiveDetailFeature(null);
                setSelectedFeature(null);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-geovision-blue hover:bg-[#063360] text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 text-white" />
              <span className="text-white">{language === 'ar' ? 'العودة للمحادثة' : 'Back to Chat'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="truncate">{language === 'ar' ? activeDetailFeature.nameAr : activeDetailFeature.nameEn}</span>
            </div>
          </div>

          {/* Scrollable Detail Body Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
            
            {/* Ultra-Premium Hero Header Card */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#063360] via-[#1E4D8C] to-[#215A9E] text-white p-5 shadow-xl space-y-4">
              {/* Decorative Subtle Radial Backdrop Accent */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top Badges Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20">
                    {activeDetailFeature.category.toUpperCase()} • {activeDetailFeature.subcategory.toUpperCase()}
                  </span>
                  {activeDetailFeature.isAuthoritative && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/25 backdrop-blur-md text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>SDI Verified</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (user?.isGuest) {
                      setGuestPromptOpen(true);
                      return;
                    }
                    if (isFavorite(activeDetailFeature.nameEn)) {
                      const favItem = favorites.find((f) => f.nameEn === activeDetailFeature.nameEn);
                      if (favItem) removeFavorite(favItem.id);
                    } else {
                      addFavorite({
                        type: 'location',
                        nameEn: activeDetailFeature.nameEn,
                        nameAr: activeDetailFeature.nameAr,
                        categoryEn: activeDetailFeature.category,
                        categoryAr: activeDetailFeature.category,
                        lat: activeDetailFeature.lat,
                        lng: activeDetailFeature.lng,
                      });
                    }
                  }}
                  className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
                    isFavorite(activeDetailFeature.nameEn)
                      ? 'bg-sky-400/25 border-sky-300/50 text-sky-200'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                  title={isFavorite(activeDetailFeature.nameEn) ? 'Remove Favorite' : 'Save Favorite'}
                >
                  <Bookmark className={`w-5 h-5 ${isFavorite(activeDetailFeature.nameEn) ? 'fill-sky-300 text-sky-300' : ''}`} />
                </button>
              </div>

              {/* Facility Title & Avatar */}
              <div className="flex items-start gap-3.5 relative z-10 pt-1">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner text-white">
                  <Building2 className="w-6 h-6 text-sky-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug tracking-tight">
                    {language === 'ar' ? activeDetailFeature.nameAr : activeDetailFeature.nameEn}
                  </h3>
                  {activeDetailFeature.nameAr && activeDetailFeature.nameEn && (
                    <p className="text-xs font-bold text-sky-200/90 truncate mt-0.5">
                      {language === 'ar' ? activeDetailFeature.nameEn : activeDetailFeature.nameAr}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveDetailTab('overview')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeDetailTab === 'overview'
                    ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('nearby')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeDetailTab === 'nearby'
                    ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'القريبة' : 'Nearby'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDetailTab('details')}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeDetailTab === 'details'
                    ? 'bg-geovision-blue text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الخصائص' : 'Details'}</span>
              </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeDetailTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Spatial Intelligence Summary Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-geovision-blue dark:text-sky-300 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ar' ? 'التحليل المكاني الجغرافي' : 'Spatial Intelligence Overview'}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed text-xs sm:text-sm">
                    {language === 'ar'
                      ? `يعتبر ${activeDetailFeature.nameAr} من المعالم والمرافق الرئيسية في إمارة أبوظبي ضمن فئة ${activeDetailFeature.category}. البيانات موثوقة مكانياً في الفهرس الجغرافي SDI.`
                      : `${activeDetailFeature.nameEn} represents a key facility within Abu Dhabi's ${activeDetailFeature.category} spatial layer, fully verified in the SDI catalog.`}
                  </p>

                  {/* 2x2 Info Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Physical Address */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{language === 'ar' ? 'العنوان الفعلي' : 'Physical Address'}</span>
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug block mt-0.5">
                          {language === 'ar' ? (activeDetailFeature.addressAr || `${activeDetailFeature.nameAr}، أبوظبي`) : (activeDetailFeature.addressEn || `${activeDetailFeature.nameEn}, Abu Dhabi, UAE`)}
                        </span>
                      </div>
                    </div>

                    {/* Contact Phone */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{language === 'ar' ? 'الهاتف' : 'Contact Phone'}</span>
                        <a href={`tel:${activeDetailFeature.phone || '+9712800555'}`} className="font-mono font-extrabold text-geovision-blue dark:text-sky-300 text-xs block mt-0.5 hover:underline">
                          {activeDetailFeature.phone || '+971 2 800 555'}
                        </a>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs block mt-0.5">
                          {language === 'ar' ? (activeDetailFeature.openStatusAr || 'مفتوح 24/7') : (activeDetailFeature.openStatusEn || 'Open 24/7')}
                        </span>
                      </div>
                    </div>

                    {/* Geographic Coords */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{language === 'ar' ? 'الإحداثيات' : 'Geographic Coords'}</span>
                        <span className="font-mono font-extrabold text-slate-900 dark:text-white text-xs block mt-0.5">
                          {activeDetailFeature.lat.toFixed(4)}°N, {activeDetailFeature.lng.toFixed(4)}°E
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activeDetailFeature.lat},${activeDetailFeature.lng}`;
                        window.open(gmapsUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="flex-1 min-w-[130px] py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                      <span className="text-white">{language === 'ar' ? 'الاتجاهات عبر خرائط جوجل' : 'Directions on Google Maps'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFeature(activeDetailFeature);
                        setMapCenterAndZoom([activeDetailFeature.lat, activeDetailFeature.lng], 15);
                        if (setNavigationTarget) setNavigationTarget(activeDetailFeature);
                        showToast(`Routing to ${activeDetailFeature.nameEn}`);
                      }}
                      className="flex-1 min-w-[130px] py-3 px-4 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4 text-white" />
                      <span className="text-white">{language === 'ar' ? 'الاتجاهات' : 'Directions'}</span>
                    </button>
                  </div>
                </div>
              </div>
              )}

              {/* NEARBY TAB */}
              {activeDetailTab === 'nearby' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px]">{language === 'ar' ? 'نطاق البحث:' : 'Proximity Radius:'}</span>
                    <div className="flex gap-1">
                      {[1, 3, 5, 10].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNearbyRadiusKm(r)}
                          className={`px-2.5 py-1 rounded-xl font-black text-[10px] transition-all cursor-pointer ${
                            nearbyRadiusKm === r ? 'bg-geovision-blue text-white shadow-2xs' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {r} km
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {GEO_FEATURES.filter((f) => f.id !== activeDetailFeature.id)
                      .map((f) => {
                        const dLat = ((f.lat - activeDetailFeature.lat) * Math.PI) / 180;
                        const dLon = ((f.lng - activeDetailFeature.lng) * Math.PI) / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((activeDetailFeature.lat * Math.PI) / 180) * Math.cos((f.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const itemDist = Math.round(6371 * c * 10) / 10;
                        return { ...f, itemDist };
                      })
                      .filter((f) => f.itemDist <= nearbyRadiusKm)
                      .sort((a, b) => a.itemDist - b.itemDist)
                      .slice(0, 8)
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

              {/* DETAILS TAB */}
              {activeDetailTab === 'details' && (
                <div className="space-y-3 text-xs">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/60">
                    <table className="w-full text-[11px] text-left rtl:text-right">
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                        <tr className="bg-white dark:bg-slate-900">
                          <td className="px-3.5 py-2 font-extrabold text-slate-500 w-1/3">Feature ID</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">{activeDetailFeature.id}</td>
                        </tr>
                        <tr>
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Category / Sub</td>
                          <td className="px-3.5 py-2 font-bold text-slate-900 dark:text-white">{activeDetailFeature.category} / {activeDetailFeature.subcategory}</td>
                        </tr>
                        <tr className="bg-white dark:bg-slate-900">
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Coordinates</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">Lat: {activeDetailFeature.lat.toFixed(5)} N, Lng: {activeDetailFeature.lng.toFixed(5)} E</td>
                        </tr>
                        <tr>
                          <td className="px-3.5 py-2 font-extrabold text-slate-500">Grid Datum</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white">UTM Zone 39N (EPSG:4326)</td>
                        </tr>
                        {activeDetailFeature.phone && (
                          <tr className="bg-white dark:bg-slate-900">
                            <td className="px-3.5 py-2 font-extrabold text-slate-500">Phone</td>
                            <td className="px-3.5 py-2 font-bold text-geovision-blue dark:text-white">{activeDetailFeature.phone}</td>
                          </tr>
                        )}
                        {activeDetailFeature.metadata && Object.entries(activeDetailFeature.metadata).map(([k, v]) => (
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
      ) : (
        <>
          {/* Messages Stream */}
          <div ref={chatContainerRef} className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4">
        {aiMessages.map((msg) => {
          const isMsgAr = Boolean(msg.isArabicPrompt || language === 'ar');

          if (msg.sender === 'user') {
            const textToDisplay = isMsgAr ? (msg.textAr || msg.textEn) : (msg.textEn || msg.textAr);
            const isEditingThis = editingMsgId === msg.id;

            return (
              <div key={msg.id} id={`msg-${msg.id}`} className="flex flex-col items-end scroll-mt-3 group/usermsg w-full">
                <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-slate-400">
                  <button
                    onClick={() => handleStartEdit(msg.id, textToDisplay)}
                    className="flex items-center gap-1 text-[10.5px] font-bold text-geovision-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 px-2 py-0.5 rounded-md"
                    title={language === 'ar' ? 'تعديل السؤال' : 'Edit Query'}
                  >
                    <Pencil className="w-3 h-3" />
                    <span>{language === 'ar' ? 'تعديل السؤال' : 'Edit Query'}</span>
                  </button>
                  <div className="w-5 h-5 rounded-full bg-[#215A9E] text-white font-extrabold flex items-center justify-center text-[9.5px] uppercase shadow-2xs shrink-0 tracking-tight">
                    {(() => {
                      if (!user?.name) return 'GU';
                      const parts = user.name.trim().split(/\s+/);
                      if (parts.length >= 2) {
                        return (parts[0][0] + parts[1][0]).toUpperCase();
                      }
                      return user.name.slice(0, 2).toUpperCase();
                    })()}
                  </div>
                </div>

                {isEditingThis ? (
                  <form onSubmit={handleSubmitEdit} className="w-full max-w-[90%] sm:max-w-[85%] p-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-geovision-blue shadow-lg space-y-2.5 text-left rtl:text-right">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitEdit();
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-geovision-blue/40 resize-none font-semibold"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={!editingText.trim() || aiProcessing}
                        className="px-3.5 py-1.5 text-xs font-black bg-geovision-blue text-white rounded-xl hover:bg-[#063360] transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'إرسال التعديل' : 'Resubmit Query'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-end gap-2 max-w-[88%] sm:max-w-[82%]">
                    {/* Attached Spatial Image Snapshot Thumbnail Card (ChatGPT style) */}
                    {msg.attachedSpatialSnapshot && (
                      <div
                        onClick={() => {
                          if (msg.attachedSpatialSnapshot?.center) {
                            setMapCenterAndZoom(msg.attachedSpatialSnapshot.center, 15);
                            if (currentView !== 'map') setCurrentView('map');
                          }
                        }}
                        className="w-full p-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-white shadow-lg overflow-hidden cursor-pointer hover:border-geovision-blue transition-all group/attachment"
                      >
                        {msg.attachedSpatialSnapshot.previewUrl && (
                          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                            <img
                              src={msg.attachedSpatialSnapshot.previewUrl}
                              alt="Spatial Attachment"
                              className="w-full h-32 sm:h-36 object-cover group-hover/attachment:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                              <Crop className="w-3 h-3" />
                              <span>Attached Spatial Map Area</span>
                            </div>
                            {msg.attachedSpatialSnapshot.areaKm2 && (
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold bg-slate-950/85 text-sky-300 backdrop-blur-md border border-slate-700">
                                {msg.attachedSpatialSnapshot.areaKm2.toFixed(1)} km²
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between px-1.5 pt-1.5 text-[11px] font-bold text-sky-200">
                          <span>📍 {msg.attachedSpatialSnapshot.titleEn}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {msg.attachedSpatialSnapshot.center[0].toFixed(3)}°N, {msg.attachedSpatialSnapshot.center[1].toFixed(3)}°E
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="w-full p-3.5 rounded-2xl bg-geovision-blue text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 rounded-tr-none break-words">
                      {textToDisplay}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              id={`msg-${msg.id}`}
              className="flex flex-col items-start scroll-mt-3"
            >
              {/* Sender Badge */}
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-slate-400">
                <img
                  src={getAssetUrl('globe-logo.png')}
                  alt="GeoVision AI"
                  className="w-4 h-4 object-contain shrink-0"
                />
              </div>

              {/* AI Response Bubble */}
              <div className="max-w-[95%] sm:max-w-[90%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-sm bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-800 space-y-3 break-words">
                
                {/* Main Text Response */}
                <div className="whitespace-pre-line leading-relaxed text-slate-800 dark:text-slate-100 font-bold break-words">
                  {isMsgAr ? (msg.textAr || msg.textEn) : (msg.textEn || msg.textAr)}
                </div>

                {/* Result Cards Display */}
                {msg.matchedFeatures && msg.matchedFeatures.length > 0 && (
                  <AIMessageSearchResults
                    matchedFeatures={msg.matchedFeatures}
                    messageId={msg.id}
                    onViewDetails={(feat) => setActiveDetailFeature(feat)}
                  />
                )}

                {/* Recommendations Section */}
                {!msg.noResultsSuggestions && !msg.disambiguationOptions && ((isMsgAr ? msg.recommendationsAr : msg.recommendationsEn) || []).length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                    <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-geovision-blue dark:text-sky-300" />
                      {t('ai.recommendationsTitle')}
                    </p>

                    <div className="space-y-1.5">
                      {(isMsgAr ? msg.recommendationsAr : msg.recommendationsEn)?.map((recText, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendAIMessage(recText)}
                          className="w-full flex items-center justify-between p-2.5 px-3 rounded-xl bg-blue-50/90 hover:bg-blue-100 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-[#063360] dark:text-sky-200 font-extrabold border border-blue-200/80 dark:border-slate-700 hover:border-geovision-blue dark:hover:border-sky-300 text-xs text-left rtl:text-right transition-all cursor-pointer shadow-2xs gap-2 min-w-0 group"
                        >
                          <span className="truncate flex-1 text-slate-800 dark:text-sky-200 font-extrabold">{recText}</span>
                          <ChevronRight className="w-4 h-4 shrink-0 text-[#215A9E] dark:text-sky-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}



              </div>
            </div>
          );
        })}

        {/* AI Thinking Step Indicator */}
        {aiProcessing && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-900/90 border border-blue-200/60 dark:border-slate-800 animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white">
                GeoAI Engine is processing NLU & Spatial Join...
              </p>
              <p className="text-[10px] text-geovision-blue dark:text-sky-300 font-extrabold uppercase tracking-wider">
                {aiStepState || 'Converting Natural Language to Structured GIS Request'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0 space-y-2">
        {/* Pending Attached Spatial Snapshot Bar (if attached) */}
        {pendingAttachment && (
          <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-geovision-blue text-white flex items-center justify-center shrink-0">
                <Crop className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold text-slate-900 dark:text-white block truncate">
                  📎 Attached Spatial Map Area: {pendingAttachment.titleEn}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate">
                  {pendingAttachment.center[0].toFixed(3)}°N, {pendingAttachment.center[1].toFixed(3)}°E • {pendingAttachment.areaKm2 ? `${pendingAttachment.areaKm2.toFixed(1)} km²` : 'GIS Bounds'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPendingAttachment(null)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
              title="Remove Attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isListening ? (language === 'ar' ? 'جاري الاستماع لصوتك...' : 'Listening to your voice...') : t('ai.inputPlaceholder')}
            className={`w-full pl-3.5 pr-28 py-2.5 sm:py-3 rtl:pr-3.5 rtl:pl-28 rounded-2xl border bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-geovision-blue transition-all ${
              isListening ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20' : 'border-slate-200 dark:border-slate-700'
            }`}
          />

          <div className="absolute right-2 rtl:right-auto rtl:left-2 flex items-center gap-1">
            {/* Capture Map Area / Attach Image Button */}
            <button
              type="button"
              onClick={handleCaptureMapExtent}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                pendingAttachment
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-geovision-blue dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={language === 'ar' ? 'إرفاق لقطة الخريطة' : 'Capture & Attach Map Area Image'}
            >
              <Crop className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-geovision-blue dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={language === 'ar' ? 'البحث الصوتي' : 'Voice Search'}
            >
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="submit"
              disabled={(!inputVal.trim() && !pendingAttachment) || aiProcessing}
              className="p-2 rounded-xl bg-geovision-blue text-white hover:bg-blue-600 disabled:opacity-50 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 rtl:rotate-180" />
            </button>
          </div>
        </form>
      </div>
    </>
  )}

    </div>
  );
};

export default GeoVisionPanel;
