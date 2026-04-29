# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

. users

. settings

. categories

. notes

. tags

. notes_tags

## Add the Entity Relationship Diagram

| users | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| username | varchar |  |
| email | varchar |  |
| password | varchar |  |
| created_at | timestamp |  |

| settings | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | forein key |
| default_color | varchar |  |
| theme | varchar |  |
| ai_enabled | boolean |  |
| auto_save | boolean |  |
| confirm_delete | boolean |  |

| categories | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | forein key |
| name | varchar |  |

| notes | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | forein key |
| category_id | integer | forein key |
| title | text |  |
| content | text |  |
| color | varchar |  |
| is_pinned | boolean |  |
| created_at | timestamp |  |
| updated_at | timestamp |  |

| tags | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | forein key |
| name | varchar |  |

| note_tag | Type | Description |
|-------------|------|-------------|
| note_id | integer | primary and forein key |
| user_id | integer | primary and forein key |
| added_at | timestamp |  |

<img width="2749" height="6660" alt="UML_Diagram" src="https://github.com/user-attachments/assets/1225268c-cf58-4561-a3dc-be3461b9ad93" />

