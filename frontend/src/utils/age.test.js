import { describe, it, expect } from 'vitest';
import { calculateAge, parseISODate, todayISO } from './age.js';

const d = (y, m, day) => new Date(y, m - 1, day, 12, 0, 0);

describe('calculateAge', () => {
  it('counts completed years', () => {
    expect(calculateAge('1990-06-15', d(2026, 6, 14))).toBe(35);
    expect(calculateAge('1990-06-15', d(2026, 6, 15))).toBe(36);
  });
  it('handles 29 Feb births (birthday counted from 1 Mar in non-leap years)', () => {
    expect(calculateAge('2000-02-29', d(2026, 2, 28))).toBe(25);
    expect(calculateAge('2000-02-29', d(2026, 3, 1))).toBe(26);
    expect(calculateAge('2000-02-29', d(2028, 2, 29))).toBe(28);
  });
  it('rejects future and invalid dates', () => {
    expect(calculateAge('2030-01-01', d(2026, 11, 2))).toBeNull();
    expect(calculateAge('2023-02-29', d(2026, 11, 2))).toBeNull(); // 2023 not a leap year
    expect(calculateAge('abc', d(2026, 11, 2))).toBeNull();
  });
  it('accepts today as DOB (age 0)', () => {
    expect(calculateAge(todayISO(d(2026, 11, 2)), d(2026, 11, 2))).toBe(0);
  });
  it('parseISODate validates calendar dates', () => {
    expect(parseISODate('2024-02-29')).toEqual({ y: 2024, m: 2, d: 29 });
    expect(parseISODate('2024-13-01')).toBeNull();
  });
});
