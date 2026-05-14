import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRU from './locales/ru/translation.json';
import translationKK from './locales/kk/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  ru: { translation: translationRU },
  kk: { translation: translationKK },
  en: { translation: translationEN }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
