import { useEffect, useState } from 'react';
import { CATEGORY_STYLES } from '../utils/categoryStyles.js';

const SIZE = 208;
const STROKE = 16;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function ScoreRing({ score, max, category, label, outOf }) {
  const [fill, setFill] = useState(0);
  const style = CATEGORY_STYLES[category];

  useEffect(() => {
    const id = requestAnimationFrame(() => setFill(score / max));
    return () => cancelAnimationFrame(id);
  }, [score, max]);

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }} role="img" aria-label={`${label}: ${score} ${outOf}`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} className="stroke-slate-200" />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" strokeWidth={STROKE} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - fill)}
          className={`${style.stroke} transition-[stroke-dashoffset] duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <span className={`text-6xl font-bold leading-none ${style.text}`}>{score}</span>
        <span className="mt-1 text-sm font-semibold text-slate-500">{outOf}</span>
      </div>
    </div>
  );
}
