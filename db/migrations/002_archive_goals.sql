ALTER TABLE goals
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_by text,
  ADD COLUMN IF NOT EXISTS unarchived_at timestamptz,
  ADD COLUMN IF NOT EXISTS unarchived_by text;

ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_slug_key;

CREATE UNIQUE INDEX IF NOT EXISTS goals_slug_active_unique
  ON goals (slug)
  WHERE is_archived = false;
