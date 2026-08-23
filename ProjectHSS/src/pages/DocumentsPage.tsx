import { FileText } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { Reveal } from '@/components/Reveal';
import { DocumentCard } from '@/components/DocumentCard';
import { getPublishedDocuments } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/States';
import { useHeroImage } from '@/lib/useHeroImage';

export function DocumentsPage() {
  const { heroImage } = useHeroImage();
  const documents = useAsync(() => getPublishedDocuments(), []);

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
              <p className="section-eyebrow text-brand-200">Downloads</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl text-balance">
                Important Documents
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                Official circulars, forms, and academic documents available for download.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Documents" title="Downloadable files" description="Official school documents, circulars, and forms." align="center" />
          <div className="mt-12">
            {documents.loading ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2, 3, 4, 5].map(i => <LoadingSkeleton key={i} className="h-32" />)}</div>
            ) : documents.error ? (
              <ErrorState message="We couldn't load documents right now." onRetry={documents.reload} />
            ) : documents.data && documents.data.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {documents.data.map(doc => <DocumentCard key={doc.id} doc={doc} />)}
              </div>
            ) : (
              <EmptyState icon={<FileText className="h-6 w-6" />} title="No documents yet" description="Official documents will appear here once published." />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
