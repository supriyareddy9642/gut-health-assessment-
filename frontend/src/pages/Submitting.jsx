import { Loader2 } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import { useAssessment } from '../hooks/AssessmentContext.jsx';

export default function Submitting() {
  const { t } = useAssessment();
  return (
    <Card className="mt-10 flex flex-col items-center p-10 text-center" role="status" aria-live="polite">
      <Loader2 className="h-12 w-12 animate-spin text-teal-600" aria-hidden="true" />
      <h1 className="mt-5 text-lg font-bold text-navy-900">{t.submit.savingTitle}</h1>
      <p className="mt-2 text-sm text-slate-500">{t.submit.savingNote}</p>
    </Card>
  );
}
