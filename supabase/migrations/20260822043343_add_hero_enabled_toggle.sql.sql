/*
# Add hero image visibility toggle to school_settings

1. Modified Tables
- `school_settings`
  - Adds `hero_enabled` boolean column (defaults to TRUE).
  - When TRUE the hero image/slideshow displays normally.
  - When FALSE the hero area shows a solid violet background instead of the image.

2. Security
- No RLS policy changes. The table's existing policies already cover the new column.
*/

ALTER TABLE school_settings
  ADD COLUMN IF NOT EXISTS hero_enabled boolean NOT NULL DEFAULT true;
