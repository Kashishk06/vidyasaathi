import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VoiceButton = ({ text, className = "" }) => {
  const { language, t } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map language
    const langMap = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
    };
    utterance.lang = langMap[language] || 'hi-IN';
    utterance.rate = 0.9; // Slightly slower for clarity in learning

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${
        isSpeaking
          ? 'bg-orange-600 text-white animate-pulse'
          : 'bg-orange-100 hover:bg-orange-200 text-orange-800'
      } ${className}`}
      title={isSpeaking ? t('speechStop') : t('speechListen')}
      type="button"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4 shrink-0" />
          <span>{t('speechStop')}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 shrink-0" />
          <span>{t('speechListen')}</span>
        </>
      )}
    </button>
  );
};
