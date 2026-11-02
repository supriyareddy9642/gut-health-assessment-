/**
 * SINGLE SOURCE OF TRUTH for the approved scoring rules.
 * Source: "Gut Health Screening – Self-Assessment Questionnaire" (Sri Ramakrishna Speciality Hospital).
 * DO NOT change ids, points or thresholds without written approval from the hospital's medical team.
 * The backend re-calculates every score from these rules; the frontend only uses them for display logic.
 */

export const ANSWER = Object.freeze({ YES: 'yes', NO: 'no' });

export const SECTIONS = Object.freeze(['acidity', 'foodWater', 'habits', 'familyMedical']);

// Order here = order shown to the patient (one prompt per screen).
export const QUESTIONS = Object.freeze([
  { id: 'q1a', section: 'acidity', points: 2 },
  { id: 'q1b', section: 'acidity', points: 1 },
  { id: 'q2a', section: 'foodWater', points: 1 },
  { id: 'q2b', section: 'foodWater', points: 1 },
  { id: 'q2c', section: 'foodWater', points: 1 },
  { id: 'q3a', section: 'habits', points: 1 },
  { id: 'q3b', section: 'habits', points: 1 },
  { id: 'q4a', section: 'familyMedical', points: 1 },
  { id: 'q4b', section: 'familyMedical', points: 1 },
]);

export const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + q.points, 0); // 10

export const CATEGORIES = Object.freeze([
  { id: 'lower', min: 0, max: 3 },
  { id: 'intermediate', min: 4, max: 6 },
  { id: 'higher', min: 7, max: 10 },
]);

export function getCategory(total) {
  const c = CATEGORIES.find((x) => total >= x.min && total <= x.max);
  if (!Number.isInteger(total) || !c) throw new RangeError(`Invalid total score: ${total}`);
  return c.id;
}

/** answers: { [questionId]: 'yes' | 'no' } – every question must be answered. */
export function calculateScore(answers) {
  const perQuestion = {};
  let total = 0;
  for (const q of QUESTIONS) {
    const a = answers ? answers[q.id] : undefined;
    if (a !== ANSWER.YES && a !== ANSWER.NO) {
      throw new TypeError(`Missing or invalid answer for ${q.id}`);
    }
    const pts = a === ANSWER.YES ? q.points : 0;
    perQuestion[q.id] = pts;
    total += pts;
  }
  return { perQuestion, total, maxScore: MAX_SCORE, category: getCategory(total) };
}
