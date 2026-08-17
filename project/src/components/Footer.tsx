import { ShieldCheck, MapPin, Mail, Phone, Megaphone, FileText, ChevronRight } from 'lucide-react';

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Academics', path: '/academics' },
  { label: 'Activities', path: '/activities' },
  { label: 'Notices', path: '/notices' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
];

export function Footer({
  onNavigate,
  schoolName = 'Govt. Model Higher Secondary School, Ramban',
  address = 'Ramban, Jammu & Kashmir, India',
  phone,
  email,
}: {
  onNavigate: (to: string) => void;
  schoolName?: string;
  address?: string;
  phone?: string | null;
  email?: string | null;
}) {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100">
      {/* Decorative top edge */}
      <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />

      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-inset ring-white/15">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3 L21 7 V12 C21 17 17 20 12 22 C7 20 3 17 3 12 V7 Z" strokeLinejoin="round" />
                  <path d="M8 12 L11 15 L16 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{schoolName}</p>
                <p className="text-xs text-brand-300">Classes 9–12 • Science & Arts</p>
              </div>
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-brand-200">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              {address}
            </p>
            {phone && (
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-200">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                {phone}
              </p>
            )}
            {email && (
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-200">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                {email}
              </p>
            )}
          </div>

          {/* Explore */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">Explore</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {NAV.map((item) => (
                <li key={item.path}>
                  <button onClick={() => onNavigate(item.path)} className="text-sm text-brand-200 transition-colors hover:text-white">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">Quick Links</p>
            <ul className="mt-4 space-y-2">
              <li>
                <button onClick={() => onNavigate('/notices')} className="flex items-center gap-1.5 text-sm text-brand-200 transition-colors hover:text-white">
                  <Megaphone className="h-3.5 w-3.5 text-brand-400" />
                  Latest Notices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/notices')} className="flex items-center gap-1.5 text-sm text-brand-200 transition-colors hover:text-white">
                  <FileText className="h-3.5 w-3.5 text-brand-400" />
                  Documents
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="flex items-center gap-1.5 text-sm text-brand-200 transition-colors hover:text-white">
                  <ChevronRight className="h-3.5 w-3.5 text-brand-400" />
                  Contact School
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="flex items-center gap-1.5 text-sm text-brand-200 transition-colors hover:text-white">
                  <ChevronRight className="h-3.5 w-3.5 text-brand-400" />
                  Staff Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs text-brand-300">
            <ShieldCheck className="h-4 w-4 text-brand-400" />
            Content on this site is managed by the school. Verified details are confirmed before publication.
          </p>
          <p className="text-xs text-brand-300">
            © {new Date().getFullYear()} {schoolName}
          </p>
        </div>
      </div>
    </footer>
  );
}
