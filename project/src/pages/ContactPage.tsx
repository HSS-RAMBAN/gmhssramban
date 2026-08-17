import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, ExternalLink, ChevronRight } from 'lucide-react';
import { getSchoolSettings, submitContactMessage } from '@/lib/queries';
import { useAsync } from '@/lib/useAsync';
import { useToast } from '@/components/Toast';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';

const HERO_IMAGE = '/images/hero/747790180_1695912488193881_6220268956494401084_n.jpg';

export function ContactPage() {
  const q = useAsync(getSchoolSettings, []);
  const { notify } = useToast();
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) { notify('Please complete the required fields.', 'error'); return; }
    setBusy(true);
    try {
      await submitContactMessage(form);
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      notify('We could not send your message right now. Please try again.', 'error');
    } finally {
      setBusy(false);
    }
  }

  const s = q.data;

  return (
    <div className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-overlay-soft" />
        </div>
        <div className="relative flex min-h-[50vh] items-end pb-14">
          <div className="container-page">
            <Reveal>
              <p className="section-eyebrow text-brand-200">Contact</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl text-balance">
                Connect with the school
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-brand-100">
                For verified information about the school, send a message using the form below.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* School Information */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="School information" title="We are here to help" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Reveal>
              <div className="card card-hover h-full p-7 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><MapPin className="h-7 w-7" /></span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">Address</p>
                <p className="mt-2 text-sm text-ink-700">{s?.address || 'Ramban, Jammu & Kashmir, India'}</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card card-hover h-full p-7 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Phone className="h-7 w-7" /></span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">Phone</p>
                <p className="mt-2 text-sm text-ink-700">{s?.phone || 'To be confirmed'}</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="card card-hover h-full p-7 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Mail className="h-7 w-7" /></span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">Email</p>
                <p className="mt-2 text-sm text-ink-700">{s?.email || 'To be confirmed'}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Location / Google Maps */}
      <section className="bg-ink-50 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeader eyebrow="Location" title="Find us in Ramban" description="Govt. Model Higher Secondary School, Ramban, Jammu & Kashmir." align="center" />
          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <Reveal className="lg:col-span-5">
              <div className="card h-full p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><MapPin className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-semibold">School location</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{s?.address || 'Ramban, Jammu & Kashmir, India'}</p>
                <p className="mt-2 text-xs text-ink-400">Exact address and map coordinates will be confirmed by the school.</p>
                {s?.map_url ? (
                  <a href={s.map_url} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full sm:w-auto">
                    <ExternalLink className="h-4 w-4" /> Open in Google Maps
                  </a>
                ) : (
                  <div className="mt-6 rounded-xl border border-dashed border-ink-200 bg-ink-50 p-4 text-sm text-ink-400">
                    The Google Maps link will be added by the school administrator from the content manager.
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal className="lg:col-span-7" delay={120}>
              <div className="card h-full overflow-hidden">
                {s?.map_url ? (
                  <iframe title="School location map" src={s.map_url} className="h-full min-h-[300px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                ) : (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-ink-100 p-8 text-center">
                    <MapPin className="h-10 w-10 text-brand-400" />
                    <p className="mt-4 text-sm font-medium text-ink-500">Map will appear here once the official location is confirmed.</p>
                    <p className="mt-1 text-xs text-ink-400">The school administrator can add the Google Maps link from the content manager.</p>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="section-eyebrow">Send a message</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Contact the school</h2>
            <p className="mt-4 text-ink-500">Use the form to send a message directly to the school administration. Your message will be reviewed and responded to if needed.</p>
            <div className="mt-8 space-y-4">
              <ContactItem icon={MapPin} label="Address" value={s?.address || 'Ramban, Jammu & Kashmir, India'} />
              <ContactItem icon={Phone} label="Phone" value={s?.phone || 'To be confirmed'} />
              <ContactItem icon={Mail} label="Email" value={s?.email || 'To be confirmed'} />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <div className="card p-6 sm:p-8">
              {sent ? (
                <div className="rounded-xl bg-moss-50 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-moss-600" />
                  <h3 className="mt-4 text-xl font-semibold text-moss-900">Message sent</h3>
                  <p className="mt-2 text-sm text-moss-700">Thank you. The school will review your message.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary mt-6">Send another message <ChevronRight className="h-4 w-4" /></button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" required value={form.name} onChange={update('name')} />
                    <Field label="Email" type="email" required value={form.email} onChange={update('email')} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone (optional)" value={form.phone} onChange={update('phone')} />
                    <Field label="Subject" required value={form.subject} onChange={update('subject')} />
                  </div>
                  <label className="block">
                    <span className="label">Message <span className="text-red-500">*</span></span>
                    <textarea required rows={5} value={form.message} onChange={update('message')} className="input resize-y" placeholder="How can we help?" />
                  </label>
                  <button disabled={busy} className="btn-primary w-full sm:w-auto">
                    <Send className="h-4 w-4" />{busy ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({ label, required, type = 'text', value, onChange }: { label: string; required?: boolean; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block">
      <span className="label">{label} {required && <span className="text-red-500">*</span>}</span>
      <input required={required} type={type} value={value} onChange={onChange} className="input" />
    </label>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
        <p className="mt-1 text-sm text-ink-700">{value}</p>
      </div>
    </div>
  );
}
