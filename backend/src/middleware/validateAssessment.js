
import { z } from 'zod';

const answer = z.enum(['yes', 'no']);

const schema = z.object({
  assessmentId: z.string().uuid(),
  language: z.enum(['en', 'te', 'ta']),

  patient: z.object({
    fullName: z.string().trim().min(2).max(80),

    // Expected format: YYYY-MM-DD
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    location: z.string().trim().min(2).max(100),

    // Accept 10-digit Indian mobile or +91 followed by 10 digits
    mobile: z.string().regex(/^(?:\+91)?[6-9]\d{9}$/),

    email: z.string().trim().max(254).email().optional().or(z.literal('')),

    consent: z.literal(true)
  }).strict(),

  answers: z.object({
    q1a: answer,
    q1b: answer,
    q2a: answer,
    q2b: answer,
    q2c: answer,
    q3a: answer,
    q3b: answer,
    q4a: answer,
    q4b: answer
  }).strict()
}).strict();

function validDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

function indiaToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(x => [x.type, x.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function ageInIndia(s) {
  const [y, m, d] = s.split('-').map(Number);
  const [ny, nm, nd] = indiaToday().split('-').map(Number);

  return ny - y - (
    nm < m || (nm === m && nd < d) ? 1 : 0
  );
}

export function validateAssessment(req, res, next) {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'VALIDATION_FAILED',
      fields: parsed.error.issues.map(i => ({
        field: i.path.join('.'),
        code: i.code
      }))
    });
  }

  const dob = parsed.data.patient.dob;
  const age = ageInIndia(dob);

  if (
    !validDate(dob) ||
    dob > indiaToday() ||
    age < 0 ||
    age > 120
  ) {
    return res.status(400).json({
      error: 'INVALID_DATE_OF_BIRTH'
    });
  }

  req.validatedAssessment = parsed.data;
  req.patientAge = age;

  next();
}
