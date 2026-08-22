import { CalendarDays } from 'lucide-react';
import type { Activity } from '@/lib/types';
import { formatDate, truncate } from '@/lib/format';
import { resolveImagePath } from '@/lib/queries';

export function ActivityCard({ activity, onOpen }: { activity: Activity; onOpen: (a: Activity) => void }) {
  const img = resolveImagePath(activity.cover_image_path);
  return (
    <article className="card card-hover overflow-hidden">
      <button onClick={() => onOpen(activity)} className="block w-full text-left">
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
          {img ? (
            <img
              src={img}
              alt={activity.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-ink-100">
              <span className="text-ink-300 text-sm">No image</span>
            </div>
          )}
          <span className="absolute left-3 top-3 chip bg-white/90 text-ink-700 backdrop-blur-sm">
            {activity.category}
          </span>
        </div>
        <div className="p-5">
          <p className="flex items-center gap-1.5 text-xs text-ink-400">
            <CalendarDays className="h-3.5 w-3.5" />
            {activity.event_date ? formatDate(activity.event_date) : 'Date to be announced'}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-snug text-ink-900">
            {activity.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {truncate(activity.description, 120)}
          </p>
        </div>
      </button>
    </article>
  );
}
