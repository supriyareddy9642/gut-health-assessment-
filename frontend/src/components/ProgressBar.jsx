export default function ProgressBar({ value, max, label }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-500 transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}
