import { ArrowRight, BookOpen, FlaskConical, Palette, GraduationCap, MapPin, CalendarDays, Megaphone, Images, FileText, ChevronRight, Star, ShieldCheck, Sparkles, Compass, ExternalLink } from 'lucide-react';
import type { SchoolSettings, Notice, Activity, GalleryItem, DocumentItem, NavigateFn } from '@/lib/types';
import { getSchoolSettings, getPublishedNotices, getPublishedActivities, getPublishedGallery, getPublishedDocuments, resolveImagePath } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { NoticeCard } from '@/components/NoticeCard';
import { ActivityCard } from '@/components/ActivityCard';
import { DocumentCard } from '@/components/DocumentCard';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';

type NavigateFn = (to: string) => void;

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function HomePage({ onNavigate }: { onNavigate: NavigateFn }) {
  const settings = useAsync(getSchoolSettings, []);
  const notices = useAsync(() => getPublishedNotices(5), []);
  const activities = useAsync(() => getPublishedActivities(4), []);
  const gallery = useAsync(() => getPublishedGallery(6), []);
  const documents = useAsync(() => getPublishedDocuments(4), []);

  const s = settings.data;

  return (
    <div>
      {/* 01 — Hero */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div className="relative flex min-h-[92vh] items-center">
          <div className="container-page w-full pt-24 pb-20">
            <Reveal>
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-brand-200">
                <span className="h-px w-8 bg-brand-300/70" />
                Ramban • Jammu & Kashmir
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl text-balance">
                {s?.hero_title || 'Government Model Higher Secondary School, Ramban'}
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium text-white/85">
                {s?.hero_subtitle || 'Education • Character • Opportunity'}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm ring-1 ring-inset ring-white/20">
                <GraduationCap className="h-4 w-4" />
                Classes 9–12 • Science & Arts
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('/about')} className="btn bg-white text-brand-800 shadow-card hover:bg-brand-50 active:scale-[0.98]">
                  Explore the School
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => onNavigate('/notices')} className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 backdrop-blur-sm hover:bg-white/20">
                  <Megaphone className="h-4 w-4" />
                  View Latest Notices
                </button>
              </div>
            </Reveal>
          </div>
        </div>
        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
            <div className="h-2 w-1 animate-float-slow rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* 02 — Institutional Introduction */}
      <section className="violet-mesh py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <p className="section-eyebrow">About the School</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl text-balance">
              A place to learn, grow, and prepare for the future
            </h2>
            <div className="prose-school mt-6 max-w-2xl">
              <p>
                {s?.about_summary ||
                  'Govt. Model Higher Secondary School, Ramban serves students from Classes 9 to 12 in the heart of Ramban district, Jammu & Kashmir. The school offers Science and Arts streams at the higher secondary level.'}
              </p>
              <p>
                Located in Ramban, the school is committed to accessible, quality education in the region. This website is maintained by the school and updated as official information is confirmed.
              </p>
            </div>
            <button onClick={() => onNavigate('/about')} className="btn-secondary mt-8">
              Learn more about the school
              <ChevronRight className="h-4 w-4" />
            </button>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <img src={HERO_IMAGE} alt="Govt. Model Higher Secondary School, Ramban" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-semibold text-white">Govt. Model Higher Secondary School</p>
                <p className="text-xs text-white/70">Ramban, Jammu & Kashmir</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — School at a Glance */}
      <section className="border-y border-ink-100 bg-white py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="At a glance" title="The school in brief" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, label: 'Classes 9–12', text: 'Secondary & Higher Secondary' },
              { icon: FlaskConical, label: 'Science Stream', text: 'Higher Secondary • 11–12' },
              { icon: Palette, label: 'Arts Stream', text: 'Higher Secondary • 11–12' },
              { icon: MapPin, label: 'Ramban, J&K', text: 'Jammu & Kashmir, India' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card card-hover h-full p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.label}</h3>
                  <p className="mt-1 text-sm text-ink-400">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Principal's Message */}
      <PrincipalSection settings={s} loading={settings.loading} />

      {/* 05 — Academic Journey */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader eyebrow="Academic journey" title="From secondary to higher secondary" description="A structured path through Classes 9 to 12, leading to Science and Arts streams." align="center" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: '09', label: 'Secondary Education', icon: BookOpen },
              { num: '10', label: 'Secondary Education', icon: BookOpen },
              { num: '11', label: 'Higher Secondary', icon: GraduationCap },
              { num: '12', label: 'Higher Secondary', icon: GraduationCap },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-ink-100 transition hover:shadow-card">
                  <span className="absolute right-4 top-3 font-serif text-5xl font-bold text-brand-100">{step.num}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-ink-400">Class {step.num}</p>
                  <h3 className="mt-1 text-lg font-semibold">{step.label}</h3>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft">
                <FlaskConical className="h-4 w-4" /> Science
              </span>
              <span className="text-ink-300">•</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-5 py-2.5 text-sm font-semibold text-brand-800 ring-1 ring-inset ring-brand-200">
                <Palette className="h-4 w-4" /> Arts
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 06 — Academic Streams */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader eyebrow="Higher secondary streams" title="Science and Arts" description="Two streams at the higher secondary level, each with a distinct academic focus." />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="card card-hover h-full overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-900/45 to-brand-800/20" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <FlaskConical className="h-7 w-7 text-white" />
                    <h3 className="text-2xl font-semibold text-white">Science</h3>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-sm font-medium text-ink-400">Higher Secondary • Classes 11–12</p>
                  <p className="mt-4 leading-relaxed text-ink-500">
                    The Science stream provides higher secondary education with a focus on scientific foundations. Subject details are published by the school when confirmed.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card card-hover h-full overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-800/45 to-brand-600/20" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <Palette className="h-7 w-7 text-white" />
                    <h3 className="text-2xl font-semibold text-white">Arts</h3>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-sm font-medium text-ink-400">Higher Secondary • Classes 11–12</p>
                  <p className="mt-4 leading-relaxed text-ink-500">
                    The Arts stream offers higher secondary education in the humanities and social sciences. Subject details are published by the school when confirmed.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-900">Secondary Education</p>
                <p className="text-sm text-brand-700">Classes 9–10 — foundation curriculum before stream selection.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 07 — Notices / Notice Board */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Stay informed"
            title="Latest notices"
            description="Official announcements from the school administration."
            action={<button onClick={() => onNavigate('/notices')} className="btn-ghost">View all notices <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-12">
            {notices.loading ? (
              <div className="grid gap-5 md:grid-cols-3">{[0, 1, 2].map(i => <LoadingSkeleton key={i} className="h-52" />)}</div>
            ) : notices.error ? (
              <ErrorState message="We couldn't load notices right now." onRetry={notices.reload} />
            ) : notices.data && notices.data.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-3">
                {notices.data.slice(0, 3).map(n => <NoticeCard key={n.id} notice={n} onOpen={() => onNavigate('/notices')} />)}
              </div>
            ) : (
              <EmptyState icon={<Megaphone className="h-6 w-6" />} title="No current notices" description="Official school announcements will appear here when published." />
            )}
          </div>
        </div>
      </section>

      {/* 08 — Activities & Achievements */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="School life"
            title="Recent activities"
            description="Events, achievements, and programmes from across the school."
            action={<button onClick={() => onNavigate('/activities')} className="btn-ghost">View all activities <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-12">
            {activities.loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map(i => <LoadingSkeleton key={i} className="h-64" />)}</div>
            ) : activities.error ? (
              <ErrorState message="We couldn't load activities right now." onRetry={activities.reload} />
            ) : activities.data && activities.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {activities.data.map(a => <ActivityCard key={a.id} activity={a} onOpen={() => onNavigate('/activities')} />)}
              </div>
            ) : (
              <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="School activities and updates will appear here." description="Published school activities will be shown once available." />
            )}
          </div>
        </div>
      </section>

      {/* 09 — School Highlights */}
      <section className="relative overflow-hidden bg-brand-950 py-20 text-white sm:py-28">
        <div className="absolute inset-0 topo-texture opacity-30" />
        <div className="container-page relative">
          <SectionHeader eyebrow="What we stand for" title="Learning. Discipline. Opportunity. Growth." align="center" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, label: 'Learning', text: 'A strong academic foundation across secondary and higher secondary levels.' },
              { icon: ShieldCheck, label: 'Discipline', text: 'An environment that values character and personal responsibility.' },
              { icon: Compass, label: 'Opportunity', text: 'Science and Arts streams that open pathways to further study.' },
              { icon: GraduationCap, label: 'Growth', text: 'Supporting students as they prepare for what comes next.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 transition hover:bg-white/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-200">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Documents */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader
            eyebrow="Resources"
            title="Important documents"
            description="Downloadable notices, forms, circulars, and academic documents."
            action={<button onClick={() => onNavigate('/notices')} className="btn-ghost">View all <ChevronRight className="h-4 w-4" /></button>}
          />
          <div className="mt-12">
            {documents.loading ? (
              <div className="grid gap-5 md:grid-cols-2">{[0, 1].map(i => <LoadingSkeleton key={i} className="h-24" />)}</div>
            ) : documents.error ? (
              <ErrorState message="We couldn't load documents right now." onRetry={documents.reload} />
            ) : documents.data && documents.data.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {documents.data.map(d => <DocumentCard key={d.id} doc={d} />)}
              </div>
            ) : (
              <EmptyState icon={<FileText className="h-6 w-6" />} title="No documents are currently available." description="Important forms, circulars, and academic documents will appear here." />
            )}
          </div>
        </div>
      </section>

      {/* 11 — Digital Notice CTA */}
      <section className="relative overflow-hidden bg-brand-800 py-20 text-white sm:py-28">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/70 to-brand-800/50" />
        </div>
        <div className="container-page relative">
          <Reveal>
            <p className="section-eyebrow text-brand-200">Stay up to date</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl text-balance">
              Keep up with school updates and announcements
            </h2>
            <p className="mt-5 max-w-xl text-brand-100">
              Notices, activities, and documents are published here as they are confirmed by the school.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('/notices')} className="btn bg-white text-brand-800 shadow-card hover:bg-brand-50">
                <Megaphone className="h-4 w-4" /> View Notices
              </button>
              <button onClick={() => onNavigate('/activities')} className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 backdrop-blur-sm hover:bg-white/20">
                <CalendarDays className="h-4 w-4" /> Explore Activities
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 12 — Location */}
      <LocationSection settings={s} onNavigate={onNavigate} />

      {/* 13 — Contact */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <p className="section-eyebrow">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Get in touch with the school</h2>
            <p className="mt-4 text-ink-500">{s?.address || 'Ramban, Jammu & Kashmir, India'}</p>
            <div className="mt-8 space-y-4">
              <ContactRow icon={MapPin} label="Address" value={s?.address || 'Ramban, Jammu & Kashmir, India'} />
              <ContactRow icon={FileText} label="Phone" value={s?.phone || 'To be confirmed'} />
              <ContactRow icon={Megaphone} label="Email" value={s?.email || 'To be confirmed'} />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={120}>
            <div className="card p-7 sm:p-8">
              <p className="section-eyebrow">Send a message</p>
              <h3 className="mt-2 text-2xl font-semibold">Contact the school</h3>
              <p className="mt-2 text-sm text-ink-500">Use the contact page to send a message directly to the school administration.</p>
              <button onClick={() => onNavigate('/contact')} className="btn-primary mt-6 w-full sm:w-auto">
                Go to contact page <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function PrincipalSection({ settings, loading }: { settings: SchoolSettings | null; loading: boolean }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl shadow-card">
            <img src={HERO_IMAGE} alt={settings?.principal_name || 'Principal'} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
          </div>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={120}>
          <p className="section-eyebrow">Principal's Message</p>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{settings?.principal_name || 'Kewal Krishna Sharma'}</h2>
          <p className="mt-1 text-sm font-medium text-ink-400">Principal</p>
          {loading ? (
            <div className="mt-6 space-y-3">
              <LoadingSkeleton className="h-4 w-full" />
              <LoadingSkeleton className="h-4 w-5/6" />
              <LoadingSkeleton className="h-4 w-4/6" />
            </div>
          ) : settings?.principal_message ? (
            <div className="prose-school mt-6">
              <p>{settings.principal_message}</p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 p-5">
              <p className="text-sm text-ink-500">
                The principal's official message will be published here once it is provided and verified by the school.
              </p>
              <p className="mt-2 text-xs text-ink-400">
                Note: the principal name shown is editable and should be verified before final launch.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function LocationSection({ settings, onNavigate }: { settings: SchoolSettings | null; onNavigate: NavigateFn }) {
  const mapUrl = settings?.map_url || '';
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Location" title="Find us in Ramban" description="Govt. Model Higher Secondary School, Ramban, Jammu & Kashmir." align="center" />
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          <Reveal className="lg:col-span-5">
            <div className="card h-full p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">School location</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                {settings?.address || 'Ramban, Jammu & Kashmir, India'}
              </p>
              <p className="mt-2 text-sm text-ink-400">
                Exact address and map coordinates will be confirmed by the school.
              </p>
              {mapUrl ? (
                <a href={mapUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full sm:w-auto">
                  <ExternalLink className="h-4 w-4" /> Open in Google Maps
                </a>
              ) : (
                <button onClick={() => onNavigate('/contact')} className="btn-secondary mt-6 w-full sm:w-auto">
                  Contact & location <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <div className="card h-full overflow-hidden">
              {mapUrl ? (
                <iframe
                  title="School location map"
                  src={mapUrl}
                  className="h-full min-h-[300px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-ink-100 p-8 text-center">
                  <MapPin className="h-10 w-10 text-brand-400" />
                  <p className="mt-4 text-sm font-medium text-ink-500">Map will appear here once the official location is confirmed.</p>
                  <p className="mt-1 text-xs text-ink-400">The school administrator can add the Google Maps link from the content manager.</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
        <p className="mt-1 text-sm text-ink-700">{value}</p>
      </div>
    </div>
  );
}
