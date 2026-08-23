import { BookOpen, FlaskConical, Palette, ArrowRight, GraduationCap, Compass, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import type { NavigateFn } from '@/lib/types';
import { useHeroImage } from '@/lib/useHeroImage';

export function AcademicsPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const { heroImage } = useHeroImage();
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
              <p className="section-eyebrow text-brand-200">Academics</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl text-balance">
                A focused path from secondary to higher secondary education
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Classes 9–10 provide the secondary foundation. Classes 11–12 continue through the Science and Arts streams at the higher secondary level.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Academic Overview */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader eyebrow="Academic structure" title="Clear levels, considered choices" description="A structured progression from secondary education to higher secondary streams (Classes 11–12)." align="center" />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-100 text-ink-700"><BookOpen className="h-6 w-6" /></span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-ink-400">Secondary Education</p>
                <h2 className="mt-2 text-3xl font-semibold">Classes 9–10</h2>
                <p className="mt-4 leading-relaxed text-ink-500">The secondary level provides the foundation for continued learning and higher secondary stream selection at Classes 11–12.</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card bg-brand-800 p-8 text-white">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-brand-200"><GraduationCap className="h-6 w-6" /></span>
                <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-200">Higher Secondary Education</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Classes 11–12</h2>
                <p className="mt-4 leading-relaxed text-brand-100">Students continue through the Science or Arts stream at the higher secondary level (Classes 11–12). Detailed subjects and academic notices are published when confirmed.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Classes 9–10 */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <p className="section-eyebrow">Secondary Education</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Classes 9–10</h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              The secondary level builds the academic foundation students need before choosing a higher secondary stream (Classes 11–12). The curriculum covers core subjects across humanities, sciences, and languages.
            </p>
            <p className="mt-3 text-sm text-ink-400">Subject details will be published by the school when confirmed.</p>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-950/70 to-brand-700/25" />
              <div className="absolute bottom-5 left-5">
                <BookOpen className="h-8 w-8 text-white" />
                <p className="mt-2 text-lg font-semibold text-white">Secondary Foundation</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Classes 11–12 */}
      <section className="py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900/70 to-brand-500/25" />
              <div className="absolute bottom-5 left-5">
                <GraduationCap className="h-8 w-8 text-white" />
                <p className="mt-2 text-lg font-semibold text-white">Higher Secondary</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <p className="section-eyebrow">Higher Secondary Education</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Classes 11–12</h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              At the higher secondary level (Classes 11–12), students pursue one of two streams — Science or Arts. Each stream provides a distinct academic pathway, preparing students for further study and careers.
            </p>
            <p className="mt-3 text-sm text-ink-400">Higher secondary stream details and subject lists will be published by the school when confirmed.</p>
          </Reveal>
        </div>
      </section>

      {/* Science */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <p className="section-eyebrow">Higher Secondary Stream</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Science</h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              The Science stream at the higher secondary level (Classes 11–12) provides education with a focus on scientific foundations. Students develop analytical and problem-solving skills across core scientific disciplines.
            </p>
            <p className="mt-3 text-sm text-ink-400">Subjects to be confirmed and published by the school.</p>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="card overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-900/40 to-brand-700/15" />
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <FlaskConical className="h-7 w-7 text-white" />
                  <h3 className="text-2xl font-semibold text-white">Science</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-ink-400">Higher Secondary • Classes 11–12</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">A higher secondary stream focused on scientific study and analytical thinking.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Arts */}
      <section className="py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="card overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-800/40 to-brand-500/15" />
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <Palette className="h-7 w-7 text-white" />
                  <h3 className="text-2xl font-semibold text-white">Arts</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-ink-400">Higher Secondary • Classes 11–12</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">A higher secondary stream focused on humanities and social sciences.</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <p className="section-eyebrow">Higher Secondary Stream</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Arts</h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              The Arts stream at the higher secondary level (Classes 11–12) offers education in the humanities and social sciences. Students explore subjects that develop critical thinking, communication, and an understanding of society.
            </p>
            <p className="mt-3 text-sm text-ink-400">Subjects to be confirmed and published by the school.</p>
          </Reveal>
        </div>
      </section>

      {/* Academic Experience */}
      <section className="bg-ink-50 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeader eyebrow="Academic experience" title="A supportive learning environment" align="center" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: 'Structured curriculum', text: 'A clear academic path from Class 9 through Class 12.' },
              { icon: Compass, title: 'Stream selection', text: 'Students choose between Science and Arts at the higher secondary level.' },
              { icon: GraduationCap, title: 'Preparation for the future', text: 'Education that prepares students for further study and opportunity.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card card-hover h-full p-7 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <item.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-400">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links to results & resources */}
      <section className="bg-ink-50 py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2">
            <button onClick={() => onNavigate('/results')} className="card card-hover flex items-center gap-4 p-6 text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><GraduationCap className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-ink-800">Examination Results</p>
                <p className="text-sm text-ink-500">Internal and board result links</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-ink-300" />
            </button>
            <button onClick={() => onNavigate('/board-resources')} className="card card-hover flex items-center gap-4 p-6 text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><BookOpen className="h-6 w-6" /></span>
              <div>
                <p className="font-semibold text-ink-800">Board Exam Resources</p>
                <p className="text-sm text-ink-500">Datesheets, syllabus & papers</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-ink-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Notices CTA */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-8 ring-1 ring-brand-100 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-brand-900">Have an academic question?</p>
                <p className="mt-1 text-sm text-brand-700">Contact the school for verified academic information.</p>
              </div>
              <button onClick={() => onNavigate('/contact')} className="btn-primary">
                Contact the school <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
