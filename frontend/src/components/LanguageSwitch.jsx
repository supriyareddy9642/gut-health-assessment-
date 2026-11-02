import { LANGUAGES } from '../translations/index.js';
import { useAssessment } from '../hooks/AssessmentContext.jsx';

export default function LanguageSwitch({ variant = 'compact' }) {
  const { state, t, actions } = useAssessment();
  const cards = variant === 'cards';

  return (
    <div
      role="radiogroup"
      aria-label={t.common.language}
      className={cards ? 'grid grid-cols-3 gap-2.5' : 'flex gap-1 rounded-full bg-slate-100 p-1'}
    >
      {LANGUAGES.map((l) => {
        const active = state.language === l.code;
        const base = cards
          ? `rounded-2xl border-2 px-2 py-3.5 text-sm font-semibold transition ${
              active ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-500/50 hover:bg-slate-50'
            }`
          : `rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active ? 'bg-white text-navy-800 shadow-sm' : 'text-slate-500 hover:text-navy-800'
            }`;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            lang={l.code}
            onClick={() => actions.setLanguage(l.code)}
            className={base}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
