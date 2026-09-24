import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { FeedbackStarIcon } from './FeedbackStarIcon';
import { Star, X, Send } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const { feedbackModalOpen, setFeedbackModalOpen, user, showToast, t } = useAppState();
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [comments, setComments] = useState('');

  if (!feedbackModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(t('feedback.success'));
    setFeedbackModalOpen(false);
    setComments('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-5 glow-blue">
        
        <button
          onClick={() => setFeedbackModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#215A9E] text-white flex items-center justify-center font-bold shadow-md shadow-[#215A9E]/30">
            <FeedbackStarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#063360] dark:text-white">
              {t('feedback.title')}
            </h2>
            <p className="text-xs font-semibold text-[#545860] dark:text-slate-400">
              Help us improve GeoVision GIS experience
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 5-Star Rating Selector (DGE On-Brand Tech Blue Fill) */}
          <div className="space-y-1.5 text-center">
            <label className="text-xs font-bold text-[#063360] dark:text-slate-300 block">
              {t('feedback.ratingLabel')}
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-[#215A9E] text-[#215A9E]'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#063360] dark:text-slate-300">
                {t('feedback.nameLabel')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmed Al Mansoori"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-[#063360] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#215A9E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#063360] dark:text-slate-300">
                {t('feedback.emailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-[#063360] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#215A9E]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t('feedback.commentsLabel')}
            </label>
            <textarea
              required
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us what features or GIS datasets you would like to see..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-geovision-blue"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180" />
              {t('feedback.btnSubmit')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
