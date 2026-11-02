import { HeartPulse } from 'lucide-react';
import { SITE } from '../config/site.js';

/** Shows the configured logo image, or a placeholder icon until the client supplies one. */
export default function Logo({ size = 'md', className = '' }) {
  const box = size === 'lg' ? 'h-20 w-20 rounded-3xl' : 'h-11 w-11 rounded-xl';
  const icon = size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return (
    <div className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-navy-800 to-teal-600 text-white shadow-card ${box} ${className}`}>
      {SITE.logoUrl ? (
        <img src={SITE.logoUrl} alt="" className="h-full w-full rounded-[inherit] object-contain bg-white p-1" />
      ) : (
        <HeartPulse className={icon} aria-hidden="true" />
      )}
    </div>
  );
}
