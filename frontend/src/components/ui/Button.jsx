const VARIANTS = {
  primary:
    'bg-navy-800 text-white shadow-btn hover:bg-navy-700 active:translate-y-[2px] active:shadow-btn-pressed disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 disabled:text-slate-500',
  secondary:
    'bg-white text-navy-800 border border-navy-100 hover:bg-navy-50 active:bg-navy-100 disabled:opacity-50',
  ghost: 'bg-transparent text-navy-700 hover:bg-navy-50',
};
const SIZES = { md: 'h-12 px-5 text-sm', lg: 'h-14 px-6 text-base' };

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
