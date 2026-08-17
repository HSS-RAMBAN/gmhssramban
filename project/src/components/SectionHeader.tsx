import type { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-4 ${align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'}`}>
      <div className={`max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {eyebrow && <p className="section-eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl font-semibold text-balance">{title}</h2>
        {description && <p className="mt-3 text-ink-500 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
