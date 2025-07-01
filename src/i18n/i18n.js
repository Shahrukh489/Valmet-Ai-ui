import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import global_en from './en/global_en.json';
import global_de from './de/global_de.json';
import global_ar from './ar/global_ar.json';
import global_ms from './ms/global_ms.json';

const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

const resources = {
  en: {
    global: global_en,
  },
  de: {
    global: global_de,
  },
  ar: {
    global: global_ar,
  },
  ms: {
    global: global_ms,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    defaultNS: 'global',
    ns: ['global'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;