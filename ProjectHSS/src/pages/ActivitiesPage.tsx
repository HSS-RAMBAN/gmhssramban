import { useMemo, useState } from 'react';
import { CalendarDays, Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { getPublishedActivities } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { ActivityCard } from '@/components/ActivityCard';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';
import { Reveal } from '@/components/Reveal';
import type { NavigateFn } from '@/lib/types';

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function ActivitiesPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const q = useAsync(() => getPublishedActivities(), []);
  const [term, setTerm] = useState('');
  const [cat, setCat] = useState('All');
  const cats = useMemo(() => ['All', ...Array.from(new Set((q.data ?? []).map(a => a.category)))], [q.data]);
  const items = useMemo(() =>
    (q.data ?? []).filter(a => (cat === 'All' || a.category === cat) && `${a.title} ${a.description ?? ''}`.toLowerCase().includes(term.toLowerCase())),
    [q.data, cat, term]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[50vh] items-end pb-14 pt-[var(--header-height)]">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">School life</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl text-balance">
                Activities & events
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                A chronological record of school activities, programmes, workshops, competitions, and events published by the school.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured + Filters */}
      <div className="container-page py-12 sm:py-16">
        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-ink-400" />
            <input value={term} onChange={e => setTerm(e.target.value)} className="input pl-10" placeholder="Search activities" aria-label="Search activities" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-ink-400" />
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 transition ${cat === c ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-10">
          {q.loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map(x => <LoadingSkeleton key={x} className="h-64" />)}</div>
          ) : q.error ? (
            <ErrorState message="We couldn't load activities right now." onRetry={q.reload} />
          ) : items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map(a => <ActivityCard key={a.id} activity={a} onOpen={() => onNavigate(`/activities/${a.slug}`)} />)}
            </div>
          ) : (
            <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="Activities and achievements will be published here as updates become available." description="Published school activities will appear here." />
          )}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-ink-50 py-16">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-800 p-8 text-white sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-white">Want to stay updated?</p>
                <p className="mt-1 text-sm text-brand-100">Check the notice board for the latest school announcements.</p>
              </div>
              <button onClick={() => onNavigate('/notices')} className="btn bg-white text-brand-800 hover:bg-brand-50">
                View notices <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
