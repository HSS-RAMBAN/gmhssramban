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
    <footer className="relative overflow-hidden gradient-dark-deep text-brand-100">
      <div className="absolute inset-0 topo-texture opacity-40" />

      <div className="container-page relative py-16 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs text-brand-400">
            &copy; {new Date().getFullYear()} GMHSS RAMBAN. All rights reserved.
          </p>

          {visitCount !== null && (
            <p className="mt-3 flex items-center gap-2 text-xs text-brand-400">
              <Eye className="h-3.5 w-3.5" />
              Total Visits: {visitCount.toLocaleString()}
            </p>
          )}
        </div>
<br />
<br />
        <div className="h-6" />

        {/* Developer credit — prominent but professional */}
          <div className="mx-auto max-w-xs border-t border-white/20 pt-4 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
           Website designed &amp; developed with{' '}
            <span className="text-red-400">&hearts;</span>
    <br />
            by a proud alumnus,
          </p>
          <p className="mt-0 text-lg font-bold tracking-tight text-white">
       <br />
            TheRoxYogi</p>

          <a
            href="mailto:hiamit.in@gmail.com"
            className="mt-1 inline-block text-sm font-medium text-sky-400 transition hover:text-sky-300"
          >
            hiamit.in@gmail.com
  </a>

  {/* Generous empty space after email */}
  <div className="h-60" />
</div>
        
        {showBackTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full gradient-accent text-white shadow-lift transition-all duration-300 hover:shadow-glow active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </footer>
  );
}
         
        
}
