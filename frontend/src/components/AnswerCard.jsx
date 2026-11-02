import { Check, X } from 'lucide-react';

export default function AnswerCard({ label, kind, selected, onSelect }) {
  const Icon = kind === 'yes' ? Check : X;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-h-[76px] w-full items-center gap-4 rounded-2xl border-2 px-5 text-left text-lg font-semibold transition duration-150 active:scale-[0.99] ${
        selected
          ? 'border-teal-600 bg-teal-50 text-navy-900 shadow-sm ring-4 ring-teal-600/10'
          : 'border-slate-200 bg-white text-slate-700 hover:border-teal-500/60 hover:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition ${
          selected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-slate-400'
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
      </span>
      {label}
    </button>
  );
}
