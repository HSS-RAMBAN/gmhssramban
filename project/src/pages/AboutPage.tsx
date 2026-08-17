import { BookOpen, GraduationCap, MapPin, ShieldCheck, FlaskConical, Palette, Compass, Sparkles, ChevronRight, ExternalLink } from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { getSchoolSettings, resolvePrincipalPhotoPath } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import type { NavigateFn } from '@/lib/types';

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function AboutPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const settings = useAsync(getSchoolSettings, []);
  const s = settings.data;

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
              <p className="section-eyebrow text-brand-200">About the School</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl text-balance">
                A place to learn, grow, and prepare for what comes next
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Govt. Model Higher Secondary School, Ramban serves students from Classes 9 to 12 in Ramban, Jammu & Kashmir.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* School Overview */}
      <section className="py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <p className="section-eyebrow">School introduction</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Education • Character • Opportunity</h2>
            <div className="prose-school mt-6">
              <p>{s?.school_description || s?.about_summary || 'The school provides higher secondary education for students in Classes 9–12. Its higher secondary streams are Science and Arts.'}</p>
              <p>Official school information, activities, notices, and documents are published here as they are confirmed and shared by the school administration.</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <img src={HERO_IMAGE} alt="Govt. Model Higher Secondary School, Ramban" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/70 to-transparent p-5">
                <p className="text-sm font-medium text-white">Ramban, Jammu & Kashmir</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Institutional Identity */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader eyebrow="Institutional identity" title="A clear academic journey" description="The school offers secondary education followed by two higher secondary streams." align="center" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: 'Classes 9–10', text: 'Secondary Education' },
              { icon: FlaskConical, title: 'Science', text: 'Higher Secondary • Classes 11–12' },
              { icon: Palette, title: 'Arts', text: 'Higher Secondary • Classes 11–12' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card card-hover h-full p-7 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-400">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Role */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl bg-brand-50 p-8 ring-1 ring-brand-100">
                <Compass className="h-8 w-8 text-brand-600" />
                <h3 className="mt-5 text-2xl font-semibold">Our role in the region</h3>
                <p className="mt-3 leading-relaxed text-ink-500">
                  As a government higher secondary school in Ramban, the institution serves the educational needs of the local community, providing accessible secondary and higher secondary education.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-2xl bg-ink-50 p-8 ring-1 ring-ink-100">
                <Sparkles className="h-8 w-8 text-brand-600" />
                <h3 className="mt-5 text-2xl font-semibold">What we offer</h3>
                <p className="mt-3 leading-relaxed text-ink-500">
                  Secondary education from Classes 9 to 10, followed by higher secondary education in Science and Arts streams for Classes 11 and 12.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl shadow-card">
              <img src={HERO_IMAGE} alt={s?.principal_name || 'Principal'} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <p className="section-eyebrow">Principal's Message</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{s?.principal_name || 'Kewal Krishna Sharma'}</h2>
            <p className="mt-1 text-sm font-medium text-ink-400">Principal</p>
            {s?.principal_message ? (
              <p className="mt-6 leading-relaxed text-ink-600">{s.principal_message}</p>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-ink-200 bg-white p-5 text-sm text-ink-500">
                The principal's official message will be published here once it is provided and verified by the school.
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 sm:py-28">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><ShieldCheck className="h-6 w-6" /></span>
                <h3 className="text-2xl font-semibold">Vision</h3>
              </div>
              <p className="mt-5 leading-relaxed text-ink-500">
                To provide accessible, quality education that prepares students for further study and responsible citizenship.
              </p>
              <p className="mt-3 text-sm text-ink-400">Editable content — the school will publish its official vision statement when confirmed.</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card h-full p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Compass className="h-6 w-6" /></span>
                <h3 className="text-2xl font-semibold">Mission</h3>
              </div>
              <p className="mt-5 leading-relaxed text-ink-500">
                To deliver secondary and higher secondary education in Science and Arts streams, supporting students as they grow academically and personally.
              </p>
              <p className="mt-3 text-sm text-ink-400">Editable content — the school will publish its official mission statement when confirmed.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Academic Levels */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader eyebrow="Academic levels" title="Secondary and higher secondary" align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-700"><BookOpen className="h-6 w-6" /></span>
                <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-ink-400">Secondary Education</p>
                <h3 className="mt-1 text-2xl font-semibold">Classes 9–10</h3>
                <p className="mt-4 leading-relaxed text-ink-500">The secondary level provides the foundation for continued learning and higher secondary stream selection.</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card bg-brand-800 p-7 text-white">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-brand-200"><GraduationCap className="h-6 w-6" /></span>
                <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-brand-200">Higher Secondary Education</p>
                <h3 className="mt-1 text-2xl font-semibold text-white">Classes 11–12</h3>
                <p className="mt-4 leading-relaxed text-brand-100">Students continue through the Science or Arts stream. Detailed subjects and academic notices are published when confirmed.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Location & CTA */}
      <section className="bg-brand-950 py-20 text-white sm:py-28">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="section-eyebrow text-brand-300">Location</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Find the school in Ramban</h2>
            <p className="mt-4 text-brand-100">{s?.address || 'Exact address to be confirmed by the school.'}</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
              <MapPin className="h-8 w-8 text-brand-300" />
              <p className="mt-4 text-sm text-brand-100">Map location and directions will appear here once the school confirms the official location.</p>
              {s?.map_url ? (
                <a href={s.map_url} target="_blank" rel="noreferrer" className="btn mt-5 bg-white text-brand-800 hover:bg-brand-50">
                  <ExternalLink className="h-4 w-4" /> Open in Google Maps
                </a>
              ) : (
                <button onClick={() => onNavigate('/contact')} className="btn mt-5 bg-white text-brand-800 hover:bg-brand-50">
                  Contact & location <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
