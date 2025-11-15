# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

** User Table **
| Column Name | Type | Description |
|-------------|------|-------------|
| userID | integer | primary key |
| username | text | unique user alias |
| password | text | login credential to access  |
| points | integer | points accuraled from mastering habits |
| timeCreated | timestamp | how long the user has been with the app |

** Habits Table **
| Column Name | Type | Description |
|-------------|------|-------------|
| userID | integer | primary key |
| habitName | text | habit to be tracked |
| description | text | description of habit |
| pointWeight | integer | how many points the user will recive from completing the habit |
| frequency | integer | how frequent the user wants to do this habit |
| duration | integer | how long the user wants to spend doing this habit   |
| status | text | if the user has already created habit into a habit |

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

![table reltationship diagram](https://github.com/norellic/codepath-web103-capstone/blob/main/table%20realtionship.png)
