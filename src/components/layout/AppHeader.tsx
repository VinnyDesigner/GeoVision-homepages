import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import { ensureAbuDhabiLocation } from '../../utils/locationUtils';
import { FeedbackStarIcon } from '../common/FeedbackStarIcon';
import {
  Globe,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  HelpCircle,
  Info,
  Map,
  Home,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    currentView,
    setCurrentView,
    userLocation,
    setMapCenterAndZoom,
    user,
    setUser,
    setLoginModalOpen,
    setFeedbackModalOpen,
    t,
  } = useAppState();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-close user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: any) => {
    if (view === 'map' && userLocation) {
      const validLoc = ensureAbuDhabiLocation(userLocation[0], userLocation[1]);
      setMapCenterAndZoom(validLoc, 14);
    }
    setCurrentView(view);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
    setUserDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    setUser({
      id: 'guest-1',
      username: 'guest',
      email: '',
      name: 'Guest User',
      isGuest: true,
    });
    setUserDropdownOpen(false);
  };

  return (
    <div className="fixed top-2 sm:top-3 left-3 sm:left-4 right-3 sm:right-4 z-[500]">
      <header className="relative w-full h-[56px] sm:h-[62px] glass-level-2 rounded-2xl px-3 sm:px-6 flex items-center justify-between shadow-xl border border-white/80 dark:border-white/10">
        
        {/* Left: First Logo — Department of Government Enablement Brandmark */}
        <div className="flex items-center cursor-pointer shrink-0 min-w-0" onClick={() => handleNavClick('home')}>
          <img
            src={getAssetUrl(theme === 'dark' ? 'assets/logos/dge-logo-dark.png' : 'assets/logos/dge-logo.png')}
            alt="Department of Government Enablement"
            className="h-6 xs:h-7 sm:h-9 md:h-10 max-w-[95px] xs:max-w-[125px] sm:max-w-none object-contain shrink-0 transition-transform hover:scale-105"
          />
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 glass-level-1 p-1 rounded-xl">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'home'
                ? 'bg-[#215A9E]/15 text-[#215A9E] dark:bg-white/15 dark:text-white font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-[#063360] dark:text-slate-200 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            {t('nav.home')}
          </button>

          <button
            onClick={() => handleNavClick('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'map'
                ? 'bg-[#215A9E]/15 text-[#215A9E] dark:bg-white/15 dark:text-white font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-[#063360] dark:text-slate-200 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            {t('nav.exploreMap')}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentView === 'about'
                ? 'bg-[#215A9E]/15 text-[#215A9E] dark:bg-white/15 dark:text-white font-extrabold shadow-2xs'
                : 'text-slate-600 hover:text-[#063360] dark:text-slate-200 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            {t('nav.about')}
          </button>
        </nav>

        {/* Right: Controls & Last Logo — Abu Dhabi Spatial Data */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 max-w-full">
          
          {/* Mobile Hamburger Navigation Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setUserDropdownOpen(false);
            }}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors glass-level-1 cursor-pointer shrink-0"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-geovision-blue dark:text-white" /> : <Menu className="w-4 h-4 text-geovision-blue dark:text-white" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-100 border border-white/60 dark:border-slate-700 hover:border-geovision-blue hover:text-geovision-blue dark:hover:text-white transition-all glass-level-1 shrink-0"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-geovision-blue dark:text-white shrink-0" />
            <span className="hidden sm:inline text-[11px] sm:text-xs">{t('nav.language')}</span>
            <span className="sm:hidden text-[10px] font-black uppercase text-geovision-blue dark:text-white">{language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors glass-level-1 cursor-pointer shrink-0"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-geovision-blue dark:text-white" /> : <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-geovision-blue dark:text-white" />}
          </button>

          {/* Help Icon Button */}
          <button
            onClick={() => handleNavClick('help')}
            className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl transition-colors glass-level-1 cursor-pointer shrink-0 ${
              currentView === 'help'
                ? 'bg-[#215A9E]/15 text-geovision-blue dark:bg-white/15 dark:text-white font-extrabold ring-1 ring-geovision-blue/30'
                : 'text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 hover:text-geovision-blue dark:hover:text-white'
            }`}
            title={t('nav.help')}
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-geovision-blue dark:text-white" />
          </button>

          {/* Feedback Icon Button */}
          <button
            onClick={() => {
              setFeedbackModalOpen(true);
              setUserDropdownOpen(false);
            }}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800 hover:text-geovision-blue dark:hover:text-white transition-colors glass-level-1 cursor-pointer shrink-0"
            title={t('nav.feedback')}
          >
            <FeedbackStarIcon className="w-4 h-4 text-geovision-blue dark:text-white" />
          </button>

          {/* User Account / Guest Controls */}
          {user.isGuest ? (
            <button
              onClick={() => {
                setLoginModalOpen(true);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-geovision-blue text-white hover:bg-blue-600 shadow-md shadow-blue-500/25 transition-all shrink-0 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t('nav.signIn')}</span>
            </button>
          ) : (
            <div className="relative shrink-0" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/60 dark:border-slate-700 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors glass-level-1"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-geovision-blue text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[80px] sm:max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-950/30 border border-slate-200/90 dark:border-slate-700/90 py-2 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile Header Box */}
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email || 'admin@fea.local'}
                    </p>
                  </div>

                  {/* Menu Options */}
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-800 dark:text-slate-100 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-geovision-blue dark:hover:text-blue-300 transition-all cursor-pointer group"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-geovision-blue dark:group-hover:text-blue-300 shrink-0" />
                      <span>{t('nav.profile')}</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer group"
                    >
                      <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-px h-5 sm:h-6 bg-slate-300/80 dark:bg-slate-700/80 shrink-0 hidden md:block" />

          {/* Rightmost: Second Logo — Abu Dhabi Spatial Data */}
          <div className="hidden md:flex items-center cursor-pointer shrink-0" onClick={() => handleNavClick('home')}>
            <img
              src={getAssetUrl(theme === 'dark' ? 'assets/logos/spatial-data-logo-dark.png' : 'assets/logos/spatial-data-logo.png')}
              alt="Abu Dhabi Spatial Data"
              className="h-6 sm:h-7 md:h-8 max-w-[85px] sm:max-w-[110px] object-contain shrink-0 transition-transform hover:scale-105"
            />
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0 glass-level-3 rounded-2xl p-3 shadow-2xl border border-white/80 dark:border-slate-800 space-y-1 z-[500] animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'home' ? 'bg-geovision-blue text-white shadow-md' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('nav.home')}</span>
            </button>

            <button
              onClick={() => handleNavClick('map')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'map' ? 'bg-geovision-blue text-white shadow-md' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>{t('nav.exploreMap')}</span>
            </button>

            <button
              onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'about' ? 'bg-geovision-blue text-white shadow-md' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{t('nav.about')}</span>
            </button>

            <button
              onClick={() => { setCurrentView('help'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'help' ? 'bg-geovision-blue text-white shadow-md' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t('nav.help')}</span>
            </button>

            <button
              onClick={() => { setFeedbackModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FeedbackStarIcon className="w-4 h-4 text-geovision-blue dark:text-white" />
              <span>{t('nav.feedback')}</span>
            </button>
          </div>
        )}

      </header>
    </div>
  );
};

export default AppHeader;
