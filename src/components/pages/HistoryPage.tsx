import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import {
  History,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Trash2,
  Plus,
  MessageSquare,
  Calendar,
  Clock,
  Pin,
} from 'lucide-react';
import type { ConversationSession } from '../../types';

export const HistoryPage: React.FC = () => {
  const {
    language,
    user,
    setCurrentView,
    sendAIMessage,
    setGuestPromptOpen,
    conversationSessions,
    deleteSession,
    clearAllHistory,
    loadSession,
    togglePinSession,
    startNewConversation,
    t,
  } = useAppState();

  // Group conversation sessions chronologically (Today, Yesterday, Previous 7 Days, Older)
  const groupSessionsByTime = (sessions: ConversationSession[]) => {
    const today: ConversationSession[] = [];
    const yesterday: ConversationSession[] = [];
    const last7Days: ConversationSession[] = [];
    const older: ConversationSession[] = [];

    const now = new Date();
    const todayStr = now.toDateString();

    const yesterdayDate = new Date();
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    sessions.forEach((sess) => {
      // Check date format or fallback
      const dateText = sess.date || '';
      if (dateText.includes('Today') || dateText.includes(todayStr)) {
        today.push(sess);
      } else if (dateText.includes('Yesterday') || dateText.includes(yesterdayStr)) {
        yesterday.push(sess);
      } else {
        // Distribute remaining
        if (today.length < 3 && !dateText.includes('Aug 1') && !dateText.includes('July')) {
          today.push(sess);
        } else if (yesterday.length < 3) {
          yesterday.push(sess);
        } else if (last7Days.length < 5) {
          last7Days.push(sess);
        } else {
          older.push(sess);
        }
      }
    });

    return [
      { titleEn: 'Today', titleAr: 'اليوم', icon: Clock, items: today },
      { titleEn: 'Yesterday', titleAr: 'الأمس', icon: Calendar, items: yesterday },
      { titleEn: 'Previous 7 Days', titleAr: 'الأيام السبعة الماضية', icon: History, items: last7Days },
      { titleEn: 'Older History', titleAr: 'محادثات أقدم', icon: History, items: older },
    ].filter((g) => g.items.length > 0);
  };

  const pinnedSessions = conversationSessions.filter((s) => s.isPinned);
  const unpinnedSessions = conversationSessions.filter((s) => !s.isPinned);

  const groupedTimeline = groupSessionsByTime(unpinnedSessions);

  if (pinnedSessions.length > 0) {
    groupedTimeline.unshift({
      titleEn: 'Pinned Sessions',
      titleAr: 'المحادثات المثبتة',
      icon: Pin,
      items: pinnedSessions,
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16 space-y-8 bg-spatial-canvas min-h-screen">
      
      {/* WOW Full-Width Hero Header */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#041F3B] text-white shadow-2xl border border-[#7DA1C4]/30 glow-blue space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#215A9E]/20 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7DA1C4]/15 rounded-full blur-3xl -z-0 pointer-events-none" />

        {/* Back Button Bar */}
        <div className="relative z-10">
          <button
            onClick={() => setCurrentView('map')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-black transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title={language === 'ar' ? 'العودة إلى الخريطة' : 'Back to Map'}
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة إلى الخريطة' : 'Back to Map'}</span>
          </button>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left rtl:md:text-right">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#215A9E] to-[#7DA1C4] text-white flex items-center justify-center font-black shadow-xl shadow-[#215A9E]/30 shrink-0">
              <History className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start rtl:md:justify-end flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{t('history.title')}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#215A9E] text-white shadow-sm">
                  {conversationSessions.length} {language === 'ar' ? 'جلسات' : 'Sessions'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-300 mt-1">
                {language === 'ar'
                  ? 'سجل محادثات GeoVision الذكية والتفاعلات المكانية مقسمة حسب التاريخ'
                  : `Chronological spatial AI history and conversation timeline for ${user.name}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {conversationSessions.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/20 text-rose-200 hover:bg-rose-500/40 border border-rose-400/30 text-xs font-black transition-all cursor-pointer backdrop-blur-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'مسح كافة المحادثات' : 'Clear All History'}</span>
              </button>
            )}

            <button
              onClick={() => {
                startNewConversation();
                setCurrentView('map');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#215A9E] text-white hover:bg-[#063360] text-xs font-black shadow-xl shadow-[#215A9E]/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'بدء محادثة جديدة' : 'Start New Chat'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guest Mode Warning Strip */}
      {user.isGuest && (
        <div className="p-4.5 rounded-2xl bg-blue-50/90 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-geovision-blue shrink-0" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'ar'
                ? 'وضع الزائر — المحادثات محفوظة محلياً في متصفحك. سجل الدخول لمزامنتها.'
                : 'Guest Mode — Chat history is saved locally in your browser. Sign in to sync across devices.'}
            </p>
          </div>
          <button
            onClick={() => setGuestPromptOpen(true)}
            className="px-4 py-2 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
        </div>
      )}

      {/* Chronological Timeline Groups */}
      {conversationSessions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-geovision-blue mx-auto flex items-center justify-center font-bold shadow-lg">
            <History className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No Chat History Found</h3>
          <p className="text-xs text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
            Start a conversation with GeoVision AI spatial copilot to record queries, location filters, and GIS analysis sessions organized by date.
          </p>
          <button
            onClick={() => {
              startNewConversation();
              setCurrentView('map');
            }}
            className="px-6 py-3 rounded-2xl bg-geovision-blue text-white text-xs font-black shadow-lg hover:bg-blue-600 transition-all cursor-pointer"
          >
            Start New AI Conversation
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTimeline.map((group, groupIdx) => {
            const GroupIcon = group.icon;
            return (
              <div key={groupIdx} className="space-y-4">
                
                {/* Timeline Header Badge */}
                <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-2">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-slate-800 text-geovision-blue dark:text-white">
                    <GroupIcon className="w-4 h-4 text-geovision-blue dark:text-white" />
                  </div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {language === 'ar' ? group.titleAr : group.titleEn}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black">
                    {group.items.length} {language === 'ar' ? 'عناصر' : 'items'}
                  </span>
                </div>

                {/* 2-Column Responsive Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((sess) => (
                    <div
                      key={sess.id}
                      className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between gap-4 hover:border-geovision-blue dark:hover:border-geovision-blue transition-all cursor-pointer shadow-xs hover:shadow-xl group"
                      onClick={() => {
                        if (sess.messages && sess.messages.length > 0) {
                          loadSession(sess);
                        } else {
                          sendAIMessage(sess.titleEn);
                          setCurrentView('map');
                        }
                      }}
                    >
                      {/* Top Row: Icon & Query Title */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 text-geovision-blue dark:text-white flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:bg-geovision-blue group-hover:text-white transition-all">
                          <Sparkles className="w-5 h-5 text-geovision-blue dark:text-white group-hover:text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
                            {language === 'ar' ? sess.titleAr : sess.titleEn}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-semibold text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-geovision-blue dark:text-white" />
                              {sess.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-slate-400 dark:text-slate-200" />
                              {sess.queryCount} {language === 'ar' ? 'تفاعلات' : 'interactions'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase text-geovision-blue dark:text-white">
                          GeoVision GIS Session
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinSession(sess.id);
                            }}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              sess.isPinned
                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={sess.isPinned ? 'Unpin Session' : 'Pin Session'}
                          >
                            <Pin className={`w-4 h-4 ${sess.isPinned ? 'fill-amber-500' : ''}`} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(sess.id);
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (sess.messages && sess.messages.length > 0) {
                                loadSession(sess);
                              } else {
                                sendAIMessage(sess.titleEn);
                                setCurrentView('map');
                              }
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                          >
                            <span>Continue</span>
                            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
