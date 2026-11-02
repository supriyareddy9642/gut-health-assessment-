import { ShieldCheck } from 'lucide-react';
import Logo from './Logo.jsx';
import LanguageSwitch from './LanguageSwitch.jsx';
import { SITE } from '../config/site.js';
import { useAssessment } from '../hooks/AssessmentContext.jsx';

export default function AppShell({ showHeader = true, children }) {
  const { t } = useAssessment();
  return (
    <div className="min-h-dvh bg-gradient-to-b from-navy-50 via-surface to-teal-50/60">
      {showHeader && (
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
            <Logo />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold leading-tight tracking-wide text-navy-900 sm:text-xs">{SITE.hospitalName}</p>
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-700">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                {SITE.hospitalSubtitle}
              </p>
            </div>
            <LanguageSwitch />
          </div>
        </header>
      )}
      <main className="mx-auto w-full max-w-xl px-4 pb-32 pt-6 sm:pt-10">{children}</main>
      <p className="pb-8 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 -translate-y-px" aria-hidden="true" />
        {t.common.secureLine}
      </p>
    </div>
  );
}
