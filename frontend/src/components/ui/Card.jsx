export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`rounded-3xl border border-white bg-white shadow-card ${className}`} {...props}>
      {children}
    </Tag>
  );
}
