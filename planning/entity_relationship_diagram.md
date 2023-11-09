# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

Students.

Tutors.

Sessions.

## Add the Entity Relationship Diagram

Students.

| Column Name | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| id          | integer  | primary key                  |
| name        | text     | name of the student          |
| subjects    | text [ ] | names of interested subjects |

Tutors.

| Column Name  | Type     | Description                     |
| ------------ | -------- | ------------------------------- |
| id           | integer  | primary key                     |
| name         | text     | name of the tutor               |
| subjects     | text [ ] | names of subjects tutored       |
| availability | date [ ] | tutor's open dates for meetings |

Appointments.

| Column Name | Type    | Description                          |
| ----------- | ------- | ------------------------------------ |
| id          | integer | primary key                          |
| student     | integer | foreign key referencing Students(id) |
| tutor       | integer | foreign key referencing Tutors(id)   |
| date        | date    | session date and time                |

![image](https://github.com/FelixNgFender/web103_finalproject/assets/98554622/1868e981-68fc-49cf-9c1d-8948e33fa3be)
