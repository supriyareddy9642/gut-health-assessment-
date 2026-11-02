import en from './en.js';
import te from './te.js';
import ta from './ta.js';

export const LANGUAGES = [
  { code: 'en', label: 'English', locale: 'en-IN' },
  { code: 'te', label: 'తెలుగు', locale: 'te-IN' },
  { code: 'ta', label: 'தமிழ்', locale: 'ta-IN' },
];

export const translations = { en, te, ta };
export const DEFAULT_LANGUAGE = 'en';

/** Replaces {name} placeholders. */
export function format(str, vars = {}) {
  return String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}
