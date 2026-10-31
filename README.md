# PrepWise

CodePath WEB103 Final Project

Designed and developed by: Lloani M, Kevon Dawkins, Victoria Zhunio, Dhimy Jean, Sarin Sigma

🔗 Link to deployed app: we use render here

## About


### Description and Purpose

PrepWise is a full-stack meal-planning and pantry-management application designed to help users make more efficient decisions about what to cook and what groceries they actually need. The platform allows users to manage pantry inventory, discover recipes based on available ingredients, organize meals for the week, save preferred recipes, and generate shopping lists for missing items.

The purpose of PrepWise is to bring several everyday food-planning tasks into one centralized application. By connecting pantry tracking with recipe discovery and meal planning, the app helps users save time, reduce unnecessary grocery purchases, minimize food waste, and maintain a more organized approach to preparing meals.

### Inspiration

Many people have busy schedules during the week and may not have enough time to decide what to cook or prepare meals. Planning meals ahead of time, especially during the weekend, can help make weekdays less stressful. Having a grocery list that shows the ingredients needed for recipes they want to try also makes shopping easier and helps people prepare in advance when they have time to visit the store. 

## Getting Started

Requires Node.js and PostgreSQL.

```bash
createdb prepwise_dev
psql prepwise_dev -f database/schema.sql -f database/seed.sql

# Terminal 1: API on :3001
cd backend
cp .env.example .env        # edit DATABASE_URL if needed
npm install
npm run dev

# Terminal 2: React app on :5173
cd frontend
npm install
npm run dev
```

In development, Vite forwards `/api` requests to the backend.

## Tech Stack

- **Frontend:** React, React Router, JavaScript,CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Deployment:** Render

## Features

### Pantry Inventory
Users can add, view, edit, and delete ingredients in their pantry, including ingredient name, quantity, category, and expiration information.

[gif goes here]

### Smart Recipe Suggestions
Users can view recipe suggestions based on ingredients they currently have in their pantry. Recipes will show which ingredients the user already has and which ingredients are missing.

[gif goes here]

### Weekly Meal Planner
Users can add recipes to a weekly meal plan and organize meals by day.

[gif goes here]

### Smart Shopping List
Users can create a shopping list for ingredients they still need to buy, including ingredients missing from planned recipes.

[gif goes here]

### Recipe Detail Modal
Users can open a recipe in a modal without leaving the current page. The modal displays ingredients, instructions, preparation time, and other recipe details.

[gif goes here]

### Recipe Filtering and Sorting
Users can filter and sort recipes by preparation time, meal type, dietary preference, or ingredient match.

[gif goes here]

### Saved Recipes
Users can save recipes they like and view them later from a saved recipes page.

[gif goes here]

### Ingredient and Recipe Matching
Recipes and ingredients are connected using a many-to-many relationship so the app can compare recipe requirements with the user's pantry.

[gif goes here]
### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

[instructions go here]
