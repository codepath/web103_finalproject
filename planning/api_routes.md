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

## Planned (not yet built)

`/api/recipes`, `/api/recipes/:id`, `/api/meal-plan`, `/api/shopping-list` — see `feature_requirements.md`.
