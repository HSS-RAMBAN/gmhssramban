import { Megaphone, Paperclip, ChevronRight, Star } from 'lucide-react';
import type { Notice } from '@/lib/types';
import { formatDate, truncate } from '@/lib/format';

const CATEGORY_COLORS: Record<string, string> = {
  Admission: 'bg-saffron-50 text-saffron-700',
  Examination: 'bg-brand-50 text-brand-700',
  Holiday: 'bg-moss-50 text-moss-700',
  Event: 'bg-ink-100 text-ink-700',
  Academic: 'bg-brand-50 text-brand-700',
  Circular: 'bg-saffron-50 text-saffron-700',
  General: 'bg-ink-100 text-ink-600',
  Other: 'bg-ink-100 text-ink-600',
};

export function NoticeCard({ notice, onOpen }: { notice: Notice; onOpen: (n: Notice) => void }) {
  return (
    <article className="card card-hover flex flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <span className={`chip ${CATEGORY_COLORS[notice.category] ?? CATEGORY_COLORS.General}`}>
          {notice.category}
        </span>
        {notice.featured && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-saffron-600">
            <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" />
            Important
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-ink-900">
        {notice.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {truncate(notice.summary || notice.content, 140)}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="flex items-center gap-1.5">
            <Megaphone className="h-3.5 w-3.5" />
            {formatDate(notice.publication_date)}
          </span>
          {notice.attachment_path && (
            <span className="flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5" />
              Attachment
            </span>
          )}
        </div>
        <button
          onClick={() => onOpen(notice)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          View
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
