# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

**Entities (core "things"):**
- `users`
- `ingredients`
- `recipes`

**Join tables (resolve many-to-many relationships):**
- `recipe_ingredients` — which ingredients (and how much) make up each recipe
- `kitchen` — which ingredients a user currently has on hand
- `favorites` — which recipes a user has saved
- `ratings` — the star rating a user gave a recipe
- `scheduled_meals` — recipes a user has scheduled on the meal calendar

## Add the Entity Relationship Diagram

![EatRite entity relationship diagram](erd.svg)

## Table Details

### users
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | user's display name |
| email | text | login email (unique) |
| password_hash | text | hashed password for authentication |
| dietary_preferences | text | user's dietary tags used to filter recipes |

### ingredients
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | ingredient name |
| category | text | e.g. produce, dairy, protein, grain |
| calories | integer | calories per unit (used to estimate meal nutrition) |
| dietary_tags | text | e.g. vegan, gluten-free, contains-nuts |

### recipes
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| title | text | recipe name |
| description | text | short summary shown on the recipe card |
| instructions | text | step-by-step preparation steps |
| image_url | text | photo of the finished dish |
| avg_rating | numeric | average of all user ratings (computed from `ratings`) |

### recipe_ingredients (join: recipes ↔ ingredients)
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| recipe_id | integer | foreign key → recipes.id |
| ingredient_id | integer | foreign key → ingredients.id |
| quantity | numeric | amount of the ingredient in this recipe |
| unit | text | unit for the quantity (cups, grams, tbsp) |

### kitchen (join: users ↔ ingredients)
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key → users.id |
| ingredient_id | integer | foreign key → ingredients.id |
| quantity | numeric | amount the user has on hand |
| unit | text | unit for the quantity |

### favorites (join: users ↔ recipes)
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key → users.id |
| recipe_id | integer | foreign key → recipes.id |

### ratings (join: users ↔ recipes)
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key → users.id |
| recipe_id | integer | foreign key → recipes.id |
| stars | integer | star rating this user gave this recipe (1–5) |

### scheduled_meals (join: users ↔ recipes)
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key → users.id |
| recipe_id | integer | foreign key → recipes.id |
| date | date | day the meal is scheduled / was eaten |
| meal_type | text | breakfast, lunch, dinner, or snack |

## Relationship Summary

- A **user** has many **kitchen** entries; each **ingredient** can appear in many users' kitchens → many-to-many via `kitchen`.
- A **recipe** has many **recipe_ingredients**; each **ingredient** can appear in many recipes → many-to-many via `recipe_ingredients` (carries `quantity` + `unit`).
- A **user** can favorite many **recipes**; a **recipe** can be favorited by many users → many-to-many via `favorites`.
- A **user** can rate many **recipes**; a **recipe** can be rated by many users → many-to-many via `ratings` (carries `stars`).
- A **user** can schedule many **recipes** across dates → many-to-many via `scheduled_meals` (carries `date` + `meal_type`).
