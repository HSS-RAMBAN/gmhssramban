import { supabase } from './supabase';
import type {
  SchoolSettings,
  Notice,
  Activity,
  GalleryItem,
  DocumentItem,
  ContactSubmission,
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
    .order('featured', { ascending: false })
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
