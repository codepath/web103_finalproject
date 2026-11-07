# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

- Users
- Courses
- Topics
- Assignments
- Assignment Progress
- Study Plans
- Comments


## Add the Entity Relationship Diagram

```mermaid
erDiagram

    USERS {
        int id PK
        string first_name
        string last_name
        string role
        timestamp created_at
    }

    COURSES {
        int id PK
        string course_name
        int ta_id FK
        timestamp created_at
    }

    TOPICS {
        int id PK
        int course_id FK
        string name
    }

    ASSIGNMENTS {
        int id PK
        int course_id FK
        int topic_id FK
        int created_by FK

        int priority
        string title
        text description
        datetime due_date

        timestamp created_at
        timestamp updated_at
    }

    ASSIGNMENT_PROGRESS {
        int id PK
        int user_id FK
        int assignment_id FK

        boolean completed
        datetime completed_at
        int priority
    }

    STUDY_PLANS {
        int id PK
        int course_id FK
        int topic_id FK
        int created_by FK

        string title
        text content

        timestamp created_at
        timestamp updated_at
    }

    COMMENTS {
        int id PK
        int user_id FK
        int study_plan_id FK
        int assignment_id FK

        text content
        timestamp created_at
    }

    USERS ||--o{ COURSES : teaches

    COURSES ||--o{ TOPICS : contains

    COURSES ||--o{ ASSIGNMENTS : has
    TOPICS ||--o{ ASSIGNMENTS : categorizes
    USERS ||--o{ ASSIGNMENTS : creates

    COURSES ||--o{ STUDY_PLANS : has
    TOPICS ||--o{ STUDY_PLANS : categorizes
    USERS ||--o{ STUDY_PLANS : creates

    USERS ||--o{ ASSIGNMENT_PROGRESS : tracks
    ASSIGNMENTS ||--o{ ASSIGNMENT_PROGRESS : tracked_by

    USERS ||--o{ COMMENTS : writes
    STUDY_PLANS ||--o{ COMMENTS : receives
    ASSIGNMENTS ||--o{ COMMENTS : receives
```

## USERS

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| first_name | text | First name of user |
| last_name | text | Last name of user |
| role | text | User role (`student` or `ta`) |
| created_at | timestamp | Timestamp when user record was created |

## COURSES

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| course_name | text | Name of the course |
| ta_id | integer | Foreign key referencing the TA user responsible for the course |
| created_at | timestamp | Timestamp when course record was created |

## TOPICS

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| course_id | integer | Foreign key referencing the associated course |
| name | text | Name of the topic |

## ASSIGNMENTS

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| course_id | integer | Foreign key referencing the associated course |
| topic_id | integer | Foreign key referencing the associated topic |
| created_by | integer | Foreign key referencing the user who created the assignment |
| priority | int | Triage level of assignment |
| title | text | Assignment title |
| description | text | Detailed assignment description |
| due_date | datetime | Assignment due date and time |
| created_at | timestamp | Timestamp when assignment was created |
| updated_at | timestamp | Timestamp when assignment was last modified |

## ASSIGNMENT_PROGRESS

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| user_id | integer | Foreign key referencing the user tracking progress |
| assignment_id | integer | Foreign key referencing the assignment |
| completed | boolean | Indicates whether the assignment has been completed |
| completed_at | datetime | Date and time the assignment was completed |
| priority | integer | User-assigned priority level for the assignment |

## STUDY_PLANS

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| course_id | integer | Foreign key referencing the associated course |
| topic_id | integer | Foreign key referencing the associated topic |
| created_by | integer | Foreign key referencing the user who created the study plan |
| title | text | Study plan title |
| content | text | Study plan content and recommendations |
| created_at | timestamp | Timestamp when study plan was created |
| updated_at | timestamp | Timestamp when study plan was last modified |

## COMMENTS

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | Primary key |
| user_id | integer | Foreign key referencing the user who wrote the comment |
| study_plan_id | integer | Foreign key referencing the study plan being commented on |
| assignment_id | integer | Foreign key referencing the assignment being commented on |
| content | text | Comment text |
| created_at | timestamp | Timestamp when comment was created |
