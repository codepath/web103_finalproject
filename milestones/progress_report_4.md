# Milestone 4 Progress Report

> Status as of 2026-11-08 (after PR #15 was merged). Update the percentage and lists below before submitting, as the remaining PRs are merged and their issues are closed.

## Milestone 4 Completion
Completion percentage for Milestone 4 - Unit 8 on GitHub: 20% (1 of 5 issues closed: #5; #7, #9, #10, #11 are open)

Merged this unit:
- PR #15 (Lloani) closes #5 and covers #7: recipe seed data with meal types and dietary tags, pantry-matching query, `GET /api/recipes` and `GET /api/recipes/:id`. #7 is still open on GitHub because only #5 was auto-closed.
- PR #17 (Victoria): recipe search, meal type tabs, and sorting

Ready for review but not yet merged:
- PR #12 (Dhimy) closes #11: Recipes page filters wired to the API, plus diet and max time filters

List each issue you completed this unit and the main file or folder where that work lives, one per line:
- Expand recipe seed data + pantry-matching query (#5, merged in PR #15) - database/seed.sql, backend/controllers/recipeController.js
- Recipes API: list (filter/sort) + detail (#7, merged in PR #15) - backend/controllers/recipeController.js, backend/routes/recipeRoutes.js, backend/server.js, planning/api_routes.md
- Wire Recipes page, filters & modal to the API (#11, in PR #12; modal part waits on #9) - frontend/src/api.js, frontend/src/pages/Recipes.jsx, frontend/src/components/RecipeCard.jsx, frontend/src/styles/recipes.css
- Recipe filter & sort bar (#10; search, meal type tabs and sort merged in PR #17, diet and max time added in PR #12) - frontend/src/pages/Recipes.jsx

Still in progress:
- Recipe Detail Modal (#9) - Victoria's branch, not pushed yet

## Features Completed This Unit
List each feature you completed and checked off in readme.md this unit, one per line:
- Recipe Filtering and Sorting (checked off in PR #12; lands in main once PR #12 is merged)
