import { calculateAge, parseISODate, todayISO } from './age.js';

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u;
const LOCATION_RE = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} ,.'’()/&-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

export const MIN_DOB = '1900-01-01';
export const MAX_AGE = 120;

export const cleanText = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

/** Returns the 10-digit national number (no +91 / 0 prefix), or '' if input has illegal characters. */
export function normaliseMobile(raw) {
  const s = String(raw ?? '').trim();
  if (!/^[+\d\s\-()]*$/.test(s)) return '';
  let digits = s.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

/** Returns { field: errorKey } – empty object means valid. errorKey maps to translations.errors[key]. */
export function validatePatient(p, now = new Date()) {
  const e = {};

  const name = cleanText(p.fullName);
  if (!name) e.fullName = 'nameRequired';
  else if (name.length > 80) e.fullName = 'nameTooLong';
  else if (name.length < 2 || !NAME_RE.test(name)) e.fullName = 'nameInvalid';

  if (!p.dob) e.dob = 'dobRequired';
  else if (!parseISODate(p.dob)) e.dob = 'dobInvalid';
  else if (p.dob > todayISO(now)) e.dob = 'dobFuture';
  else if (p.dob < MIN_DOB || calculateAge(p.dob, now) > MAX_AGE) e.dob = 'dobTooOld';

  const loc = cleanText(p.location);
  if (!loc) e.location = 'locationRequired';
  else if (loc.length > 100) e.location = 'locationTooLong';
  else if (loc.length < 2 || !LOCATION_RE.test(loc)) e.location = 'locationInvalid';

  if (!String(p.mobile ?? '').trim()) e.mobile = 'mobileRequired';
  else if (!MOBILE_RE.test(normaliseMobile(p.mobile))) e.mobile = 'mobileInvalid';

  const email = String(p.email ?? '').trim();
  if (email && (email.length > 254 || !EMAIL_RE.test(email))) e.email = 'emailInvalid';

  if (!p.consent) e.consent = 'consentRequired';

  return e;
}
