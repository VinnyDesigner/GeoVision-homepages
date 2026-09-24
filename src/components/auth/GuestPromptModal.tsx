import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import { X, UserCheck } from 'lucide-react';

export const GuestPromptModal: React.FC = () => {
  const { guestPromptOpen, setGuestPromptOpen, setLoginModalOpen, language, theme } = useAppState();

  if (!guestPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 text-center space-y-5 glow-blue-lg">
        
        {/* Close Button */}
        <button
          onClick={() => setGuestPromptOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header Row featuring both official logos */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 pr-8 rtl:pl-8 rtl:pr-0">
          <img
            src={getAssetUrl(theme === 'dark' ? 'assets/logos/dge-logo-dark.png' : 'assets/logos/dge-logo.png')}
            alt="Department of Government Enablement"
            className="h-8 sm:h-9 object-contain shrink-0"
          />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 shrink-0" />
          <img
            src={getAssetUrl(theme === 'dark' ? 'assets/logos/spatial-data-logo-dark.png' : 'assets/logos/spatial-data-logo.png')}
            alt="Abu Dhabi Spatial Data"
            className="h-7 sm:h-8 object-contain shrink-0"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3 text-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'قم بإنشاء حساب للحفظ' : 'Create an Account to Save'}
          </h2>

          <div className="p-3 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700 text-left rtl:text-right space-y-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            <p className="text-[11px] font-black text-geovision-blue dark:text-blue-300">
              {language === 'ar' ? 'عند تسجيل الدخول يمكنك حفظ:' : 'Create an account to save:'}
            </p>
            <div className="space-y-1 text-slate-800 dark:text-slate-100 font-extrabold">
              <p>✓ {language === 'ar' ? 'المواقع المفضلة' : 'Favourite locations'}</p>
              <p>✓ {language === 'ar' ? 'سجل البحث' : 'Search history'}</p>
              <p>✓ {language === 'ar' ? 'محادثات الذكاء الاصطناعي المكانية' : 'Saved AI conversations'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              setGuestPromptOpen(false);
              setLoginModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Register Account'}</span>
          </button>

          <button
            onClick={() => setGuestPromptOpen(false)}
            className="w-full py-2.5 rounded-xl border border-white/70 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors glass-level-1 cursor-pointer"
          >
            {language === 'ar' ? 'المتابعة كزائر' : 'Continue as Guest'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuestPromptModal;
