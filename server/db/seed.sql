-- Insert in a fixed order into freshly recreated tables for predictable demo IDs.
INSERT INTO users (name, email) VALUES
  ('Yingshu', 'yingshu@example.com'),
  ('Yugant', 'yugant@example.com'),
  ('Arnold', 'arnold@example.com');

INSERT INTO trips (organizer_id, title, destination, start_date, end_date, budget, invite_code) VALUES
  (1, 'Seattle Weekend', 'Seattle, WA', '2026-11-20', '2026-11-22', 900, 'SEATTLE26'),
  (2, 'Portland Food Trip', 'Portland, OR', '2026-12-04', '2026-12-06', 600, 'PORTLAND26');

INSERT INTO trip_members (trip_id, user_id, role) VALUES
  (1, 1, 'organizer'), (1, 2, 'member'), (1, 3, 'member'),
  (2, 2, 'organizer'), (2, 1, 'member');

INSERT INTO activities (trip_id, created_by_id, title, location, scheduled_date, description, estimated_cost) VALUES
  (1, 1, 'Explore Pike Place Market', 'Pike Place Market', '2026-11-20', 'Browse the market and get lunch together.', 25),
  (1, 2, 'Visit the Space Needle', 'Seattle Center', '2026-11-21', 'An afternoon with views of the city.', 45),
  (1, 3, 'Walk along the waterfront', 'Seattle Waterfront', NULL, 'Pick a time when the weather looks good.', 0),
  (2, 2, 'Food cart lunch', 'Downtown Portland', '2026-12-04', 'Try a few different food carts.', 20),
  (2, 1, 'Browse Powell''s Books', 'Pearl District', '2026-12-05', 'An afternoon at the bookstore.', 0);

INSERT INTO activity_votes (activity_id, user_id) VALUES
  (1, 1), (1, 2), (1, 3), (2, 1), (2, 3), (4, 1), (4, 2);

-- Payer and recorder can differ; the second entry demonstrates that workflow.
INSERT INTO expenses (trip_id, payer_id, created_by_id, description, amount, expense_date) VALUES
  (1, 1, 1, 'Shared hotel deposit', 180, '2026-11-01'),
  (1, 2, 3, 'Museum tickets for the group', 75, '2026-11-02'),
  (2, 2, 2, 'Train reservation deposit', 60, '2026-11-03');
