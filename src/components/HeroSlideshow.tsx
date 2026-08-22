import { useState, useEffect, useRef, useCallback } from 'react';
import { resolveImagePath } from '@/lib/queries';
import type { HeroSlide } from '@/lib/types';

export function HeroSlideshow({ slides, fallback, heroEnabled = true }: { slides: HeroSlide[]; fallback: string; heroEnabled?: boolean }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const advance = useCallback(() => {
    setIndex(prev => (prev + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || prefersReducedMotion.current) return;
    timerRef.current = setInterval(advance, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance, slides.length]);

  useEffect(() => {
    const nextIdx = (index + 1) % Math.max(slides.length, 1);
    if (!loaded.has(nextIdx)) {
      setLoaded(prev => new Set(prev).add(nextIdx));
    }
  }, [index, loaded, slides.length]);

  if (!heroEnabled) {
    return <div className="absolute inset-0 bg-violet-700" />;
  }

  if (slides.length === 0) {
    return (
      <div className="absolute inset-0">
        <img src={fallback} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((slide, i) => {
        const src = resolveImagePath(slide.image_path);
        const isVisible = i === index;
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: isVisible ? 1 : 0,
              zIndex: isVisible ? 1 : 0,
            }}
            aria-hidden={!isVisible}
          >
            <img
              src={src}
              alt={slide.caption || ''}
              className="h-full w-full object-cover"
              loading={loaded.has(i) ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          </div>
        );
      })}
      <div className="absolute inset-0 hero-overlay" />
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white/80' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
