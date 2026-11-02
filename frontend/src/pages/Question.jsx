import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QUESTIONS } from '@gha/shared';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import AnswerCard from '../components/AnswerCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import StickyActions from '../components/StickyActions.jsx';
import { useAssessment } from '../hooks/AssessmentContext.jsx';
import { format } from '../translations/index.js';

export default function Question() {
  const { state, t, actions } = useAssessment();
  const { questionIndex: index, answers } = state;
  const q = QUESTIONS[index];
  const total = QUESTIONS.length;
  const answer = answers[q.id];
  const isLast = index === total - 1;
  const headingRef = useRef(null);

  // Move focus to the new question for screen-reader and keyboard users.
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [index]);

  const progressLabel = format(t.questions.progress, { n: index + 1, total });

  return (
    <>
      <div className="mb-5">
        <div className="mb-2.5 flex items-center justify-between text-xs font-semibold">
          <span className="text-navy-800">{progressLabel}</span>
          <span className="text-slate-400">{index + (answer ? 1 : 0)}/{total}</span>
        </div>
        <ProgressBar value={index + (answer ? 1 : 0)} max={total} label={progressLabel} />
      </div>

      <Card className="p-5 sm:p-8">
        <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-700">
          {t.questions.sections[q.section]}
        </span>
        <h1 ref={headingRef} tabIndex={-1} className="mt-4 text-balance text-xl font-semibold leading-snug text-navy-900 outline-none sm:text-2xl">
          {t.questions.items[q.id]}
        </h1>

        <div role="radiogroup" aria-label={t.questions.items[q.id]} className="mt-6 grid gap-3">
          <AnswerCard kind="yes" label={t.common.yes} selected={answer === 'yes'} onSelect={() => actions.answer(q.id, 'yes')} />
          <AnswerCard kind="no" label={t.common.no} selected={answer === 'no'} onSelect={() => actions.answer(q.id, 'no')} />
        </div>
        <p className={`mt-4 text-center text-xs font-medium text-slate-400 transition-opacity ${answer ? 'opacity-0' : 'opacity-100'}`} aria-hidden={!!answer}>
          {t.questions.selectAnswer}
        </p>
      </Card>

      <StickyActions>
        <Button variant="secondary" size="lg" className="flex-1" onClick={actions.back}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          {t.common.back}
        </Button>
        <Button size="lg" className="flex-[1.4]" disabled={!answer} onClick={isLast ? actions.submit : actions.next}>
          {isLast ? t.questions.viewResult : t.common.next}
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </StickyActions>
    </>
  );
}
