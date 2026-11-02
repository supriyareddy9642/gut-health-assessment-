import { cleanText, normaliseMobile } from './validators.js';

/** Builds the API payload. The score is deliberately NOT sent – the backend calculates it. */
export function buildPayload(state) {
  const p = state.patient;
  const email = String(p.email ?? '').trim();
  return {
    assessmentId: state.assessmentId,
    language: state.language,
    patient: {
      fullName: cleanText(p.fullName),
      dob: p.dob,
      location: cleanText(p.location),
      mobile: `+91${normaliseMobile(p.mobile)}`,
      ...(email ? { email } : {}),
      consent: p.consent === true,
    },
    answers: state.answers,
  };
}
