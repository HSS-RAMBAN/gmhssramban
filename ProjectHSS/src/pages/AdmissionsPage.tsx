import { FileText, Download, CalendarDays, ListChecks, Info, ScrollText } from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { getAdmissionsContent } from '@/lib/queries';
import { Reveal } from '@/components/Reveal';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';
import type { NavigateFn } from '@/lib/types';

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function AdmissionsPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const content = useAsync(getAdmissionsContent, []);
  const c = content.data;

  return (
    <div>
      <section className="relative min-h-[45vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[45vh] items-end pb-14 pt-[var(--header-height)]">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">Admissions</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl text-balance">
                Admissions Information
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Information for prospective students and parents.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-page">
          {content.loading ? (
            <div className="space-y-4">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-24" />)}</div>
          ) : content.error ? (
            <ErrorState message="We couldn't load admissions information right now." onRetry={content.reload} />
          ) : c ? (
            <div className="space-y-8">
              {c.intro && (
                <Reveal>
                  <div className="card p-7">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Info className="h-5 w-5" /></span>
                      <h2 className="text-2xl font-semibold">Introduction</h2>
                    </div>
                    <p className="mt-5 whitespace-pre-line leading-relaxed text-ink-600">{c.intro}</p>
                  </div>
                </Reveal>
              )}

              {c.prospectus_url && (
                <Reveal>
                  <a href={c.prospectus_url} target="_blank" rel="noreferrer" className="card card-hover flex items-center gap-4 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Download className="h-5 w-5" /></span>
                    <div>
                      <p className="font-semibold text-ink-800">Download Prospectus</p>
                      <p className="text-sm text-ink-400">View the admission prospectus</p>
                    </div>
                  </a>
                </Reveal>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                {c.programs_offered && (
                  <Reveal>
                    <AdmissionsCard icon={ListChecks} title="Programs Offered" content={c.programs_offered} />
                  </Reveal>
                )}
                {c.required_documents && (
                  <Reveal delay={80}>
                    <AdmissionsCard icon={FileText} title="Required Documents" content={c.required_documents} />
                  </Reveal>
                )}
                {c.important_dates && (
                  <Reveal>
                    <AdmissionsCard icon={CalendarDays} title="Important Dates" content={c.important_dates} />
                  </Reveal>
                )}
                {c.fee_structure && (
                  <Reveal delay={80}>
                    <AdmissionsCard icon={ScrollText} title="Fee Structure" content={c.fee_structure} />
                  </Reveal>
                )}
              </div>

              {c.admission_notices && (
                <Reveal>
                  <AdmissionsCard icon={Info} title="Admission Notices" content={c.admission_notices} />
                </Reveal>
              )}
              {c.downloadable_forms && (
                <Reveal>
                  <AdmissionsCard icon={Download} title="Downloadable Forms" content={c.downloadable_forms} />
                </Reveal>
              )}
              {c.instructions && (
                <Reveal>
                  <AdmissionsCard icon={ListChecks} title="Instructions" content={c.instructions} />
                </Reveal>
              )}

              {!c.intro && !c.programs_offered && !c.required_documents && !c.important_dates && !c.fee_structure && !c.admission_notices && !c.downloadable_forms && !c.instructions && (
                <EmptyState icon={<Info className="h-6 w-6" />} title="Admissions information coming soon" description="The school will publish admissions details here when available. Please check back or contact the school directly." />
              )}
            </div>
          ) : (
            <EmptyState icon={<Info className="h-6 w-6" />} title="Admissions information coming soon" description="The school will publish admissions details here when available." />
          )}

          <Reveal>
            <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-50 p-8 ring-1 ring-brand-100 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-brand-900">Have an admissions question?</p>
                <p className="mt-1 text-sm text-brand-700">Contact the school directly for verified information.</p>
              </div>
              <button onClick={() => onNavigate('/contact')} className="btn-primary">
                Contact the school
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function AdmissionsCard({ icon: Icon, title, content }: { icon: typeof Info; title: string; content: string }) {
  return (
    <div className="card h-full p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mt-5 whitespace-pre-line leading-relaxed text-ink-600">{content}</p>
    </div>
  );
}
