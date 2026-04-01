import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import vi from './translations/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
} as const;

const STORAGE_KEY = 'store_language';

const fallbackLng = 'en';
const initialLanguage =
  typeof window !== 'undefined'
    ? window.localStorage.getItem(STORAGE_KEY) || fallbackLng
    : fallbackLng;

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng,
  interpolation: {
    escapeValue: false,
  },
});

if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    window.localStorage.setItem(STORAGE_KEY, lng);
  });
}

export { i18n };
