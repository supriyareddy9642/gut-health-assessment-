import { AlertCircle } from 'lucide-react';

export const inputClass =
  'h-14 w-full min-w-0 bg-transparent text-base font-medium text-navy-900 outline-none placeholder:font-normal placeholder:text-slate-400';

export function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-high">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function InputShell({ icon: Icon, prefix, invalid, children }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 transition focus-within:border-teal-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-600/15 ${
        invalid ? 'border-high bg-high-soft/50' : 'border-transparent bg-slate-50'
      }`}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />}
      {prefix && <span className="shrink-0 text-sm font-semibold text-slate-500">{prefix}</span>}
      {children}
    </div>
  );
}
