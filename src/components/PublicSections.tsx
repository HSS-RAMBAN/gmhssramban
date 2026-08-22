import {
  Award, FileText, Link2, Users, Building2, ExternalLink, Star, Calendar, Download,
} from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import {
  getPublishedResults, getPublishedBoardResources, getPublishedUsefulLinks,
  getPublishedStaff, getPublishedInfrastructure, resolveImagePath, resolveDocumentPath,
} from '@/lib/queries';
import { supabase, STORAGE_BUCKETS } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';
import { BOARD_RESOURCE_TYPES } from '@/lib/types';

function resolveStaffPhoto(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path;
  return supabase.storage.from(STORAGE_BUCKETS.schoolImages).getPublicUrl(path).data.publicUrl;
}

/* ============================ Results ============================ */

export function PublicResults() {
  const { data, loading, error } = useAsync(getPublishedResults, []);
  if (loading) return <ResultsSkeleton />;
  if (error) return null;
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <Award className="mx-auto h-8 w-8 text-ink-300" />
        <p className="mt-3 text-sm font-medium text-ink-500">Result links will appear here once published by the school.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((r, i) => (
        <Reveal key={r.id} delay={i * 60}>
          <a href={r.url} target="_blank" rel="noreferrer" className="card card-hover flex h-full items-start gap-4 p-5">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${r.featured ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-600'}`}>
              <Award className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-ink-800">{r.title}</p>
                {r.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-saffron-400 text-saffron-500" />}
              </div>
              <p className="mt-1 text-xs text-ink-400">{r.category}{r.year ? ` • ${r.year}` : ''}</p>
              {r.description && <p className="mt-2 text-sm text-ink-500 line-clamp-2">{r.description}</p>}
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-ink-300" />
          </a>
        </Reveal>
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return <div className="grid gap-4 sm:grid-cols-2">{[1, 2].map(x => <div key={x} className="h-20 animate-pulse rounded-2xl bg-ink-100" />)}</div>;
}

/* ============================ Board Resources ============================ */

export function PublicBoardResources() {
  const { data, loading, error } = useAsync(getPublishedBoardResources, []);
  if (loading) return <BoardSkeleton />;
  if (error) return null;
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <FileText className="mx-auto h-8 w-8 text-ink-300" />
        <p className="mt-3 text-sm font-medium text-ink-500">Board exam resources will appear here once published by the school.</p>
      </div>
    );
  }
  const grouped = BOARD_RESOURCE_TYPES.map(t => ({ ...t, items: data.filter(i => i.resource_type === t.value) })).filter(g => g.items.length > 0);
  return (
    <div className="space-y-10">
      {grouped.map((group, gi) => (
        <div key={group.value}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><FileText className="h-5 w-5" /></span>
            <h3 className="text-xl font-semibold text-ink-800">{group.label}</h3>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item, i) => {
              const href = item.external_url || (item.file_path ? resolveDocumentPath(item.file_path) : '');
              if (!href) return null;
              return (
                <Reveal key={item.id} delay={(gi * 3 + i) * 50}>
                  <a href={href} target="_blank" rel="noreferrer" className="card card-hover flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600"><FileText className="h-4 w-4" /></span>
                      {item.file_path && <Download className="h-4 w-4 text-ink-300" />}
                      {item.external_url && !item.file_path && <ExternalLink className="h-4 w-4 text-ink-300" />}
                    </div>
                    <p className="mt-4 truncate font-semibold text-ink-800">{item.title}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-400">
                      {item.academic_year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.academic_year}</span>}
                      {item.class_level && <span>{item.class_level}</span>}
                      {item.subject && <span>{item.subject}</span>}
                    </div>
                    {item.description && <p className="mt-3 text-sm text-ink-500 line-clamp-2">{item.description}</p>}
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BoardSkeleton() {
  return <div className="space-y-6">{[1, 2].map(x => <div key={x} className="h-24 animate-pulse rounded-2xl bg-ink-100" />)}</div>;
}

/* ============================ Useful Links ============================ */

export function PublicUsefulLinks() {
  const { data, loading, error } = useAsync(getPublishedUsefulLinks, []);
  if (loading) return <div className="grid gap-4 sm:grid-cols-2">{[1, 2].map(x => <div key={x} className="h-16 animate-pulse rounded-xl bg-ink-100" />)}</div>;
  if (error) return null;
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <Link2 className="mx-auto h-8 w-8 text-ink-300" />
        <p className="mt-3 text-sm font-medium text-ink-500">Useful links will appear here once added by the school.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((link, i) => (
        <Reveal key={link.id} delay={i * 60}>
          <a href={link.url} target="_blank" rel="noreferrer" className="card card-hover flex h-full items-start gap-4 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Link2 className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-ink-800">{link.title}</p>
                <span className="chip bg-ink-50 text-ink-500">{link.category}</span>
              </div>
              {link.description && <p className="mt-1 text-sm text-ink-500 line-clamp-2">{link.description}</p>}
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-ink-300" />
          </a>
        </Reveal>
      ))}
    </div>
  );
}

/* ============================ Staff Directory ============================ */

export function PublicStaffDirectory() {
  const { data, loading, error } = useAsync(getPublishedStaff, []);
  if (loading) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(x => <div key={x} className="h-48 animate-pulse rounded-2xl bg-ink-100" />)}</div>;
  if (error) return null;
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <Users className="mx-auto h-8 w-8 text-ink-300" />
        <p className="mt-3 text-sm font-medium text-ink-500">Staff profiles will appear here once published by the school.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((member, i) => (
        <Reveal key={member.id} delay={i * 80}>
          <div className="card card-hover h-full p-6 text-center">
            {member.photo_path ? (
              <img src={resolveStaffPhoto(member.photo_path)} alt={member.name} className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-brand-100" loading="lazy" />
            ) : (
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-2 ring-brand-100"><Users className="h-8 w-8" /></span>
            )}
            <h3 className="mt-4 text-lg font-semibold text-ink-800">{member.name}</h3>
            <p className="text-sm font-medium text-brand-700">{member.designation}</p>
            {member.department && <p className="mt-1 text-xs text-ink-400">{member.department}</p>}
            {member.bio && <p className="mt-3 text-sm leading-relaxed text-ink-500 line-clamp-3">{member.bio}</p>}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ============================ Infrastructure ============================ */

export function PublicInfrastructure() {
  const { data, loading, error } = useAsync(getPublishedInfrastructure, []);
  if (loading) return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(x => <div key={x} className="h-40 animate-pulse rounded-2xl bg-ink-100" />)}</div>;
  if (error) return null;
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-8 text-center">
        <Building2 className="mx-auto h-8 w-8 text-ink-300" />
        <p className="mt-3 text-sm font-medium text-ink-500">Facility information will appear here once published by the school.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item, i) => (
        <Reveal key={item.id} delay={i * 80}>
          <div className="card card-hover h-full overflow-hidden">
            {item.image_path && (
              <div className="relative h-40 overflow-hidden">
                <img src={resolveImagePath(item.image_path)} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Building2 className="h-4 w-4" /></span>
                <h3 className="text-lg font-semibold text-ink-800">{item.name}</h3>
              </div>
              {item.description && <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.description}</p>}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
