import Card from './ui/Card.jsx';

export default function InfoCard({ icon: Icon, title, items, bullet: Bullet }) {
  return (
    <Card as="section" className="p-5 sm:p-6">
      <h2 className="flex items-center gap-3 text-base font-bold text-navy-900">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((text) => (
          <li key={text} className="flex gap-3 text-sm leading-relaxed text-slate-600">
            <Bullet className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
