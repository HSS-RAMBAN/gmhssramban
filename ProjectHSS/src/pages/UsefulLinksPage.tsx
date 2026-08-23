import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { PublicUsefulLinks } from '@/components/PublicSections';
import { useHeroImage } from '@/lib/useHeroImage';

export function UsefulLinksPage() {
  const { heroImage } = useHeroImage();
  return (
    <div>
      <section className="relative min-h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[40vh] items-end pb-14 pt-[var(--header-height)]">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">References</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl text-balance">
                Useful Links
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Curated external links for students, parents, and visitors.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="External Resources" title="Useful links" description="A collection of helpful external references." align="center" />
          <div className="mt-12"><PublicUsefulLinks /></div>
        </div>
      </section>
    </div>
  );
}
