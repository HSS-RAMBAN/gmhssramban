import { useEffect, useState } from 'react';
import {
  BarChart3, Bell, BookOpen, FileImage, FileText, Inbox, LogOut, Menu, Plus,
  Settings, ShieldCheck, Trash2, X, Pencil, CheckCircle2, Mail, MailOpen,
  Archive, Upload, Image as ImageIcon, FileUp, Star,
  Award, Link2, Users, Building2, ChevronDown, ChevronUp,
  Share2, GraduationCap, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase';
import {
  NOTICE_CATEGORIES, ACTIVITY_CATEGORIES, GALLERY_CATEGORIES, DOCUMENT_CATEGORIES,
  RESULT_CATEGORIES, BOARD_RESOURCE_TYPES, CLASS_LEVELS, LINK_CATEGORIES,
  SOCIAL_PLATFORMS,
  type Notice, type Activity, type GalleryItem, type DocumentItem,
  type ContactSubmission, type SchoolSettings, type ContentStatus, type NavigateFn,
  type ResultLink, type BoardResource, type BoardResourceType,
  type UsefulLink, type StaffMember, type InfrastructureItem,
  type SocialLink, type AdmissionsContent,
} from '@/lib/types';
import { formatDate, formatFileSize, slugify } from '@/lib/format';
import { useToast } from '@/components/Toast';
import { EmptyState, LoadingSkeleton } from '@/components/States';

export function AdminPage({ onNavigate }: { onNavigate: NavigateFn }) {
  const auth = useAuth();
  if (auth.loading) return <div className="flex min-h-screen items-center justify-center bg-ink-50"><LoadingSkeleton className="h-12 w-48" /></div>;
  return auth.isStaff ? <AdminShell onNavigate={onNavigate} /> : <LoginScreen />;
}

function LoginScreen() {
  const { signIn } = useAuth();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    if (error) notify(error, 'error');
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
      <div className="w-full max-w-md">
        <button onClick={() => { window.history.pushState(null, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="mx-auto flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl gradient-accent text-white"><ShieldCheck className="h-6 w-6" /></span>
          <span className="text-left">
            <span className="block font-semibold text-ink-900">GMHSS Ramban</span>
          </span>
        </button>
        <div className="card mt-8 p-7 sm:p-8">
          <p className="section-eyebrow">STAFF LOGIN</p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in to manage the site</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Use your school administrator account to manage published content.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="label">Email</span>
              <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="label">Password</span>
              <input className="input" type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <button disabled={busy} className="btn-primary w-full">{busy ? 'Please wait…' : 'Sign In'}</button>
          </form>
          <button onClick={() => { window.history.pushState(null, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="btn-ghost mt-2 w-full">Return to public website</button>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  ['Dashboard', BarChart3],
  ['Notices', Bell],
  ['Activities', BookOpen],
  ['Gallery', FileImage],
  ['Documents & Links', FileText],
  ['Exam Resources', Award],
  ['Admissions', GraduationCap],
  ['School Profile', Users],
  ['Messages', Inbox],
  ['School Information', Settings],
] as const;

function AdminShell({ onNavigate }: { onNavigate: NavigateFn }) {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<string>('Dashboard');
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 gradient-dark-deep text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="font-semibold">GMHSS Ramban</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1 p-3">
          {NAV_ITEMS.map(([label, Icon]) => (
            <button key={label} onClick={() => { setTab(label); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${tab === label ? 'gradient-accent text-white shadow-soft' : 'text-brand-200 hover:bg-white/10 hover:text-white'}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink-100 bg-white/90 px-5 backdrop-blur-md sm:px-8">
          <button onClick={() => setOpen(true)} className="lg:hidden" aria-label="Open admin menu"><Menu className="h-5 w-5" /></button>
          <div className="ml-auto flex items-center gap-3">
            <span className="chip bg-moss-50 text-moss-700"><span className="h-1.5 w-1.5 rounded-full bg-moss-500" />Signed in</span>
            <button onClick={() => onNavigate('/')} className="btn-secondary hidden sm:inline-flex">View Website</button>
            <button onClick={() => void signOut()} className="btn-ghost h-9 px-3 text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Sign Out</button>
          </div>
        </header>
        <main className="p-5 sm:p-8">
          {tab === 'Dashboard' && <Dashboard onTab={setTab} />}
          {tab === 'Notices' && <NoticeManager />}
          {tab === 'Activities' && <ActivityManager />}
          {tab === 'Gallery' && <GalleryManager />}
          {tab === 'Documents & Links' && <DocumentsLinksManager />}
          {tab === 'Exam Resources' && <ExamResourcesManager />}
          {tab === 'Admissions' && <AdmissionsManager />}
          {tab === 'School Profile' && <SchoolProfileManager />}
          {tab === 'Messages' && <MessagesManager />}
          {tab === 'School Information' && <SchoolInformationManager />}
        </main>
      </div>
      {open && <div className="fixed inset-0 z-30 bg-ink-950/30 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}

/* ============================ Dashboard ============================ */

function Dashboard({ onTab }: { onTab: (tab: string) => void }) {
  const [counts, setCounts] = useState({ notices: 0, drafts: 0, activities: 0, gallery: 0, documents: 0, messages: 0, results: 0, boardResources: 0, staff: 0, infrastructure: 0 });
  useEffect(() => {
    (async () => {
      const [n, a, g, d, m, r, b, s, i] = await Promise.all([
        supabase.from('notices').select('status'),
        supabase.from('activities').select('id'),
        supabase.from('gallery').select('id'),
        supabase.from('documents').select('id'),
        supabase.from('contact_submissions').select('id').eq('is_read', false),
        supabase.from('results').select('id').eq('published', true),
        supabase.from('board_resources').select('id').eq('published', true),
        supabase.from('staff_directory').select('id').eq('published', true),
        supabase.from('infrastructure').select('id').eq('published', true),
      ]);
      setCounts({
        notices: n.data?.filter(x => x.status === 'PUBLISHED').length ?? 0,
        drafts: n.data?.filter(x => x.status === 'DRAFT').length ?? 0,
        activities: a.data?.length ?? 0,
        gallery: g.data?.length ?? 0,
        documents: d.data?.length ?? 0,
        messages: m.data?.length ?? 0,
        results: r.data?.length ?? 0,
        boardResources: b.data?.length ?? 0,
        staff: s.data?.length ?? 0,
        infrastructure: i.data?.length ?? 0,
      });
    })();
  }, []);

  const cards: [string, number, typeof Bell, string | null][] = [
    ['Published Notices', counts.notices, Bell, 'Notices'],
    ['Draft Notices', counts.drafts, FileText, 'Notices'],
    ['Activities', counts.activities, BookOpen, 'Activities'],
    ['Gallery Photos', counts.gallery, FileImage, 'Gallery'],
    ['Documents', counts.documents, FileText, 'Documents & Links'],
    ['Unread Messages', counts.messages, Inbox, 'Messages'],
    ['Published Results', counts.results, Award, 'Exam Resources'],
    ['Board Resources', counts.boardResources, FileText, 'Exam Resources'],
    ['Staff Members', counts.staff, Users, 'School Profile'],
    ['Facilities', counts.infrastructure, Building2, 'School Profile'],
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-eyebrow">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-ink-500">Manage what visitors see on the school website.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, Icon, tab]) => (
          <button key={label} onClick={tab ? () => onTab(tab) : undefined} className={`card p-5 text-left transition ${tab ? 'card-hover cursor-pointer' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand-soft text-brand-700 ring-1 ring-brand-100"><Icon className="h-5 w-5" /></span>
              <span className="text-3xl font-semibold text-ink-900">{value}</span>
            </div>
            <p className="mt-4 text-sm text-ink-500">{label}</p>
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => onTab('Notices')} className="btn-primary"><Plus className="h-4 w-4" />Add Notice</button>
        <button onClick={() => onTab('Activities')} className="btn-secondary"><Plus className="h-4 w-4" />Add Activity</button>
        <button onClick={() => onTab('Gallery')} className="btn-secondary"><Plus className="h-4 w-4" />Upload Photo</button>
        <button onClick={() => onTab('Documents & Links')} className="btn-secondary"><Plus className="h-4 w-4" />Upload Document</button>
      </div>
      <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-white p-6">
        <p className="font-semibold text-ink-800">Publishing workflow</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">Create a notice, save it as a draft while preparing it, then publish it when the school has confirmed the information. Published content appears on the public website automatically — no code editing or redeployment needed.</p>
      </div>
    </div>
  );
}

/* ============================ Shared ============================ */

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-ink-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-lift sm:p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow">{title}</p>
            {subtitle && <h2 className="mt-2 text-2xl font-semibold">{subtitle}</h2>}
          </div>
          <button onClick={onClose} className="btn-ghost h-10 w-10 p-0"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: ContentStatus }) {
  const cls = status === 'PUBLISHED' ? 'bg-moss-50 text-moss-700' : status === 'DRAFT' ? 'bg-saffron-50 text-saffron-700' : 'bg-ink-100 text-ink-500';
  return <span className={`chip ${cls}`}>{status}</span>;
}

/* ============================ Notices ============================ */

function NoticeManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<Notice[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as Notice[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this notice permanently?')) return;
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Notice deleted'); void load(); }
  }

  async function changeStatus(item: Notice, status: ContentStatus) {
    const { error } = await supabase.from('notices').update({ status, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(status === 'PUBLISHED' ? 'Notice published' : 'Notice updated'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Notices" description="Write, review, and publish school announcements."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add notice</button>} />
      {showForm && <NoticeForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip status={item.status} />
                  <span className="text-xs text-ink-400">{item.category} • {formatDate(item.publication_date)}</span>
                  {item.featured && <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" />}
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.title}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                {item.status === 'PUBLISHED'
                  ? <button onClick={() => void changeStatus(item, 'DRAFT')} className="btn-secondary h-9 px-3">Unpublish</button>
                  : <button onClick={() => void changeStatus(item, 'PUBLISHED')} className="btn-primary h-9 px-3">Publish</button>}
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<Bell className="h-6 w-6" />} title="No notices yet" description="Create a draft notice, then publish it when ready." />}
      </div>
    </div>
  );
}

function NoticeForm({ initial, onClose, onSaved }: { initial: Notice | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? '', summary: initial?.summary ?? '', content: initial?.content ?? '',
    category: initial?.category ?? 'General', publication_date: initial?.publication_date ?? new Date().toISOString().slice(0, 10),
    featured: initial?.featured ?? false,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function save(status: ContentStatus) {
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    setBusy(true);
    const payload = { ...form, status, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('notices').update(payload).eq('id', initial.id) : await supabase.from('notices').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify(status === 'PUBLISHED' ? 'Notice published' : 'Draft saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit notice' : 'New notice'} subtitle="Prepare an announcement" onClose={onClose}>
      <div className="space-y-4">
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={set('category')}>{NOTICE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="label">Publication date</span><input type="date" className="input" value={form.publication_date} onChange={set('publication_date')} /></label>
        </div>
        <label className="block"><span className="label">Short summary</span><textarea className="input resize-y" rows={2} value={form.summary} onChange={set('summary')} /></label>
        <label className="block"><span className="label">Full notice</span><textarea className="input resize-y" rows={6} value={form.content} onChange={set('content')} /></label>
        <label className="flex items-center gap-3 text-sm text-ink-700"><input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />Mark as important</label>
      </div>
      <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save('DRAFT')} disabled={busy} className="btn-secondary">Save draft</button>
        <button onClick={() => void save('PUBLISHED')} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />Publish notice</button>
      </div>
    </Modal>
  );
}

/* ============================ Activities ============================ */

function ActivityManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<Activity[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as Activity[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this activity permanently?')) return;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Activity deleted'); void load(); }
  }

  async function changeStatus(item: Activity, status: ContentStatus) {
    const { error } = await supabase.from('activities').update({ status, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(status === 'PUBLISHED' ? 'Activity published' : 'Activity updated'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Activities" description="Manage school events, achievements, and programmes."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add activity</button>} />
      {showForm && <ActivityForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip status={item.status} />
                  <span className="text-xs text-ink-400">{item.category} • {item.event_date ? formatDate(item.event_date) : 'No date'}</span>
                  {item.featured && <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" />}
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.title}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                {item.status === 'PUBLISHED'
                  ? <button onClick={() => void changeStatus(item, 'DRAFT')} className="btn-secondary h-9 px-3">Unpublish</button>
                  : <button onClick={() => void changeStatus(item, 'PUBLISHED')} className="btn-primary h-9 px-3">Publish</button>}
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<BookOpen className="h-6 w-6" />} title="No activities yet" description="Add an activity, then publish it when ready." />}
      </div>
    </div>
  );
}

function ActivityForm({ initial, onClose, onSaved }: { initial: Activity | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? '', description: initial?.description ?? '',
    category: initial?.category ?? 'Activity', event_date: initial?.event_date ?? '',
    featured: initial?.featured ?? false,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function save(status: ContentStatus) {
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    setBusy(true);
    const payload = { ...form, slug: slugify(form.title) + '-' + Date.now().toString(36), event_date: form.event_date || null, status, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('activities').update(payload).eq('id', initial.id) : await supabase.from('activities').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify(status === 'PUBLISHED' ? 'Activity published' : 'Draft saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit activity' : 'New activity'} subtitle="School event or programme" onClose={onClose}>
      <div className="space-y-4">
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={set('category')}>{ACTIVITY_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="label">Event date</span><input type="date" className="input" value={form.event_date} onChange={set('event_date')} /></label>
        </div>
        <label className="block"><span className="label">Description</span><textarea className="input resize-y" rows={5} value={form.description} onChange={set('description')} /></label>
        <label className="flex items-center gap-3 text-sm text-ink-700"><input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />Mark as featured</label>
      </div>
      <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save('DRAFT')} disabled={busy} className="btn-secondary">Save draft</button>
        <button onClick={() => void save('PUBLISHED')} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />Publish</button>
      </div>
    </Modal>
  );
}

/* ============================ Gallery ============================ */

function GalleryManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [busy, setBusy] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as GalleryItem[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this photo permanently?')) return;
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Photo deleted'); void load(); }
  }

  async function togglePublish(item: GalleryItem) {
    const newStatus: ContentStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const { error } = await supabase.from('gallery').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(newStatus === 'PUBLISHED' ? 'Photo published' : 'Photo unpublished'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Gallery" description="Upload and manage school photos."
        action={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" />Upload photo</button>} />
      {showForm && <GalleryForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8">
        {busy ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{[1, 2, 3, 4].map(x => <LoadingSkeleton key={x} className="aspect-square" />)}</div>
          : items.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map(item => (
              <div key={item.id} className="card overflow-hidden">
                <div className="relative aspect-square bg-ink-100">
                  <img src={item.image_path.startsWith('http') || item.image_path.startsWith('/') ? item.image_path : supabase.storage.from(STORAGE_BUCKETS.schoolImages).getPublicUrl(item.image_path).data.publicUrl} alt={item.alt_text} className="h-full w-full object-cover" />
                  <div className="absolute left-2 top-2"><StatusChip status={item.status} /></div>
                  {item.featured && <div className="absolute right-2 top-2"><Star className="h-4 w-4 fill-saffron-400 text-saffron-500" /></div>}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-ink-800">{item.title}</p>
                  <p className="text-xs text-ink-400">{item.category}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => void togglePublish(item)} className="btn-secondary flex-1 h-8 px-2 text-xs">{item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                    <button onClick={() => void remove(item.id)} className="btn-ghost h-8 w-8 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          : <EmptyState icon={<FileImage className="h-6 w-6" />} title="No photos yet" description="Upload photos, then publish them to the gallery." />}
      </div>
    </div>
  );
}

function GalleryForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const progress = 0;
  const [preview, setPreview] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', caption: '', category: 'School Life', alt_text: '', featured: false, event_date: '' });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { notify('Please select an image file.', 'error'); return; }
    if (f.size > 5 * 1024 * 1024) { notify('Image must be under 5 MB.', 'error'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!form.alt_text) setForm(prev => ({ ...prev, alt_text: f.name.replace(/\.[^.]+$/, '') }));
  }

  async function save() {
    if (!file) { notify('Select an image to upload.', 'error'); return; }
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    setBusy(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(STORAGE_BUCKETS.schoolImages).upload(path, file, { upsert: false });
    if (upErr) { notify(upErr.message, 'error'); setBusy(false); return; }

    const { error } = await supabase.from('gallery').insert({
      ...form, event_date: form.event_date || null, image_path: path, status: 'PUBLISHED' as ContentStatus,
    });
    if (error) notify(error.message, 'error'); else { notify('Photo uploaded and published'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title="Upload photo" subtitle="Add a photo to the gallery" onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="label">Image file *</span>
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              <Upload className="h-4 w-4" />Choose file
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
            {file && <span className="text-sm text-ink-500">{file.name} ({formatFileSize(file.size)})</span>}
          </div>
        </label>
        {preview && <div className="overflow-hidden rounded-xl"><img src={preview} alt="Preview" className="aspect-video w-full object-cover" /></div>}
        {busy && <div className="h-1.5 overflow-hidden rounded-full bg-ink-100"><div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} /></div>}
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <label className="block"><span className="label">Caption</span><textarea className="input resize-y" rows={2} value={form.caption} onChange={set('caption')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={set('category')}>{GALLERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="label">Alt text (for accessibility)</span><input className="input" value={form.alt_text} onChange={set('alt_text')} /></label>
        </div>
        <label className="block"><span className="label">Event date (optional)</span><input type="date" className="input" value={form.event_date} onChange={set('event_date')} /></label>
        <label className="flex items-center gap-3 text-sm text-ink-700"><input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />Mark as featured</label>
      </div>
      <div className="mt-7 flex justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save()} disabled={busy} className="btn-primary"><ImageIcon className="h-4 w-4" />{busy ? 'Uploading…' : 'Upload & publish'}</button>
      </div>
    </Modal>
  );
}

/* ============================ Documents ============================ */

function DocumentManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [busy, setBusy] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as DocumentItem[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this document permanently?')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Document deleted'); void load(); }
  }

  async function togglePublish(item: DocumentItem) {
    const { error } = await supabase.from('documents').update({ published: !item.published, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.published ? 'Document unpublished' : 'Document published'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Documents" description="Upload and manage downloadable documents."
        action={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" />Upload document</button>} />
      {showForm && <DocumentForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${item.published ? 'bg-moss-50 text-moss-700' : 'bg-saffron-50 text-saffron-700'}`}>{item.published ? 'Published' : 'Draft'}</span>
                  <span className="text-xs text-ink-400">{item.category} • {formatDate(item.created_at)}{item.file_size ? ` • ${formatFileSize(item.file_size)}` : ''}</span>
                  {item.featured && <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" />}
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.title}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => void togglePublish(item)} className={item.published ? 'btn-secondary h-9 px-3' : 'btn-primary h-9 px-3'}>{item.published ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<FileText className="h-6 w-6" />} title="No documents yet" description="Upload a document, then publish it for visitors to download." />}
      </div>
    </div>
  );
}

function DocumentForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', featured: false });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/png', 'image/jpeg'];
    if (!allowed.includes(f.type) && !f.name.match(/\.(pdf|doc|docx|txt|png|jpg|jpeg)$/i)) { notify('Please select a PDF, DOC, DOCX, TXT, or image file.', 'error'); return; }
    if (f.size > 10 * 1024 * 1024) { notify('File must be under 10 MB.', 'error'); return; }
    setFile(f);
    if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') }));
  }

  async function save() {
    if (!file) { notify('Select a file to upload.', 'error'); return; }
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    setBusy(true);
    const ext = file.name.split('.').pop() || 'pdf';
    const path = `documents/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(STORAGE_BUCKETS.documents).upload(path, file, { upsert: false });
    if (upErr) { notify(upErr.message, 'error'); setBusy(false); return; }

    const { error } = await supabase.from('documents').insert({
      ...form, file_path: path, file_type: file.type || ext, file_size: file.size, published: true,
    });
    if (error) notify(error.message, 'error'); else { notify('Document uploaded and published'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title="Upload document" subtitle="Add a downloadable document" onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="label">File *</span>
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              <FileUp className="h-4 w-4" />Choose file
              <input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={onFile} />
            </label>
            {file && <span className="text-sm text-ink-500">{file.name} ({formatFileSize(file.size)})</span>}
          </div>
        </label>
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <label className="block"><span className="label">Description</span><textarea className="input resize-y" rows={2} value={form.description} onChange={set('description')} /></label>
        <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={set('category')}>{DOCUMENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="flex items-center gap-3 text-sm text-ink-700"><input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />Mark as featured</label>
      </div>
      <div className="mt-7 flex justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save()} disabled={busy} className="btn-primary"><FileUp className="h-4 w-4" />{busy ? 'Uploading…' : 'Upload & publish'}</button>
      </div>
    </Modal>
  );
}

/* ============================ Messages ============================ */

function MessagesManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [busy, setBusy] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as ContactSubmission[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function markRead(item: ContactSubmission) {
    const { error } = await supabase.from('contact_submissions').update({ is_read: true, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else void load();
  }

  async function toggleArchive(item: ContactSubmission) {
    const { error } = await supabase.from('contact_submissions').update({ is_archived: !item.is_archived, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.is_archived ? 'Message restored' : 'Message archived'); void load(); }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this message permanently?')) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Message deleted'); setSelected(null); void load(); }
  }

  const visible = items.filter(i => !i.is_archived);

  return (
    <div>
      <PageHeader eyebrow="Inbox" title="Messages" description="Contact form submissions from visitors." />
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : visible.length ? <div className="divide-y divide-ink-100">{visible.map(item => (
            <button key={item.id} onClick={() => { setSelected(item); if (!item.is_read) void markRead(item); }} className="flex w-full items-start gap-4 p-5 text-left hover:bg-ink-50">
              {!item.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm ${item.is_read ? 'font-medium text-ink-700' : 'font-semibold text-ink-900'}`}>{item.subject}</p>
                </div>
                <p className="mt-1 truncate text-xs text-ink-400">{item.name} • {item.email} • {formatDate(item.created_at)}</p>
                <p className="mt-1 truncate text-sm text-ink-500">{item.message}</p>
              </div>
              {item.is_read ? <MailOpen className="h-4 w-4 shrink-0 text-ink-300" /> : <Mail className="h-4 w-4 shrink-0 text-brand-500" />}
            </button>
          ))}</div>
          : <EmptyState icon={<Inbox className="h-6 w-6" />} title="No messages" description="Contact form submissions will appear here." />}
      </div>
      {selected && (
        <Modal title="Message" subtitle={selected.subject} onClose={() => setSelected(null)}>
          <div className="space-y-4">
            <div className="rounded-xl bg-ink-50 p-4 text-sm">
              <p><span className="font-semibold">From:</span> {selected.name}</p>
              <p><span className="font-semibold">Email:</span> {selected.email}</p>
              {selected.phone && <p><span className="font-semibold">Phone:</span> {selected.phone}</p>}
              <p><span className="font-semibold">Date:</span> {formatDate(selected.created_at)}</p>
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-ink-600">{selected.message}</div>
          </div>
          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
            <button onClick={() => void toggleArchive(selected)} className="btn-secondary"><Archive className="h-4 w-4" />Archive</button>
            <button onClick={() => void remove(selected.id)} className="btn-danger"><Trash2 className="h-4 w-4" />Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================ Settings ============================ */

/* ============================ School Information ============================ */

function SchoolInformationManager() {
  const [sub, setSub] = useState('School Details');
  return (
    <div>
      <SubTabs tabs={[['School Details', Settings], ['Social Links', Share2]]} active={sub} onSelect={setSub} />
      {sub === 'School Details' && <SettingsManager />}
      {sub === 'Social Links' && <SocialLinksManager />}
    </div>
  );
}

function SettingsManager() {
  const { notify } = useToast();
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('school_settings').select('*').limit(1).maybeSingle();
      if (error) notify(error.message, 'error'); else setSettings(data as SchoolSettings);
      setBusy(false);
    })();
  }, []);

  const update = (key: keyof SchoolSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings(s => s ? { ...s, [key]: e.target.value } : s);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>('');
  const [heroBusy, setHeroBusy] = useState(false);

  function onHeroFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { notify('Please select an image file.', 'error'); return; }
    if (f.size > 5 * 1024 * 1024) { notify('Image must be under 5 MB.', 'error'); return; }
    setHeroFile(f);
    setHeroPreview(URL.createObjectURL(f));
  }

  async function uploadHeroImage() {
    if (!settings || !heroFile) { notify('Choose an image to upload.', 'error'); return; }
    setHeroBusy(true);
    const ext = heroFile.name.split('.').pop() || 'jpg';
    const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(STORAGE_BUCKETS.schoolImages).upload(path, heroFile, { upsert: false });
    if (upErr) { notify(upErr.message, 'error'); setHeroBusy(false); return; }
    const { error } = await supabase.from('school_settings').update({ hero_image_path: path, updated_at: new Date().toISOString() }).eq('id', settings.id);
    if (error) notify(error.message, 'error'); else { notify('Hero image updated'); setSettings({ ...settings, hero_image_path: path }); setHeroFile(null); setHeroPreview(''); }
    setHeroBusy(false);
  }

  async function toggleHero() {
    if (!settings) return;
    const next = !settings.hero_enabled;
    setSettings({ ...settings, hero_enabled: next });
    const { error } = await supabase.from('school_settings').update({ hero_enabled: next, updated_at: new Date().toISOString() }).eq('id', settings.id);
    if (error) { notify(error.message, 'error'); setSettings({ ...settings, hero_enabled: !next }); }
    else notify(next ? 'Hero image enabled' : 'Hero image hidden');
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from('school_settings').update({
      school_name: settings.school_name, short_name: settings.short_name, address: settings.address,
      phone: settings.phone, email: settings.email, principal_name: settings.principal_name,
      principal_message: settings.principal_message, school_description: settings.school_description,
      map_url: settings.map_url, latitude: settings.latitude ? Number(settings.latitude) : null,
      longitude: settings.longitude ? Number(settings.longitude) : null,
      hero_title: settings.hero_title, hero_subtitle: settings.hero_subtitle, about_summary: settings.about_summary,
      updated_at: new Date().toISOString(),
    }).eq('id', settings.id);
    if (error) notify(error.message, 'error'); else notify('School information saved');
    setSaving(false);
  }

  if (busy) return <div className="space-y-4">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-20" />)}</div>;
  if (!settings) return <EmptyState icon={<Settings className="h-6 w-6" />} title="Settings not found" description="School settings could not be loaded." />;

  return (
    <div>
      <PageHeader eyebrow="Configuration" title="School Information" description="Update school details, contact info, and homepage content. Changes appear on the public website immediately."
        action={<button onClick={() => void save()} disabled={saving} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{saving ? 'Saving…' : 'Save changes'}</button>} />
      <div className="mt-8 space-y-8">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">School identity</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="label">School name</span><input className="input" value={settings.school_name} onChange={update('school_name')} /></label>
            <label className="block"><span className="label">Short name</span><input className="input" value={settings.short_name} onChange={update('short_name')} /></label>
          </div>
          <label className="mt-4 block"><span className="label">School description</span><textarea className="input resize-y" rows={3} value={settings.school_description ?? ''} onChange={update('school_description')} /></label>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-semibold">Contact information</h2>
          <p className="mt-1 text-sm text-ink-400">Only enter confirmed details. Leave blank if not yet verified.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="label">Address</span><input className="input" value={settings.address ?? ''} onChange={update('address')} /></label>
            <label className="block"><span className="label">Phone</span><input className="input" value={settings.phone ?? ''} onChange={update('phone')} /></label>
            <label className="block"><span className="label">Email</span><input className="input" value={settings.email ?? ''} onChange={update('email')} /></label>
            <label className="block"><span className="label">Map URL</span><input className="input" value={settings.map_url ?? ''} onChange={update('map_url')} /></label>
            <label className="block"><span className="label">Latitude</span><input type="number" className="input" value={settings.latitude ?? ''} onChange={update('latitude' as keyof SchoolSettings)} /></label>
            <label className="block"><span className="label">Longitude</span><input type="number" className="input" value={settings.longitude ?? ''} onChange={update('longitude' as keyof SchoolSettings)} /></label>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-semibold">Principal</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="label">Principal name</span><input className="input" value={settings.principal_name} onChange={update('principal_name')} /></label>
          </div>
          <label className="mt-4 block"><span className="label">Principal's message</span><textarea className="input resize-y" rows={4} value={settings.principal_message ?? ''} onChange={update('principal_message')} /></label>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-semibold">Homepage content</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="label">Hero title</span><input className="input" value={settings.hero_title} onChange={update('hero_title')} /></label>
            <label className="block"><span className="label">Hero subtitle</span><input className="input" value={settings.hero_subtitle} onChange={update('hero_subtitle')} /></label>
          </div>
          <label className="mt-4 block"><span className="label">About summary</span><textarea className="input resize-y" rows={3} value={settings.about_summary ?? ''} onChange={update('about_summary')} /></label>

          {/* Hero image visibility toggle */}
          <div className="mt-6 flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink-800">Hero image</p>
              <p className="text-xs text-ink-400">Show the hero photo on the homepage. When off, a solid violet background is shown.</p>
            </div>
            <button
              type="button"
              onClick={() => void toggleHero()}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${settings.hero_enabled ? 'bg-brand-700' : 'bg-ink-300'}`}
              aria-pressed={settings.hero_enabled}
              aria-label="Toggle hero image"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.hero_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Hero image upload (visible when hero is enabled) */}
          {settings.hero_enabled && (
            <div className="mt-4 space-y-3">
              <span className="label">Hero image</span>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {(heroPreview || settings.hero_image_path) && (
                  <img src={heroPreview || (settings.hero_image_path.startsWith('http') || settings.hero_image_path.startsWith('/') ? settings.hero_image_path : supabase.storage.from(STORAGE_BUCKETS.schoolImages).getPublicUrl(settings.hero_image_path).data.publicUrl)} alt="Hero preview" className="h-16 w-28 rounded-lg object-cover" />
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="btn-secondary cursor-pointer">
                    <Upload className="h-4 w-4" />Choose image
                    <input type="file" accept="image/*" className="hidden" onChange={onHeroFile} />
                  </label>
                  {heroFile && <span className="text-sm text-ink-500">{heroFile.name}</span>}
                  {heroFile && (
                    <button onClick={() => void uploadHeroImage()} disabled={heroBusy} className="btn-primary">
                      <ImageIcon className="h-4 w-4" />{heroBusy ? 'Uploading…' : 'Upload'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button onClick={() => void save()} disabled={saving} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{saving ? 'Saving…' : 'Save all changes'}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ Results ============================ */

function ResultsManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<ResultLink[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<ResultLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('results').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as ResultLink[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this result link permanently?')) return;
    const { error } = await supabase.from('results').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Result deleted'); void load(); }
  }

  async function togglePublish(item: ResultLink) {
    const { error } = await supabase.from('results').update({ published: !item.published, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.published ? 'Result unpublished' : 'Result published'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Results" description="Manage result links for internal exams and board results."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add result</button>} />
      {showForm && <ResultForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${item.published ? 'bg-moss-50 text-moss-700' : 'bg-saffron-50 text-saffron-700'}`}>{item.published ? 'Published' : 'Draft'}</span>
                  <span className="text-xs text-ink-400">{item.category}{item.year ? ` • ${item.year}` : ''}</span>
                  {item.featured && <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-500" />}
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.title}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                <button onClick={() => void togglePublish(item)} className={item.published ? 'btn-secondary h-9 px-3' : 'btn-primary h-9 px-3'}>{item.published ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<Award className="h-6 w-6" />} title="No results yet" description="Add result links, then publish them for visitors." />}
      </div>
    </div>
  );
}

function ResultForm({ initial, onClose, onSaved }: { initial: ResultLink | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? '', category: initial?.category ?? 'Internal Examination',
    year: initial?.year ?? '', url: initial?.url ?? '', description: initial?.description ?? '',
    featured: initial?.featured ?? false, sort_order: initial?.sort_order ?? 0,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function save(published: boolean) {
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    if (!form.url.trim()) { notify('Add a URL before saving.', 'error'); return; }
    setBusy(true);
    const payload = { ...form, year: form.year || null, published, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('results').update(payload).eq('id', initial.id) : await supabase.from('results').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify(published ? 'Result published' : 'Draft saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit result' : 'New result'} subtitle="Result link" onClose={onClose}>
      <div className="space-y-4">
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={set('category')}>{RESULT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="label">Year</span><input className="input" placeholder="e.g. 2026" value={form.year} onChange={set('year')} /></label>
        </div>
        <label className="block"><span className="label">URL *</span><input className="input" placeholder="https://…" value={form.url} onChange={set('url')} /></label>
        <label className="block"><span className="label">Description</span><textarea className="input resize-y" rows={2} value={form.description} onChange={set('description')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Sort order</span><input type="number" className="input" value={form.sort_order} onChange={set('sort_order')} /></label>
          <label className="flex items-center gap-3 pt-6 text-sm text-ink-700"><input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />Mark as important</label>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save(false)} disabled={busy} className="btn-secondary">Save draft</button>
        <button onClick={() => void save(true)} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />Publish</button>
      </div>
    </Modal>
  );
}

/* ============================ Board Resources ============================ */

function BoardResourceManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<BoardResource[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<BoardResource | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [openType, setOpenType] = useState<string | null>(null);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('board_resources').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as BoardResource[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this resource permanently?')) return;
    const { error } = await supabase.from('board_resources').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Resource deleted'); void load(); }
  }

  async function togglePublish(item: BoardResource) {
    const { error } = await supabase.from('board_resources').update({ published: !item.published, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.published ? 'Resource unpublished' : 'Resource published'); void load(); }
  }

  const grouped = BOARD_RESOURCE_TYPES.map(t => ({ ...t, items: items.filter(i => i.resource_type === t.value) }));

  return (
    <div>
      <PageHeader eyebrow="Content" title="Board Exam Resources" description="Manage datesheets, syllabus, and previous year question papers."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add resource</button>} />
      {showForm && <BoardResourceForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 space-y-4">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : grouped.map(group => (
            <div key={group.value} className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
              <button onClick={() => setOpenType(openType === group.value ? null : group.value)} className="flex w-full items-center justify-between p-5 text-left">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand-soft text-brand-700 ring-1 ring-brand-100"><FileText className="h-4 w-4" /></span>
                  <div>
                    <p className="font-semibold text-ink-800">{group.label}</p>
                    <p className="text-xs text-ink-400">{group.items.length} item{group.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {openType === group.value ? <ChevronUp className="h-5 w-5 text-ink-400" /> : <ChevronDown className="h-5 w-5 text-ink-400" />}
              </button>
              {openType === group.value && (
                <div className="divide-y divide-ink-100 border-t border-ink-100">
                  {group.items.length ? group.items.map(item => (
                    <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`chip ${item.published ? 'bg-moss-50 text-moss-700' : 'bg-saffron-50 text-saffron-700'}`}>{item.published ? 'Published' : 'Draft'}</span>
                          <span className="text-xs text-ink-400">{[item.academic_year, item.class_level, item.subject].filter(Boolean).join(' • ') || 'No details'}</span>
                        </div>
                        <p className="mt-2 truncate font-semibold text-ink-800">{item.title}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                        <button onClick={() => void togglePublish(item)} className={item.published ? 'btn-secondary h-9 px-3' : 'btn-primary h-9 px-3'}>{item.published ? 'Unpublish' : 'Publish'}</button>
                        <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )) : <div className="p-5 text-sm text-ink-400">No items in this category yet.</div>}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function BoardResourceForm({ initial, onClose, onSaved }: { initial: BoardResource | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? '', resource_type: (initial?.resource_type ?? 'DATESHEET') as BoardResourceType,
    academic_year: initial?.academic_year ?? '', class_level: initial?.class_level ?? '',
    subject: initial?.subject ?? '', external_url: initial?.external_url ?? '',
    description: initial?.description ?? '', sort_order: initial?.sort_order ?? 0,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { notify('File must be under 10 MB.', 'error'); return; }
    setFile(f);
    if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') }));
  }

  async function save(published: boolean) {
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    if (!file && !form.external_url && !initial?.file_path) { notify('Add a file or external URL.', 'error'); return; }
    setBusy(true);
    let filePath = initial?.file_path ?? null;
    if (file) {
      const ext = file.name.split('.').pop() || 'pdf';
      const path = `board-resources/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKETS.documents).upload(path, file, { upsert: false });
      if (upErr) { notify(upErr.message, 'error'); setBusy(false); return; }
      filePath = path;
    }
    const payload = { ...form, academic_year: form.academic_year || null, class_level: form.class_level || null, subject: form.subject || null, external_url: form.external_url || null, file_path: filePath, published, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('board_resources').update(payload).eq('id', initial.id) : await supabase.from('board_resources').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify(published ? 'Resource published' : 'Draft saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit resource' : 'New resource'} subtitle="Board exam resource" onClose={onClose}>
      <div className="space-y-4">
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Type</span><select className="input" value={form.resource_type} onChange={set('resource_type')}>{BOARD_RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
          <label className="block"><span className="label">Academic year</span><input className="input" placeholder="e.g. 2026-27" value={form.academic_year} onChange={set('academic_year')} /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Class level</span><select className="input" value={form.class_level} onChange={set('class_level')}><option value="">—</option>{CLASS_LEVELS.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="label">Subject</span><input className="input" placeholder="e.g. Mathematics" value={form.subject} onChange={set('subject')} /></label>
        </div>
        <label className="block">
          <span className="label">Upload file</span>
          <div className="flex items-center gap-3">
            <label className="btn-secondary cursor-pointer">
              <FileUp className="h-4 w-4" />Choose file
              <input type="file" accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg" className="hidden" onChange={onFile} />
            </label>
            {file && <span className="text-sm text-ink-500">{file.name}</span>}
            {initial?.file_path && !file && <span className="text-xs text-ink-400">Existing file attached</span>}
          </div>
        </label>
        <label className="block"><span className="label">Or external URL</span><input className="input" placeholder="https://…" value={form.external_url} onChange={set('external_url')} /></label>
        <label className="block"><span className="label">Description</span><textarea className="input resize-y" rows={2} value={form.description} onChange={set('description')} /></label>
      </div>
      <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save(false)} disabled={busy} className="btn-secondary">Save draft</button>
        <button onClick={() => void save(true)} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />Publish</button>
      </div>
    </Modal>
  );
}

/* ============================ Useful Links ============================ */

function UsefulLinksManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<UsefulLink[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<UsefulLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('useful_links').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as UsefulLink[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this link permanently?')) return;
    const { error } = await supabase.from('useful_links').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Link deleted'); void load(); }
  }

  async function toggleActive(item: UsefulLink) {
    const { error } = await supabase.from('useful_links').update({ is_active: !item.is_active, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.is_active ? 'Link deactivated' : 'Link activated'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Useful Links" description="Manage curated external links for students and visitors."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add link</button>} />
      {showForm && <UsefulLinkForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${item.is_active ? 'bg-moss-50 text-moss-700' : 'bg-ink-100 text-ink-500'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
                  <span className="text-xs text-ink-400">{item.category}</span>
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.title}</p>
                <p className="truncate text-xs text-ink-400">{item.url}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                <button onClick={() => void toggleActive(item)} className={item.is_active ? 'btn-secondary h-9 px-3' : 'btn-primary h-9 px-3'}>{item.is_active ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<Link2 className="h-6 w-6" />} title="No links yet" description="Add useful external links for visitors." />}
      </div>
    </div>
  );
}

function UsefulLinkForm({ initial, onClose, onSaved }: { initial: UsefulLink | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? '', url: initial?.url ?? '', description: initial?.description ?? '',
    category: initial?.category ?? 'General', sort_order: initial?.sort_order ?? 0,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  async function save() {
    if (!form.title.trim()) { notify('Add a title before saving.', 'error'); return; }
    if (!form.url.trim()) { notify('Add a URL before saving.', 'error'); return; }
    setBusy(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('useful_links').update(payload).eq('id', initial.id) : await supabase.from('useful_links').insert({ ...payload, is_active: true });
    if (result.error) notify(result.error.message, 'error'); else { notify('Link saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit link' : 'New link'} subtitle="Useful external link" onClose={onClose}>
      <div className="space-y-4">
        <label className="block"><span className="label">Title *</span><input className="input" value={form.title} onChange={set('title')} /></label>
        <label className="block"><span className="label">URL *</span><input className="input" placeholder="https://…" value={form.url} onChange={set('url')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Category</span><select className="input" value={form.category} onChange={set('category')}>{LINK_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
          <label className="block"><span className="label">Sort order</span><input type="number" className="input" value={form.sort_order} onChange={set('sort_order')} /></label>
        </div>
        <label className="block"><span className="label">Description</span><textarea className="input resize-y" rows={2} value={form.description} onChange={set('description')} /></label>
      </div>
      <div className="mt-7 flex justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save()} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{busy ? 'Saving…' : 'Save link'}</button>
      </div>
    </Modal>
  );
}

/* ============================ Staff Directory ============================ */

function StaffDirectoryManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<StaffMember[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('staff_directory').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as StaffMember[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this staff member permanently?')) return;
    const { error } = await supabase.from('staff_directory').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Staff member deleted'); void load(); }
  }

  async function togglePublish(item: StaffMember) {
    const { error } = await supabase.from('staff_directory').update({ published: !item.published, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.published ? 'Staff member unpublished' : 'Staff member published'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Staff Directory" description="Manage staff profiles displayed on the About page."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add staff</button>} />
      {showForm && <StaffForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {item.photo_path ? (
                  <img src={item.photo_path.startsWith('http') || item.photo_path.startsWith('/') ? item.photo_path : supabase.storage.from(STORAGE_BUCKETS.schoolImages).getPublicUrl(item.photo_path).data.publicUrl} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Users className="h-5 w-5" /></span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip ${item.published ? 'bg-moss-50 text-moss-700' : 'bg-saffron-50 text-saffron-700'}`}>{item.published ? 'Published' : 'Draft'}</span>
                  </div>
                  <p className="mt-1 truncate font-semibold text-ink-800">{item.name}</p>
                  <p className="truncate text-xs text-ink-400">{item.designation}{item.department ? ` • ${item.department}` : ''}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                <button onClick={() => void togglePublish(item)} className={item.published ? 'btn-secondary h-9 px-3' : 'btn-primary h-9 px-3'}>{item.published ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<Users className="h-6 w-6" />} title="No staff yet" description="Add staff members, then publish them to the directory." />}
      </div>
    </div>
  );
}

function StaffForm({ initial, onClose, onSaved }: { initial: StaffMember | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [form, setForm] = useState({
    name: initial?.name ?? '', designation: initial?.designation ?? 'Teacher',
    department: initial?.department ?? '', bio: initial?.bio ?? '', sort_order: initial?.sort_order ?? 0,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { notify('Please select an image file.', 'error'); return; }
    if (f.size > 5 * 1024 * 1024) { notify('Image must be under 5 MB.', 'error'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save(published: boolean) {
    if (!form.name.trim()) { notify('Add a name before saving.', 'error'); return; }
    setBusy(true);
    let photoPath = initial?.photo_path ?? null;
    if (file) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `staff/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKETS.schoolImages).upload(path, file, { upsert: false });
      if (upErr) { notify(upErr.message, 'error'); setBusy(false); return; }
      photoPath = path;
    }
    const payload = { ...form, department: form.department || null, bio: form.bio || null, photo_path: photoPath, published, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('staff_directory').update(payload).eq('id', initial.id) : await supabase.from('staff_directory').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify(published ? 'Staff member published' : 'Draft saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit staff' : 'New staff'} subtitle="Staff member profile" onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="label">Photo</span>
          <div className="flex items-center gap-4">
            {preview ? <img src={preview} alt="Preview" className="h-16 w-16 rounded-full object-cover" /> : initial?.photo_path ? <img src={initial.photo_path.startsWith('http') || initial.photo_path.startsWith('/') ? initial.photo_path : supabase.storage.from(STORAGE_BUCKETS.schoolImages).getPublicUrl(initial.photo_path).data.publicUrl} alt={initial.name} className="h-16 w-16 rounded-full object-cover" /> : <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Users className="h-6 w-6" /></span>}
            <label className="btn-secondary cursor-pointer">
              <Upload className="h-4 w-4" />Choose photo
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        </label>
        <label className="block"><span className="label">Name *</span><input className="input" value={form.name} onChange={set('name')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Designation</span><input className="input" value={form.designation} onChange={set('designation')} /></label>
          <label className="block"><span className="label">Department</span><input className="input" placeholder="e.g. Science" value={form.department} onChange={set('department')} /></label>
        </div>
        <label className="block"><span className="label">Bio</span><textarea className="input resize-y" rows={3} value={form.bio} onChange={set('bio')} /></label>
        <label className="block"><span className="label">Sort order</span><input type="number" className="input" value={form.sort_order} onChange={set('sort_order')} /></label>
      </div>
      <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save(false)} disabled={busy} className="btn-secondary">Save draft</button>
        <button onClick={() => void save(true)} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />Publish</button>
      </div>
    </Modal>
  );
}

/* ============================ Infrastructure ============================ */

function InfrastructureManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<InfrastructureItem[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<InfrastructureItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('infrastructure').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as InfrastructureItem[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this facility permanently?')) return;
    const { error } = await supabase.from('infrastructure').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Facility deleted'); void load(); }
  }

  async function togglePublish(item: InfrastructureItem) {
    const { error } = await supabase.from('infrastructure').update({ published: !item.published, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.published ? 'Facility unpublished' : 'Facility published'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Infrastructure" description="Manage school facilities displayed on the About page."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add facility</button>} />
      {showForm && <InfrastructureForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${item.published ? 'bg-moss-50 text-moss-700' : 'bg-saffron-50 text-saffron-700'}`}>{item.published ? 'Published' : 'Draft'}</span>
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.name}</p>
                {item.description && <p className="truncate text-xs text-ink-400">{item.description}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                <button onClick={() => void togglePublish(item)} className={item.published ? 'btn-secondary h-9 px-3' : 'btn-primary h-9 px-3'}>{item.published ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<Building2 className="h-6 w-6" />} title="No facilities yet" description="Add school facilities, then publish them." />}
      </div>
    </div>
  );
}

function InfrastructureForm({ initial, onClose, onSaved }: { initial: InfrastructureItem | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [form, setForm] = useState({
    name: initial?.name ?? '', description: initial?.description ?? '', sort_order: initial?.sort_order ?? 0,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { notify('Please select an image file.', 'error'); return; }
    if (f.size > 5 * 1024 * 1024) { notify('Image must be under 5 MB.', 'error'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save(published: boolean) {
    if (!form.name.trim()) { notify('Add a name before saving.', 'error'); return; }
    setBusy(true);
    let imagePath = initial?.image_path ?? null;
    if (file) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `infrastructure/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(STORAGE_BUCKETS.schoolImages).upload(path, file, { upsert: false });
      if (upErr) { notify(upErr.message, 'error'); setBusy(false); return; }
      imagePath = path;
    }
    const payload = { ...form, description: form.description || null, image_path: imagePath, published, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('infrastructure').update(payload).eq('id', initial.id) : await supabase.from('infrastructure').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify(published ? 'Facility published' : 'Draft saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit facility' : 'New facility'} subtitle="School infrastructure" onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="label">Image (optional)</span>
          <div className="flex items-center gap-4">
            {preview ? <img src={preview} alt="Preview" className="h-16 w-16 rounded-xl object-cover" /> : initial?.image_path ? <img src={initial.image_path.startsWith('http') || initial.image_path.startsWith('/') ? initial.image_path : supabase.storage.from(STORAGE_BUCKETS.schoolImages).getPublicUrl(initial.image_path).data.publicUrl} alt={initial.name} className="h-16 w-16 rounded-xl object-cover" /> : <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Building2 className="h-6 w-6" /></span>}
            <label className="btn-secondary cursor-pointer">
              <Upload className="h-4 w-4" />Choose image
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        </label>
        <label className="block"><span className="label">Name *</span><input className="input" value={form.name} onChange={set('name')} /></label>
        <label className="block"><span className="label">Description</span><textarea className="input resize-y" rows={3} value={form.description} onChange={set('description')} /></label>
        <label className="block"><span className="label">Sort order</span><input type="number" className="input" value={form.sort_order} onChange={set('sort_order')} /></label>
      </div>
      <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save(false)} disabled={busy} className="btn-secondary">Save draft</button>
        <button onClick={() => void save(true)} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />Publish</button>
      </div>
    </Modal>
  );
}

/* ============================ Social Links ============================ */

function SocialLinksManager() {
  const { notify } = useToast();
  const [items, setItems] = useState<SocialLink[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setBusy(true);
    const { data, error } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
    if (error) notify(error.message, 'error'); else setItems((data ?? []) as SocialLink[]);
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function remove(id: string) {
    if (!window.confirm('Delete this link permanently?')) return;
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) notify(error.message, 'error'); else { notify('Link deleted'); void load(); }
  }

  async function toggleVisible(item: SocialLink) {
    const { error } = await supabase.from('social_links').update({ is_visible: !item.is_visible, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) notify(error.message, 'error'); else { notify(item.is_visible ? 'Link hidden' : 'Link shown'); void load(); }
  }

  return (
    <div>
      <PageHeader eyebrow="Content" title="Social Links" description="Manage social media icons shown in the site header."
        action={<button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="h-4 w-4" />Add link</button>} />
      {showForm && <SocialLinkForm initial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); void load(); }} />}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
        {busy ? <div className="space-y-3 p-6">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-14" />)}</div>
          : items.length ? <div className="divide-y divide-ink-100">{items.map(item => (
            <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`chip ${item.is_visible ? 'bg-moss-50 text-moss-700' : 'bg-ink-100 text-ink-500'}`}>{item.is_visible ? 'Visible' : 'Hidden'}</span>
                  <span className="text-xs text-ink-400">{item.platform}</span>
                </div>
                <p className="mt-2 truncate font-semibold text-ink-800">{item.label || item.platform}</p>
                <p className="truncate text-xs text-ink-400">{item.url}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => void toggleVisible(item)} className="btn-ghost h-9 px-3">{item.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{item.is_visible ? 'Hide' : 'Show'}</button>
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="btn-ghost h-9 px-3"><Pencil className="h-4 w-4" />Edit</button>
                <button onClick={() => void remove(item.id)} className="btn-ghost h-9 w-9 p-0 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>
          : <EmptyState icon={<Share2 className="h-6 w-6" />} title="No social links yet" description="Add social media links to show icons in the header." />}
      </div>
    </div>
  );
}

function SocialLinkForm({ initial, onClose, onSaved }: { initial: SocialLink | null; onClose: () => void; onSaved: () => void }) {
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    platform: initial?.platform ?? 'Instagram',
    url: initial?.url ?? '',
    label: initial?.label ?? '',
    sort_order: initial?.sort_order ?? 0,
    is_visible: initial?.is_visible ?? true,
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function save() {
    if (!form.url.trim()) { notify('Add a URL before saving.', 'error'); return; }
    setBusy(true);
    const payload = { ...form, label: form.label || null, updated_at: new Date().toISOString() };
    const result = initial ? await supabase.from('social_links').update(payload).eq('id', initial.id) : await supabase.from('social_links').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else { notify('Link saved'); onSaved(); }
    setBusy(false);
  }

  return (
    <Modal title={initial ? 'Edit social link' : 'New social link'} subtitle="Header social icon" onClose={onClose}>
      <div className="space-y-4">
        <label className="block"><span className="label">Platform</span><select className="input" value={form.platform} onChange={set('platform')}>{SOCIAL_PLATFORMS.map(p => <option key={p}>{p}</option>)}</select></label>
        <label className="block"><span className="label">URL *</span><input className="input" placeholder="https://…" value={form.url} onChange={set('url')} /></label>
        <label className="block"><span className="label">Label (optional)</span><input className="input" placeholder="e.g. Follow us on Instagram" value={form.label} onChange={set('label')} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="label">Sort order</span><input type="number" className="input" value={form.sort_order} onChange={set('sort_order')} /></label>
          <label className="flex items-center gap-3 pt-6 text-sm text-ink-700"><input type="checkbox" checked={form.is_visible} onChange={set('is_visible')} className="h-4 w-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500" />Visible</label>
        </div>
      </div>
      <div className="mt-7 flex justify-end gap-3 border-t border-ink-100 pt-5">
        <button onClick={() => void save()} disabled={busy} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{busy ? 'Saving…' : 'Save link'}</button>
      </div>
    </Modal>
  );
}

/* ============================ Admissions Content ============================ */

function AdmissionsManager() {
  const { notify } = useToast();
  const [content, setContent] = useState<AdmissionsContent | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('admissions_content').select('*').limit(1).maybeSingle();
      if (error) notify(error.message, 'error'); else setContent(data as AdmissionsContent);
      setBusy(false);
    })();
  }, []);

  const update = (key: keyof AdmissionsContent) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setContent(c => c ? { ...c, [key]: e.target.value } : c);

  async function save() {
    if (!content) return;
    setSaving(true);
    const payload = {
      intro: content.intro, prospectus_url: content.prospectus_url,
      programs_offered: content.programs_offered, fee_structure: content.fee_structure,
      required_documents: content.required_documents, important_dates: content.important_dates,
      admission_notices: content.admission_notices, downloadable_forms: content.downloadable_forms,
      instructions: content.instructions, updated_at: new Date().toISOString(),
    };
    const result = content.id
      ? await supabase.from('admissions_content').update(payload).eq('id', content.id)
      : await supabase.from('admissions_content').insert(payload);
    if (result.error) notify(result.error.message, 'error'); else notify('Admissions content saved');
    setSaving(false);
  }

  if (busy) return <div className="space-y-4">{[1, 2, 3].map(x => <LoadingSkeleton key={x} className="h-20" />)}</div>;

  const c = content;
  return (
    <div>
      <PageHeader eyebrow="Content" title="Admissions" description="Edit the admissions page content. All fields are optional — empty fields are hidden on the public page."
        action={<button onClick={() => void save()} disabled={saving} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{saving ? 'Saving…' : 'Save changes'}</button>} />
      <div className="mt-8 space-y-6">
        <section className="card p-6">
          <h2 className="text-xl font-semibold">Introduction</h2>
          <label className="mt-4 block"><span className="label">Intro text</span><textarea className="input resize-y" rows={4} value={c?.intro ?? ''} onChange={update('intro')} /></label>
          <label className="mt-4 block"><span className="label">Prospectus URL (optional)</span><input className="input" placeholder="https://…" value={c?.prospectus_url ?? ''} onChange={update('prospectus_url')} /></label>
        </section>
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card p-6"><h2 className="text-xl font-semibold">Programs Offered</h2><label className="mt-4 block"><span className="label">Details</span><textarea className="input resize-y" rows={5} value={c?.programs_offered ?? ''} onChange={update('programs_offered')} /></label></section>
          <section className="card p-6"><h2 className="text-xl font-semibold">Required Documents</h2><label className="mt-4 block"><span className="label">List of documents</span><textarea className="input resize-y" rows={5} value={c?.required_documents ?? ''} onChange={update('required_documents')} /></label></section>
          <section className="card p-6"><h2 className="text-xl font-semibold">Important Dates</h2><label className="mt-4 block"><span className="label">Date information</span><textarea className="input resize-y" rows={5} value={c?.important_dates ?? ''} onChange={update('important_dates')} /></label></section>
          <section className="card p-6"><h2 className="text-xl font-semibold">Fee Structure</h2><label className="mt-4 block"><span className="label">Fee details</span><textarea className="input resize-y" rows={5} value={c?.fee_structure ?? ''} onChange={update('fee_structure')} /></label></section>
        </div>
        <section className="card p-6"><h2 className="text-xl font-semibold">Admission Notices</h2><label className="mt-4 block"><span className="label">Notices text</span><textarea className="input resize-y" rows={4} value={c?.admission_notices ?? ''} onChange={update('admission_notices')} /></label></section>
        <section className="card p-6"><h2 className="text-xl font-semibold">Downloadable Forms</h2><label className="mt-4 block"><span className="label">Forms information / links</span><textarea className="input resize-y" rows={4} value={c?.downloadable_forms ?? ''} onChange={update('downloadable_forms')} /></label></section>
        <section className="card p-6"><h2 className="text-xl font-semibold">Instructions</h2><label className="mt-4 block"><span className="label">Instructions for applicants</span><textarea className="input resize-y" rows={5} value={c?.instructions ?? ''} onChange={update('instructions')} /></label></section>
        <div className="flex justify-end">
          <button onClick={() => void save()} disabled={saving} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{saving ? 'Saving…' : 'Save all changes'}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ Merged Managers ============================ */

function SubTabs({ tabs, active, onSelect }: { tabs: [string, typeof Bell][]; active: string; onSelect: (t: string) => void }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map(([label, Icon]) => (
        <button key={label} onClick={() => onSelect(label)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active === label ? 'gradient-accent text-white shadow-soft' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-brand-50 hover:text-brand-800'}`}>
          <Icon className="h-4 w-4" />{label}
        </button>
      ))}
    </div>
  );
}

function DocumentsLinksManager() {
  const [sub, setSub] = useState('Documents');
  return (
    <div>
      <SubTabs tabs={[['Documents', FileText], ['Useful Links', Link2]]} active={sub} onSelect={setSub} />
      {sub === 'Documents' && <DocumentManager />}
      {sub === 'Useful Links' && <UsefulLinksManager />}
    </div>
  );
}

function ExamResourcesManager() {
  const [sub, setSub] = useState('Results');
  return (
    <div>
      <SubTabs tabs={[['Results', Award], ['Board Resources', FileText]]} active={sub} onSelect={setSub} />
      {sub === 'Results' && <ResultsManager />}
      {sub === 'Board Resources' && <BoardResourceManager />}
    </div>
  );
}

function SchoolProfileManager() {
  const [sub, setSub] = useState('Staff Directory');
  return (
    <div>
      <SubTabs tabs={[['Staff Directory', Users], ['Infrastructure', Building2]]} active={sub} onSelect={setSub} />
      {sub === 'Staff Directory' && <StaffDirectoryManager />}
      {sub === 'Infrastructure' && <InfrastructureManager />}
    </div>
  );
}

