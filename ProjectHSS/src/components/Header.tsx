import { useEffect, useState, useRef, useCallback } from 'react';
import {
  X, ChevronRight, Mail, ShieldCheck,
  BookOpen, FileText, Link2, Users, Building2, Award, Home, Images, Info,
  Instagram, Facebook, Youtube, Linkedin, Globe,
} from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { getPublishedSocialLinks } from '@/lib/queries';
import type { SocialLink } from '@/lib/types';

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Notices', path: '/notices' },
];

export function Header({ currentPath, onNavigate }: { currentPath: string; onNavigate: (to: string) => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => { setDrawerOpen(false); }, [currentPath]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setCollapsed(false);
      } else if (y > lastScrollY.current + 5) {
        setCollapsed(true);
      } else if (y < lastScrollY.current - 5) {
        setCollapsed(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (p: string) => (p === '/' ? currentPath === '/' : currentPath.startsWith(p));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex flex-col">
        {/* Tile 1 — thinnest: location + social icons */}
        <div className={`overflow-hidden gradient-dark-deep text-white transition-[height,opacity] duration-300 ease-in-out ${collapsed ? 'h-0 opacity-0' : 'h-6 opacity-100'}`}>
          <div className="container-page flex h-6 items-center justify-between">
            <span className="text-[11px] font-medium tracking-wide text-brand-300">Ramban, Jammu &amp; Kashmir, India</span>
            <SocialIcons />
          </div>
        </div>

        {/* Tile 2 — identity + core actions */}
        <div className="gradient-dark text-white">
          <div className="container-page flex h-14 items-center justify-between gap-3">
            {/* Left: hamburger + logo + name */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setDrawerOpen(true)}
                className="group inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-100 transition hover:bg-white/10 hover:text-white"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <span className="flex flex-col items-center justify-center gap-[5px]">
                  <span className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${drawerOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
                  <span className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${drawerOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${drawerOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
                </span>
              </button>
              <button onClick={() => onNavigate('/')} className="flex items-center gap-2 text-left" aria-label="GMHSS Ramban home">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-inset ring-white/20">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3.5 L21 7.5 L12 11.5 L3 7.5 Z" />
                    <path d="M6 10 V14.5 C6 14.5 9 16.5 12 16.5 C15 16.5 18 14.5 18 14.5 V10" />
                    <path d="M21 7.5 V13" />
                  </svg>
                </span>
                <span className="text-[15px] font-bold tracking-tight text-white">GMHSS RAMBAN</span>
              </button>
            </div>
            {/* Right: contact icon */}
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-100 transition hover:bg-white/10 hover:text-white"
              aria-label="Contact"
            >
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tile 3 — thinnest navigation: 4 tabs (transparent, adapts to page background) */}
        <div className={`overflow-hidden text-white transition-[height,opacity] duration-300 ease-in-out ${collapsed ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
          <nav className="container-page flex h-10 items-center justify-center gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive(item.path)
                    ? 'bg-white/15 text-white'
                    : 'text-brand-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Side drawer */}
      <UtilityDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />
    </>
  );
}

/* ============================ Utility Drawer ============================ */

type DrawerItem = {
  label: string;
  desc: string;
  icon: typeof BookOpen;
  target: string;
};

const DRAWER_SECTIONS: { heading: string; items: DrawerItem[] }[] = [
  {
    heading: 'Explore',
    items: [
      { label: 'Home', desc: 'Latest news and highlights', icon: Home, target: '/' },
      { label: 'About', desc: 'Our history, vision and staff', icon: Info, target: '/about' },
      { label: 'Gallery', desc: 'Photos from school events', icon: Images, target: '/gallery' },
      { label: 'Activities', desc: 'Clubs, events and programmes', icon: BookOpen, target: '/activities' },
      { label: 'Admissions', desc: 'How to apply and enrol', icon: FileText, target: '/admissions' },
    ],
  },
  {
    heading: 'Academics & Resources',
    items: [
      { label: 'Academics', desc: 'Courses, streams and curriculum', icon: BookOpen, target: '/academics' },
      { label: 'Results', desc: 'Exam outcomes and toppers', icon: Award, target: '/results' },
      { label: 'Board Exam Resources', desc: 'Past papers and study aids', icon: FileText, target: '/board-resources' },
      { label: 'Important Documents', desc: 'Forms, certificates and notices', icon: FileText, target: '/documents' },
      { label: 'Useful Links', desc: 'Helpful external resources', icon: Link2, target: '/useful-links' },
    ],
  },
  {
    heading: 'School Information',
    items: [
      { label: 'Staff Directory', desc: 'Teaching and admin faculty', icon: Users, target: '/about' },
      { label: 'Infrastructure', desc: 'Campus facilities and resources', icon: Building2, target: '/about' },
    ],
  },
  {
    heading: 'Updates',
    items: [
      { label: 'Notices', desc: 'Announcements and circulars', icon: FileText, target: '/notices' },
    ],
  },
];

function UtilityDrawer({ open, onClose, onNavigate }: { open: boolean; onClose: () => void; onNavigate: (to: string) => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    closeBtnRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, handleKey]);

  const go = (target: string) => {
    if (target) onNavigate(target);
    onClose();
  };

  return (
    <div className={`${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="GMHSS Ramban menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col gradient-dark-deep text-white shadow-lift transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header — ONLY "GMHSS Ramban" */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <p className="text-lg font-bold tracking-tight text-white">GMHSS Ramban</p>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-200 transition hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
          {DRAWER_SECTIONS.map((section, si) => (
            <div key={si} className="mb-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-400">{section.heading}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => go(item.target)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-200 group-hover:text-white">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-tight text-white">{item.label}</span>
                      <span className="block truncate text-[11px] leading-tight text-brand-400">{item.desc}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 self-center text-brand-400" />
                  </button>
                ))}
              </div>
              {si < DRAWER_SECTIONS.length - 1 && <div className="my-3 border-t border-white/5" />}
            </div>
          ))}

          {/* Staff Login — discreet */}
          <div className="mt-2">
            <button
              onClick={() => go('/admin')}
              className="group flex w-full items-center gap-3 rounded-xl bg-white/5 px-3 py-3 text-left ring-1 ring-inset ring-white/10 transition hover:bg-white/10"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-accent text-white">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-white">Staff Login</span>
              <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-brand-400" />
            </button>
          </div>
        </div>

        {/* Bottom — only developer credit */}
        <div className="border-t border-white/10 px-5 py-3 text-center">
          <p className="text-[11px] leading-tight text-brand-400">
            Website designed &amp; developed with{' '}
            <span className="text-red-400">&hearts;</span>
            <br />
            by a proud alumnus,{' '}
            <span className="font-semibold text-brand-200">TheRoxYogi</span>
            {' '}(<span className="font-medium text-brand-300">Batch 2023</span>)
            <br />
            <a href="mailto:hiamit.in@gmail.com" className="text-brand-400 transition-colors hover:text-brand-200">hiamit.in@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================ Social Icons ============================ */

const SOCIAL_ICON_MAP: Record<string, typeof Instagram> = {
  Instagram,
  Facebook,
  Youtube,
  X: Globe,
  Linkedin,
  Custom: Globe,
};

function SocialIcons() {
  const { data } = useAsync(getPublishedSocialLinks, []);
  if (!data || data.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      {data.map((link: SocialLink) => {
        const Icon = SOCIAL_ICON_MAP[link.platform] || Globe;
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label || link.platform}
            className="inline-flex h-5 w-5 items-center justify-center text-brand-300 transition-colors duration-200 hover:text-white"
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        );
      })}
    </div>
  );
}
