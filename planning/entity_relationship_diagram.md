| List of Tables           |
|--------------------------|
| users                    |
| posts                    |
| comments                 |
| tags                     |
| post_tags                |
| votes                    |
| user_layout_preferences  |

----------------------------------------------------------

# Entity Relationship Diagram

## users
| Column        | Type      | Constraints                |
|--------------|-----------|---------------------------|
| id           | int       | PRIMARY KEY               |
| username     | varchar   | UNIQUE, NOT NULL          |
| email        | varchar   | UNIQUE, NOT NULL          |
| password_hash| varchar   | NOT NULL                  |
| display_name | varchar   | NOT NULL                  |
| github_id    | varchar   | UNIQUE                    |
| created_at   | timestamp | NOT NULL, DEFAULT NOW()   |
| updated_at   | timestamp | NOT NULL, DEFAULT NOW()   |

## posts
| Column      | Type      | Constraints                |
|------------|-----------|---------------------------|
| id         | int       | PRIMARY KEY               |
| user_id    | int       | FOREIGN KEY (users.id)    |
| title      | text      | NOT NULL                  |
| content    | text      | NOT NULL                  |
| score      | int       | NOT NULL, DEFAULT 0       |
| created_at | timestamp | NOT NULL, DEFAULT NOW()   |
| updated_at | timestamp | NOT NULL, DEFAULT NOW()   |

## comments
| Column            | Type      | Constraints                     |
|------------------|-----------|--------------------------------|
| id               | int       | PRIMARY KEY                    |
| user_id          | int       | FOREIGN KEY (users.id)         |
| post_id          | int       | FOREIGN KEY (posts.id)         |
| parent_comment_id| int       | FOREIGN KEY (comments.id)      |
| content          | text      | NOT NULL                       |
| score            | int       | NOT NULL, DEFAULT 0            |
| created_at       | timestamp | NOT NULL, DEFAULT NOW()        |
| updated_at       | timestamp | NOT NULL, DEFAULT NOW()        |

## tags
| Column      | Type      | Constraints                |
|------------|-----------|---------------------------|
| id         | int       | PRIMARY KEY               |
| name       | varchar   | UNIQUE, NOT NULL          |
| description| text      |                           |
| created_at | timestamp | NOT NULL, DEFAULT NOW()   |

## post_tags
| Column  | Type | Constraints                          |
|--------|------|-------------------------------------|
| post_id| int  | FOREIGN KEY (posts.id)              |
| tag_id | int  | FOREIGN KEY (tags.id)               |
PRIMARY KEY (post_id, tag_id)

## votes
| Column      | Type      | Constraints                      |
|------------|-----------|----------------------------------|
| id         | int       | PRIMARY KEY                      |
| user_id    | int       | FOREIGN KEY (users.id)           |
| post_id    | int       | FOREIGN KEY (posts.id)           |
| comment_id | int       | FOREIGN KEY (comments.id)        |
| value      | int       | NOT NULL, CHECK (value IN(-1,1)) |
| created_at | timestamp | NOT NULL, DEFAULT NOW()          |

## user_layout_preferences
| Column      | Type      | Constraints                |
|------------|-----------|---------------------------|
| user_id    | int       | PRIMARY KEY, FOREIGN KEY  |
| layout_type| varchar   | NOT NULL                  |
| updated_at | timestamp | NOT NULL, DEFAULT NOW()   |
