import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Mic, X, Edit3, ArrowRight, Volume2 } from 'lucide-react';

interface VoiceSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSearchOverlay: React.FC<VoiceSearchOverlayProps> = ({ isOpen, onClose }) => {
  const { language, sendAIMessage, t } = useAppState();
  const [listeningState, setListeningState] = useState<'listening' | 'captured'>('listening');
  const [capturedText, setCapturedText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setListeningState('listening');
      setCapturedText('');
      setIsEditing(false);

      // Simulate audio speech recognition after 2.5 seconds
      const timer = setTimeout(() => {
        setCapturedText(
          language === 'ar'
            ? 'عرض المستشفيات على بعد 5 كم من مدينة خليفة'
            : 'Show hospitals within 5 km of Khalifa City'
        );
        setListeningState('captured');
      }, 2400);

      return () => clearTimeout(timer);
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (capturedText.trim()) {
      sendAIMessage(capturedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-level-3 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 text-center glow-blue-lg">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {listeningState === 'listening' ? (
          <div className="flex flex-col items-center gap-6 py-4">
            {/* Animated Mic & Pulse Rings */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full bg-geovision-blue/20 animate-ping"></div>
              <div className="absolute w-20 h-20 rounded-full bg-geovision-blue/30 animate-pulse"></div>
              <div className="relative w-16 h-16 rounded-full bg-geovision-blue text-white flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Mic className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {t('voice.title')}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('voice.listeningHint')}
              </p>
            </div>

            {/* Simulated Waveform Animation */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[40, 75, 100, 60, 90, 45, 80, 30].map((h, idx) => (
                <div
                  key={idx}
                  className="w-1.5 bg-geovision-blue rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${idx * 150}ms`,
                  }}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-2 text-xs font-bold text-slate-500 hover:text-geovision-blue dark:text-slate-400 dark:hover:text-slate-200 underline"
            >
              {t('voice.btnCancel')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 py-2">
            <div className="w-12 h-12 rounded-2xl bg-geovision-blue/15 text-geovision-blue flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Volume2 className="w-6 h-6" />
            </div>

            <div className="space-y-2 w-full">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                {t('voice.capturedLabel')}
              </span>

              {isEditing ? (
                <input
                  type="text"
                  value={capturedText}
                  onChange={(e) => setCapturedText(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-white/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-geovision-blue"
                  autoFocus
                />
              ) : (
                <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/80 dark:border-slate-800 shadow-xs">
                  "{capturedText}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 w-full mt-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {t('voice.btnEdit')}
              </button>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-geovision-blue text-white text-xs font-black hover:bg-blue-600 shadow-lg shadow-blue-500/25 transition-all"
              >
                {t('voice.btnSearch')}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
