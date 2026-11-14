
<div align="center">

# 🍳 PrepWise

### Your Smart Kitchen Companion

![Typing SVG](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Plan+Smarter.+Cook+Better.;Your+AI+Cooking+Companion;Smart+Pantry+Management;Discover+Delicious+Recipes;Meet+Your+Animated+AI+Chef!)

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployment-000000?style=for-the-badge&logo=render&logoColor=white)

**CodePath WEB103 Final Project**

Designed and developed by:

Lloani M • Kevon Dawkins • Victoria Zhunio • Dhimy Jean • Sarin Sigma

**Plan Smarter. Cook Better. Waste Less.**

</div>

---

## 🔗 Live Application

- **Deployment:** Render
- **Live App:** Deployment link coming soon.
- **Repository:** [PrepWise Source Code](https://github.com/lloanim/web103_finalproject)

---

## 📖 About

### Description and Purpose

PrepWise is a full-stack, AI-powered meal planning and pantry management application designed to help users make more efficient decisions about what to cook and what groceries they actually need.

The platform allows users to manage pantry inventory, discover recipes based on available ingredients, organize meals for the week, save favorite recipes, and generate shopping lists for missing ingredients.

PrepWise also introduces an interactive AI cooking assistant with an animated virtual chef that provides personalized recipe recommendations, responds to user actions, and guides users through cooking instructions.

The purpose of PrepWise is to bring everyday food-planning tasks into one centralized application.

By connecting pantry tracking, recipe discovery, artificial intelligence, and meal planning, PrepWise helps users:

- Save time deciding what to cook.
- Reduce unnecessary grocery purchases.
- Minimize food waste.
- Discover new recipes.
- Stay organized throughout the week.
- Receive personalized cooking recommendations.
- Enjoy an interactive cooking experience.

### Inspiration

Many people have busy schedules during the week and may not have enough time to decide what to cook or prepare meals.

Planning meals ahead of time, especially during the weekend, can make weekdays less stressful. A grocery list that identifies missing ingredients also makes shopping easier and helps people prepare in advance.

PrepWise was created to make everyday meal planning more convenient, personalized, interactive, and enjoyable through technology.

---

## ✨ Core Features

### ✅ Smart Dashboard

A centralized dashboard displays real-time kitchen information.

Features include:

- Current date and time.
- Total pantry ingredients.
- Today's planned meals.
- Number of saved recipes.
- Remaining shopping list items.
- Ingredients approaching expiration.
- Quick actions for common tasks.

### ✅ Pantry Inventory

Users can add, view, edit, and delete ingredients in their pantry.

Each pantry item includes:

- Ingredient name.
- Quantity.
- Measurement unit.
- Category.
- Expiration date.

![Pantry Inventory](planning/assets/pantry-inventory.gif)

### ✅ Smart Recipe Suggestions

Users can discover recipes based on ingredients they currently have in their pantry.

Recipes display:

- Available ingredients.
- Missing ingredients.
- Ingredient match counts.
- Preparation and cooking information.
- Food images.
- Dietary preferences.

### ✅ Recipe Detail Modal

Users can open a recipe without leaving the current page.

The recipe detail modal displays:

- Recipe images.
- Ingredients.
- Ingredient quantities.
- Preparation time.
- Cooking time.
- Servings.
- Cooking instructions.

Users can also save recipes or add them directly to their meal planner.

![Recipe Detail Modal](planning/assets/recipe-detail-modal.gif)

### ✅ Recipe Filtering and Sorting

Users can filter recipes by:

- Meal type.
- Dietary preference.
- Cooking time.

Recipes can also be sorted by name, cooking time, and ingredient availability.

![Recipe Filtering and Sorting](planning/assets/recipe-filtering.gif)

### ✅ Weekly Meal Planner

Users can organize meals in an interactive weekly calendar.

Features include:

- Add recipes to specific dates.
- Organize breakfast, lunch, dinner, and snacks.
- Navigate between calendar weeks.
- View planned meals.
- Remove meals from the calendar.
- Generate shopping lists from planned recipes.

The AI assistant can also generate a seven-day dinner plan using available recipes and user preferences.

### ✅ Smart Shopping List

Users can create and manage shopping lists for ingredients they still need to purchase.

Features include:

- Add shopping list items.
- Check off purchased ingredients.
- Delete items.
- Add missing ingredients from recipes.
- Generate shopping lists from weekly meal plans.
- Combine compatible measurement units.
- Move purchased ingredients into the pantry.

![Smart Shopping List](planning/assets/shopping-list.gif)

### ✅ Saved Recipes

Users can save their favorite recipes and access them later.

Features include:

- Save favorite recipes.
- Remove saved recipes.
- View food images and preparation times.
- Open recipe details.
- Add favorite recipes to meal plans.

### ✅ Ingredient and Recipe Matching

Recipes and ingredients are connected using a many-to-many relationship in PostgreSQL.

This allows PrepWise to compare recipe requirements with the user's pantry and identify available and missing ingredients.

---

## 🤖 PrepWise AI Assistant

PrepWise includes an intelligent cooking assistant powered by the Google Gemini API.

The AI assistant uses function calling to retrieve real pantry information, recipe data, and meal plans from the application.

### AI Capabilities

| Feature | Description |
|---------|-------------|
| Pantry Recommendations | Suggest recipes using available ingredients |
| Missing Ingredients | Identify ingredients needed to prepare recipes |
| Recipe Discovery | Search local and online recipe collections |
| Dietary Preferences | Personalize recommendations based on dietary selections |
| Allergy Screening | Screen known ingredients against user restrictions |
| Weekly Meal Planning | Generate seven-day dinner plan previews |
| Shopping Lists | Generate grocery lists from confirmed meal plans |
| Expiration Awareness | Identify ingredients approaching expiration |
| Conversation Memory | Remember recent conversation text |
| Interactive Recipe Cards | Display images and recipe actions inside the chatbot |

### Example AI Questions

- What can I cook with my pantry ingredients?
- Recommend three high-protein dinners.
- What ingredients are expiring soon?
- Create a seven-day dinner plan.
- Find new salmon recipes online.
- Recommend meals based on my dietary preferences.
- What are my saved ingredient restrictions?
- Help me reduce food waste this week.

### Personalized Dietary Preferences

Users can select preferences including:

- Vegetarian
- Vegan
- Pescatarian
- Gluten Free
- High Protein

Users can also select common food allergies or add custom ingredients to avoid.

The assistant uses these preferences when filtering recipe recommendations.

**Important:** Dietary classifications and ingredient screening cannot guarantee that a recipe is allergy-safe. Users must verify ingredient labels, preparation methods, and cross-contamination risks.

### Persistent Conversation Memory

The chatbot remembers recent conversation text and dietary preferences using browser localStorage.

Users can refresh the application without losing their saved preferences or previous conversation text.

A New Chat button allows users to start a fresh conversation.

### Confirmed Actions

The AI assistant provides recommendations and previews.

Users confirm actions through the interface before saving recipes, importing recipes, modifying meal plans, or generating shopping lists.

---

## 🌐 Live Recipe Discovery

PrepWise integrates with TheMealDB API to discover recipes beyond its existing PostgreSQL database.

### TheMealDB Integration

Users can:

- Search for new recipes online.
- Discover international dishes.
- View recipe images.
- Review ingredients and measurements.
- Read cooking instructions.
- Import recipes into the local database.
- Review unsupported measurements before importing.
- Save imported recipes as favorites.
- Add imported recipes to meal plans.
- Generate shopping lists from imported recipes.

External recipe data and food images are provided by [TheMealDB](https://www.themealdb.com/).

---

## 👨‍🍳 Meet Your PrepWise Chef 2.0

<div align="center">

### Your interactive virtual cooking companion

![Chef Typing Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=20&duration=2500&pause=1200&color=C8553D&center=true&vCenter=true&width=550&lines=Need+help%3F;Let's+cook+something+delicious!;Thinking+of+your+next+meal...;Your+meal+plan+is+ready!;Great+job%2C+Chef!)

**An animated chef that reacts, speaks, dances, and helps you cook.**

</div>

<!--
Add a recording of the actual animated chef here
after creating planning/assets/chef-animation.gif:

<div align="center">
  <img src="planning/assets/chef-animation.gif" width="280" alt="Interactive PrepWise Chef" />
</div>
-->

PrepWise introduces an animated virtual chef designed to make meal planning feel more personal and engaging.

The chef is built using React, SVG animations, CSS, and browser speech synthesis.

### 12 Interactive Character Features

| Feature | Character Behavior |
|---------|--------------------|
| 👀 Eye Tracking | Eyes follow the user's mouse cursor |
| 🗣️ Voice Assistant | Speaks AI responses with animated mouth movements |
| 🥱 Time-Based Emotions | Changes mood based on the time of day |
| 🍳 Cooking Animation | Displays a cooking pot, stirring spoon, and steam |
| 🎉 Celebrations | Celebrates successful actions with confetti |
| 😟 Expiration Warnings | Shows concern when ingredients approach expiration |
| 🛒 Shopping Mode | Carries a basket on the Shopping List page |
| 😋 Recipe Reactions | Reacts when users discover or view recipes |
| 🧠 Smart Memory | Personalizes greetings using dietary preferences |
| 🎮 Interactive Controls | Can dance, be dragged, and reset its position |
| 💬 Proactive Reminders | Displays real pantry alerts |
| 👨‍🍳 Guided Cooking | Helps users follow recipes step by step |

### Character Emotions

The chef changes expressions depending on what is happening inside PrepWise.

- **Idle:** Blinks, breathes, and waves.
- **Happy:** Smiles and welcomes the user.
- **Thinking:** Tilts its head while the AI generates a response.
- **Excited:** Celebrates completed actions.
- **Worried:** Alerts users about expiring ingredients.
- **Sleepy:** Yawns during nighttime hours.
- **Dancing:** Performs a happy dance when its hat is tapped.
- **Speaking:** Animates its mouth while reading responses.

### Voice Controls

Users can optionally enable the chef's voice.

The assistant uses the browser's Web Speech API to:

- Read AI responses aloud.
- Speak individual cooking instructions.
- Greet the user.
- Celebrate completed cooking sessions.

Voice responses can be disabled at any time.

### Guided Cooking Mode

The chef includes a dedicated cooking interface where users can:

1. Select a recipe from the PrepWise database.
2. Review ingredients and dietary restrictions.
3. Follow the recipe's original cooking instructions.
4. Navigate between individual steps.
5. Listen to spoken cooking instructions.
6. Start and stop a cooking countdown timer.
7. Complete the recipe and celebrate with the chef.

Cooking timers run while the cooking guide is open.

---

## 🎨 User Interface

### Light and Dark Mode

PrepWise includes two appearance modes.

- ☀️ Light Mode
- 🌙 Dark Mode

Users can switch between themes using the sidebar appearance control.

The selected theme is saved locally and remains active after refreshing the application.

### Animated Food Background

The application features a kitchen-themed animated background containing floating fruits, vegetables, and ingredients.

Food animations use CSS and remain behind the main application interface.

### Responsive Design

PrepWise includes responsive layouts for desktop and smaller screens.

### Accessibility

The interface includes:

- Keyboard-accessible controls.
- Descriptive accessibility labels.
- Visible focus indicators.
- Reduced-motion support for animations.
- Optional voice playback.

---

## 🛠 Tech Stack

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

</div>

| Category | Technologies |
|----------|--------------|
| Frontend | React, React Router, JavaScript |
| Styling | HTML, CSS, SVG |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| AI Integration | Google Gemini API |
| Recipe Integration | TheMealDB API |
| Character Animation | SVG and CSS Animations |
| Voice Assistant | Web Speech API |
| Browser Storage | localStorage |
| Deployment | Render |
| Version Control | Git and GitHub |

---

## 🏗 System Architecture

```mermaid
flowchart TD
    A[User] --> B[React Frontend]
    B --> C[Express API]
    C --> D[(PostgreSQL)]
    C --> E[Google Gemini API]
    C --> F[TheMealDB API]
    B --> G[Animated Chef]
    B --> H[Browser localStorage]
    G --> I[Web Speech API]
```

### Application Workflow

1. The user interacts with the React frontend.
2. The frontend sends requests to the Express backend.
3. The backend retrieves or updates PostgreSQL data.
4. The AI assistant uses Gemini to provide personalized recommendations.
5. TheMealDB provides external recipes for discovery and importing.
6. The animated chef reacts to user interactions and application events.

---

## 🗄 Database Architecture

PrepWise uses a relational PostgreSQL database with eight core tables.

| Table | Description |
|-------|-------------|
| users | Stores user records |
| ingredients | Stores the ingredient catalog |
| recipes | Stores recipe information and instructions |
| pantry_items | Tracks pantry inventory and expiration dates |
| recipe_ingredients | Connects recipes with required ingredients |
| meal_plan_entries | Stores scheduled meals |
| saved_recipes | Connects users with favorite recipes |
| shopping_list_items | Stores shopping list items |

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PANTRY_ITEMS : owns
    INGREDIENTS ||--o{ PANTRY_ITEMS : contains

    RECIPES ||--o{ RECIPE_INGREDIENTS : requires
    INGREDIENTS ||--o{ RECIPE_INGREDIENTS : included_in

    USERS ||--o{ MEAL_PLAN_ENTRIES : plans
    RECIPES ||--o{ MEAL_PLAN_ENTRIES : scheduled_in

    USERS ||--o{ SAVED_RECIPES : saves
    RECIPES ||--o{ SAVED_RECIPES : saved_as

    USERS ||--o{ SHOPPING_LIST_ITEMS : manages
    INGREDIENTS ||--o{ SHOPPING_LIST_ITEMS : needed_for
```

The database uses primary keys, foreign keys, constraints, and many-to-many relationships to maintain referential integrity.

---

## 📁 Project Structure

```text
web103_finalproject/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── mealdbRoutes.js
│   │   ├── mealPlanRoutes.js
│   │   ├── pantryRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── savedRecipesRoutes.js
│   │   └── shoppingRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── mealdb_migration.sql
│   └── recipe_images.sql
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChefMascot.jsx
│   │   │   ├── ChefCookingGuide.jsx
│   │   │   ├── PrepWiseChat.jsx
│   │   │   ├── ChatRecipeCard.jsx
│   │   │   ├── ChatWeeklyPlan.jsx
│   │   │   ├── ChatMealDBRecipes.jsx
│   │   │   └── FoodBackground.jsx
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── planning/
│   └── assets/
│
└── README.md
```

---

## 🚀 Installation Instructions

### Prerequisites

Before running PrepWise, install:

- Node.js 22 or newer recommended
- npm
- PostgreSQL
- Git
- Google Gemini API key for AI features

### 1. Clone the Repository

```bash
git clone https://github.com/lloanim/web103_finalproject.git

cd web103_finalproject
```

### 2. Create the PostgreSQL Database

```bash
createdb prepwise_dev
```

Create the schema and load sample data:

```bash
psql -d prepwise_dev -f database/schema.sql -f database/seed.sql
```

Run the seed script only on a fresh development database.

Do not run the seed script against a shared or production database.

For older databases created before the MealDB integration, apply the migration:

```bash
psql -d prepwise_dev -f database/mealdb_migration.sql
```

### 3. Configure Environment Variables

Navigate to the backend folder:

```bash
cd backend
```

Copy `.env.example` to `.env`.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Configure the `backend/.env` file:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/prepwise_dev

PORT=3001

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

GEMINI_MODEL=gemini-3.5-flash-lite
```

Replace the database credentials with your own PostgreSQL settings.

Use a Gemini model available to your Google AI Studio project.

You can obtain an API key from [Google AI Studio](https://aistudio.google.com/).

**Never commit API keys, passwords, or the `.env` file to GitHub.**

### 4. Start the Backend

From the backend folder:

```bash
npm install

npm run dev
```

Backend URL:

```text
http://localhost:3001
```

### 5. Start the Frontend

Open a new terminal from the project root:

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Vite forwards `/api` requests to the Express backend during development.

### 6. Test the Application

Open the frontend URL in your browser.

Verify that the following features work:

- Dashboard
- Pantry Inventory
- Discover Recipes
- Meal Planner
- Shopping List
- Saved Recipes
- AI Assistant
- Animated Chef
- Guided Cooking Mode
- Light and Dark Mode

The backend health endpoint is available at:

```text
http://localhost:3001/api/health
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Backend health check |
| GET | /api/pantry-items | List pantry ingredients |
| POST | /api/pantry-items | Add pantry ingredients |
| PATCH | /api/pantry-items/:id | Update pantry ingredients |
| DELETE | /api/pantry-items/:id | Remove pantry ingredients |
| GET | /api/recipes | List and filter recipes |
| GET | /api/recipes/:id | Retrieve recipe details |
| GET | /api/meal-plan | Retrieve weekly meal plan |
| POST | /api/meal-plan | Add a planned meal |
| PATCH | /api/meal-plan/:id | Update a planned meal |
| DELETE | /api/meal-plan/:id | Remove a planned meal |
| GET | /api/saved-recipes | List favorite recipes |
| POST | /api/saved-recipes | Save a recipe |
| DELETE | /api/saved-recipes/:recipeId | Remove a saved recipe |
| GET | /api/shopping-list | List shopping items |
| POST | /api/shopping-list/generate | Generate weekly shopping list |
| GET | /api/mealdb/search | Search external recipes |
| POST | /api/mealdb/import/:mealId | Import an external recipe |
| POST | /api/chat | Communicate with PrepWise AI |
| POST | /api/chat/weekly-plan | Save a confirmed AI meal plan |

---

## ☁️ Deployment

PrepWise uses Render for deployment.

The backend requires the following environment variables:

- DATABASE_URL
- GEMINI_API_KEY
- GEMINI_MODEL
- PORT, as configured by the hosting environment

The deployed frontend must route API requests to the deployed backend.

Existing PostgreSQL databases must include the latest required database schema and migrations.

---

## 📸 Demo Walkthrough

### Pantry Management

![Pantry Demo](planning/assets/pantry-inventory.gif)

### Recipe Discovery and Details

![Recipe Details Demo](planning/assets/recipe-detail-modal.gif)

### Filtering and Sorting

![Recipe Filtering Demo](planning/assets/recipe-filtering.gif)

### Smart Shopping List

![Shopping List Demo](planning/assets/shopping-list.gif)

### AI Assistant and Interactive Chef

Demo recording coming soon.

<!--
Add your actual application recordings when available:

![AI Assistant](planning/assets/ai-assistant.gif)

![Interactive Chef](planning/assets/chef-animation.gif)

![Guided Cooking](planning/assets/guided-cooking.gif)

![Dark Mode](planning/assets/dark-mode.gif)

![Weekly Meal Planner](planning/assets/meal-planner.gif)
-->

---

## 🧪 Testing Checklist

### Core Application

- [x] Pantry inventory management
- [x] Recipe discovery
- [x] Recipe filtering and sorting
- [x] Recipe details
- [x] Weekly meal planning
- [x] Saved recipes
- [x] Shopping list management
- [x] Ingredient matching

### AI and Personalization

- [x] Gemini AI integration
- [x] AI function calling
- [x] Dietary preferences
- [x] Ingredient allergy screening
- [x] Conversation memory
- [x] AI weekly meal plans
- [x] TheMealDB search and import

### Interactive Features

- [x] Animated chef
- [x] Eye tracking
- [x] Time-based emotions
- [x] Voice assistant
- [x] Animated lip movement
- [x] Guided cooking interface
- [x] Cooking timers
- [x] Proactive pantry reminders
- [x] Animated food background
- [x] Light and dark mode

### Remaining Verification

- [ ] End-to-end testing of all deployed features
- [ ] Mobile browser compatibility testing
- [ ] Additional feature demonstration recordings
- [ ] Final accessibility and performance review

---

## 🔮 Future Improvements

Potential improvements include:

- Secure user authentication.
- Individual user accounts.
- Cross-device synchronization.
- Nutritional information and calorie tracking.
- More advanced quantity-based recommendations.
- Grocery price comparison.
- Mobile notifications.
- More advanced character animations.
- Additional languages and voice options.
- Automated frontend and backend testing.

### Current Limitations

- The current application uses a seeded demonstration user.
- Chat history, dietary preferences, and appearance settings are stored in the browser.
- Pantry matching does not always verify sufficient ingredient quantities.
- Dietary labels and ingredient screening cannot guarantee allergy safety.
- Imported recipes may require additional preparation times, serving information, or dietary classifications.
- Voice availability depends on browser support.
- Cooking timers and pantry reminders require the application to remain open.
- AI functionality is subject to Gemini API limits and model availability.

---

## 👥 Project Team

<div align="center">

| Team Member |
|-------------|
| Lloani M |
| Kevon Dawkins |
| Victoria Zhunio |
| Dhimy Jean |
| Sarin Sigma |

**Developed as part of the CodePath WEB103 Web Development program.**

</div>

---

## 🙏 Acknowledgments

- [CodePath](https://www.codepath.org/) — WEB103 Web Development
- [Google Gemini](https://ai.google.dev/) — AI cooking assistant
- [TheMealDB](https://www.themealdb.com/) — Recipe data and food images
- [React](https://react.dev/) — Frontend development
- [PostgreSQL](https://www.postgresql.org/) — Database management
- [Render](https://render.com/) — Deployment
- [Shields.io](https://shields.io/) — README badges
- [Readme Typing SVG](https://readme-typing-svg.demolab.com/) — Animated README text

---

<div align="center">

## 🍳 PrepWise

![Footer Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&size=20&duration=3000&pause=1000&color=C8553D&center=true&vCenter=true&width=500&lines=Plan+Smarter.;Cook+Better.;Waste+Less.;Thank+you+for+visiting+PrepWise!)

**Your kitchen. Your ingredients. Your AI chef.**

⭐ If you like this project, consider giving it a star!

</div>
