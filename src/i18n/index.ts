import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import de from './locales/de.json';
import ar from './locales/ar.json';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  it: { translation: it },
  nl: { translation: nl },
  de: { translation: de },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Handle RTL languages
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

// Set initial direction
if (typeof document !== 'undefined') {
  const currentLang = i18n.language || 'fr';
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;
}

export default i18n;

// `complete: true` = traduction complète. On n'expose au public que les langues
// complètes (règle « aucune traduction partielle »). Les autres restent chargées
// pour un fallback propre et pourront être exposées une fois finalisées.
export const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false, complete: true },
  { code: 'en', name: 'English', flag: '🇬🇧', rtl: false, complete: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', rtl: false, complete: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', rtl: false, complete: false },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', rtl: false, complete: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', rtl: false, complete: false },
  { code: 'ar', name: 'العربية', flag: '🇲🇦', rtl: true, complete: false },
] as const;

export type LanguageCode = typeof languages[number]['code'];

/** Langues entièrement traduites, seules exposées à l'utilisateur. */
export const completeLanguages = languages.filter((l) => l.complete);

export const isRTL = (code: string) => code === 'ar';
