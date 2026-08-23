import { useMemo, useState } from 'react';
import { Images, SlidersHorizontal, ImageOff, Calendar } from 'lucide-react';
import { getPublishedGallery, resolveImagePath } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';
import { Lightbox } from '@/components/Lightbox';
import { Reveal } from '@/components/Reveal';
import { formatDate } from '@/lib/format';
import { GALLERY_CATEGORIES } from '@/lib/types';
import { useHeroImage } from '@/lib/useHeroImage';

export function GalleryPage() {
  const { heroImage } = useHeroImage();
  const q = useAsync(() => getPublishedGallery(), []);
  const [cat, setCat] = useState('All');
  const [index, setIndex] = useState<number | null>(null);

  const items = useMemo(() => (q.data ?? []).filter(x => cat === 'All' || x.category === cat), [q.data, cat]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[50vh] items-end pb-14 pt-[var(--header-height)]">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">Gallery</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl text-balance">
                Moments from school life
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Photographs published by the school, with captions and accessible descriptions.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <div className="container-page py-12 sm:py-16">
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-ink-400" />
          <button onClick={() => setCat('All')} className={`chip shrink-0 ${cat === 'All' ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-600'}`}>All photos</button>
          {GALLERY_CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`chip shrink-0 ${cat === c ? 'bg-brand-700 text-white' : 'bg-ink-100 text-ink-600'}`}>{c}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8">
          {q.loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map(x => <LoadingSkeleton key={x} className="aspect-square" />)}
            </div>
          ) : q.error ? (
            <ErrorState message="We couldn't load the gallery right now." onRetry={q.reload} />
          ) : items.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item, i) => (
                <button key={item.id} onClick={() => setIndex(i)} className={`group relative overflow-hidden rounded-xl bg-ink-100 ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`} aria-label={`View ${item.title}`}>
                  <img src={resolveImagePath(item.image_path)} alt={item.alt_text || item.title} loading="lazy" className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent p-3 text-left">
                    <p className="truncate text-sm font-medium text-white">{item.title}</p>
                    {item.event_date && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-white/60">
                        <Calendar className="h-3 w-3" />{formatDate(item.event_date)}
                      </p>
                    )}
                    {item.caption && <p className="truncate text-xs text-white/70">{item.caption}</p>}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ImageOff className="h-6 w-6" />}
              title="School photographs will be published here."
              description="Gallery images will be shown once uploaded and published by the school. The gallery is ready for content."
            />
          )}
        </div>

        {/* Future readiness note */}
        {!q.loading && !q.error && items.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-6 text-center">
            <Images className="mx-auto h-8 w-8 text-brand-400" />
            <p className="mt-3 text-sm font-medium text-brand-800">Gallery architecture is ready</p>
            <p className="mt-1 text-xs text-brand-600">The school administrator can upload and publish photos from the content manager. Published photos will appear here automatically.</p>
          </div>
        )}
      </div>

      {index !== null && <Lightbox items={items} index={index} onClose={() => setIndex(null)} onNavigate={setIndex} />}
    </div>
  );
}
