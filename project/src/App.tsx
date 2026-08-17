import { useEffect } from 'react';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/Toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useRouter, matchRoute } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { AcademicsPage } from '@/pages/AcademicsPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { NoticesPage } from '@/pages/NoticesPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { ContactPage } from '@/pages/ContactPage';
import { AdminPage } from '@/pages/AdminPage';

const META: Record<string, { title: string; description: string }> = {
  '/': { title: 'Govt. Model Higher Secondary School, Ramban | Official Website', description: 'Govt. Model Higher Secondary School, Ramban, Jammu & Kashmir. Classes 9–12, Science & Arts streams.' },
  '/about': { title: 'About Govt. Model Higher Secondary School, Ramban', description: 'Learn about GMHSS Ramban, its academic levels, and school information.' },
  '/academics': { title: 'Academics | Govt. Model Higher Secondary School, Ramban', description: 'Secondary and higher secondary education at GMHSS Ramban.' },
  '/activities': { title: 'Activities & Achievements | GMHSS Ramban', description: 'School activities and events published by GMHSS Ramban.' },
  '/notices': { title: 'Notices & Announcements | GMHSS Ramban', description: 'Latest published notices from GMHSS Ramban.' },
  '/gallery': { title: 'Gallery | Govt. Model Higher Secondary School, Ramban', description: 'Moments from school life at GMHSS Ramban.' },
  '/contact': { title: 'Contact | Govt. Model Higher Secondary School, Ramban', description: 'Contact information and message form for GMHSS Ramban.' },
};

function AppContent() {
  const { route, navigate } = useRouter();
  const isAdmin = route.path === '/admin';
  useEffect(() => {
    const meta = META[route.path] ?? META['/'];
    document.title = meta.title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', meta.description);
  }, [route.path]);

  if (isAdmin) return <AdminPage onNavigate={navigate} />;
  const page = route.path === '/' ? <HomePage onNavigate={navigate} />
    : route.path === '/about' ? <AboutPage onNavigate={navigate} />
    : route.path === '/academics' ? <AcademicsPage onNavigate={navigate} />
    : route.path === '/activities' || matchRoute(route.path, '/activities/:slug') ? <ActivitiesPage onNavigate={navigate} />
    : route.path === '/notices' ? <NoticesPage onNavigate={navigate} />
    : route.path === '/gallery' ? <GalleryPage />
    : route.path === '/contact' ? <ContactPage />
    : <HomePage onNavigate={navigate} />;
  return <><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-brand-800">Skip to content</a><Header currentPath={route.path} onNavigate={navigate}/><main id="main-content">{page}</main><Footer onNavigate={navigate}/></>;
}

export default function App() { return <AuthProvider><ToastProvider><AppContent/></ToastProvider></AuthProvider>; }
