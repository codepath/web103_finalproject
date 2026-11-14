# PrepWise — Database Schema

## 1. Overview

PrepWise uses PostgreSQL to manage user pantry inventories, recipes, ingredients, weekly meal plans, saved recipes, and shopping lists.

The database follows a relational design that reduces duplicate data, maintains data integrity, and supports efficient ingredient matching.

**Database:** PostgreSQL  
**Backend:** Node.js and Express.js  
**Status:** Proposed schema — implementation pending

## 2. Database Tables

### Table 1: `users`

Stores basic user information.

| Column | Data Type | Constraints |
|---|---|---|
| id | SERIAL | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| created_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP |

Authentication is optional. A demonstration user can be seeded during initial development.

### Table 2: `ingredients`

Stores a reusable catalog of ingredients.

| Column | Data Type | Constraints |
|---|---|---|
| id | SERIAL | Primary Key |
| name | VARCHAR(150) | UNIQUE, NOT NULL |
| category | VARCHAR(50) | |
| created_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP |

Examples include chicken breast, rice, eggs, and broccoli.

### Table 3: `pantry_items`

Tracks ingredients currently available in each user's pantry.

| Column | Data Type | Constraints |
|---|---|---|
| id | SERIAL | Primary Key |
| user_id | INTEGER | Foreign Key → users.id |
| ingredient_id | INTEGER | Foreign Key → ingredients.id |
| quantity | NUMERIC(10,2) | NOT NULL, CHECK quantity >= 0 |
| unit | VARCHAR(30) | NOT NULL |
| expiration_date | DATE | Optional |
| updated_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Supports adding, viewing, updating, and deleting pantry items.

### Table 4: `recipes`

Stores the recipes available in PrepWise.

| Column | Data Type | Constraints |
|---|---|---|
| id | SERIAL | Primary Key |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | |
| instructions | TEXT | NOT NULL |
| prep_minutes | INTEGER | CHECK >= 0 |
| cook_minutes | INTEGER | CHECK >= 0 |
| servings | INTEGER | CHECK > 0 |
| meal_type | VARCHAR(30) | |
| dietary_preference | VARCHAR(50) | |
| image_url | TEXT | Optional |

**Purpose:** Supports recipe discovery, recipe details, filtering, and sorting.

### Table 5: `recipe_ingredients`

Connects recipes to their required ingredients.

| Column | Data Type | Constraints |
|---|---|---|
| recipe_id | INTEGER | Foreign Key → recipes.id |
| ingredient_id | INTEGER | Foreign Key → ingredients.id |
| quantity | NUMERIC(10,2) | NOT NULL, CHECK > 0 |
| unit | VARCHAR(30) | NOT NULL |

**Primary Key:** `(recipe_id, ingredient_id)`

**Purpose:** Implements the required many-to-many relationship between recipes and ingredients.

### Table 6: `meal_plan_entries`

Stores recipes scheduled for particular dates.

| Column | Data Type | Constraints |
|---|---|---|
| id | SERIAL | Primary Key |
| user_id | INTEGER | Foreign Key → users.id |
| recipe_id | INTEGER | Foreign Key → recipes.id |
| planned_date | DATE | NOT NULL |
| meal_type | VARCHAR(30) | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP |

**Purpose:** Supports the weekly meal-planning calendar.

### Table 7: `saved_recipes`

Tracks recipes bookmarked by users.

| Column | Data Type | Constraints |
|---|---|---|
| user_id | INTEGER | Foreign Key → users.id |
| recipe_id | INTEGER | Foreign Key → recipes.id |
| saved_at | TIMESTAMPTZ | DEFAULT CURRENT_TIMESTAMP |

**Primary Key:** `(user_id, recipe_id)`

**Purpose:** Allows users to save and revisit preferred recipes.

### Table 8: `shopping_list_items`

Stores grocery items needed by each user.

| Column | Data Type | Constraints |
|---|---|---|
| id | SERIAL | Primary Key |
| user_id | INTEGER | Foreign Key → users.id |
| ingredient_id | INTEGER | Foreign Key → ingredients.id |
| quantity | NUMERIC(10,2) | NOT NULL, CHECK > 0 |
| unit | VARCHAR(30) | NOT NULL |
| is_checked | BOOLEAN | DEFAULT FALSE |
| source | VARCHAR(20) | DEFAULT 'manual' |

**Purpose:** Supports generated shopping lists, manually added groceries, and completed-item tracking.

## 3. Entity Relationships

### One-to-Many Relationships

- One user can own multiple pantry items.
- One user can schedule multiple meal-plan entries.
- One recipe can appear in multiple meal-plan entries.
- One user can have multiple shopping-list items.

### Many-to-Many Relationships

**Recipes ↔ Ingredients**

Implemented through `recipe_ingredients`.

- One recipe can require multiple ingredients.
- One ingredient can appear in multiple recipes.

**Users ↔ Recipes**

Implemented through `saved_recipes`.

- One user can save multiple recipes.
- One recipe can be saved by multiple users.

## 4. Business Logic

### Pantry Management

Users can add, edit, view, and delete pantry records. Each item references an existing ingredient.

### Recipe Matching

The backend compares ingredient requirements stored in `recipe_ingredients` against the user's pantry inventory.

Recipe results can identify:

- Available ingredients
- Missing ingredients
- Ingredient match percentage

Quantity-aware matching will compare compatible units.

### Weekly Meal Planning

Users can schedule recipes for specific days and meal types. The application retrieves the relevant records for the selected week.

### Shopping List Generation

The application determines ingredient requirements from scheduled recipes, subtracts available pantry quantities, and generates a consolidated list of missing items.

Automatically generated items can be stored in `shopping_list_items` with `source = 'generated'`.

Regeneration should avoid creating duplicate entries.

## 5. Database Integrity

The implementation will use:

- Primary keys to uniquely identify records
- Foreign keys to maintain relationships
- Composite keys to prevent duplicate recipe-ingredient and saved-recipe associations
- CHECK constraints to prevent invalid quantities
- Appropriate indexes on frequently queried foreign keys
- Transactions for operations that update related records

## 6. Database Initialization

The project will include:

- `schema.sql` — Creates database tables and constraints
- `seed.sql` — Inserts demonstration users, ingredients, recipes, and related data
- `reset.js` — Resets and reseeds the database to its default state

These files will be implemented during backend development.

## 7. CodePath Requirements Alignment

| Requirement | Implementation |
|---|---|
| PostgreSQL database | All eight proposed tables |
| One-to-many relationship | users → pantry_items |
| Many-to-many relationship | recipes ↔ ingredients |
| Join table | recipe_ingredients |
| RESTful CRUD operations | pantry_items |
| Database reset | Reset and seed scripts |
| Dynamic recipe information | recipes + recipe_ingredients |
| Recipe filtering | Recipe query parameters |
| Shopping list generation | Meal plans + pantry comparisons |

## 8. Development Status

- [x] Identify required entities
- [x] Define proposed tables and columns
- [x] Specify primary and foreign keys
- [x] Plan one-to-many relationships
- [x] Plan many-to-many relationships
- [ ] Implement PostgreSQL schema
- [ ] Create seed data
- [ ] Build database reset script
- [ ] Connect Express API
- [ ] Test database operations

**Status:** Database planning complete; implementation and testing pending.
