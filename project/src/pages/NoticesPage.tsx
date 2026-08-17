import { useMemo, useState } from 'react';
import { Search, Megaphone, X, Paperclip, ChevronRight, Star } from 'lucide-react';
import { getPublishedNotices, resolveDocumentPath } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { NoticeCard } from '@/components/NoticeCard';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';
import { Reveal } from '@/components/Reveal';
import { NOTICE_CATEGORIES, type Notice, NavigateFn } from '@/lib/types';

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function NoticesPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const q = useAsync(() => getPublishedNotices(), []);
  const [term, setTerm] = useState('');
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState<Notice | null>(null);
  const items = useMemo(() =>
    (q.data ?? []).filter(n => (cat === 'All' || n.category === cat) && `${n.title} ${n.summary ?? ''} ${n.content ?? ''}`.toLowerCase().includes(term.toLowerCase())),
    [q.data, cat, term]);

  const featured = items.find(n => n.featured);

  return (
    <div className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[50vh] items-end pb-14">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">Stay informed</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl text-balance">
                Notices & announcements
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Official notices published by the school administration.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured notice */}
      {featured && !term && cat === 'All' && (
        <section className="py-12">
          <div className="container-page">
            <Reveal>
              <div className="card overflow-hidden ring-brand-200">
                <div className="grid gap-0 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <div className="relative h-full min-h-[200px] overflow-hidden">
                      <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 to-brand-700/40" />
                      <div className="absolute bottom-4 left-5 flex items-center gap-2">
                        <Star className="h-5 w-5 fill-saffron-400 text-saffron-400" />
                        <span className="text-sm font-semibold text-white">Important</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-7 lg:col-span-8">
                    <span className="chip bg-brand-50 text-brand-700">{featured.category}</span>
                    <h2 className="mt-3 text-2xl font-semibold">{featured.title}</h2>
                    <p className="mt-2 text-sm text-ink-400">{new Date(featured.publication_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="mt-4 leading-relaxed text-ink-500">{featured.summary || featured.content || 'No additional details have been provided.'}</p>
                    <button onClick={() => setSelected(featured)} className="btn-primary mt-6">Read full notice <ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Filters + List */}
      <div className="container-page py-12 sm:py-16">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-ink-400" />
            <input value={term} onChange={e => setTerm(e.target.value)} className="input pl-10" placeholder="Search notices" aria-label="Search notices" />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin">
            <button onClick={() => setCat('All')} className={`chip shrink-0 ${cat === 'All' ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-600'}`}>All</button>
            {NOTICE_CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 ${cat === c ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-600'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {q.loading ? (
            <div className="grid gap-5 md:grid-cols-3">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-52" />)}</div>
          ) : q.error ? (
            <ErrorState message="We couldn't load notices right now." onRetry={q.reload} />
          ) : items.length ? (
            <div className="grid gap-5 md:grid-cols-3">
              {items.map(n => <NoticeCard key={n.id} notice={n} onOpen={setSelected} />)}
            </div>
          ) : (
            <EmptyState icon={<Megaphone className="h-6 w-6" />} title="No notices have been published yet." description="Official school announcements will appear here once published by the administrator." />
          )}
        </div>
      </div>

      {selected && <NoticeModal notice={selected} onClose={() => setSelected(null)} onNavigate={onNavigate} />}
    </div>
  );
}

function NoticeModal({ notice, onClose, onNavigate }: { notice: Notice; onClose: () => void; onNavigate: NavigateFn }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-lift sm:p-8 animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip bg-brand-50 text-brand-700">{notice.category}</span>
              {notice.featured && <span className="inline-flex items-center gap-1 text-xs font-medium text-saffron-600"><Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" />Important</span>}
            </div>
            <h2 className="mt-3 text-2xl font-semibold">{notice.title}</h2>
            <p className="mt-1 text-sm text-ink-400">{new Date(notice.publication_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="btn-ghost h-10 w-10 p-0" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {notice.summary && <p className="mt-6 text-sm font-medium text-ink-700">{notice.summary}</p>}
        <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-600">{notice.content || 'No additional details have been provided.'}</p>
        {notice.attachment_path && (
          <a className="btn-secondary mt-6" href={resolveDocumentPath(notice.attachment_path)} target="_blank" rel="noreferrer">
            <Paperclip className="h-4 w-4" /> View attachment
          </a>
        )}
      </div>
    </div>
  );
}
