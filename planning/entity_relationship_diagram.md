# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

1. **User** - Stores information about the users who register and sign in to the application.
2. **Salon** - Contains details of salons listed on the platform, including address, hours, and rating.
3. **Employee** - Represents employees who work at different salons.
4. **Appointment** - Manages appointment bookings between users and salons.
5. **Service** - Lists available services provided by each salon.
6. **Review** - Allows users to review and rate salons after appointments.

## Add the Entity Relationship Diagram

### Table Structure

#### User

| Column Name | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| id          | integer  | Primary key                       |
| username    | text     | Unique username                   |
| password    | text     | Encrypted user password           |
| profile_pic | text     | URL to the user’s profile picture |
| created_at  | datetime | Date the account was created      |

#### Salon

| Column Name  | Type    | Description                    |
| ------------ | ------- | ------------------------------ |
| id           | integer | Primary key                    |
| name         | text    | Salon name                     |
| address      | text    | Physical address of the salon  |
| opening_time | time    | Opening time                   |
| closing_time | time    | Closing time                   |
| rating       | float   | Average rating of the salon    |
| latitude     | float   | Latitude for location mapping  |
| longitude    | float   | Longitude for location mapping |

#### Employee

| Column Name | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| id          | integer | Primary key                           |
| salon_id    | integer | Foreign key referencing `Salon`       |
| name        | text    | Employee's name                       |
| role        | text    | Job title or role                     |
| profile_pic | text    | URL to the employee’s profile picture |

#### Appointment

| Column Name      | Type    | Description                                           |
| ---------------- | ------- | ----------------------------------------------------- |
| id               | integer | Primary key                                           |
| user_id          | integer | Foreign key referencing `User`                        |
| salon_id         | integer | Foreign key referencing `Salon`                       |
| employee_id      | integer | Foreign key referencing `Employee`                    |
| appointment_date | date    | Date of the appointment                               |
| time_slot        | time    | Time slot selected by the user                        |
| status           | text    | Status of the appointment (e.g., confirmed, canceled) |

#### Service

| Column Name | Type    | Description                     |
| ----------- | ------- | ------------------------------- |
| id          | integer | Primary key                     |
| salon_id    | integer | Foreign key referencing `Salon` |
| name        | text    | Name of the service             |
| description | text    | Description of the service      |
| price       | float   | Price of the service            |

#### Review

| Column Name | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| id          | integer  | Primary key                          |
| user_id     | integer  | Foreign key referencing `User`       |
| salon_id    | integer  | Foreign key referencing `Salon`      |
| rating      | integer  | Rating given by the user (e.g., 1-5) |
| comment     | text     | User’s review comment                |
| created_at  | datetime | Date the review was created          |
