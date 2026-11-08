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
| GET | `/api/recipes` | List recipes with `total_minutes`, `total_count` (ingredients needed), and `have_count` (ingredients in the pantry), and `is_saved`. Optional query: `mealType`, `diet`, `maxTime` (minutes), `sort` (`time` or `availability`) |
| GET | `/api/recipes/:id` | One recipe plus `is_saved` and its `ingredients`, each marked `have: true/false` |

`is_saved` is `true` when the demo user has saved the recipe (see [Saved recipes](#saved-recipes)).

Status codes: `400` invalid `maxTime`, `sort`, or id, `404` recipe not found.

Example `GET /api/recipes?sort=time`:

```json
[
  {
    "id": 2, "title": "Scrambled Eggs", "description": "Quick breakfast",
    "instructions": "Whisk eggs and cook in a pan.",
    "prep_minutes": 5, "cook_minutes": 5, "servings": 1,
    "meal_type": "Breakfast", "dietary_preference": null, "image_url": null,
    "total_minutes": 10, "total_count": 1, "have_count": 1, "is_saved": true
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
  "is_saved": false,
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

## Meal plan

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/meal-plan?start=YYYY-MM-DD` | One week of entries (`start` through `start` + 6 days), joined with the recipe's `title`, `image_url`, and `prep_minutes`. Sorted by date, then breakfast → lunch → dinner → snack |
| POST | `/api/meal-plan` | Schedule a meal. Body: `recipe_id`, `planned_date` (`YYYY-MM-DD`), `meal_type` |
| PATCH | `/api/meal-plan/:id` | Move a meal to another day and/or meal type. Body: `planned_date` and/or `meal_type` (fields left out stay the same) |
| DELETE | `/api/meal-plan/:id` | Remove a planned meal (204) |

`meal_type` must be `breakfast`, `lunch`, `dinner`, or `snack` (case-insensitive, always returned lowercase). Dates are sent and returned as `YYYY-MM-DD` strings.

Status codes: `201` created, `400` missing/invalid `start`, `planned_date`, `meal_type`, or `recipe_id`, `404` entry or recipe not found.

Example `GET /api/meal-plan?start=2026-11-08`:

```json
[
  {
    "id": 1, "recipe_id": 1, "planned_date": "2026-11-08", "meal_type": "dinner",
    "title": "Chicken Rice Bowl", "image_url": null, "prep_minutes": 10
  }
]
```

`POST` and `PATCH` return a single entry in the same shape.

Example error, `POST /api/meal-plan` with `"meal_type": "brunch"` (400):

```json
{ "error": "meal_type must be one of: breakfast, lunch, dinner, snack." }
```

## Saved recipes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/saved-recipes` | List saved recipes, joined with the recipe's `title`, `image_url`, and `prep_minutes`. Newest saved first |
| POST | `/api/saved-recipes` | Save a recipe. Body: `{ "recipe_id": 1 }`. Saving a recipe that is already saved does nothing and returns `200` with the existing row |
| DELETE | `/api/saved-recipes/:recipeId` | Unsave a recipe by its **recipe id** (204) |

Status codes: `201` saved, `200` already saved, `400` invalid `recipe_id`, `404` recipe not found or not saved.

Example `GET /api/saved-recipes`:

```json
[
  {
    "recipe_id": 2, "saved_at": "2026-11-08T19:58:21.154Z",
    "title": "Scrambled Eggs", "image_url": null, "prep_minutes": 5
  }
]
```

`POST` returns a single saved recipe in the same shape.

Example error, `POST /api/saved-recipes` with `"recipe_id": 9999` (404):

```json
{ "error": "Recipe not found." }
```
