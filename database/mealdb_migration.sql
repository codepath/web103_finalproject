BEGIN;

ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS mealdb_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS recipes_mealdb_id_key
ON recipes (mealdb_id);

COMMIT;