import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  Globe,
  Moon,
  Sun,
  Star,
  History,
  LogOut,
  ShieldCheck,
  Map,
  ArrowRight,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    user,
    setUser,
    setCurrentView,
    favorites,
    conversationSessions,
  } = useAppState();

  const handleLogout = () => {
    setUser({
      id: 'guest-1',
      username: 'guest',
      email: '',
      name: 'Guest User',
      isGuest: true,
    });
    setCurrentView('home');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16 space-y-8 bg-spatial-canvas min-h-screen">
      
      {/* WOW Full-Width Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#041F3B] text-white shadow-2xl border border-[#7DA1C4]/30 glow-blue">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#215A9E]/20 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7DA1C4]/15 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left rtl:sm:text-right">
            {/* Avatar Circle with Glow Ring */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#215A9E] via-[#7DA1C4] to-[#063360] p-1 shadow-2xl shadow-[#215A9E]/40">
                <div className="w-full h-full rounded-[22px] bg-[#041F3B] flex items-center justify-center text-4xl font-black text-white">
                  {user.name.charAt(0)}
                </div>
              </div>
              {!user.isGuest && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#063360] shadow-md" title="Verified Abu Dhabi Citizen">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.name}</h1>
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-[#7DA1C4] border border-white/20 backdrop-blur-md">
                  {user.isGuest ? 'Guest Session' : 'Verified Citizen'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-300">
                {user.email || 'admin@fea.local'}
              </p>
              <p className="text-xs font-black text-[#7DA1C4] flex items-center justify-center sm:justify-start rtl:sm:justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7DA1C4] animate-ping inline-block" />
                <span>Department of Government Enablement — Abu Dhabi</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('map')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#215A9E] hover:bg-[#063360] text-white font-black text-xs shadow-xl shadow-[#215A9E]/30 transition-all cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Launch Spatial Workspace</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* 4-Column Quick Stats Dashboard Strip */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-black text-amber-400">{favorites.length}</p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-1">Favorites</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-black text-cyan-400">{conversationSessions.length}</p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-1">AI Chat Sessions</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-black text-emerald-400">{language.toUpperCase()}</p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-1">Language</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-2xl font-black text-purple-400">{theme.toUpperCase()}</p>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mt-1">Theme Mode</p>
          </div>
        </div>
      </div>

      {/* Preferences & Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Preference Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-geovision-blue flex items-center justify-center font-black shadow-md">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">System Language</h3>
              <p className="text-xs font-semibold text-slate-400">Choose preferred interface language & text direction</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-slate-900 dark:text-white">
                {language === 'en' ? 'English (LTR)' : 'العربية (RTL)'}
              </p>
              <p className="text-[11px] text-slate-400 font-semibold">
                {language === 'en' ? 'Left-to-Right Layout' : 'من اليمين إلى اليسار'}
              </p>
            </div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-5 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Switch Language
            </button>
          </div>
        </div>

        {/* Theme Preference Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#215A9E]/10 dark:bg-white/10 text-geovision-blue dark:text-white flex items-center justify-center font-black shadow-md">
              {theme === 'light' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Appearance Theme</h3>
              <p className="text-xs font-semibold text-slate-400">Toggle dark and light visual aesthetics</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-slate-900 dark:text-white">
                {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </p>
              <p className="text-[11px] text-slate-400 font-semibold">
                {theme === 'light' ? 'Bright high-contrast map UI' : 'Sleek dark glassmorphism'}
              </p>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-black hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              Toggle Theme
            </button>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('favorites')}
          className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between hover:border-amber-400 transition-all cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center font-bold shadow-xs">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-black text-slate-900 dark:text-white">My Favorites</p>
              <p className="text-xs text-slate-400 font-semibold">{favorites.length} favorite items</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all rtl:rotate-180" />
        </button>

        <button
          onClick={() => setCurrentView('history')}
          className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between hover:border-geovision-blue transition-all cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-geovision-blue flex items-center justify-center font-bold shadow-xs">
              <History className="w-6 h-6" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-black text-slate-900 dark:text-white">AI Chat History</p>
              <p className="text-xs text-slate-400 font-semibold">{conversationSessions.length} timeline sessions</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-geovision-blue group-hover:translate-x-1 transition-all rtl:rotate-180" />
        </button>

        <button
          onClick={handleLogout}
          className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-all cursor-pointer group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-500 flex items-center justify-center font-bold shadow-xs">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-sm font-black text-rose-600 dark:text-rose-400">Sign Out</p>
              <p className="text-xs text-slate-400 font-semibold">End current session</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-all rtl:rotate-180" />
        </button>
      </div>

    </div>
  );
};
