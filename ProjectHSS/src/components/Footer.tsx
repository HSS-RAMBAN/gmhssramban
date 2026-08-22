import { useEffect, useState } from 'react';
import { ArrowUp, Eye } from 'lucide-react';
import { getVisitCount, incrementVisit } from '@/lib/queries';

export function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const count = await incrementVisit();
        if (mounted) setVisitCount(count);
      } catch {
        try {
          const count = await getVisitCount();
          if (mounted) setVisitCount(count);
        } catch { /* ignore */ }
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100">
      <div className="absolute inset-0 topo-texture opacity-40" />

      <div className="container-page relative py-16 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs text-brand-400">
            &copy; {new Date().getFullYear()} GMHSS Ramban. All rights reserved.
          </p>

          {visitCount !== null && (
            <p className="mt-3 flex items-center gap-2 text-xs text-brand-400">
              <Eye className="h-3.5 w-3.5" />
              Total Visits: {visitCount.toLocaleString()}
            </p>
          )}
        </div>

        {/* Developer credit — sits around lower-middle of final viewport */}
        <div className="mt-14 flex flex-col items-center text-center">
          <p className="text-[11px] leading-relaxed text-brand-400">
            Website designed &amp; developed with{' '}
            <span className="text-red-400">&hearts;</span>
            <br />
            by a proud alumnus,{' '}
            <span className="font-semibold text-brand-200">TheRoxYogi</span>
            {' '}(<span className="font-medium text-brand-300">Batch 2023</span>)
          </p>
          <a
            href="mailto:hiamit.in@gmail.com"
            className="mt-1.5 text-[11px] text-brand-400 transition-colors duration-200 hover:text-brand-200"
          >
            hiamit.in@gmail.com
          </a>
          {/* Generous empty space after email */}
          <div className="h-60" />
        </div>
      </div>

      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-white shadow-lift transition-all duration-300 hover:bg-brand-800 active:scale-95"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}
