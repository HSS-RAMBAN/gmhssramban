import { useEffect, useState } from 'react';
import { Menu, X, ChevronRight, Megaphone, MapPin } from 'lucide-react';

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Activities', path: '/activities' },
  { label: 'Notices', path: '/notices' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export function Header({ currentPath, onNavigate }: { currentPath: string; onNavigate: (to: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [currentPath]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (p: string) => (p === '/' ? currentPath === '/' : currentPath.startsWith(p));
  const onDark = !scrolled && (currentPath === '/' || currentPath === '/about' || currentPath === '/academics' || currentPath === '/activities' || currentPath === '/notices' || currentPath === '/contact');

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-soft backdrop-blur-md' : 'bg-transparent'}`}>
      {/* Top strip */}
      <div className={`hidden border-b transition-colors duration-300 ${scrolled ? 'border-ink-100 bg-brand-950 text-brand-100' : 'border-white/10 bg-brand-950/80 text-brand-100'} lg:block`}>
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-brand-300" />
            Ramban, Jammu & Kashmir, India
          </span>
          <span className="flex items-center gap-4">
            <span className="text-brand-200">Classes 9–12 • Science & Arts</span>
            <button onClick={() => onNavigate('/admin')} className="font-medium text-brand-200 transition-colors hover:text-white">
              Staff Login
            </button>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <button onClick={() => onNavigate('/')} className="flex items-center gap-3 text-left" aria-label="GMHSS Ramban home">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-soft transition-colors ${scrolled ? 'bg-brand-800 text-white' : 'bg-white/15 text-white ring-1 ring-inset ring-white/25'}`}>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3 L21 7 V12 C21 17 17 20 12 22 C7 20 3 17 3 12 V7 Z" strokeLinejoin="round" />
              <path d="M8 12 L11 15 L16 9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden leading-tight sm:block">
            <span className={`block text-[15px] font-semibold transition-colors ${scrolled ? 'text-ink-900' : 'text-white'}`}>
              GMHSS Ramban
            </span>
            <span className={`block text-[11px] font-medium uppercase tracking-wider transition-colors ${scrolled ? 'text-ink-400' : 'text-brand-200'}`}>
              Higher Secondary School
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? scrolled ? 'text-brand-800 nav-underline' : 'text-white nav-underline'
                  : scrolled ? 'text-ink-600 hover:text-ink-900' : 'text-brand-100 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/notices')}
            className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition sm:inline-flex ${scrolled ? 'bg-brand-700 text-white hover:bg-brand-800' : 'bg-white/15 text-white ring-1 ring-inset ring-white/30 backdrop-blur-sm hover:bg-white/25'}`}
          >
            <Megaphone className="h-4 w-4" />
            Latest Notices
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition lg:hidden ${scrolled ? 'text-ink-700 hover:bg-ink-100' : 'text-white hover:bg-white/10'}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`fixed inset-0 top-[calc(var(--header-height)+2.25rem)] bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <div className={`absolute inset-x-0 top-[calc(var(--header-height)+2.25rem)] origin-top bg-white shadow-lift transition-all duration-300 ${open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <nav className="container-page flex flex-col py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${isActive(item.path) ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-50'}`}
              >
                {item.label}
                <ChevronRight className={`h-4 w-4 ${isActive(item.path) ? 'text-brand-600' : 'text-ink-300'}`} />
              </button>
            ))}
            <button onClick={() => onNavigate('/notices')} className="btn-primary mt-3 w-full">
              <Megaphone className="h-4 w-4" />
              Latest Notices
            </button>
            <button onClick={() => onNavigate('/admin')} className="btn-ghost mt-2 w-full text-ink-500">
              Staff Login
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
