export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type NavigateFn = (to: string) => void;

export interface SchoolSettings {
  id: string;
  school_name: string;
  short_name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  principal_name: string;
  principal_message: string | null;
  principal_photo_path: string | null;
  logo_path: string | null;
  school_description: string | null;
  map_url: string | null;
  latitude: number | null;
  longitude: number | null;
  hero_title: string;
  hero_subtitle: string;
  hero_image_path: string;
  about_summary: string | null;
  updated_at: string;
}

export interface Notice {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  publication_date: string;
  attachment_path: string | null;
  featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  category: string;
  cover_image_path: string | null;
  gallery_images: string[];
  featured: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string | null;
  image_path: string;
  category: string;
  alt_text: string;
  featured: boolean;
  status: ContentStatus;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  published: boolean;
  featured: boolean;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  role: 'admin' | 'editor' | 'administrator';
  created_at: string;
}

export const NOTICE_CATEGORIES = [
  'General',
  'Admission',
  'Examination',
  'Academic',
  'Holiday',
  'Event',
  'Circular',
  'Other',
] as const;

export const ACTIVITY_CATEGORIES = [
  'Activity',
  'Event',
  'Achievement',
  'Workshop',
  'Awareness',
  'Competition',
  'Cultural',
  'Sports',
  'Educational',
] as const;

export const GALLERY_CATEGORIES = [
  'School Life',
  'Events',
  'Sports',
  'Academics',
  'Campus',
  'Achievements',
] as const;

export const DOCUMENT_CATEGORIES = [
  'Notices',
  'Forms',
  'Circulars',
  'Academic Documents',
  'General',
] as const;
