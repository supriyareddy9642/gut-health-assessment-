/** Local calendar date as YYYY-MM-DD (no timezone shifting). */
export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses a strict YYYY-MM-DD string. Returns {y, m, d} or null if not a real calendar date. */
export function parseISODate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) return null;
  return { y, m, d };
}

/**
 * Completed years. Month/day comparison means a 29 Feb birthday is counted
 * from 1 March in non-leap years. Returns null for invalid or future dates.
 */
export function calculateAge(dobISO, now = new Date()) {
  const dob = parseISODate(dobISO);
  if (!dob) return null;
  if (dobISO > todayISO(now)) return null;
  const nm = now.getMonth() + 1;
  const nd = now.getDate();
  let age = now.getFullYear() - dob.y;
  if (nm < dob.m || (nm === dob.m && nd < dob.d)) age -= 1;
  return age;
}
