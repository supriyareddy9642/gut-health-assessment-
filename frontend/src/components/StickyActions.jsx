/** Bottom action bar that stays reachable with the thumb on phones. */
export default function StickyActions({ children }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-xl gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">{children}</div>
    </div>
  );
}
