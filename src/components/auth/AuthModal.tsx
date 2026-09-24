import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { getAssetUrl } from '../../utils/assetUtils';
import { X, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, setUser, showToast, language, theme } = useAppState();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('ahmed.almansoori@dge.gov.ae');
  const [password, setPassword] = useState('dge2026password');
  const [username, setUsername] = useState('Ahmed Al Mansoori');

  if (!loginModalOpen) return null;

  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  const handleTabChange = (newTab: 'signin' | 'signup' | 'forgot') => {
    setTab(newTab);
    setError(null);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !isValidEmail(email)) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        language === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.'
          : 'Invalid email address or password. Please check your credentials and try again.'
      );
      return;
    }

    setUser({
      id: 'user-registered-1',
      username: username || email.split('@')[0],
      email: email,
      name: username || 'Ahmed Al Mansoori',
      isGuest: false,
    });
    setLoginModalOpen(false);
    showToast(
      language === 'ar'
        ? 'تم تسجيل الدخول بنجاح! تم استعادة محادثتك سابقة.'
        : 'Signed in successfully! Your previous conversation has been restored.'
    );
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || username.trim().length < 3) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل).'
          : 'Please enter your full name (minimum 3 characters).'
      );
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!password || password.length < 6) {
      setError(
        language === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    setUser({
      id: `user-${Date.now()}`,
      username: username.trim(),
      email: email.trim(),
      name: username.trim(),
      isGuest: false,
    });
    setLoginModalOpen(false);
    showToast(
      language === 'ar'
        ? 'تم إنشاء الحساب بنجاح! تم حفظ جلسة البحث الخاصة بك.'
        : 'Account created! Your search session has been restored & saved to your account.'
    );
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !isValidEmail(email)) {
      setError(
        language === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    showToast(language === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' : 'Password reset link sent to your email');
    setTab('signin');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-5 glow-blue-lg">
        
        {/* Close Button */}
        <button
          onClick={() => setLoginModalOpen(false)}
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
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {tab === 'signin' && (language === 'ar' ? 'تسجيل الدخول إلى GeoVision' : 'Sign In to GeoVision')}
            {tab === 'signup' && (language === 'ar' ? 'إنشاء حساب مستخدم جديد' : 'Create Citizen Account')}
            {tab === 'forgot' && (language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password')}
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'دائرة التمكين الحكومي - أبوظبي' : 'Department of Government Enablement — Abu Dhabi'}
          </p>
        </div>



        {/* Tab Selector */}
        {tab !== 'forgot' && (
          <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl glass-level-1 text-xs font-extrabold">
            <button
              onClick={() => handleTabChange('signin')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-[#215A9E] text-white shadow-md shadow-[#215A9E]/25 font-black'
                  : 'text-[#545860] dark:text-slate-300 hover:text-[#063360] dark:hover:text-white'
              }`}
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-[#215A9E] text-white shadow-md shadow-[#215A9E]/25 font-black'
                  : 'text-[#545860] dark:text-slate-300 hover:text-[#063360] dark:hover:text-white'
              }`}
            >
              {language === 'ar' ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>
        )}

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-extrabold flex items-center gap-2.5 animate-fade-in shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">


            <div className="space-y-1">
              <label className="text-xs font-bold text-[#063360] dark:text-slate-300">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed.almansoori@dge.gov.ae"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-[#063360] dark:text-white focus:ring-2 focus:ring-[#215A9E] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#063360] dark:text-slate-300">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="font-bold text-[#215A9E] hover:underline cursor-pointer"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rtl:pr-10 rtl:pl-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-[#063360] dark:text-white focus:ring-2 focus:ring-[#215A9E] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 rtl:left-3.5 rtl:right-auto cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#215A9E] text-white text-xs font-black hover:bg-[#063360] shadow-xl shadow-[#215A9E]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{language === 'ar' ? 'تسجيل الدخول للمنصة' : 'Sign In to Platform'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ahmed Al Mansoori"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'ar' ? 'البريد الإلكتروني المسجل' : 'Registered Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed.almansoori@dge.gov.ae"
                className="w-full px-4 py-2.5 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-geovision-blue focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-xl transition-all cursor-pointer"
            >
              {language === 'ar' ? 'إرسال التعليمات' : 'Send Reset Instructions'}
            </button>
            <button
              type="button"
              onClick={() => setTab('signin')}
              className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {language === 'ar' ? '← العودة إلى تسجيل الدخول' : '← Back to Sign In'}
            </button>
          </form>
        )}

        {/* Guest Action */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center">
          <button
            onClick={() => setLoginModalOpen(false)}
            className="text-xs font-bold text-slate-500 hover:text-geovision-blue transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'المتابعة كزائر ←' : 'Continue exploring as Guest →'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
