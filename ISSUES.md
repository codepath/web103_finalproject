# MacroMate – Issue Tracker

---

## In Progress

---

### Issue 1 – Implement Set Your Macro Goal

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
Users select a fitness goal (cut, bulk, or maintain) and input their daily calorie, protein, carb, and fat targets. These targets are used across the app to track progress.

**What has been done**
- `Goals.jsx` page is fully built with a goal selector dropdown and numeric inputs for all four macro targets
- On load, the page fetches the current user from `GET /api/users/1` and pre-fills the form
- Submitting the form sends a `PATCH /api/users/1` request to save the updated targets
- Server-side: `users` controller and routes support full CRUD (`GET`, `POST`, `PATCH`, `DELETE`)

**What still needs to be done**
- End-to-end testing with a live database to confirm save/load works correctly in production
- Consider what happens if no user record exists (currently assumes user with `id = 1` always exists)

---

### Issue 2 – Implement Food Item Library

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
Users can create, edit, and delete reusable food items. Each food item stores its name, calories, protein, carbs, fat, and serving unit (g, oz, cup, etc.). Editing and deleting should happen on the same page without navigating away.

**What has been done**
- `FoodLibrary.jsx` renders all food items in a grid with search filtering
- Inline edit modal opens on the same page (no navigation) and sends a `PATCH` request on save
- Delete button removes the item via `DELETE /api/food-items/:id` and updates the list in state
- `AddFoodItem.jsx` is a separate form page at `/foods/new` that POSTs a new food item and redirects back to the library
- Server-side: `food_items` controller and routes support full CRUD

**What still needs to be done**
- End-to-end testing to confirm all CRUD operations work with the live database
- `CreateMeal.jsx` fetches food items but has no `res.ok` guard — if the fetch fails it will crash (same fix applied to other pages should be added here too)

---

### Issue 3 – Implement Build a Meal

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
Users create a meal (e.g. "Breakfast", "Post-workout") and add food items to it with a specific quantity/serving. MacroMate auto-calculates the meal's total macros from its food items.

**What has been done**
- `CreateMeal.jsx` lets users set a meal name and date, search the food library, add items with a quantity input, and remove items before saving
- On submit, the meal is created via `POST /api/meals`, then each food item is linked via `POST /api/meal-food-items/meal/:mealId`
- Server-side: `meals` and `meal_food_items` controllers and routes are in place including a join query that returns food item macro data alongside each meal entry
- Auto-calculated calorie and item count totals are shown in `Meals.jsx` using the joined meal-food-items data

**What still needs to be done**
- The "👁 View Details" button in `Meals.jsx` is rendered but has no `onClick` handler — it needs to navigate to a meal detail page (blocked by Issue 9 – dynamic routes)
- No way to edit or delete an existing meal from the UI
- `CreateMeal.jsx` is missing a `res.ok` guard when fetching food items (if the API fails, `allFoodItems.filter` will crash)

---

### Issue 4 – Build Daily Macro Dashboard

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
A dashboard shows all meals logged for the day, the running macro totals, and progress bars comparing consumed vs. target for calories, protein, carbs, and fat.

**What has been done**
- `Dashboard.jsx` fetches the current user's targets from `GET /api/users/1`
- Fetches today's meals from `GET /api/meals/user/1` and filters to today's date
- For each meal, fetches food items from `GET /api/meal-food-items/meal/:id` and accumulates macro totals
- Renders a progress bar for each macro (calories, protein, carbs, fat) showing consumed vs. target
- Shows a list of today's meals; displays "No meals logged for today" when empty

**What still needs to be done**
- Remaining macros (target minus consumed) are not displayed — this is covered by Issue 7
- The meals listed on the dashboard are not clickable/linked to a detail view — blocked by Issue 9
- `res.ok` guards have been added to `fetchUser` and `fetchTodaysMeals` to prevent crashes when the API returns an error, but `fetchTodaysMeals` also fetches meal-food-items in a loop with no guard — those inner fetches should be guarded too

---

## To Do

---

### Issue 5 – Build Meal History Log

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
Users can browse past meals by date to review what they ate and how their macros looked on any given day. Requires a dynamic route `/history/:date`.

**What has been done**
- `Meals.jsx` exists and shows all meals grouped by date with a date filter input
- Each meal row shows calorie total and item count
- A "👁 View Details" button is rendered per meal but is not wired up

**What still needs to be done**
- Add a dynamic route `/meals/:id` (or `/history/:date`) in `App.jsx` for a meal detail page
- Create a `MealDetail.jsx` page component that fetches a single meal and its food items by ID
- Wire the "👁 View Details" button in `Meals.jsx` to navigate to that route
- Display macro totals and a breakdown per meal on the detail page

---

### Issue 6 – Add Meal Macro Breakdown

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
Each meal displays a visual macro breakdown (percentage of calories from protein, carbs, and fat) so users can quickly spot imbalanced meals.

**What has been done**
- Nothing yet. The data needed for this (calories, protein, carbs, fat per meal) is already returned by `GET /api/meal-food-items/meal/:mealId` via a JOIN query

**What still needs to be done**
- Create a macro breakdown UI component (e.g. percentage bars or a visual split) showing % of calories from protein, carbs, and fat
- Formula: protein% = (protein × 4 / calories) × 100, carbs% = (carbs × 4 / calories) × 100, fat% = (fat × 9 / calories) × 100
- Display this on the meal detail page (MealDetail.jsx — see Issue 5) and optionally inline in `Meals.jsx`

---

### Issue 7 – Add Remaining Macros Calculator

## NOTE: For this specific issue, when you complete it, please go to readme.md and check off the feature by adding a ✅ emoji as well as adding a gif showing this feature's functionality.

**Description**
After logging meals, MacroMate shows how many calories and grams of each macro the user still has left for the day, helping them plan their next meal.

**What has been done**
- `Dashboard.jsx` already calculates `totals` (consumed amounts) and has access to `user` (which holds the targets). All the data needed is already in component state.

**What still needs to be done**
- Add a "Remaining" section to `Dashboard.jsx` that displays `target - consumed` for each macro
- Handle edge cases: if consumed exceeds target, show 0 remaining or a "over target" indicator rather than a negative number

---

### Issue 8 – Deploy Frontend and Backend to Render

**Description**
Configure both the Express backend and React frontend as Render services with environment variables. Ensure all pages and features work in production.

**What has been done**
- The PostgreSQL database is already provisioned on Render and the connection string is in `server/.env`

**What still needs to be done**
- **Backend**: Create a Render Web Service pointed at the `server/` directory with `npm start` as the start command. Add all env vars from `server/.env` (`PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`) in the Render dashboard
- **Frontend**: Create a Render Static Site pointed at `client/`. Set build command to `npm run build` and publish directory to `dist`
- **API URL**: The Vite dev proxy (`/api` → `http://localhost:3001`) does not work in production. The frontend will need an environment variable (e.g. `VITE_API_URL`) pointing to the deployed backend URL, and all `fetch('/api/...')` calls will need to be updated to use it
- Verify all routes and features work end-to-end after deployment

---

### Issue 9 – Set Up Dynamic Routes with React Router

**Description**
Configure dynamic routes such as `/meals/:id` and `/food-items/:id` using React Router so individual meal and food item detail pages can be accessed by ID.

**What has been done**
- React Router is already configured in `App.jsx` using `useRoutes`
- Existing static routes: `/`, `/goals`, `/meals`, `/meals/new`, `/foods`, `/foods/new`

**What still needs to be done**
- Add a `/meals/:id` dynamic route in `App.jsx` pointing to a new `MealDetail.jsx` page
- Create `MealDetail.jsx` — it should read the `id` param via `useParams()`, fetch the meal from `GET /api/meals/:id`, fetch its food items from `GET /api/meal-food-items/meal/:id`, and render the full breakdown
- Optionally add `/foods/:id` if a food item detail page is needed
- Wire the "👁 View Details" button in `Meals.jsx` to `navigate(`/meals/${meal.id}`)` using `useNavigate`
