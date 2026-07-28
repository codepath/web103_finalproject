# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

- **Users** — core account table: `user_id` (PK), `username` (unique), `email` (unique), `password_hash`, `profile_image_url`, `total_points`, `created_at`, `updated_at`
- **Followed_Teams** — join table tracking which teams a user follows: `followed_team_id` (PK), `user_id` (FK → Users), `api_team_id`, `team_name`, `followed_at`
- **Predictions** — a user's wager/prediction on a match's outcome: `prediction_id` (PK), `user_id` (FK → Users), `api_match_id`, `predicted_home_score`, `predicted_away_score`, `points_awarded`, `submitted_at`
- **Comments** — user comments left on a match: `comment_id` (PK), `user_id` (FK → Users), `api_match_id`, `content`, `created_at`, `updated_at`
- **Notifications** — alerts sent to a user (match alerts, transfer news, etc.): `notification_id` (PK), `user_id` (FK → Users), `api_team_id`, `api_match_id`, `notification_type`, `message`, `is_read`, `created_at`
- **Video_Links** — video highlights/footage associated with a match: `video_link_id` (PK), `user_id` (FK → Users), `api_match_id`, `title`, `video_url`, `provider`, `created_at`
  **Relationships:** One user can follow many teams, submit many predictions, write many comments, receive many notifications, and be associated with many video links — all one-to-many from `Users` out to the other five tables via `user_id`.

Note: `api_match_id` and `api_team_id` are stored as external reference identifiers (from the football data API) rather than foreign keys into local tables, since match and team data are sourced externally rather than stored as their own entities in this schema.

## Add the Entity Relationship Diagram

**Initial draft (whiteboard):**

<img src="./images/ER Diagram v1.png" alt="Initial ER diagram, by hand">

**Finalized diagram:**

<img src="./images/ER Diagram MatchLens.png" alt="Fianl ER diagram, represented by tables">
