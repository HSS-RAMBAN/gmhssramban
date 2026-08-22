import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { PublicResults } from '@/components/PublicSections';

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function ResultsPage() {
  return (
    <div>
      <section className="relative min-h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[40vh] items-end pb-14 pt-[var(--header-height)]">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">Examinations</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl text-balance">
                Results
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Internal examination results and official board result links.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Examination Results" title="Published results" description="Links to internal examination results and board results." align="center" />
          <div className="mt-12"><PublicResults /></div>
        </div>
      </section>
    </div>
  );
}
