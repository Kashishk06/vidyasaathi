import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('vidyasaathi_lang') || 'hi';
  });

  const [lowBandwidth, setLowBandwidthState] = useState(() => {
    return localStorage.getItem('vidyasaathi_low_bw') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('vidyasaathi_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('vidyasaathi_low_bw', lowBandwidth.toString());
    if (lowBandwidth) {
      document.body.classList.add('low-bandwidth');
    } else {
      document.body.classList.remove('low-bandwidth');
    }
  }, [lowBandwidth]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  const toggleLowBandwidth = () => {
    setLowBandwidthState((prev) => !prev);
  };

  // Translation lookup with strict language separation
  const t = (key, fallback) => {
    // 1. Direct match for current language
    if (translations[language] && translations[language][key] !== undefined) {
      return translations[language][key];
    }
    // 2. If language is English, only fallback to English dictionary, fallback param, or key
    if (language === 'en') {
      return translations['en']?.[key] || fallback || key;
    }
    // 3. If language is Hindi, only fallback to Hindi dictionary, fallback param, or key
    if (language === 'hi') {
      return translations['hi']?.[key] || fallback || key;
    }
    // 4. For other languages (mr, bn, ta), check target, then Hindi, then English, then fallback
    return (
      translations[language]?.[key] ||
      translations['hi']?.[key] ||
      translations['en']?.[key] ||
      fallback ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        lowBandwidth,
        toggleLowBandwidth,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
