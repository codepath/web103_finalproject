# MacroMate

CodePath WEB103 Final Project

Designed and developed by: Nour Siwar, Diwash Kuskusmiya, Yens Castro, Derrick Woodall

🔗 Link to deployed app: 

## About

### Description and Purpose

MacroMate is a nutrition tracking web app designed to help users hit their daily calorie and macro targets based on their fitness goal — whether they're on a cut, bulk, or maintenance phase. Users build meals from a reusable food item library, each with detailed macro data (calories, protein, carbs, fat), and MacroMate automatically calculates their daily totals against their personal targets.

### Inspiration

Counting macros is one of the most effective ways to reach a body composition goal, but most dedicated macro tracking apps are either too complex, paywalled, or cluttered with features most people don't need. We wanted to build a clean, straightforward tool focused on the core loop: set your goal, log your food, see your numbers.

## Tech Stack

Frontend: React, React Router

Backend: Node.js, Express, PostgreSQL (using Render)

## Installation Instructions

[instructions go here]



## Features

### !! NOTE !! We have been told that if we have GIFs for at least 5 features, we no longer need to add GIFs for the rest of the features

### Set Your Macro Goal

Users select a goal (cut, bulk, or maintain) and input their daily calorie, protein, carb, and fat targets. These targets are used across the app to track progress.

[gif goes here]

### Food Item Library [✅]

Users can create, edit, and delete reusable food items. Each food item stores its name, calories, protein, carbs, fat, and serving unit (g, oz, cup, etc.).

[View Demo](https://imgur.com/a/c9HQZzM.gif)

### Build a Meal [✅]

Users create a meal (e.g. "Breakfast", "Post-workout") and add food items to it with a specific quantity/serving. MacroMate auto-calculates the meal's total macros from its food items.

[View Demo](https://imgur.com/a/o9UzMXU.gif)

### Daily Macro Dashboard

A dashboard shows all meals logged for the day, the running macro totals, and progress bars comparing consumed vs. target for calories, protein, carbs, and fat.

[View Demo](https://imgur.com/a/KDse5Su.gif)

### Meal History Log

Users can browse past meals by date to review what they ate and how their macros looked on any given day.

[gif goes here]

### Remaining Macros Calculator [✅]

After logging meals, MacroMate shows how many calories and grams of each macro the user still has left for the day, helping them plan their next meal.

[View Demo](https://imgur.com/a/movM6Nh.gif)

### Meal Macro Breakdown

Each meal displays a visual macro breakdown (percentage of calories from protein, carbs, and fat) so users can quickly spot imbalanced meals.

[gif goes here]

## Custom Features

### Graceful error handling [✅]

This has been implemented by adding try/catch in all controllers, error states in every page

### Slide-out pane or modal [✅]

The web app includes a slide-out pane or modal as appropriate for your use case that pops up and covers the page content without navigating away from the current page. This was implemented by having SelectFoodModal in CreateMeal, edit modal in FoodLibrary, day modal in Log, and NutriBot pane

### Unique field in join table [✅]

The web app includes a unique field within the join table. This was implemented by adding the "quantity" column in meal_food_items beyond the two foreign keys

### Custom non-RESTful route [✅]

The web app includes a custom non-RESTful route with corresponding controller actions. This was implemented by adding routes like /api/auth/login, /api/auth/register, /api/meals/user/:userId, /api/chatbot.

### Filter or sort items [✅]

The user can filter or sort items based on particular criteria as appropriate for your use case. This was implemented by adding a date filter on Meals page, and search filter in FoodLibrary and CreateMeal modal

### Data auto-generated on action [✅]

Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account. This was implemented by having default macro goals (2000 kcal, 150g protein, etc.) auto-created on registration

### POST/PATCH validation [✅]

Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created). This was implemented by having the Goals page validate ranges client-side; auth checks duplicate email server-side

## Stretch Features

### 🥗 NutriBot (Stretch Feature) [✅]

NutriBot is an AI-powered assistant that gives guidance on macronutrient intake.

- General advice on carbs, protein, and fats  
- Reads user data for personalized recommendations via gemini-tool calling

[View Demo](https://imgur.com/a/0Hjn6lk.gif)

### Pages require login [✅]

This is implemented by using App.jsx to redirect unauthenticated users to /login for all routes

### Loading spinner [✅]

This was partially implemented by having the dashboard showing "Loading..." text, and NutriBot has animated dots

### Data Visualization [✅]

Implemented custom SVG pie charts: hand-coded with trig math (toXY(), arc calculations), not a chart library. Live-updating as you add food items in CreateMeal, MealDetail and Log

Implemented color-coded animated progress bars on Dashboard (green → yellow → red based on how close you are to targets)

### Advanced UI Components [✅]

Implemented multi-date calendar picker that is built from scratch with no date library, full month navigation, multi-select with Set logic, modal animations

Also implemented SelectFoodModal with a multi-checkbox food selector with real-time search, and duplicate prevention, "already added" badges, keyboard support.
