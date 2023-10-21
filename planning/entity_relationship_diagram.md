# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

- users
- fridges
- fridges_users
- foods
- food_categories

## Add the Entity Relationship Diagram

![ERD](entity_relationship_diagram.jpg)

### users
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| username | text | the name of the user |
| email | text | the email of the user account |
| password | text | the password of the user account |
| created_date | date | the date the account is created |

### fridges
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | the id of the user (primary key) |
| name | text | the name of the shoe model |

### fridges_users
| Column Name | Type | Description |
|-------------|------|-------------|
| user_id | integer | the id of the user (foreign key) |
| fridge_id | integer | the id of the fridge (foreign key) |

### foods
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | the id of the user (primary key) |
| name | text | the name of the food item |
| fridge_id | integer | the id of the fridge (foregin key) |
| category_id | integer | the category of the food (foreign key) |
| added_date | date | the date the food is added |
| expiration_date | date | the expiration date of the food |
| count | integer | the quantity of the food |

### food_categories
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | the id of the user (primary key) |
| name | text | the category of the food item |