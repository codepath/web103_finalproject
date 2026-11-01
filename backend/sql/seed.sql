INSERT INTO users (name, email)
VALUES ('HabitFlow Demo User', 'demo@habitflow.local')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, color)
VALUES
  ('Health', '#22c55e'),
  ('Career', '#3b82f6'),
  ('Learning', '#8b5cf6'),
  ('Personal', '#f97316'),
  ('Finance', '#eab308')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tasks (user_id, title, description, priority, due_date)
SELECT u.id, seed.title, seed.description, seed.priority, seed.due_date::date
FROM users AS u
CROSS JOIN (
  VALUES
    ('Finish project outline', 'Define the next implementation steps.', 'high', CURRENT_DATE + 1),
    ('Review reading notes', 'Summarize the most important ideas.', 'medium', CURRENT_DATE),
    ('Plan workout', 'Choose a workout for this week.', 'low', CURRENT_DATE + 2)
) AS seed(title, description, priority, due_date)
WHERE u.email = 'demo@habitflow.local'
  AND NOT EXISTS (
    SELECT 1
    FROM tasks AS existing_task
    WHERE existing_task.user_id = u.id
      AND existing_task.title = seed.title
  );

INSERT INTO habits (user_id, name, description, frequency)
SELECT u.id, seed.name, seed.description, seed.frequency
FROM users AS u
CROSS JOIN (
  VALUES
    ('Morning walk', 'Take a walk before starting work.', 'daily'),
    ('Read for 20 minutes', 'Read a book or course material.', 'weekdays'),
    ('Drink water', 'Drink water throughout the day.', 'daily')
) AS seed(name, description, frequency)
WHERE u.email = 'demo@habitflow.local'
  AND NOT EXISTS (
    SELECT 1
    FROM habits AS existing_habit
    WHERE existing_habit.user_id = u.id
      AND existing_habit.name = seed.name
  );