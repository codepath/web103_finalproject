# Milestone 4 Progress Report

## Milestone 4 Completion
Completion percentage for Milestone 4 - Unit 8 on GitHub: 100% 

Merged this unit:
- PR #15 (Lloani) closes #5 and covers #7: recipe seed data with meal types and dietary tags, pantry-matching query, `GET /api/recipes` and `GET /api/recipes/:id`. 
- PR #17 (Victoria): recipe search, meal type tabs, and sorting
- PR #12 (Dhimy) closes #11: Recipes page filters wired to the API, plus diet and max time filters
- PR #24 (Victoria): closes #9: Recipe Detail Modal

List each issue you completed this unit and the main file or folder where that work lives, one per line:
- Expand recipe seed data + pantry-matching query (#5, merged in PR #15) - database/seed.sql, backend/controllers/recipeController.js
- Recipes API: list (filter/sort) + detail (#7, merged in PR #15) - backend/controllers/recipeController.js, backend/routes/recipeRoutes.js, backend/server.js, planning/api_routes.md
- Wire Recipes page, filters & modal to the API (#11, in PR #12; modal part waits on #9) - frontend/src/api.js, frontend/src/pages/Recipes.jsx, frontend/src/components/RecipeCard.jsx, frontend/src/styles/recipes.css
- Recipe filter & sort bar (#10; search, meal type tabs and sort merged in PR #17, diet and max time added in PR #12) - frontend/src/pages/Recipes.jsx
- Recipe Detail Modal - frontend/src/components/RecipeCard.jsx, frontend/src/components/RecipeDetail.jsx, frontend/src/pages/Recipes.jsx, frontend/src/styles/recipes.css


## Features Completed This Unit
List each feature you completed and checked off in readme.md this unit, one per line:
- Recipe Filtering and Sorting 
- Recipe Detail Modal
