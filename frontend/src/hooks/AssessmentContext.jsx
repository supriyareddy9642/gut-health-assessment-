import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { ANSWER, QUESTIONS } from '@gha/shared';
import { DEFAULT_LANGUAGE, translations } from '../translations/index.js';
import { submitAssessment } from '../api/assessmentApi.js';
import { buildPayload } from '../utils/payload.js';
import { newId } from '../utils/id.js';

const STORAGE_KEY = 'gha:draft:v1';
const LAST = QUESTIONS.length - 1;
const blankPatient = { fullName: '', dob: '', location: '', mobile: '', email: '', consent: false };

const initialState = {
  screen: 'welcome', // welcome | details | questions | submitting | error | result
  language: DEFAULT_LANGUAGE,
  patient: blankPatient,
  answers: {},
  questionIndex: 0,
  assessmentId: null,
  result: null,
  errorKind: null,
};

/** Restores an in-progress draft (same browser tab only). Cleared when the result is shown. */
function loadDraft() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const d = JSON.parse(raw);

    const language = translations[d.language] ? d.language : DEFAULT_LANGUAGE;
    const answers = {};
    for (const q of QUESTIONS) {
      if (d.answers?.[q.id] === ANSWER.YES || d.answers?.[q.id] === ANSWER.NO) answers[q.id] = d.answers[q.id];
    }
    const patient = { ...blankPatient };
    for (const k of ['fullName', 'dob', 'location', 'mobile', 'email']) {
      if (typeof d.patient?.[k] === 'string') patient[k] = d.patient[k].slice(0, 254);
    }
    patient.consent = d.patient?.consent === true;

    let screen = d.screen;
    let questionIndex = Number.isInteger(d.questionIndex) ? Math.min(Math.max(d.questionIndex, 0), LAST) : 0;
    if (screen === 'submitting' || screen === 'error') { screen = 'questions'; questionIndex = LAST; }
    if (!['welcome', 'details', 'questions'].includes(screen)) screen = 'welcome';
    const assessmentId = typeof d.assessmentId === 'string' ? d.assessmentId : null;
    if (screen !== 'welcome' && !assessmentId) screen = 'welcome';

    return { ...initialState, language, patient, answers, screen, questionIndex, assessmentId };
  } catch {
    return initialState;
  }
}

function reducer(s, a) {
  switch (a.type) {
    case 'SET_LANGUAGE':
      return translations[a.language] ? { ...s, language: a.language } : s;
    case 'START':
      return { ...s, screen: 'details', assessmentId: s.assessmentId ?? a.assessmentId };
    case 'SET_PATIENT_FIELD':
      return { ...s, patient: { ...s.patient, [a.field]: a.value } };
    case 'DETAILS_DONE':
      return { ...s, screen: 'questions' };
    case 'ANSWER':
      return { ...s, answers: { ...s.answers, [a.id]: a.value } };
    case 'NEXT': {
      const q = QUESTIONS[s.questionIndex];
      if (!s.answers[q.id] || s.questionIndex >= LAST) return s;
      return { ...s, questionIndex: s.questionIndex + 1 };
    }
    case 'BACK':
      if (s.screen === 'questions') {
        return s.questionIndex === 0 ? { ...s, screen: 'details' } : { ...s, questionIndex: s.questionIndex - 1 };
      }
      if (s.screen === 'details') return { ...s, screen: 'welcome' };
      return s;
    case 'REVIEW':
      return { ...s, screen: 'questions', questionIndex: LAST, errorKind: null };
    case 'SUBMIT_START':
      return { ...s, screen: 'submitting', errorKind: null };
    case 'SUBMIT_OK':
      return { ...s, screen: 'result', result: a.result };
    case 'SUBMIT_FAIL':
      return { ...s, screen: 'error', errorKind: a.kind };
    case 'RESET':
      return { ...initialState, language: s.language };
    default:
      return s;
  }
}

const Ctx = createContext(null);

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadDraft);
  const ref = useRef(state);
  ref.current = state;

  // Keep the draft only while the patient is still filling in the form. Never keep it once a result exists.
  useEffect(() => {
    try {
      if (state.screen === 'result' || (state.screen === 'welcome' && !state.assessmentId)) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      const { result, errorKind, ...draft } = state;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch { /* storage unavailable – app still works */ }
  }, [state]);

  const actions = useMemo(
    () => ({
      setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', language }),
      start: () => dispatch({ type: 'START', assessmentId: newId() }),
      setPatientField: (field, value) => dispatch({ type: 'SET_PATIENT_FIELD', field, value }),
      detailsDone: () => dispatch({ type: 'DETAILS_DONE' }),
      answer: (id, value) => dispatch({ type: 'ANSWER', id, value }),
      next: () => dispatch({ type: 'NEXT' }),
      back: () => dispatch({ type: 'BACK' }),
      review: () => dispatch({ type: 'REVIEW' }),
      reset: () => dispatch({ type: 'RESET' }),
      async submit() {
        dispatch({ type: 'SUBMIT_START' });
        try {
          const result = await submitAssessment(buildPayload(ref.current));
          dispatch({ type: 'SUBMIT_OK', result });
        } catch (err) {
          dispatch({ type: 'SUBMIT_FAIL', kind: err?.kind || 'network' });
        }
      },
    }),
    [],
  );

  const t = translations[state.language];
  const value = useMemo(() => ({ state, t, actions }), [state, t, actions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAssessment() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAssessment must be used inside <AssessmentProvider>');
  return v;
}
