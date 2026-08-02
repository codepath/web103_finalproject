# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables
- Users
- Trips
- Destinations
- Activities
- Expenses
- Packing List

## Add the Entity Relationship Diagram

<img src='/planning/img/Ramblr ERD.png' title='ERD' width='' alt='entity relationship diagram image' />

### Users
| Column Name   | Type       | Description                                                   |
| ------------- | ---------- | ------------------------------------------------------------- |
| id            | integer    | Primary key, auto-increment                                   |
| email         | varchar    | Unique email address, required                                |
| password_hash | varchar    | Hashed password, required                                     |
| display_name  | varchar    | User's display name                                           |
| home_currency | varchar(3) | Default currency (`USD`)                                      |
| created_at    | timestamp  | Timestamp when account was created (defaults to current time) |

### Trips
| Column Name | Type          | Description                                                |
| ----------- | ------------- | ---------------------------------------------------------- |
| id          | integer       | Primary key, auto-increment                                |
| user_id     | integer       | Foreign key referencing `users.id`                         |
| title       | varchar       | Trip title, required                                       |
| start_date  | date          | Trip start date                                            |
| end_date    | date          | Trip end date                                              |
| budget      | decimal(12,2) | Planned budget                                             |
| created_at  | timestamp     | Timestamp when trip was created (defaults to current time) |

### Destinations
| Column Name   | Type       | Description                                    |
| ------------- | ---------- | ---------------------------------------------- |
| id            | integer    | Primary key, auto-increment                    |
| trip_id       | integer    | Foreign key referencing `trips.id`             |
| city          | varchar    | Destination city, required                     |
| country       | varchar    | Destination country, required                  |
| currency_code | varchar(3) | Local currency code                            |
| arrival_order | integer    | Order of this destination in a multi-stop trip |
| start_date    | date       | Arrival/start date                             |
| end_date      | date       | Departure/end date                             |

### Activities
| Column Name      | Type    | Description                               |
| ---------------- | ------- | ----------------------------------------- |
| id               | integer | Primary key, auto-increment               |
| destination_id   | integer | Foreign key referencing `destinations.id` |
| name             | varchar | Activity name, required                   |
| scheduled_date   | date    | Date of the activity (optional)           |
| start_time       | time    | Planned start time                        |
| duration_minutes | integer | Estimated duration in minutes             |
| notes            | text    | Additional activity notes                 |

### Expenses
| Column Name      | Type    | Description                               |
| ---------------- | ------- | ----------------------------------------- |
| id               | integer | Primary key, auto-increment               |
| destination_id   | integer | Foreign key referencing `destinations.id` |
| name             | varchar | Activity name, required                   |
| scheduled_date   | date    | Date of the activity (optional)           |
| start_time       | time    | Planned start time                        |
| duration_minutes | integer | Estimated duration in minutes             |
| notes            | text    | Additional activity notes                 |

### Packing List
| Column Name       | Type    | Description                                                            |
| ----------------- | ------- | ---------------------------------------------------------------------- |
| id                | integer | Primary key, auto-increment                                            |
| trip_id           | integer | Foreign key referencing `trips.id`                                     |
| name              | varchar | Item name, required                                                    |
| is_packed         | boolean | Whether the item has been packed (defaults to `false`)                 |
| is_auto_generated | boolean | Whether the app automatically suggested the item (defaults to `false`) |


