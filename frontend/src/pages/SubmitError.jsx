import { AlertTriangle, RotateCcw } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { useAssessment } from '../hooks/AssessmentContext.jsx';

export default function SubmitError() {
  const { state, t, actions } = useAssessment();
  const body = state.errorKind === 'rate' ? t.submit.errorRate : t.submit.errorBody;
  return (
    <Card className="mt-10 p-8 text-center" role="alert">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-high-soft text-high">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-lg font-bold text-navy-900">{t.submit.errorTitle}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
      <div className="mt-6 grid gap-3">
        {/* Retry re-sends the SAME assessment id, so a retry can never create a duplicate row. */}
        <Button size="lg" onClick={actions.submit}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          {t.common.retry}
        </Button>
        <Button variant="secondary" size="lg" onClick={actions.review}>{t.submit.review}</Button>
      </div>
    </Card>
  );
}
