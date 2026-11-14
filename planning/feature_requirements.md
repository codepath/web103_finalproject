#Project Requirements

# PrepWise — Feature Requirements

## 1. Project Overview

PrepWise is a full-stack meal-planning and pantry-management application designed to simplify meal preparation, reduce food waste, and help users manage grocery expenses. The platform connects pantry inventory, recipe discovery, weekly meal planning, and shopping lists in one application.

## 2. Core Functional Requirements

### FR-01: Pantry Inventory
**Priority:** High

- Users can add, view, edit, and delete pantry ingredients.
- Each pantry item stores its name, quantity, category, and expiration date.
- Users can identify ingredients approaching expiration.

### FR-02: Smart Recipe Suggestions
**Priority:** High

- Display recipes based on ingredients available in the user's pantry.
- Identify available and missing ingredients for each recipe.
- Help users prioritize recipes that require fewer additional ingredients.

### FR-03: Weekly Meal Planner
**Priority:** High

- Allow users to assign recipes to specific days of the week.
- Display scheduled meals in an organized weekly view.
- Allow users to update or remove planned meals.

### FR-04: Smart Shopping List
**Priority:** High

- Automatically generate shopping lists using missing ingredients from planned recipes.
- Combine duplicate ingredients when possible.
- Allow users to review and manage their shopping lists.

### FR-05: Recipe Detail Modal
**Priority:** High — Custom Feature 1

- Open recipe information in a modal without navigating away from the current page.
- Display ingredients, preparation time, instructions, and recipe details.
- Allow users to close the modal and continue browsing.

### FR-06: Recipe Filtering and Sorting
**Priority:** High — Custom Feature 2

- Filter recipes by preparation time, meal type, and dietary preference.
- Sort recipes by preparation time or ingredient availability.
- Update displayed results without reloading the page.

### FR-07: Saved Recipes
**Priority:** Medium

- Allow users to save preferred recipes.
- Provide a dedicated view for saved recipes.
- Allow users to remove previously saved recipes.

### FR-08: Ingredient and Recipe Matching
**Priority:** High

- Connect recipes and ingredients through a many-to-many database relationship.
- Store ingredient requirements for each recipe.
- Compare recipe requirements against pantry inventory to identify missing ingredients.

## 3. CodePath Baseline Requirements

The application must satisfy the following technical requirements:

- [ ] React frontend and Express.js backend
- [ ] Dynamic frontend routing using React Router
- [ ] Dynamic backend API routes
- [ ] PostgreSQL database with one-to-many and many-to-many relationships
- [ ] RESTful API supporting GET, POST, PATCH, and DELETE for at least one entity
- [ ] Database reset functionality to restore default data
- [ ] Frontend redirection after appropriate user actions
- [ ] At least one same-page interactive feature
- [ ] Hierarchical, reusable React components
- [ ] Functional deployment on Render

## 4. Required Custom Features

PrepWise will implement these two CodePath-approved custom features:

**Custom Feature 1 — Recipe Detail Modal**

Users can view complete recipe details through an interactive modal without leaving the recipe browsing page.

**Custom Feature 2 — Recipe Filtering and Sorting**

Users can refine recipe results based on their preferences and available ingredients.

## 5. Database Requirements

**Planned tables:**

- `users` — User records
- `ingredients` — Available ingredient catalog
- `pantry_items` — Ingredients owned by users
- `recipes` — Recipe information
- `recipe_ingredients` — Join table connecting recipes and ingredients
- `meal_plan_entries` — Scheduled meals
- `saved_recipes` — User-saved recipes

**Required relationships:**

- One-to-many: Users → Pantry Items
- Many-to-many: Recipes ↔ Ingredients through `recipe_ingredients`

A seeded demonstration user may be used for the initial implementation; authentication is not required for the selected baseline features.

## 6. API Requirements

The Express backend should provide the following primary endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/pantry-items` | Retrieve pantry inventory |
| POST | `/api/pantry-items` | Add an ingredient |
| PATCH | `/api/pantry-items/:id` | Update an ingredient |
| DELETE | `/api/pantry-items/:id` | Delete an ingredient |
| GET | `/api/recipes` | Retrieve recipes |
| GET | `/api/recipes/:id` | Retrieve recipe details |
| GET | `/api/meal-plan` | Retrieve planned meals |
| POST | `/api/meal-plan` | Schedule a meal |
| GET | `/api/shopping-list` | Retrieve missing ingredients |

Additional endpoints can be introduced as development progresses.

## 7. Technology and Deployment Requirements

- **Frontend:** React, React Router, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Hosting:** Render
- **Version Control:** Git and GitHub

## 8. Completion Criteria

A feature is considered complete when it:

- Performs its documented functionality successfully.
- Uses the appropriate frontend and backend components.
- Persists data where required.
- Handles expected user interactions.
- Has been tested and reviewed.
- Is committed to the team repository.

**Project Status:** Planning — requirements defined; implementation pending.
