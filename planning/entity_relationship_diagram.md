# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

Students.

Tutors.

Appointments. 

## Add the Entity Relationship Diagram

Students.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the student |
| subjects | text [ ] | names of interested subjects |

Tutors.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the tutor |
| subjects | text [ ] | names of subjects tutored |
| availability | date [ ] | tutor's open dates for meetings | 

Appointments.

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| student | integer | foreign key referencing Students(id) |
| tutor | integer | foreign key referencing Tutors(id) |
| date | date | session date and time | 

