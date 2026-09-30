import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Globe,
  Building2,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MapPin,
  ExternalLink,
  Database,
  Gauge,
  Share2,
  Cpu,
  Eye,
  Users,
  Compass,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { t, language, setCurrentView } = useAppState();
  const [activeTab, setActiveTab] = useState<'all' | 'dge' | 'sdi' | 'mission'>('all');

  return (
    <div className="w-full bg-[#f4f7fb] dark:bg-[#060b13] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background Ambient Blur Lights */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-[#215A9E]/10 dark:bg-[#215A9E]/15 rounded-full blur-[130px] pointer-events-none -z-0" />
      <div className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-24 space-y-12 sm:space-y-16">
        
        {/* ================= STUNNING MODERN CENTRERED HERO ================= */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
          
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#215A9E] dark:bg-sky-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-[#215A9E] dark:text-sky-300">
              {t('about.tagline')}
            </span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {language === 'ar' ? (
              <>
                من نحن <br />
                <span className="bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#176BFF] dark:from-sky-300 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  منصة GeoVision
                </span>
              </>
            ) : (
              <>
                About Us <br />
                <span className="bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#176BFF] dark:from-sky-300 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  GeoVision
                </span>
              </>
            )}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            {t('about.body')}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('map')}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#176BFF] text-white font-black text-sm shadow-xl shadow-[#215A9E]/30 hover:shadow-2xl hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-sky-200" />
              <span>{t('about.exploreBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <a
              href="https://www.dge.gov.ae/en"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold text-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <span>{t('about.dgeBtn')}</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

        </section>

        {/* ================= FLOATING GLASS METRICS BAR ================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:border-[#215A9E]/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('about.stat1Num')}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-3">
              {t('about.stat1Label')}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:border-[#215A9E]/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('about.stat2Num')}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#215A9E]/10 text-[#215A9E] dark:text-sky-300 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-3">
              {t('about.stat2Label')}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:border-[#215A9E]/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('about.stat3Num')}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-3">
              {t('about.stat3Label')}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl hover:border-[#215A9E]/40 hover:-translate-y-1 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {t('about.stat4Num')}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Gauge className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-3">
              {t('about.stat4Label')}
            </p>
          </div>

        </section>

        {/* ================= INTERACTIVE PILLAR FILTER TABS ================= */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#215A9E] text-white shadow-lg shadow-[#215A9E]/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {language === 'ar' ? 'جميع المبادرات' : 'All Initiatives'}
          </button>
          <button
            onClick={() => setActiveTab('dge')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'dge'
                ? 'bg-[#215A9E] text-white shadow-lg shadow-[#215A9E]/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {t('about.dgeTitle')}
          </button>
          <button
            onClick={() => setActiveTab('sdi')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'sdi'
                ? 'bg-[#215A9E] text-white shadow-lg shadow-[#215A9E]/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {t('about.sdiTitle')}
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'mission'
                ? 'bg-[#215A9E] text-white shadow-lg shadow-[#215A9E]/25'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {t('about.missionTitle')}
          </button>
        </div>

        {/* ================= BENTO GRID FEATURE DISPLAY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* BENTO CARD 1: Department of Government Enablement (DGE) */}
          {(activeTab === 'all' || activeTab === 'dge') && (
            <div className="lg:col-span-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 flex flex-col justify-between group hover:border-[#215A9E]/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#215A9E]/10 text-[#215A9E] dark:text-sky-300 text-xs font-black uppercase tracking-wider">
                    <Building2 className="w-4 h-4" />
                    <span>{t('about.dgeTag')}</span>
                  </div>
                  <a
                    href="https://www.dge.gov.ae/en"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={t('about.dgeBtn')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t('about.dgeTitle')}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {t('about.dgeBody1')}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {t('about.dgeBody2')}
                </p>
              </div>

              {/* 3 Pillar Micro Badges */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200/60 dark:border-slate-800">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#215A9E] shrink-0" />
                    <span>{t('about.dgeCard1Title')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-3">
                    {t('about.dgeCard1Desc')}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{t('about.dgeCard2Title')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-3">
                    {t('about.dgeCard2Desc')}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{t('about.dgeCard3Title')}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-3">
                    {t('about.dgeCard3Desc')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BENTO CARD 2: Visual Abu Dhabi Landmark Highlight */}
          {(activeTab === 'all' || activeTab === 'dge') && (
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl min-h-[320px] flex flex-col justify-end group">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
                alt="Abu Dhabi Landmark"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="relative z-10 p-6 sm:p-8 space-y-2 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Abu Dhabi Capital District</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Empowering 100% Digitized Government Infrastructure
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Connecting citizens, planners, and GIS teams through real-time spatial intelligence.
                </p>
              </div>
            </div>
          )}

          {/* BENTO CARD 3: Abu Dhabi Spatial Data Infrastructure (AD-SDI) */}
          {(activeTab === 'all' || activeTab === 'sdi') && (
            <div className="lg:col-span-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-8 hover:border-[#215A9E]/50 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-wider">
                    <Globe className="w-4 h-4" />
                    <span>{t('about.sdiTag')}</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t('about.sdiTitle')}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {t('about.sdiBody1')}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {t('about.sdiBody2')}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {t('about.sdiBody3')}
                  </p>

                  <div className="pt-2">
                    <a
                      href="https://sdi.gov.abudhabi/sdi/index.html"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#063360] hover:bg-[#215A9E] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
                    >
                      <span>{t('about.sdiBtn')}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {t('about.sdiCard1Title')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {t('about.sdiCard1Desc')}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {t('about.sdiCard2Title')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {t('about.sdiCard2Desc')}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#215A9E]/10 text-[#215A9E] dark:text-sky-300 flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {t('about.sdiCard3Title')}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {t('about.sdiCard3Desc')}
                    </p>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* BENTO CARD 4: Mission & Principles Grid */}
          {(activeTab === 'all' || activeTab === 'mission') && (
            <div className="lg:col-span-12 space-y-6">
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t('about.missionTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {t('about.missionSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t('about.mCard1Title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t('about.mCard1Desc')}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-[#215A9E]/10 text-[#215A9E] dark:text-sky-300 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t('about.mCard2Title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t('about.mCard2Desc')}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t('about.mCard3Title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t('about.mCard3Desc')}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* ================= EXPLORE CTA BANNER ================= */}
        <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#041F3B] via-[#063360] to-[#215A9E] text-white shadow-2xl border border-white/10 glow-blue">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left rtl:md:text-right max-w-2xl">
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                {t('about.ctaTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {t('about.ctaSubtitle')}
              </p>
            </div>

            <button
              onClick={() => setCurrentView('map')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-[#063360] dark:text-[#063360] hover:bg-slate-100 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 dark-preserve-dark-text"
            >
              <span className="text-[#063360] font-black">{t('about.ctaBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 text-[#063360]" />
            </button>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="pt-10 border-t border-slate-200 dark:border-slate-800/80 space-y-8 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 mb-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
                <div className="w-6 h-6 rounded-lg bg-[#215A9E] text-white flex items-center justify-center font-bold text-xs">
                  G
                </div>
                <span>GeoVision</span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                {language === 'ar'
                  ? 'تمكين الوصول السهل للخدمات المكانية والبيانات المفتوحة في جميع أنحاء أبوظبي.'
                  : 'Enabling seamless access to geospatial intelligence, community infrastructure, and open data across Abu Dhabi.'}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white text-[11px]">
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h5>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setCurrentView('map')} className="hover:text-[#215A9E] dark:hover:text-sky-300 transition-colors">
                    {language === 'ar' ? 'خريطة GeoVision' : 'GeoVision Map'}
                  </button>
                </li>
                <li>
                  <a href="https://sdi.gov.abudhabi/sdi/index.html" target="_blank" rel="noreferrer" className="hover:text-[#215A9E] dark:hover:text-sky-300 transition-colors">
                    {language === 'ar' ? 'بوابة AD-SDI' : 'AD-SDI Portal'}
                  </a>
                </li>
                <li>
                  <a href="https://www.dge.gov.ae/en" target="_blank" rel="noreferrer" className="hover:text-[#215A9E] dark:hover:text-sky-300 transition-colors">
                    {language === 'ar' ? 'موقع دائرة التمكين الحكومي' : 'DGE Website'}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>
              © 2026 Abu Dhabi Spatial Data Infrastructure – AD-SDI GeoVision | UAE Open Data Initiative
            </div>
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>AD-SDI Platform Operational</span>
            </div>
          </div>

        </footer>

      </div>

    </div>
  );
};
