import { supabase } from './supabase';
import type {
  SchoolSettings,
  Notice,
  Activity,
  GalleryItem,
  DocumentItem,
  ContactSubmission,
  ResultLink,
  BoardResource,
  UsefulLink,
  StaffMember,
  InfrastructureItem,
  SchoolQuote,
  SocialLink,
  AdmissionsContent,
} from './types';

export async function getSchoolSettings(): Promise<SchoolSettings | null> {
  const { data, error } = await supabase
    .from('school_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as SchoolSettings | null;
}

export async function getPublishedNotices(limit?: number): Promise<Notice[]> {
  let query = supabase
    .from('notices')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('publication_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Notice[];
}

export async function getPublishedActivities(limit?: number): Promise<Activity[]> {
  let query = supabase
    .from('activities')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('event_date', { ascending: false }, { nullsFirst: false })
    .order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function getPublishedGallery(limit?: number): Promise<GalleryItem[]> {
  let query = supabase
    .from('gallery')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('event_date', { ascending: false }, { nullsFirst: false })
    .order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as GalleryItem[];
}

export async function getPublishedDocuments(limit?: number): Promise<DocumentItem[]> {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DocumentItem[];
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from('contact_submissions').insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    subject: input.subject.trim(),
    message: input.message.trim(),
  });
  if (error) throw error;
}

export function resolveImagePath(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return path;
  const { data } = supabase.storage.from('school-images').getPublicUrl(path);
  return data.publicUrl;
}

export function resolveDocumentPath(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return path;
  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return data.publicUrl;
}

export function resolvePrincipalPhotoPath(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return path;
  const { data } = supabase.storage.from('principal-assets').getPublicUrl(path);
  return data.publicUrl;
}

export type { ContactSubmission };

export async function getPublishedResults(): Promise<ResultLink[]> {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ResultLink[];
}

export async function getPublishedBoardResources(): Promise<BoardResource[]> {
  const { data, error } = await supabase
    .from('board_resources')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BoardResource[];
}

export async function getPublishedUsefulLinks(): Promise<UsefulLink[]> {
  const { data, error } = await supabase
    .from('useful_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as UsefulLink[];
}

export async function getPublishedStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff_directory')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as StaffMember[];
}

export async function getPublishedInfrastructure(): Promise<InfrastructureItem[]> {
  const { data, error } = await supabase
    .from('infrastructure')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as InfrastructureItem[];
}

export async function getFeaturedQuote(): Promise<SchoolQuote | null> {
  const { data, error } = await supabase
    .from('school_quotes')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as SchoolQuote | null;
}

export async function getPublishedQuotes(): Promise<SchoolQuote[]> {
  const { data, error } = await supabase
    .from('school_quotes')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SchoolQuote[];
}

export async function getPublishedSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SocialLink[];
}

export async function getAdmissionsContent(): Promise<AdmissionsContent | null> {
  const { data, error } = await supabase
    .from('admissions_content')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as AdmissionsContent | null;
}

export async function getVisitCount(): Promise<number> {
  const { data, error } = await supabase
    .from('visit_counter')
    .select('count')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.count ?? 0;
}

export async function incrementVisit(): Promise<number> {
  const { data, error } = await supabase.rpc('increment_visit');
  if (error) throw error;
  return data ?? 0;
}
