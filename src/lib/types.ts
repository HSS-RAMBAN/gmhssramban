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
  hero_enabled: boolean;
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
  event_date: string | null;
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

export interface ResultLink {
  id: string;
  title: string;
  category: string;
  year: string | null;
  url: string;
  description: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const RESULT_CATEGORIES = [
  'Internal Examination',
  'Board Result',
  'Annual Result',
  'Other',
] as const;

export type BoardResourceType = 'DATESHEET' | 'SYLLABUS' | 'QUESTION_PAPER';

export interface BoardResource {
  id: string;
  title: string;
  resource_type: BoardResourceType;
  academic_year: string | null;
  class_level: string | null;
  subject: string | null;
  file_path: string | null;
  external_url: string | null;
  description: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const BOARD_RESOURCE_TYPES: { value: BoardResourceType; label: string }[] = [
  { value: 'DATESHEET', label: 'Datesheet & Timetable' },
  { value: 'SYLLABUS', label: 'Syllabus & Blueprint' },
  { value: 'QUESTION_PAPER', label: 'Previous Year Question Paper' },
];

export const CLASS_LEVELS = ['Class 9', 'Class 10', 'Class 11', 'Class 12'] as const;

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const LINK_CATEGORIES = [
  'General',
  'Academic',
  'Government',
  'Board',
  'Reference',
] as const;

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: string | null;
  bio: string | null;
  photo_path: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface InfrastructureItem {
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolQuote {
  id: string;
  quote: string;
  author: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  image_path: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const SOCIAL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'YouTube',
  'X',
  'LinkedIn',
  'Custom',
] as const;

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string | null;
  icon: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageBackground {
  id: string;
  image_path: string;
  label: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdmissionsContent {
  id: string;
  intro: string | null;
  prospectus_url: string | null;
  programs_offered: string | null;
  fee_structure: string | null;
  required_documents: string | null;
  important_dates: string | null;
  admission_notices: string | null;
  downloadable_forms: string | null;
  instructions: string | null;
  updated_at: string;
}
