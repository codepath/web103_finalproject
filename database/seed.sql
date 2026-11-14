-- PrepWise Sample Data

-- Demo user (id = 1)
INSERT INTO users (name, email)
VALUES ('Demo User', 'demo@prepwise.com');

-- Ingredients (ids in comments; recipe/pantry rows reference these)
INSERT INTO ingredients (name, category)
VALUES
('Chicken Breast', 'Protein'),     -- 1
('Rice', 'Grains'),                -- 2
('Eggs', 'Protein'),               -- 3
('Broccoli', 'Vegetables'),        -- 4
('Olive Oil', 'Oils'),             -- 5
('Garlic', 'Vegetables'),          -- 6
('Onion', 'Vegetables'),           -- 7
('Tomato', 'Vegetables'),          -- 8
('Pasta', 'Grains'),               -- 9
('Spinach', 'Vegetables'),         -- 10
('Oats', 'Grains'),                -- 11
('Milk', 'Dairy'),                 -- 12
('Banana', 'Fruit'),               -- 13
('Black Beans', 'Protein'),        -- 14
('Tortilla', 'Grains'),            -- 15
('Cheddar Cheese', 'Dairy'),       -- 16
('Salmon', 'Protein'),             -- 17
('Lemon', 'Fruit'),                -- 18
('Bread', 'Grains'),               -- 19
('Avocado', 'Fruit'),              -- 20
('Tofu', 'Protein'),               -- 21
('Soy Sauce', 'Condiments');       -- 22

-- Recipes (every recipe has prep_minutes, meal_type and dietary_preference)
INSERT INTO recipes
(title, description, instructions, prep_minutes, cook_minutes, servings, meal_type, dietary_preference)
VALUES
('Chicken Rice Bowl', 'Simple chicken and rice meal',
 'Cook rice, prepare chicken, and combine.', 10, 25, 2, 'Dinner', 'High Protein'),            -- 1
('Scrambled Eggs', 'Quick breakfast',
 'Whisk eggs and cook in a pan with olive oil.', 5, 5, 1, 'Breakfast', 'Vegetarian'),         -- 2
('Garlic Broccoli Rice', 'Easy veggie side or main',
 'Cook rice. Saute garlic and broccoli in olive oil, toss with rice.', 10, 20, 2, 'Lunch', 'Vegan'), -- 3
('Spinach Omelette', 'Fluffy omelette with spinach',
 'Whisk eggs, wilt spinach in olive oil, pour eggs over and fold.', 5, 8, 1, 'Breakfast', 'Vegetarian'), -- 4
('Banana Oatmeal', 'Warm oats with banana',
 'Simmer oats in milk, top with sliced banana.', 2, 8, 1, 'Breakfast', 'Vegetarian'),        -- 5
('Tomato Garlic Pasta', 'Classic simple pasta',
 'Boil pasta. Saute garlic, onion and tomato in olive oil, toss with pasta.', 10, 15, 2, 'Dinner', 'Vegan'), -- 6
('Bean & Cheese Quesadilla', 'Crispy quesadilla',
 'Fill tortilla with black beans and cheddar, cook until crisp.', 5, 10, 1, 'Lunch', 'Vegetarian'), -- 7
('Lemon Garlic Salmon', 'Pan-seared salmon with lemon',
 'Sear salmon in olive oil with garlic, finish with lemon juice.', 10, 15, 2, 'Dinner', 'Pescatarian'), -- 8
('Avocado Toast', 'Toast topped with smashed avocado',
 'Toast bread, smash avocado with lemon, spread on top.', 5, 3, 1, 'Breakfast', 'Vegan'),    -- 9
('Tofu Stir Fry', 'Crispy tofu with broccoli',
 'Fry tofu in olive oil, add broccoli, garlic and soy sauce. Serve over rice.', 15, 15, 2, 'Dinner', 'Vegan'), -- 10
('Chicken Spinach Salad', 'Light protein salad',
 'Grill chicken, slice, serve over spinach with tomato, olive oil and lemon.', 10, 15, 2, 'Lunch', 'Gluten Free'); -- 11

-- Connect recipes with ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES
-- 1 Chicken Rice Bowl
(1, 1, 200, 'g'), (1, 2, 150, 'g'), (1, 5, 1, 'tbsp'),
-- 2 Scrambled Eggs
(2, 3, 2, 'pieces'), (2, 5, 1, 'tsp'),
-- 3 Garlic Broccoli Rice
(3, 2, 150, 'g'), (3, 4, 1, 'cup'), (3, 6, 2, 'cloves'), (3, 5, 1, 'tbsp'),
-- 4 Spinach Omelette
(4, 3, 3, 'pieces'), (4, 10, 1, 'cup'), (4, 5, 1, 'tsp'),
-- 5 Banana Oatmeal
(5, 11, 50, 'g'), (5, 12, 1, 'cup'), (5, 13, 1, 'pieces'),
-- 6 Tomato Garlic Pasta
(6, 9, 200, 'g'), (6, 8, 2, 'pieces'), (6, 6, 3, 'cloves'), (6, 7, 1, 'pieces'), (6, 5, 2, 'tbsp'),
-- 7 Bean & Cheese Quesadilla
(7, 15, 2, 'pieces'), (7, 14, 0.5, 'cup'), (7, 16, 50, 'g'),
-- 8 Lemon Garlic Salmon
(8, 17, 300, 'g'), (8, 18, 1, 'pieces'), (8, 6, 2, 'cloves'), (8, 5, 1, 'tbsp'),
-- 9 Avocado Toast
(9, 19, 2, 'slices'), (9, 20, 1, 'pieces'), (9, 18, 0.5, 'pieces'),
-- 10 Tofu Stir Fry
(10, 21, 200, 'g'), (10, 4, 1, 'cup'), (10, 6, 2, 'cloves'), (10, 22, 2, 'tbsp'), (10, 2, 150, 'g'), (10, 5, 1, 'tbsp'),
-- 11 Chicken Spinach Salad
(11, 1, 200, 'g'), (11, 10, 2, 'cup'), (11, 8, 1, 'pieces'), (11, 5, 1, 'tbsp'), (11, 18, 0.5, 'pieces');

-- Demo pantry
-- Fully matched: 2 Scrambled Eggs, 3 Garlic Broccoli Rice, 4 Spinach Omelette, 5 Banana Oatmeal
-- Partially matched: 1, 6, 8, 10, 11   |   Nothing matched: 7 Quesadilla, 9 Avocado Toast
INSERT INTO pantry_items (user_id, ingredient_id, quantity, unit)
VALUES
(1, 2, 500, 'g'),        -- Rice
(1, 3, 6, 'pieces'),     -- Eggs
(1, 4, 2, 'cup'),        -- Broccoli
(1, 5, 250, 'ml'),       -- Olive Oil
(1, 6, 1, 'bulb'),       -- Garlic
(1, 10, 3, 'cup'),       -- Spinach
(1, 11, 500, 'g'),       -- Oats
(1, 12, 1, 'l'),         -- Milk
(1, 13, 3, 'pieces'),    -- Banana
(1, 8, 2, 'pieces');     -- Tomato


-- Weekly meal plan
INSERT INTO meal_plan_entries
(user_id, recipe_id, planned_date, meal_type)
VALUES
(1, 1, CURRENT_DATE, 'dinner'),
(1, 5, CURRENT_DATE + 1, 'breakfast'),
(1, 3, CURRENT_DATE + 2, 'lunch'),
(1, 10, CURRENT_DATE + 3, 'dinner');



-- Saved recipes
INSERT INTO saved_recipes (user_id, recipe_id)
VALUES
(1, 2),
(1, 3),
(1, 9);


-- Shopping list
INSERT INTO shopping_list_items (user_id, ingredient_id, quantity, unit)
VALUES (1, 1, 200, 'g');
