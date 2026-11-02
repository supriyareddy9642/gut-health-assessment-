import { describe, it, expect } from 'vitest';
import { QUESTIONS, MAX_SCORE, calculateScore, getCategory } from './assessment.config.js';

const build = (yesIds) =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, yesIds.includes(q.id) ? 'yes' : 'no']));

describe('scoring', () => {
  it('has 9 prompts and max 10', () => {
    expect(QUESTIONS).toHaveLength(9);
    expect(MAX_SCORE).toBe(10);
  });
  it('all no = 0 lower', () => {
    const r = calculateScore(build([]));
    expect(r.total).toBe(0);
    expect(r.category).toBe('lower');
  });
  it('all yes = 10 higher', () => {
    const r = calculateScore(build(QUESTIONS.map((q) => q.id)));
    expect(r.total).toBe(10);
    expect(r.category).toBe('higher');
  });
  it('boundary 3 -> lower', () => {
    expect(calculateScore(build(['q1a', 'q1b']))).toMatchObject({ total: 3, category: 'lower' });
  });
  it('boundary 4 -> intermediate', () => {
    expect(calculateScore(build(['q1a', 'q1b', 'q2a']))).toMatchObject({ total: 4, category: 'intermediate' });
  });
  it('boundary 6 -> intermediate', () => {
    expect(calculateScore(build(['q1a', 'q2a', 'q2b', 'q2c', 'q3a']))).toMatchObject({ total: 6, category: 'intermediate' });
  });
  it('boundary 7 -> higher', () => {
    expect(calculateScore(build(['q1a', 'q2a', 'q2b', 'q2c', 'q3a', 'q3b']))).toMatchObject({ total: 7, category: 'higher' });
  });
  it('q1a is worth 2 points', () => {
    expect(calculateScore(build(['q1a'])).perQuestion.q1a).toBe(2);
  });
  it('rejects missing/invalid answers', () => {
    expect(() => calculateScore({})).toThrow();
    expect(() => calculateScore({ ...build([]), q1a: 'maybe' })).toThrow();
  });
  it('rejects out-of-range totals', () => {
    expect(() => getCategory(11)).toThrow();
    expect(() => getCategory(-1)).toThrow();
  });
});
