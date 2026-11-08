# PrepWise — API Routes

All routes are prefixed with `/api`. The baseline has no login; requests act as the seeded demo user (id 1).
Errors return `{ "error": "message" }` with a 4xx/5xx status.

## Units

The only accepted units are: `g`, `kg`, `ml`, `l`, `tsp`, `tbsp`, `cup`, `pieces` (`GET /api/units`).

## Reference data

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server check |
| GET | `/api/units` | Allowed units |
| GET | `/api/ingredients` | Ingredient catalog (`id`, `name`, `category`) |

## Pantry items

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/pantry-items` | List pantry items, with ingredient `name`, `category`, and `days_until_expiry` |
| POST | `/api/pantry-items` | Add an item. Body: `ingredient_id` **or** `name` (+ optional `category` for a new ingredient), `quantity`, `unit`, optional `expiration_date` |
| PATCH | `/api/pantry-items/:id` | Update `quantity`, `unit`, and/or `expiration_date` |
| DELETE | `/api/pantry-items/:id` | Remove an item (204) |

Status codes: `201` created, `400` invalid quantity/unit/name, `404` item not found, `409` ingredient already in pantry.

## Recipes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/recipes` | List recipes with `total_minutes`, `total_count` (ingredients needed), and `have_count` (ingredients in the pantry). Optional query: `mealType`, `diet`, `maxTime` (minutes), `sort` (`time` or `availability`) |
| GET | `/api/recipes/:id` | One recipe plus its `ingredients`, each marked `have: true/false` |

Status codes: `400` invalid `maxTime`, `sort`, or id, `404` recipe not found.

Example `GET /api/recipes?sort=time`:

```json
[
  {
    "id": 2, "title": "Scrambled Eggs", "description": "Quick breakfast",
    "instructions": "Whisk eggs and cook in a pan.",
    "prep_minutes": 5, "cook_minutes": 5, "servings": 1,
    "meal_type": "Breakfast", "dietary_preference": null, "image_url": null,
    "total_minutes": 10, "total_count": 1, "have_count": 1
  }
]
```

Example `GET /api/recipes/1`:

```json
{
  "id": 1, "title": "Chicken Rice Bowl", "description": "Simple chicken and rice meal",
  "instructions": "Cook rice, prepare chicken, and combine.",
  "prep_minutes": 10, "cook_minutes": 25, "servings": 2,
  "meal_type": "Dinner", "dietary_preference": null, "image_url": null,
  "ingredients": [
    { "id": 1, "name": "Chicken Breast", "category": "Protein", "quantity": 200, "unit": "g", "have": false },
    { "id": 2, "name": "Rice", "category": "Grains", "quantity": 150, "unit": "g", "have": true }
  ]
}
```

Example error, `GET /api/recipes/9999` (404):

```json
{ "error": "Recipe not found." }
```

## Shopping list

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/shopping-list` | List items with ingredient `name`, `category`, `is_checked`, and `source` (`manual` or `recipe`), unchecked first |
| POST | `/api/shopping-list` | Add an item. Body: `ingredient_id` **or** `name` (+ optional `category`), `quantity`, `unit`. If the same ingredient is already unchecked on the list with a unit that can be combined (same unit, g/kg, or ml/l), the quantity is added to that row |
| POST | `/api/shopping-list/from-recipe/:recipeId` | Add the recipe's ingredients that are not in the pantry. Returns `{ "added": 2 }` |
| PATCH | `/api/shopping-list/:id` | Check or uncheck an item. Body: `{ "is_checked": true }` |
| DELETE | `/api/shopping-list/:id` | Remove an item (204) |
| POST | `/api/shopping-list/checked/to-pantry` | Add every checked item to the pantry (adds to an existing pantry item when the units can be combined), then remove it from the list. Items whose unit can't be combined with the pantry's stay on the list. Returns `{ "moved": 2, "skipped": 0 }` |
| DELETE | `/api/shopping-list/checked` | Remove all checked items (204) |

Status codes: `201` created, `400` invalid quantity/unit/name or `is_checked`, `404` item or recipe not found.

## Planned (not yet built)

`/api/meal-plan` — see `feature_requirements.md`.
