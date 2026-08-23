import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';
import { resolveImagePath } from '@/lib/queries';

export function HomeCarousel({ images, onOpen }: { images: GalleryItem[]; onOpen: () => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, images.length]);

  if (images.length === 0) return null;

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);
  const current = images[index];

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-soft ring-1 ring-ink-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button onClick={onOpen} className="block w-full text-left">
        <div className="relative h-[320px] sm:h-[400px] lg:h-[460px]">
          {images.map((img, i) => (
            <img
              key={img.id}
              src={resolveImagePath(img.image_path)}
              alt={img.alt_text || img.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{current.category}</p>
            <h3 className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">{current.title}</h3>
            {current.caption && <p className="mt-1 text-sm text-white/75 line-clamp-1">{current.caption}</p>}
          </div>
        </div>
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink-800 shadow-soft backdrop-blur-sm transition hover:bg-white hover:scale-110"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink-800 shadow-soft backdrop-blur-sm transition hover:bg-white hover:scale-110"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
