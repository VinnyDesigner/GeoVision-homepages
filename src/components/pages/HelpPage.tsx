import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  Layers,
  Edit3,
  Star,
  MessageSquare,
  Play,
  FileText,
  X,
  Download,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  Compass,
  ArrowRight,
  RefreshCw,
  Mail,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Check,
  Sliders,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  const { t, language, setFeedbackModalOpen, showToast } = useAppState();
  const [searchHelp, setSearchHelp] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('all');
  const [isCopiedEmail, setIsCopiedEmail] = useState(false);

  // Modals state for Video Tutorial & User Guide PDF
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Track voted FAQs (helpful / unhelpful)
  const [votedFaqs, setVotedFaqs] = useState<Record<number, 'yes' | 'no'>>({});

  const faqs = [
    {
      id: 1,
      category: 'ai',
      q: t('help.faq1Q'),
      a: t('help.faq1A'),
      icon: Sparkles,
      tag: 'GeoVision AI',
      steps: [
        language === 'ar' ? 'اكتب سؤالك بوضوح في شريط البحث الرئيسي.' : 'Type your question in natural language into the search input.',
        language === 'ar' ? 'سيقوم المساعد بفهم المعلم وتحديد النطاق الجغرافي تلقائياً.' : 'GeoVision AI resolves spatial intent, location, and buffer distance automatically.',
        language === 'ar' ? 'انقر على أي معلم على الخريطة لعرض تفاصيله ومصادر البيانات.' : 'Click any highlighted feature on the map to inspect SDI source metadata.',
      ],
    },
    {
      id: 2,
      category: 'tools',
      q: t('help.faq2Q'),
      a: t('help.faq2A'),
      icon: Edit3,
      tag: 'Spatial AOI Tools',
      steps: [
        language === 'ar' ? 'افتح الخريطة وانقر على أداة "رسم AOI" في شريط الأدوات العائم.' : 'Open Map Workspace and select "Sketch AOI" from floating toolbar.',
        language === 'ar' ? 'اختر رسم مضلع، مستطيل، أو رسم حر لتحديد منطقتك.' : 'Choose Polygon, Rectangle, or Freehand to enclose your area of interest.',
        language === 'ar' ? 'انقر على "التحليل بواسطة GeoVision" لاستخراج كشوفات الخدمات والمنشآت.' : 'Click "Analyze with GeoVision" to get instant breakdown metrics & counts.',
      ],
    },
    {
      id: 3,
      category: 'account',
      q: language === 'ar' ? 'كيف يمكنني حفظ المواقع والطبقات في المفضلة؟' : 'How do I save locations and datasets to My Favorites?',
      a: language === 'ar' ? 'انقر على رمز النجمة الموجود في أي بطاقة نتيجة بحث، أداة الاستعلام، أو قائمة الطبقات لحفظ الموقع في حسابك.' : 'Click the star icon on any location card, map feature inspector, or dataset item. Your saved items will be synced to your registered user profile.',
      icon: Star,
      tag: 'Bookmarks',
      steps: [
        language === 'ar' ? 'انقر على النجمة على أي موقع أو معلم.' : 'Click Star icon on feature popup or search result.',
        language === 'ar' ? 'افتح قائمة "المفضلة" من الأعلى لاستعراض العناصر المحفوظة.' : 'Access "My Favorites" from user menu to view saved locations.',
      ],
    },
    {
      id: 4,
      category: 'tools',
      q: language === 'ar' ? 'كيف يمكنني طباعة وتصدير تقارير الخرائط الرسمية؟' : 'How do I export and print a government-compliant map report?',
      a: language === 'ar' ? 'افتح شاشة الخريطة التفاعلية، ثم انقر على أداة الطباعة في شريط الأدوات العائم لتنسيق وتصدير تقرير PDF high-resolution.' : 'Open the Map Workspace, click the Print Map icon in the floating tool dock, select your preferred format (PDF, PNG, JPEG), and click "Generate Printable Map".',
      icon: Layers,
      tag: 'Printing',
      steps: [
        language === 'ar' ? 'انقر على أداة الطباعة والتصدير في الخريطة.' : 'Click Print / Export icon on map floating dock.',
        language === 'ar' ? 'حدد التنسيق المطلوب (PDF / PNG) واتجاه الصفحة.' : 'Select layout format (PDF/PNG/JPEG) & page orientation.',
        language === 'ar' ? 'انقر على "إنشاء الخريطة المطبوعة" لتنزيل الملف فوراً.' : 'Click "Generate Printable Map" to instantly download report.',
      ],
    },
    {
      id: 5,
      category: 'ai',
      q: language === 'ar' ? 'ما هي اللغات التي يدعمها المساعد الذكي المكانية؟' : 'Which languages are supported by GeoVision Spatial AI?',
      a: language === 'ar' ? 'يدعم المساعد الذكي الاستعلامات المباشرة باللغتين العربية والإنجليزية، مع تبديل اتجاه الواجهة (RTL/LTR) واستخلاص المفاهيم المكانية.' : 'GeoVision supports seamless natural language queries in both English and Arabic with automated spatial intent resolution and RTL/LTR layout alignment.',
      icon: Compass,
      tag: 'Bilingual NLU',
      steps: [
        language === 'ar' ? 'بدّل اللغة في أي وقت بالنقر على "العربية" / "English" في الشريط العلوي.' : 'Toggle language anytime via top navigation header.',
        language === 'ar' ? 'يمكنك كتابة الأسماء باللغة العربية أو الإنجليزية مجاناً.' : 'Queries process in English or Arabic seamlessly.',
      ],
    },
    {
      id: 6,
      category: 'tools',
      q: language === 'ar' ? 'كيف يمكنني إجراء تحليل الشعاع الجغرافي (Buffer Analysis)؟' : 'How do I run a Guided Buffer Distance Analysis?',
      a: language === 'ar' ? 'تتيح أداة Buffer التحليل المكاني بناءً على مسافة معينة حول أي موقع أو معلم (مثلاً 5 كم حول جزيرة ياس).' : 'The Buffer Analysis tool calculates distance radiuses (from 500 meters to 50 km) around target locations to highlight all surrounding public services.',
      icon: Sliders,
      tag: 'Buffer Analysis',
      steps: [
        language === 'ar' ? 'اختر أداة Buffer من شريط أدوات الخريطة.' : 'Select Buffer Analysis tool from floating toolbar.',
        language === 'ar' ? 'حدد مسافة الشعاع (مثلاً 3 كم).' : 'Set distance slider (e.g., 3 km or 500m).',
        language === 'ar' ? 'شاهد النتائج المحددة داخل نطاق الدائرة.' : 'View facilities enclosed within radius circle on map.',
      ],
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    if (selectedFaqCategory !== 'all' && f.category !== selectedFaqCategory) return false;
    if (searchHelp.trim()) {
      const q = searchHelp.toLowerCase();
      return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.tag.toLowerCase().includes(q);
    }
    return true;
  });

  const quickSearchTags = [
    { labelEn: 'Spatial AI Copilot', labelAr: 'مساعد الخرائط الذكي', query: 'AI' },
    { labelEn: 'AOI Drawing & Buffer', labelAr: 'أدوات الرسم والنطاق', query: 'AOI' },
    { labelEn: 'Print Map Reports', labelAr: 'طباعة التقارير', query: 'Print' },
    { labelEn: 'Favorites & Bookmarks', labelAr: 'المفضلة والمستندات', query: 'Favorites' },
  ];

  const handleVote = (faqId: number, vote: 'yes' | 'no') => {
    setVotedFaqs((prev) => ({ ...prev, [faqId]: vote }));
    if (vote === 'yes') {
      showToast(language === 'ar' ? 'شكراً لتقييمك! نحن مسرورون بأن الإجابة كانت مفيدة.' : 'Thank you for your feedback! Glad this guide helped.');
    } else {
      showToast(language === 'ar' ? 'شكراً لتقييمك! سنقوم بتحسين هذا الدليل قريباً.' : 'Thank you for your feedback! We will improve this guide.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-20 space-y-12 bg-spatial-canvas min-h-screen">
      
      {/* WOW Ultra-Premium Hero Search Header */}
      <div className="relative overflow-hidden p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-[#063360] via-[#16477B] to-[#041F3B] text-white text-center space-y-6 shadow-2xl border border-[#7DA1C4]/30 glow-blue">
        {/* Ambient Radial Mesh Blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#215A9E]/30 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7DA1C4]/15 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -z-0 pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-3xl mx-auto">
          {/* SDI Official Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-slate-100 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Abu Dhabi Spatial Infrastructure • Official Knowledge Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
            {language === 'ar' ? 'كيف يمكننا مساعدتك اليوم؟' : 'How can we help you today?'}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-semibold max-w-2xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'ابحث في موضوعات الخرائط المكانية، واستعرض الدروس التعليمية السريعة، وافتح أدلة المستخدم، أو تواصل مباشرة مع أخصائي نظم المعلومات الجغرافية.'
              : 'Search spatial intelligence topics, browse interactive video walkthroughs, open user guides, or contact our dedicated GIS support team.'}
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <Search className="absolute left-4.5 top-6.5 w-5 h-5 text-slate-300 rtl:right-4.5 rtl:left-auto" />
            <input
              type="text"
              value={searchHelp}
              onChange={(e) => setSearchHelp(e.target.value)}
              placeholder={t('help.searchPlaceholder')}
              className="w-full pl-12 pr-24 py-4.5 rounded-2xl border border-white/30 bg-white/15 backdrop-blur-2xl text-xs sm:text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-2xl transition-all rtl:pr-12 rtl:pl-24 font-bold"
            />
            <div className="absolute right-3.5 top-5 flex items-center gap-2 rtl:right-auto rtl:left-3.5">
              {searchHelp ? (
                <button
                  onClick={() => setSearchHelp('')}
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/15 border border-white/20 text-[10px] font-mono text-slate-300 font-semibold">
                  Search
                </kbd>
              )}
            </div>
          </div>

          {/* Quick Search Tag Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-300">
              {language === 'ar' ? 'البحث السريع:' : 'Popular topics:'}
            </span>
            {quickSearchTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchHelp(tag.query)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                  searchHelp === tag.query
                    ? 'bg-white text-[#063360] border-white shadow-md scale-105'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-100'
                }`}
              >
                {language === 'ar' ? tag.labelAr : tag.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Quick Cards (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: language === 'ar' ? 'البدء والاستكشاف' : 'Getting Started',
            descEn: 'Platform introduction & map controls',
            descAr: 'مقدمة المنصة والتحكم بالخريطة',
            icon: BookOpen,
            count: '5 Topics',
            catId: 'all',
            bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
            borderColor: 'hover:border-blue-500/50',
            iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
          },
          {
            title: language === 'ar' ? 'الذكاء الاصطناعي المكانية' : 'GeoVision AI',
            descEn: 'Natural Language Spatial NLU queries',
            descAr: 'استعلامات الذكاء الاصطناعي المكانية',
            icon: Sparkles,
            count: '65 Prompts',
            catId: 'ai',
            bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
            borderColor: 'hover:border-amber-500/50',
            iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          },
          {
            title: language === 'ar' ? 'أدوات الخريطة والطباعة' : 'Map & Print Tools',
            descEn: 'AOI drawing, buffers & PDF export',
            descAr: 'أدوات الرسم، النطاقات وتصدير التقارير',
            icon: Layers,
            count: '6 Tools',
            catId: 'tools',
            bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
            borderColor: 'hover:border-emerald-500/50',
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          },
          {
            title: language === 'ar' ? 'المفضلة والسجل' : 'Favorites & Account',
            descEn: 'Saved locations & session timeline',
            descAr: 'المواقع المحفوظة وسجل المحادثات',
            icon: Star,
            count: 'Sync Profile',
            catId: 'account',
            bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
            borderColor: 'hover:border-purple-500/50',
            iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
          },
        ].map((cat, idx) => {
          const IconC = cat.icon;
          const isSelected = selectedFaqCategory === cat.catId;
          return (
            <button
              key={idx}
              onClick={() => setSelectedFaqCategory(cat.catId)}
              className={`glass-panel p-6 rounded-3xl text-left rtl:text-right space-y-4 border transition-all cursor-pointer group shadow-xs hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${
                isSelected
                  ? 'border-geovision-blue ring-2 ring-geovision-blue/20 bg-blue-50/40 dark:bg-blue-950/20'
                  : `border-slate-200/80 dark:border-slate-800/80 ${cat.borderColor}`
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.bgGradient} rounded-full blur-2xl pointer-events-none`} />
              
              <div className="flex items-center justify-between relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center font-bold group-hover:scale-110 transition-transform shadow-xs`}>
                  <IconC className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                  {cat.count}
                </span>
              </div>
              
              <div className="relative z-10 space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-geovision-blue dark:group-hover:text-sky-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {language === 'ar' ? cat.descAr : cat.descEn}
                </p>
              </div>

              <div className="pt-1 flex items-center text-xs font-bold text-geovision-blue dark:text-sky-400 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>{language === 'ar' ? 'استعراض الأسئلة' : 'Explore FAQs'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* QUICK TUTORIALS SECTION (Matches User Reference Screenshot with Premium UI) */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-4">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-slate-200/80 via-slate-100/90 to-slate-200/80 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-800/80 text-slate-900 dark:text-white border border-slate-300/80 dark:border-slate-700 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm sm:text-base font-black uppercase tracking-widest">
              {language === 'ar' ? 'الدروس التعليمية السريعة' : 'QUICK TUTORIALS'}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {language === 'ar'
              ? 'شاهد الفيديو التعليمي التفاعلي أو تصفح دليل المستخدم المعتمد بصيغة PDF'
              : 'Watch step-by-step video walkthroughs or open the official PDF user guide'}
          </p>
        </div>

        {/* 2-Column Grid for Video Tutorial & User Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Video Tutorial */}
          <div className="glass-panel border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-red-400/80 dark:hover:border-red-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 min-w-0 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform relative">
                <Play className="w-7 h-7 fill-white stroke-white ml-0.5" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                    5:30 MINS • 4K HD
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Interactive
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {language === 'ar' ? 'فيديو تعليمي تفاعلي' : 'Video Tutorial'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'ar'
                    ? 'إرشادات خطوة بخطوة لاستخدام الخرائط التفاعلية والتحليل المكاني.'
                    : 'Step-by-step guidance for using GeoVision platform.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setVideoModalOpen(true)}
              className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-rose-300/80 dark:border-rose-800/80 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-950/60 dark:to-red-950/60 text-rose-700 dark:text-rose-200 hover:from-rose-600 hover:to-red-600 hover:text-white dark:hover:from-rose-600 dark:hover:to-red-600 dark:hover:text-white font-black text-xs transition-all shrink-0 cursor-pointer shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{language === 'ar' ? 'مشاهدة الفيديو' : 'Watch Video'}</span>
            </button>
          </div>

          {/* Card 2: User Guide */}
          <div className="glass-panel border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-sky-400/80 dark:hover:border-sky-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 min-w-0 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-sky-500/30 group-hover:scale-105 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-900/50">
                    VERSION 2.4 • PDF
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Official SDI
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                  {language === 'ar' ? 'دليل المستخدم الرسمي' : 'User Guide'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  {language === 'ar'
                    ? 'دليل المستخدم التفصيلي لمنصة GeoVision بصيغة PDF.'
                    : 'Detailed GeoVision user guide in PDF format.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setGuideModalOpen(true)}
              className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-sky-300/80 dark:border-sky-800/80 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/60 dark:to-blue-950/60 text-sky-700 dark:text-sky-200 hover:from-geovision-blue hover:to-blue-700 hover:text-white dark:hover:from-blue-600 dark:hover:to-blue-700 dark:hover:text-white font-black text-xs transition-all shrink-0 cursor-pointer shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'ar' ? 'فتح الدليل' : 'Open Guide'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* STILL NEED HELP? BANNER (Matches User Reference Screenshot with Premium UI) */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto w-full pt-4">
        <div className="bg-gradient-to-br from-sky-50/90 via-blue-50/70 to-indigo-50/80 dark:from-slate-900 dark:via-[#063360]/90 dark:to-slate-950 border border-sky-200/90 dark:border-slate-700/90 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 text-[#063360] dark:text-blue-400 mx-auto flex items-center justify-center font-bold shadow-xl shadow-blue-500/20 border border-sky-200 dark:border-slate-700 transform hover:rotate-6 transition-transform">
            <Headphones className="w-8 h-8 text-[#215A9E] dark:text-sky-400" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-[#063360] dark:text-white tracking-tight">
              {language === 'ar' ? 'هل ما زلت بحاجة إلى المساعدة؟' : 'Still need help?'}
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
              {language === 'ar'
                ? 'فريق أخصائي الخرائط والدعم الفني في خدمتكم للإجابة على استفسارات البيانات المكانية، وتساؤلات المنصة، وسير العمل.'
                : 'Our GIS specialists and support team are here to assist with spatial data inquiries, platform questions, and workflows.'}
            </p>
          </div>

          {/* Interactive Contact Buttons Grid */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#063360] hover:bg-[#215A9E] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#063360]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-sky-400" />
              <span>{language === 'ar' ? 'التواصل مع الدعم الفني' : 'Contact Support'}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText('support@geovision.gov.ae');
                setIsCopiedEmail(true);
                showToast(language === 'ar' ? 'تم نسخ البريد الإلكتروني لدعم GIS' : 'Support email copied to clipboard!');
                setTimeout(() => setIsCopiedEmail(false), 3000);
              }}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-md transition-all cursor-pointer"
            >
              {isCopiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Mail className="w-4 h-4 text-geovision-blue" />}
              <span>support@geovision.gov.ae</span>
            </button>
          </div>

          {/* SLA / Response Time Indicator */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 border-t border-sky-200/50 dark:border-slate-800/80 max-w-md mx-auto">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {language === 'ar' ? 'متوسط وقت الرد: أقل من 15 دقيقة' : 'Avg Response Time: < 15 mins'}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {language === 'ar' ? 'دعم حكومي معتمد' : 'Verified Government Support'}
            </span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-400 flex items-center justify-center font-bold shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'الأسئلة الشائعة والإجابات' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'استعرض الأسئلة الأكثر شيوعاً أو استخدم فلتر الفئات' : 'Find answers to common platform and GIS questions'}
              </p>
            </div>
          </div>

          {/* Filter Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', labelEn: 'All FAQs', labelAr: 'جميع الأسئلة', count: faqs.length },
              { id: 'ai', labelEn: 'GeoVision AI', labelAr: 'الذكاء الاصطناعي', count: faqs.filter(f => f.category === 'ai').length },
              { id: 'tools', labelEn: 'Tools & Printing', labelAr: 'الأدوات والطباعة', count: faqs.filter(f => f.category === 'tools').length },
              { id: 'account', labelEn: 'Account & Saved', labelAr: 'الحساب والمفضلة', count: faqs.filter(f => f.category === 'account').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFaqCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedFaqCategory === tab.id
                    ? 'bg-geovision-blue text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  selectedFaqCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-10 text-center glass-panel rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'لم يتم العثور على نتائج مطابقة في الأسئلة الشائعة' : 'No matching questions found'}
            </p>
            <button
              onClick={() => { setSearchHelp(''); setSelectedFaqCategory('all'); }}
              className="text-xs font-bold text-geovision-blue hover:underline cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Search Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              const IconC = faq.icon;
              const voteState = votedFaqs[faq.id];

              return (
                <div
                  key={faq.id}
                  className={`glass-panel rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md ${
                    isOpen
                      ? 'border-geovision-blue/60 ring-1 ring-geovision-blue/30 bg-blue-50/20 dark:bg-blue-950/10'
                      : 'border-slate-200/80 dark:border-slate-800/80'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between text-left rtl:text-right font-black text-xs sm:text-sm text-slate-900 dark:text-white hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer gap-4"
                  >
                    <span className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                        isOpen ? 'bg-geovision-blue text-white shadow-md' : 'bg-blue-50 dark:bg-slate-800 text-geovision-blue dark:text-blue-400'
                      }`}>
                        <IconC className="w-5 h-5" />
                      </div>
                      <span className="truncate leading-snug">{faq.q}</span>
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hidden sm:inline border border-slate-200/60 dark:border-slate-700">
                        {faq.tag}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-geovision-blue transition-transform" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400 rtl:rotate-180 transition-transform" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-5 sm:p-6 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 space-y-4 animate-in fade-in duration-150">
                      <p className="text-slate-700 dark:text-slate-200">{faq.a}</p>

                      {/* Step-by-step Breakdown if available */}
                      {faq.steps && faq.steps.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 space-y-2">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-geovision-blue dark:text-sky-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{language === 'ar' ? 'خطوات التنفيذ السريعة:' : 'Quick Step-by-Step Guide:'}</span>
                          </h4>
                          <ol className="space-y-1.5 pl-4 rtl:pr-4 rtl:pl-0 list-decimal text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {faq.steps.map((st, sIdx) => (
                              <li key={sIdx}>{st}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Feedback Rating Bar */}
                      <div className="pt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-200/50 dark:border-slate-800/60">
                        <span>{language === 'ar' ? 'هل كانت هذه الإجابة مفيدة؟' : 'Was this answer helpful?'}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleVote(faq.id, 'yes')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer border ${
                              voteState === 'yes'
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600 dark:text-white" />
                            <span>{language === 'ar' ? 'نعم' : 'Yes'}</span>
                          </button>
                          <button
                            onClick={() => handleVote(faq.id, 'no')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer border ${
                              voteState === 'no'
                                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5 text-rose-600 dark:text-white" />
                            <span>{language === 'ar' ? 'لا' : 'No'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIDEO TUTORIAL MODAL */}
      {/* ========================================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col space-y-4 p-6 sm:p-8">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/30">
                <Play className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? 'فيديو تعليمي تفاعلي — GeoVision' : 'Interactive Video Tutorial — GeoVision'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'دليل الاستخدام الكامل والتحليل المكاني بالذكاء الاصطناعي' : 'Complete platform walkthrough & AI spatial analytics guide'}
                </p>
              </div>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={getAssetUrl('homepage-bg-light.png')}
              >
                <source src={getAssetUrl('Homebackground.mp4')} type="video/mp4" />
                {language === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
              </video>
            </div>

            {/* Video Chapters Jump Menu */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'فصول الفيديو التعليمية:' : 'Video Chapters & Topics:'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                {[
                  { time: '0:00', title: '1. Platform Intro' },
                  { time: '1:20', title: '2. Spatial AI NLU' },
                  { time: '2:45', title: '3. AOI & Buffers' },
                  { time: '4:10', title: '4. Print PDF Reports' },
                ].map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span className="truncate">{ch.title}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold">
                      {ch.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Department of Government Enablement • Official Tutorial</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-md"
              >
                {language === 'ar' ? 'إغلاق' : 'Close Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* USER GUIDE PDF INSPECTOR MODAL */}
      {/* ========================================================================= */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setGuideModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-geovision-blue text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? 'دليل المستخدم التفصيلي (PDF)' : 'GeoVision Official User Guide (PDF)'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Version 2.4 • Abu Dhabi Spatial Data Infrastructure (SDI)
                </p>
              </div>
            </div>

            {/* Scrollable PDF Chapter Outline */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-black uppercase text-geovision-blue dark:text-sky-400 tracking-wider">
                  {language === 'ar' ? 'جدول المحتويات المعتمد' : 'Document Table of Contents'}
                </h4>
                <div className="space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                    <span>1. Introduction to Abu Dhabi SDI Spatial Platform</span>
                    <span className="text-slate-400 font-mono">Page 1-8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                    <span>2. Conversational GeoVision AI Queries (Bilingual NLU)</span>
                    <span className="text-slate-400 font-mono">Page 9-22</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                    <span>3. Spatial AOI Drawing, Buffer Tools & Layer Clustering</span>
                    <span className="text-slate-400 font-mono">Page 23-38</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                    <span>4. Government Print Studio & PDF Cartographic Exports</span>
                    <span className="text-slate-400 font-mono">Page 39-48</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 shrink-0 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  showToast(language === 'ar' ? 'جاري تحميل دليل المستخدم PDF...' : 'Downloading GeoVision User Guide PDF...');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ar' ? 'تحميل الملف (PDF)' : 'Download PDF Guide'}</span>
              </button>

              <button
                onClick={() => setGuideModalOpen(false)}
                className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Close Guide'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HelpPage;
