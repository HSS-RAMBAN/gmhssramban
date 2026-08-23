import { ArrowRight, MapPin, Megaphone, CalendarDays, ChevronRight, Images, ExternalLink, GraduationCap } from 'lucide-react';
import type { NavigateFn } from '@/lib/types';
import { getSchoolSettings, getPublishedNotices, getPublishedActivities, getPublishedGallery, resolveImagePath } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { NoticeCard } from '@/components/NoticeCard';
import { ActivityCard } from '@/components/ActivityCard';
import { HomeCarousel } from '@/components/HomeCarousel';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';
import { useHeroImage } from '@/lib/useHeroImage';

export function HomePage({ onNavigate }: { onNavigate: NavigateFn }) {
  const settings = useAsync(getSchoolSettings, []);
  const notices = useAsync(() => getPublishedNotices(3), []);
  const activities = useAsync(() => getPublishedActivities(4), []);
  const gallery = useAsync(() => getPublishedGallery(6), []);
  const { heroImage, heroEnabled } = useHeroImage();

  const s = settings.data;

  return (
    <div>
      {/* 01 — Hero */}
      <section className="relative min-h-[92vh] overflow-hidden">
        {heroEnabled ? (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 hero-overlay" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-brand-950" />
        )}
        <div className="relative flex min-h-[92vh] items-center">
          <div className="container-page w-full pt-24 pb-20">
            <Reveal>
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-brand-200">
                <span className="h-px w-8 bg-brand-300/70" />
                Ramban • Jammu &amp; Kashmir
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl text-balance">
                {s?.hero_title || 'Government Model Higher Secondary School, Ramban'}
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium text-white/85">
                {s?.hero_subtitle || 'Education • Character • Opportunity'}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('/about')} className="btn gradient-accent text-white shadow-card hover:shadow-glow active:scale-[0.98]">
                  Explore the School
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => onNavigate('/notices')} className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 backdrop-blur-sm hover:bg-white/20">
                  <Megaphone className="h-4 w-4" />
                  View Notifications
                </button>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
            <div className="h-2 w-1 animate-float-slow rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* 02 — School Overview */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="About the School" title="A place to learn, grow, and prepare for the future" description={s?.about_summary || 'Govt. Model Higher Secondary School, Ramban serves students from Classes 9 to 12 in the heart of Ramban district, Jammu & Kashmir.'} align="center" />
          <Reveal>
            <div className="mt-8 text-center">
              <button onClick={() => onNavigate('/about')} className="btn-secondary">
                Learn more about the school
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — Latest Notifications preview */}
      <section className="border-y border-ink-100 bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Stay informed"
            title="Latest School Notifications"
            description="Official announcements from the school administration."
            action={<button onClick={() => onNavigate('/notices')} className="btn-ghost">View all <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-12">
            {notices.loading ? (
              <div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map(i => <LoadingSkeleton key={i} className="h-52" />)}</div>
            ) : notices.error ? (
              <ErrorState message="We couldn't load notices right now." onRetry={notices.reload} />
            ) : notices.data && notices.data.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-3">
                {notices.data.map(n => <NoticeCard key={n.id} notice={n} onOpen={() => onNavigate('/notices')} />)}
              </div>
            ) : (
              <EmptyState icon={<Megaphone className="h-6 w-6" />} title="No current notifications" description="Official school announcements will appear here when published." />
            )}
          </div>
        </div>
      </section>

      {/* 04 — VIEW ACADEMICS banner */}
      <section className="py-14 sm:py-16">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl gradient-dark px-8 py-10 sm:px-12 sm:py-12">
              <div className="absolute inset-0 topo-texture opacity-20" />
              <div className="relative flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-200 ring-1 ring-inset ring-white/15">
                    <GraduationCap className="h-6 w-6" />
                  </span>
                  <h2 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">Academics at GMHSS Ramban</h2>
                  <p className="mt-3 max-w-xl text-brand-200">Secondary and higher secondary education with Science and Arts streams for Classes 11–12.</p>
                </div>
                <button onClick={() => onNavigate('/academics')} className="btn mt-6 gradient-accent text-white shadow-card hover:shadow-glow active:scale-[0.98] sm:mt-0">
                  View Academics
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 05 — Activities preview */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="School life"
            title="Recent activities"
            action={<button onClick={() => onNavigate('/activities')} className="btn-ghost">View all activities <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-10">
            {activities.loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map(i => <LoadingSkeleton key={i} className="h-64" />)}</div>
            ) : activities.error ? (
              <ErrorState message="We couldn't load activities right now." onRetry={activities.reload} />
            ) : activities.data && activities.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {activities.data.map(a => <ActivityCard key={a.id} activity={a} onOpen={() => onNavigate('/activities')} />)}
              </div>
            ) : (
              <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="School activities will appear here." description="Published activities will be shown once available." />
            )}
          </div>
        </div>
      </section>

      {/* 06 — Photo carousel */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Campus life"
            title="A glimpse of our school"
            description="Moments from classrooms, events, and everyday life at GMHSS Ramban."
            action={<button onClick={() => onNavigate('/gallery')} className="btn-ghost">View full gallery <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-10">
            {gallery.loading ? (
              <LoadingSkeleton className="h-[320px] rounded-2xl" />
            ) : gallery.error ? (
              <ErrorState message="We couldn't load photos right now." onRetry={gallery.reload} />
            ) : gallery.data && gallery.data.length > 0 ? (
              <HomeCarousel images={gallery.data} onOpen={() => onNavigate('/gallery')} />
            ) : (
              <EmptyState icon={<Images className="h-6 w-6" />} title="No photos yet" description="Photos will appear here once published." />
            )}
          </div>
        </div>
      </section>

      {/* 07 — Gallery grid preview */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Moments"
            title="Gallery preview"
            action={<button onClick={() => onNavigate('/gallery')} className="btn-ghost">View full gallery <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-10">
            {gallery.loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{[0, 1, 2, 3, 4, 5].map(i => <LoadingSkeleton key={i} className="aspect-square" />)}</div>
            ) : gallery.error ? (
              <ErrorState message="We couldn't load gallery images right now." onRetry={gallery.reload} />
            ) : gallery.data && gallery.data.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {gallery.data.slice(0, 6).map(item => {
                  const src = resolveImagePath(item.image_path);
                  return (
                    <button key={item.id} onClick={() => onNavigate('/gallery')} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-ink-100 transition-all duration-300 hover:ring-brand-300">
                      <img src={src} alt={item.alt_text} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={<Images className="h-6 w-6" />} title="No photos yet" description="Gallery photos will appear here once published." />
            )}
          </div>
        </div>
      </section>

      {/* 07 — Location & Contact */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="section-eyebrow">Location &amp; Contact</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Find us in Ramban</h2>
            <p className="mt-4 text-ink-500">{s?.address || 'Ramban, Jammu & Kashmir, India'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {s?.map_url ? (
                <a href={s.map_url} target="_blank" rel="noreferrer" className="btn-primary">
                  <ExternalLink className="h-4 w-4" /> Open in Maps
                </a>
              ) : null}
              <button onClick={() => onNavigate('/contact')} className="btn-secondary">
                Contact page <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <div className="card h-full overflow-hidden">
              {s?.map_url ? (
                <iframe title="School location map" src={s.map_url} className="h-full min-h-[280px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-ink-100 p-8 text-center">
                  <MapPin className="h-10 w-10 text-brand-400" />
                  <p className="mt-4 text-sm font-medium text-ink-500">Map will appear here once the official location is confirmed.</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
