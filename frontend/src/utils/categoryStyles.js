import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

// Full class names must appear literally so Tailwind can generate them.
export const CATEGORY_STYLES = {
  lower: {
    Icon: CheckCircle2,
    text: 'text-ok', soft: 'bg-ok-soft', border: 'border-ok-border', stroke: 'stroke-ok', solid: 'bg-ok',
  },
  intermediate: {
    Icon: AlertCircle,
    text: 'text-mid', soft: 'bg-mid-soft', border: 'border-mid-border', stroke: 'stroke-mid-ring', solid: 'bg-mid',
  },
  higher: {
    Icon: AlertTriangle,
    text: 'text-high', soft: 'bg-high-soft', border: 'border-high-border', stroke: 'stroke-high-ring', solid: 'bg-high',
  },
};
