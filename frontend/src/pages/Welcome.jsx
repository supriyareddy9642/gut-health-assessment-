import { ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from '../components/Logo.jsx';
import LanguageSwitch from '../components/LanguageSwitch.jsx';
import { SITE } from '../config/site.js';
import { useAssessment } from '../hooks/AssessmentContext.jsx';

export default function Welcome() {
  const { t, actions } = useAssessment();
  return (
    <div className="flex min-h-[calc(100dvh-9rem)] items-center">
      <Card className="w-full p-6 text-center sm:p-10">
        <Logo size="lg" className="mx-auto" />
        <p className="mt-5 text-sm font-bold tracking-wide text-navy-900">{SITE.hospitalName}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">{SITE.hospitalSubtitle}</p>
        <div className="mx-auto my-5 h-1 w-12 rounded-full bg-teal-500/50" aria-hidden="true" />

        <h1 className="text-balance text-2xl font-bold leading-snug text-navy-900 sm:text-3xl">{t.welcome.heading}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.welcome.intro}</p>

        <div className="mt-7 text-left">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t.welcome.chooseLanguage}</p>
          <LanguageSwitch variant="cards" />
        </div>

        <Button size="lg" className="mt-7 w-full" onClick={actions.start}>
          {t.welcome.start}
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </Card>
    </div>
  );
}
