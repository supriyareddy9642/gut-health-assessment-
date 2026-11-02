import { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Mail, MapPin, Phone, User } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { Field, InputShell, inputClass } from '../components/ui/Field.jsx';
import StickyActions from '../components/StickyActions.jsx';
import { useAssessment } from '../hooks/AssessmentContext.jsx';
import { calculateAge, todayISO } from '../utils/age.js';
import { MIN_DOB, validatePatient } from '../utils/validators.js';

const ORDER = ['fullName', 'dob', 'location', 'mobile', 'email', 'consent'];

export default function PatientDetails() {
  const { state, t, actions } = useAssessment();
  const p = state.patient;
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);

  const errors = useMemo(() => validatePatient(p), [p]);
  const msg = (f) => ((touched[f] || attempted) && errors[f] ? t.errors[errors[f]] : null);
  const touch = (f) => () => setTouched((s) => ({ ...s, [f]: true }));
  const onChange = (f) => (e) =>
    actions.setPatientField(f, e.target.type === 'checkbox' ? e.target.checked : e.target.value);

  const age = errors.dob ? null : calculateAge(p.dob);

  const proceed = () => {
    setAttempted(true);
    const first = ORDER.find((f) => errors[f]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    actions.detailsDone();
  };

  const describedBy = (f) => (msg(f) ? `${f}-error` : undefined);

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-900">{t.details.title}</h1>
      <p className="mt-1 text-sm text-slate-500">{t.details.subtitle}</p>

      <Card className="mt-5 space-y-5 p-5 sm:p-7" as="form" noValidate onSubmit={(e) => { e.preventDefault(); proceed(); }}>
        <Field id="fullName" label={t.details.fullName} error={msg('fullName')}>
          <InputShell icon={User} invalid={!!msg('fullName')}>
            <input
              id="fullName" type="text" autoComplete="name" maxLength={100}
              className={inputClass} placeholder={t.details.fullNamePlaceholder}
              value={p.fullName} onChange={onChange('fullName')} onBlur={touch('fullName')}
              aria-invalid={!!msg('fullName')} aria-describedby={describedBy('fullName')}
            />
          </InputShell>
        </Field>

        <div>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <Field id="dob" label={t.details.dob} error={null}>
                <InputShell icon={Calendar} invalid={!!msg('dob')}>
                  <input
                    id="dob" type="date" autoComplete="bday" min={MIN_DOB} max={todayISO()}
                    className={inputClass} value={p.dob} onChange={onChange('dob')} onBlur={touch('dob')}
                    aria-invalid={!!msg('dob')} aria-describedby={describedBy('dob')}
                  />
                </InputShell>
              </Field>
            </div>
            <div className="w-24 shrink-0 sm:w-28">
              <span className="mb-1.5 block text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t.details.age}</span>
              <output
                aria-live="polite" htmlFor="dob"
                className="flex h-14 items-center justify-center rounded-xl bg-navy-50 text-center text-base font-bold text-navy-800"
              >
                {age === null ? '—' : `${age} ${t.common.ageUnit}`}
              </output>
            </div>
          </div>
          {msg('dob') && (
            <p id="dob-error" role="alert" className="mt-1.5 text-xs font-medium text-high">{msg('dob')}</p>
          )}
        </div>

        <Field id="location" label={t.details.location} error={msg('location')}>
          <InputShell icon={MapPin} invalid={!!msg('location')}>
            <input
              id="location" type="text" autoComplete="address-level2" maxLength={120}
              className={inputClass} placeholder={t.details.locationPlaceholder}
              value={p.location} onChange={onChange('location')} onBlur={touch('location')}
              aria-invalid={!!msg('location')} aria-describedby={describedBy('location')}
            />
          </InputShell>
        </Field>

        <Field id="mobile" label={t.details.mobile} error={msg('mobile')}>
          <InputShell icon={Phone} prefix="+91" invalid={!!msg('mobile')}>
            <input
              id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16}
              className={inputClass} placeholder={t.details.mobilePlaceholder}
              value={p.mobile} onChange={onChange('mobile')} onBlur={touch('mobile')}
              aria-invalid={!!msg('mobile')} aria-describedby={describedBy('mobile')}
            />
          </InputShell>
        </Field>

        <Field id="email" label={t.details.email} error={msg('email')}>
          <InputShell icon={Mail} invalid={!!msg('email')}>
            <input
              id="email" type="email" inputMode="email" autoComplete="email" maxLength={254}
              className={inputClass} placeholder={t.details.emailPlaceholder}
              value={p.email} onChange={onChange('email')} onBlur={touch('email')}
              aria-invalid={!!msg('email')} aria-describedby={describedBy('email')}
            />
          </InputShell>
        </Field>

        <div className="border-t border-slate-100 pt-5">
          <p className="mb-3 text-xs leading-relaxed text-slate-500">{t.details.purpose}</p>
          <label htmlFor="consent" className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${msg('consent') ? 'border-high bg-high-soft/50' : 'border-slate-200 hover:bg-slate-50'}`}>
            <input
              id="consent" type="checkbox" checked={p.consent} onChange={onChange('consent')} onBlur={touch('consent')}
              className="mt-0.5 h-5 w-5 shrink-0 accent-teal-600"
              aria-invalid={!!msg('consent')} aria-describedby={describedBy('consent')}
            />
            <span className="text-sm leading-relaxed text-slate-700">{t.details.consent}</span>
          </label>
          {msg('consent') && <p id="consent-error" role="alert" className="mt-1.5 text-xs font-medium text-high">{msg('consent')}</p>}
        </div>
      </Card>

      <StickyActions>
        <Button variant="secondary" size="lg" onClick={actions.back} aria-label={t.common.back}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button size="lg" className="flex-1" onClick={proceed}>
          {t.details.continue}
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </StickyActions>
    </>
  );
}
