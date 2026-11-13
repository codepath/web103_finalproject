-- Local PrepWise test database only. Preserves existing image URLs.
BEGIN;
DO $$ BEGIN
  IF current_database() <> 'prepwise_test' THEN
    RAISE EXCEPTION 'Not the local prepwise_test database';
  END IF;
END $$;
UPDATE recipes AS r
SET image_url = v.image_url
FROM (VALUES
  ('Avocado Toast', '/images/recipes/avocado-toast.png'),
  ('Banana Oatmeal', '/images/recipes/banana-oatmeal.png'),
  ('Bean & Cheese Quesadilla', '/images/recipes/bean-cheese-quesadilla.png'),
  ('Chicken Rice Bowl', '/images/recipes/chicken-rice-bowl.png'),
  ('Chicken Spinach Salad', '/images/recipes/chicken-spinach-salad.png'),
  ('Garlic Broccoli Rice', '/images/recipes/garlic-broccoli-rice.png'),
  ('Lemon Garlic Salmon', '/images/recipes/lemon-garlic-salmon.png'),
  ('Scrambled Eggs', '/images/recipes/scrambled-eggs.png'),
  ('Spinach Omelette', '/images/recipes/spinach-omelette.png'),
  ('Tofu Stir Fry', '/images/recipes/tofu-stir-fry.png'),
  ('Tomato Garlic Pasta', '/images/recipes/tomato-garlic-pasta.png')
) AS v(title, image_url)
WHERE r.title = v.title
  AND (r.image_url IS NULL OR r.image_url = '');
COMMIT;
