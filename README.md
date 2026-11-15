<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:C8553D,50:BD5539,100:743D2B&height=230&section=header&text=PrepWise&fontSize=80&fontColor=FFFFFF&animation=fadeIn&fontAlignY=35&desc=Your%20Smart%20Kitchen%20Companion&descAlignY=58&descSize=22" width="100%" />

![Typing SVG](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Plan+Smarter.+Cook+Better.;Your+AI+Cooking+Companion;Smart+Pantry+Management;Discover+Delicious+Recipes;Powered+by+Google+Gemini!)

<br>

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployment-000000?style=for-the-badge&logo=render&logoColor=white)

<br>

# 🍳 PrepWise 3.1

### CodePath WEB103 Final Project

**Plan Smarter. Cook Better. Waste Less.**

[![Launch PrepWise](https://img.shields.io/badge/Launch-PrepWise-C8553D?style=for-the-badge&logo=render&logoColor=white)](https://prepwise-backend-stln.onrender.com)
[![GitHub](https://img.shields.io/badge/View-Source_Code-181717?style=for-the-badge&logo=github)](https://github.com/lloanim/web103_finalproject)

<br>

![Status](https://img.shields.io/badge/Status-Deployed-success?style=flat-square)
![Desktop](https://img.shields.io/badge/Desktop-Tested-success?style=flat-square)
![Android](https://img.shields.io/badge/Android-Tested-success?style=flat-square)
![Version](https://img.shields.io/badge/Version-3.1-C8553D?style=flat-square)
![Project](https://img.shields.io/badge/CodePath-WEB103-blue?style=flat-square)

### Developed By

**Lloani M • Kevon Dawkins • Victoria Zhunio • Dhimy Jean • Sarin Sigma**

</div>

---

<div align="center">

## ✨ Discover PrepWise

![Feature Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=700&size=21&duration=2500&pause=1200&color=C8553D&center=true&vCenter=true&width=650&lines=Speak+to+Your+AI+Chef;Plan+Your+Entire+Week;Scan+Your+Groceries;Track+Your+Nutrition;Manage+Your+Grocery+Budget;Cook+Smarter+Every+Day)

</div>

---

## 🔗 Live Application

| Resource | Link |
|----------|------|
| 🌐 Live Website | [Launch PrepWise](https://prepwise-backend-stln.onrender.com) |
| 💻 Source Code | [GitHub Repository](https://github.com/lloanim/web103_finalproject) |
| 🌿 Production Branch | [Main](https://github.com/lloanim/web103_finalproject/tree/main) |
| 🟢 Backend Health | [API Health Check](https://prepwise-backend-stln.onrender.com/api/health) |
| ☁️ Hosting Platform | [Render](https://render.com/) |

> PrepWise is hosted on Render. Free-tier hosting may experience a short startup delay after inactivity.

---

## 📖 About PrepWise

PrepWise is a full-stack, AI-powered kitchen management application designed to simplify everyday meal planning, grocery shopping, pantry management, and cooking.

Instead of using multiple applications to organize meals, track ingredients, and discover recipes, users can manage their entire kitchen from one centralized platform.

PrepWise combines personalized user accounts, a relational PostgreSQL database, recipe discovery, interactive meal planners, grocery scanning, nutrition tracking, budgeting, and an animated AI cooking assistant.

### 🎯 Our Mission

- Help users decide what to cook.
- Reduce unnecessary food waste.
- Simplify weekly meal planning.
- Save time and money when grocery shopping.
- Discover recipes using available ingredients.
- Encourage organized cooking habits.
- Provide personalized cooking assistance.
- Make kitchen management more interactive and enjoyable.

### 💡 Inspiration

Many people have busy schedules and struggle to decide what to cook, remember which ingredients they already have, and determine what groceries they need.

PrepWise was created to solve this problem by connecting everyday kitchen tasks with artificial intelligence.

Our goal is to help users plan smarter, cook better, and waste less.

---

## 📚 Table of Contents

- [Core Features](#core-features)
- [Dual Meal Planning System](#dual-meal-planning-system)
- [PrepWise AI Assistant](#prepwise-ai-assistant)
- [Voice Assistant](#voice-assistant)
- [Smart Shopping List](#smart-shopping-list)
- [Online Recipe Integration](#online-recipe-integration)
- [Kitchen Studio](#kitchen-studio)
- [Grocery Scanner](#grocery-scanner-20)
- [Interactive Chef](#meet-your-prepwise-chef)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Architecture](#database-architecture)
- [Installation](#installation-instructions)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Testing Results](#final-testing-results)
- [Project Team](#project-team)

---

<a id="core-features"></a>

## ✨ Core Features

### 🔐 User Authentication

PrepWise supports individual user accounts with personalized kitchen information.

Features include:

- Account registration.
- User login and logout.
- Password hashing.
- Database-backed authentication sessions.
- Automatic session restoration.
- Protected application routes.
- Account-specific pantry inventory.
- Personalized meal plans.
- Individual shopping lists.
- Saved recipes.
- Personal Kitchen Studio records.

Each user manages their own kitchen data without interfering with another user's account.

---

### 🏠 Smart Dashboard

The dashboard provides a centralized overview of the user's kitchen.

Features include:

- Personalized greetings.
- Current date and time.
- Total pantry ingredients.
- Today's planned meals.
- Saved recipe count.
- Remaining shopping list items.
- Ingredients approaching expiration.
- Quick access to kitchen tools.
- Grocery scanner shortcut.
- Interactive AI chef.

---

### 🥫 Pantry Inventory

Users can add, view, edit, and remove pantry ingredients.

Each pantry item includes:

- Ingredient name.
- Quantity.
- Measurement unit.
- Category.
- Expiration date.

Additional functionality:

- Track ingredient availability.
- Identify ingredients approaching expiration.
- Recommend recipes using available ingredients.
- Deduct ingredients after cooking.
- Add purchased shopping items to the pantry.

<div align="center">

![Pantry Inventory](planning/assets/pantry-inventory.gif)

**Smart Pantry Inventory Management**

</div>

---

### 🍲 Smart Recipe Discovery

Users can discover recipes based on ingredients they currently have.

Recipes may display:

- Food images.
- Available ingredients.
- Missing ingredients.
- Ingredient match counts.
- Preparation time.
- Cooking time.
- Serving information.
- Dietary classification.
- Cooking instructions.

Users can filter recipes by:

- Meal type.
- Dietary preference.
- Cooking time.

Users can also sort recipes using the available sorting options.

<div align="center">

![Recipe Filtering](planning/assets/recipe-filtering.gif)

**Recipe Filtering and Sorting**

</div>

---

### 📋 Recipe Details

Users can open detailed recipe information without leaving the current page.

The recipe detail interface includes:

- Recipe images.
- Ingredient names.
- Ingredient quantities.
- Preparation and cooking times.
- Serving information.
- Cooking instructions.
- Ingredient availability indicators.
- Save recipe action.
- Add to meal planner action.

<div align="center">

![Recipe Detail](planning/assets/recipe-detail-modal.gif)

**Interactive Recipe Details**

</div>

---

### ❤️ Saved Recipes

Users can maintain their own collection of favorite recipes.

Features include:

- Save favorite recipes.
- Remove saved recipes.
- View recipe details.
- View food images.
- Add favorites to meal plans.
- Access saved recipes across sessions.

---

<a id="dual-meal-planning-system"></a>

## 📅 Dual Meal Planning System

PrepWise offers two integrated meal planner experiences that share the same PostgreSQL meal plan data.

<div align="center">

![Planner Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=21&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=600&lines=Your+Week.+Your+Meals.;Two+Planners.+One+Kitchen.;Plan+with+AI.+Cook+with+Confidence.)

</div>

### 1️⃣ Weekly Planner

The redesigned Weekly Planner includes:

- Interactive weekly calendar.
- Breakfast, lunch, dinner, and snack slots.
- Recipe selection directly from meal slots.
- Horizontal calendar scrolling.
- Previous week navigation.
- Next week navigation.
- Current week navigation.
- Recipe detail previews.
- Meal editing.
- Meal removal.
- Shopping list shortcuts.
- Light and dark mode styling.

### 2️⃣ Drag & Drop Planner

The Drag & Drop Planner includes:

- Seven-day calendar.
- Drag meals between different days.
- Move meals between meal types.
- Keyboard-accessible move menus.
- Touch-friendly dropdown controls.
- Calendar refresh.
- Current-day highlighting.
- Meal removal.

### 🔄 Shared Planner Integration

Both calendar views:

- Share the same saved meal plan data.
- Display meals for the authenticated user.
- Allow users to switch between planner experiences.
- Preserve saved meals.
- Support automatic navigation from AI-generated plans.
- Provide weekly meal organization.

<div align="center">

![Meal Planner](planning/assets/meal-planner.gif)

**Meal Planner**

</div>

---

<a id="prepwise-ai-assistant"></a>

## 🤖 PrepWise AI Assistant

<div align="center">

![AI Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=22&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Ask+Your+AI+Chef;Discover+New+Recipes;Create+Your+Weekly+Meal+Plan;Turn+Recipes+Into+Shopping+Lists!)

![Google Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)

</div>

PrepWise uses the Google Gemini API to provide personalized cooking assistance.

Gemini function calling connects the AI assistant to real application data, including pantry inventory, available recipes, ingredient information, and existing meal plans.

### 🧠 AI Capabilities

| Feature | Description |
|---------|-------------|
| Pantry Recommendations | Suggest meals using available ingredients |
| Missing Ingredients | Identify ingredients needed for a recipe |
| Recipe Discovery | Search internal and external recipe collections |
| Dietary Personalization | Apply selected dietary preferences |
| Allergy Screening | Screen known recipe ingredients |
| Weekly Meal Planning | Generate seven-day dinner previews |
| Smart Calendar | Resolve current and relative dates |
| Existing Meal Detection | Preserve occupied dinner slots |
| Shopping List Generation | Generate grocery requirements |
| Expiration Awareness | Identify ingredients approaching expiration |
| Conversation History | Retain recent conversation context |
| Interactive Recipe Cards | Display recipe previews |
| Voice Input | Convert spoken questions into text |
| Voice Output | Read AI responses aloud |

### 📅 AI Weekly Meal Planning

Users can request a seven-day dinner plan using recipes from their PrepWise database.

Features include:

- Seven-day dinner plan previews.
- User timezone awareness.
- Correct current dates and years.
- Relative dates such as "next week."
- Explicitly requested dates.
- Recipe variety when sufficient recipes are available.
- Pantry ingredient matching.
- Confirmation before saving.
- Automatic calendar navigation.
- Existing meal preservation.
- Shopping list generation.

If all seven dinner slots are already occupied, PrepWise preserves existing meals rather than overwriting them.

Users can view their saved meal plan or generate its shopping list.

### 💬 Example AI Prompts

```text
What can I cook with my pantry ingredients?
```

```text
Create a seven-day dinner meal plan for next week.
```

```text
Find Jamaican jerk chicken recipes online.
```

```text
What ingredients are expiring soon?
```

```text
Show my existing dinner meal plan and generate my shopping list.
```

```text
Recommend three high-protein dinners.
```

```text
Help me reduce food waste this week.
```

---

### 🥗 Personalized Dietary Preferences

Users can select dietary preferences such as:

- Vegetarian.
- Vegan.
- Pescatarian.
- Gluten Free.
- High Protein.

Users can also select food allergies and custom ingredients to avoid.

The AI uses these preferences when recommending and filtering recipes.

> Important: Ingredient screening and dietary classifications cannot guarantee allergy safety. Always verify food labels, preparation methods, and cross-contamination risks.

### 💾 Conversation Memory

PrepWise retains recent conversation history and preferences using browser localStorage.

Users can:

- Continue recent conversations.
- Refresh the application.
- Update dietary preferences.
- Start a new conversation.

Browser-stored chat history and preferences do not automatically synchronize across devices.

---

<a id="voice-assistant"></a>

## 🎤 Voice Assistant

<div align="center">

![Voice Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=21&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Speak.+Listen.+Cook.;Hands-Free+Cooking+Assistance;Your+AI+Chef+Can+Talk!)

![Voice](https://img.shields.io/badge/Voice-Web_Speech_API-C8553D?style=for-the-badge)
![Mobile](https://img.shields.io/badge/Android-Compatible-3DDC84?style=for-the-badge&logo=android&logoColor=white)

</div>

PrepWise supports speech-to-text and text-to-speech through compatible browser APIs.

### 🎙️ Voice Input

Users can:

1. Click the microphone button.
2. Speak a cooking question.
3. Convert their speech into text.
4. Review the transcript.
5. Send the question to AI Chef.

Google Chrome is recommended for microphone input.

### 🔊 Voice Output

| Control | Function |
|---------|----------|
| Voice On / Off | Enable or disable automatic speech |
| Replay | Repeat the latest AI response |
| Stop | Interrupt speech playback |
| Voice Selection | Select an available browser voice |
| Speech Speed | Adjust the playback speed |

Supported speed options:

- 0.8x
- 1.0x
- 1.2x
- 1.4x

Voice output uses the browser's speech synthesis functionality.

No separate paid text-to-speech API is required.

### 📱 Android Voice Setup

PrepWise has been manually tested on Android.

Available voices depend on the device's installed speech engine and the voices exposed by the browser.

If only "Default voice" appears:

1. Open Android Settings.
2. Search for Text-to-speech output.
3. Select Speech Recognition and Synthesis from Google.
4. Open the speech engine settings.
5. Select English (United States).
6. Install or select an available voice.
7. Reopen PrepWise in Google Chrome.

Some devices may expose only the default browser voice even when multiple system voices are installed.

If automatic speech playback is blocked, tap Replay to begin speaking.

---

<a id="smart-shopping-list"></a>

## 🛒 Smart Shopping List

PrepWise generates shopping lists based on individual recipes or weekly meal plans.

### Features

- Add shopping items manually.
- Check off purchased ingredients.
- Delete items.
- Add missing ingredients from individual recipes.
- Generate shopping requirements for a selected week.
- Combine compatible measurement units.
- Subtract available pantry quantities.
- Account for ingredient expiration.
- Preserve manually added items.
- Replace previously generated shopping items.
- Transfer purchased ingredients into the pantry.

### Intelligent Measurement Handling

Supported measurements include:

- Grams and kilograms.
- Milliliters and liters.
- Teaspoons and tablespoons.
- Cups.
- Pieces.
- Cloves.
- Slices.
- Bunches.
- Sprigs.
- Pinches.
- Stalks.

Compatible measurements are combined automatically.

Incompatible units remain separate instead of using unreliable conversions.

<div align="center">

![Shopping List Demo](planning/assets/shopping-list.gif)

**Smart Grocery List Generation**

</div>

---

<a id="online-recipe-integration"></a>

## 🌐 Online Recipe Integration

<div align="center">

![TheMealDB](https://img.shields.io/badge/Recipes-TheMealDB-orange?style=for-the-badge)
![Database](https://img.shields.io/badge/Recipe_Storage-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

PrepWise integrates with [TheMealDB](https://www.themealdb.com/) to discover international recipes.

Users can:

- Search external recipe collections.
- View recipe images.
- Review ingredients.
- Review measurements.
- Read original cooking instructions.
- Import recipes into PostgreSQL.
- Save imported recipes as favorites.
- Add imported recipes to meal plans.
- Generate shopping lists from imported recipes.

### Improved Recipe Importer

The importer includes:

- Fraction and quantity parsing.
- Ingredient name normalization.
- Duplicate ingredient handling.
- Compatible measurement conversion.
- Suspicious measurement validation.
- User review of unsupported measurements.
- Prevention of duplicate recipe imports.
- Transaction-based database insertion.

The importer asks users to review unclear measurements rather than silently accepting unreliable quantities.

---

<a id="kitchen-studio"></a>

## 🍽 Kitchen Studio

<div align="center">

![Kitchen Studio Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=21&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Cook+and+Consume;Scan+Your+Groceries;Track+Your+Nutrition;Manage+Your+Budget;Celebrate+Your+Progress!)

</div>

Kitchen Studio extends PrepWise beyond meal planning into a comprehensive kitchen management experience.

| Tool | Purpose |
|------|---------|
| 🍳 Cook & Consume | Record cooked meals and ingredient usage |
| 📸 Grocery Scanner | Identify food products and ingredients |
| 🥗 Nutrition | Track calories and macronutrients |
| 💰 Budget | Monitor grocery spending |
| 📊 Activity & Achievements | Review cooking history and kitchen progress |

### 🍳 Cook & Consume

Users can:

- Select a recipe.
- Review required ingredients.
- Choose serving quantities.
- Check pantry availability.
- Record completed cooking sessions.
- Deduct available ingredients from inventory.
- Track ingredient usage.

Database transactions help maintain consistent ingredient and cooking records.

### 🥗 Nutrition Tracker

Users can track:

- Calories.
- Protein.
- Carbohydrates.
- Fat.

Additional functionality:

- Personalized nutrition goals.
- Daily nutrition records.
- Manual nutrition entries.
- Nutrition label information.
- Barcode product nutrition when available.
- Daily nutrition summaries.

Nutrition values should be verified against reliable labels and serving sizes.

### 💰 Grocery Budget Tracker

Users can:

- Set a weekly grocery budget.
- Record grocery purchases.
- Track weekly expenses.
- View remaining budget.
- Manage purchase records.

### 📊 Activity & Achievements

Users can review:

- Cooking history.
- Completed meals.
- Ingredient usage.
- Recorded food waste.
- Nutrition progress.
- Grocery spending.
- Kitchen activity summaries.

---

<a id="grocery-scanner-20"></a>

## 📸 Grocery Scanner 2.0

<div align="center">

![Scanner Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=21&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Scan.+Identify.+Save.;Turn+Groceries+Into+Digital+Inventory;Your+Kitchen+Just+Got+Smarter!)

![Open Food Facts](https://img.shields.io/badge/Product_Data-Open_Food_Facts-47A447?style=for-the-badge)
![Gemini Vision](https://img.shields.io/badge/Image_Analysis-Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini)

</div>

PrepWise supports multiple grocery identification methods.

### 1️⃣ Live Barcode Scanner

Compatible devices can use their camera to detect product barcodes.

Features include:

- Live camera preview.
- Automatic barcode detection.
- Product lookup.
- Product name.
- Product images.
- Nutrition data when available.

### 2️⃣ Manual Barcode Entry

Users can enter product barcodes manually.

Supported barcode lengths:

- 8 digits.
- 12 digits.
- 13 digits.
- 14 digits.

Product information is retrieved from [Open Food Facts](https://world.openfoodfacts.org/).

### 3️⃣ Barcode Image Scanner

Users can upload an image containing a barcode for detection on supported browsers.

### 4️⃣ AI Grocery Photo Scanner

Users can upload grocery photos for Gemini-powered ingredient recognition.

The assistant may suggest:

- Ingredient names.
- Estimated quantities.
- Measurement units.

Users review the suggested ingredients before adding them to their pantry.

### 5️⃣ Nutrition Integration

Available product nutrition information can be reviewed and transferred to the nutrition tracker.

> Camera access requires a compatible browser and permission. AI recognition and product information may be incomplete or inaccurate. Always review results before saving.

---

<a id="meet-your-prepwise-chef"></a>

## 👨‍🍳 Meet Your PrepWise Chef

<div align="center">

![Chef Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=22&duration=2500&pause=1200&color=C8553D&center=true&vCenter=true&width=600&lines=Hello+Chef!;Need+Help+in+the+Kitchen%3F;Let's+Cook+Something+Delicious!;Your+Meal+Plan+is+Ready!;Great+Job%2C+Chef!)

### Your Interactive Virtual Cooking Companion

**Talk. Cook. Celebrate. Repeat.**

</div>

PrepWise includes an animated virtual chef built with React, SVG, CSS animations, and browser speech technology.

The chef responds to application activity and makes the kitchen experience more interactive.

### 🎮 Character Features

| Feature | Behavior |
|---------|----------|
| 👀 Eye Tracking | Follows mouse movement |
| 🙂 Expressions | Reacts to application activity |
| 🌙 Time-Based Emotions | Changes mood throughout the day |
| 🍳 Cooking Animation | Displays cooking animations |
| 🎉 Celebrations | Celebrates successful kitchen actions |
| 😟 Expiration Alerts | Responds to expiring ingredients |
| 🛒 Shopping Mode | Reacts to shopping activities |
| 🍲 Recipe Reactions | Responds to recipe discovery |
| 💬 Proactive Reminders | Displays helpful kitchen messages |
| 🎮 Character Interaction | Supports dragging and animations |
| 🗣️ Voice Assistance | Provides optional spoken assistance |
| 👨‍🍳 Guided Cooking | Helps users follow recipes |

### Character Emotions

The chef can react with different moods:

- Idle.
- Happy.
- Thinking.
- Excited.
- Worried.
- Sleepy.
- Dancing.
- Speaking.

### Guided Cooking Mode

Users can:

1. Select a recipe.
2. Review ingredients.
3. Follow cooking instructions.
4. Navigate between cooking steps.
5. Listen to spoken guidance.
6. Use countdown timers.
7. Complete the cooking experience.
8. Record completed meals through Kitchen Studio.

Cooking timers require the cooking guide to remain open.

<!--
Optional animated chef demonstration:

Record the actual PrepWise chef dancing, speaking,
and reacting to user actions.

Save the recording as:

planning/assets/chef-animation.gif

Then add the following:

<div align="center">

<img src="planning/assets/chef-animation.gif"
     width="320"
     alt="Animated PrepWise Chef" />

</div>

-->

---

## 🎨 User Interface

### Light and Dark Mode

PrepWise supports two appearance modes:

- ☀️ Light Mode
- 🌙 Dark Mode

Users can switch themes using the sidebar appearance control.

Theme preferences are stored locally and remain active after refreshing the application.

Both meal planners and the AI assistant support dark-mode styling.

### Interactive Design

- Animated food backgrounds.
- Floating kitchen ingredients.
- Interactive recipe cards.
- Responsive layouts.
- Recipe detail modals.
- Calendar controls.
- AI voice controls.
- Animated cooking assistant.
- Personalized dashboard.

### Accessibility

- Keyboard-accessible controls.
- Descriptive accessibility labels.
- Visible focus indicators.
- Reduced-motion support.
- Optional voice playback.
- Alternative controls for drag-and-drop interactions.

---

<a id="technology-stack"></a>

## 🛠 Technology Stack

<div align="center">

### Frontend

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend and Database

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

### AI and External APIs

![Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)
![TheMealDB](https://img.shields.io/badge/TheMealDB-orange?style=for-the-badge)
![Open Food Facts](https://img.shields.io/badge/Open_Food_Facts-47A447?style=for-the-badge)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-C8553D?style=for-the-badge)

### Development and Deployment

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Render](https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white)

</div>

| Category | Technology |
|----------|------------|
| Frontend | React, JavaScript, React Router |
| Styling | HTML, CSS, SVG |
| Build Tool | Vite |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | Password hashing and database-backed sessions |
| Artificial Intelligence | Google Gemini API |
| Recipe Data | TheMealDB API |
| Product Data | Open Food Facts API |
| Voice Recognition | Web Speech Recognition API |
| Voice Output | Speech Synthesis API |
| Camera Access | MediaDevices API |
| Barcode Detection | BarcodeDetector API |
| Character Animation | CSS and SVG |
| Browser Storage | localStorage |
| Deployment | Render |
| Version Control | Git and GitHub |

---

<a id="system-architecture"></a>

## 🏗 System Architecture

```mermaid
flowchart TD
    U[User] --> F[React Frontend]

    F --> B[Express Backend]

    B --> A[Authentication]
    B --> D[(PostgreSQL Database)]
    B --> G[Google Gemini API]
    B --> M[TheMealDB API]
    B --> O[Open Food Facts API]

    F --> C[Animated AI Chef]
    F --> V[Web Speech API]
    F --> S[Camera and Barcode Detection]
    F --> L[Browser localStorage]

    D --> P[Pantry Inventory]
    D --> R[Recipe Collection]
    D --> W[Weekly Meal Plans]
    D --> H[Shopping Lists]
    D --> K[Kitchen Studio]
```

### Application Workflow

1. Users interact with the React frontend.
2. Express processes frontend API requests.
3. Authentication identifies the current account.
4. PostgreSQL stores and retrieves application data.
5. Gemini generates AI recommendations using application information.
6. TheMealDB supplies external recipes.
7. Open Food Facts supplies barcode product information.
8. Browser APIs enable voice and camera features.
9. The animated chef responds to application activity.

### AI Meal Planning Workflow

```mermaid
flowchart TD
    A[User Requests Weekly Meal Plan] --> B[AI Receives Current Date and Preferences]

    B --> C[Retrieve Recipes and Pantry Data]

    C --> D[Check Existing Meal Plans]

    D --> E{Dinner Slot Available?}

    E -->|Yes| F[Recommend Suitable Recipe]
    E -->|No| G[Preserve Existing Meal]

    F --> H[Display Weekly Preview]
    G --> H

    H --> I[User Confirms Plan]

    I --> J[(Save to PostgreSQL)]

    J --> K[Open Correct Calendar Week]

    K --> L[Generate Shopping List]
```

### Production Architecture

```mermaid
flowchart LR
    U[Desktop or Mobile Browser] --> R[Render Web Service]

    R --> F[React Production Build]
    R --> E[Express API]

    E --> P[(PostgreSQL)]
    E --> G[Google Gemini]
    E --> T[TheMealDB]
    E --> O[Open Food Facts]
```

The production frontend and backend are served from the same Render web service.

---

<a id="database-architecture"></a>

## 🗄 Database Architecture

PrepWise uses PostgreSQL to store relational kitchen data.

### Database Tables

| Table | Description |
|-------|-------------|
| users | User accounts |
| auth_sessions | Login sessions |
| ingredients | Ingredient catalog |
| recipes | Recipe information |
| recipe_ingredients | Recipe ingredient relationships |
| pantry_items | User pantry inventory |
| meal_plan_entries | Scheduled meals |
| saved_recipes | User recipe favorites |
| shopping_list_items | Grocery shopping items |
| cooking_sessions | Completed cooking sessions |
| pantry_activity | Ingredient consumption and waste |
| kitchen_goals | Nutrition and budget goals |
| nutrition_entries | Nutrition records |
| grocery_expenses | Grocery expenses |

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ AUTH_SESSIONS : authenticates

    USERS ||--o{ PANTRY_ITEMS : owns
    INGREDIENTS ||--o{ PANTRY_ITEMS : contains

    RECIPES ||--o{ RECIPE_INGREDIENTS : requires
    INGREDIENTS ||--o{ RECIPE_INGREDIENTS : includes

    USERS ||--o{ MEAL_PLAN_ENTRIES : plans
    RECIPES ||--o{ MEAL_PLAN_ENTRIES : schedules

    USERS ||--o{ SAVED_RECIPES : saves
    RECIPES ||--o{ SAVED_RECIPES : favorites

    USERS ||--o{ SHOPPING_LIST_ITEMS : manages
    INGREDIENTS ||--o{ SHOPPING_LIST_ITEMS : purchases

    USERS ||--o{ COOKING_SESSIONS : cooks
    RECIPES ||--o{ COOKING_SESSIONS : prepares

    USERS ||--o{ PANTRY_ACTIVITY : records
    INGREDIENTS ||--o{ PANTRY_ACTIVITY : tracks

    COOKING_SESSIONS o|--o{ PANTRY_ACTIVITY : consumes

    USERS ||--o| KITCHEN_GOALS : sets
    USERS ||--o{ NUTRITION_ENTRIES : logs
    USERS ||--o{ GROCERY_EXPENSES : records
```

### Database Integrity

PrepWise uses:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Check constraints.
- Database transactions.
- Many-to-many relationships.
- User-specific data associations.
- Duplicate recipe prevention.

These features help maintain consistent relational data.

---

## 📁 Project Structure

```text
web103_finalproject/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── chatDates.js
│   │   └── units.js
│   │
│   ├── controllers/
│   ├── middleware/
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── kitchenRoutes.js
│   │   ├── productRoutes.js
│   │   ├── mealdbRoutes.js
│   │   ├── mealPlanRoutes.js
│   │   ├── pantryRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── savedRecipesRoutes.js
│   │   └── shoppingRoutes.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── prepwise3_migration.sql
│   ├── mealdb_migration.sql
│   ├── recipe_images.sql
│   └── reset.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChefMascot.jsx
│   │   │   ├── ChefCookingGuide.jsx
│   │   │   ├── PrepWiseChat.jsx
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── VoiceOutput.jsx
│   │   │   ├── ChatWeeklyPlan.jsx
│   │   │   ├── ChatRecipeCard.jsx
│   │   │   ├── ChatMealDBRecipes.jsx
│   │   │   ├── MealDBDiscovery.jsx
│   │   │   ├── GroceryScanner.jsx
│   │   │   └── FoodBackground.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Pantry.jsx
│   │   │   ├── PantryNew.jsx
│   │   │   ├── Recipes.jsx
│   │   │   ├── Planner.jsx
│   │   │   ├── MealPlanner.jsx
│   │   │   ├── Shopping.jsx
│   │   │   ├── SavedRecipes.jsx
│   │   │   └── KitchenStudio.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── planner.css
│   │   │   ├── dragPlanner.css
│   │   │   ├── voiceOutput.css
│   │   │   └── theme.css
│   │   │
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── planning/
│   ├── assets/
│   ├── database_schema.md
│   ├── feature_requirements.md
│   ├── project_tasks.md
│   └── user_stories.md
│
├── milestones/
│
└── README.md
```

---

<a id="installation-instructions"></a>

## 🚀 Installation Instructions

### Prerequisites

- Node.js 22 or newer recommended.
- npm.
- PostgreSQL.
- Git.
- Google Gemini API key.
- Google Chrome or another compatible browser.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/lloanim/web103_finalproject.git

cd web103_finalproject
```

### Step 2 — Install Dependencies

```bash
npm --prefix backend install

npm --prefix frontend install
```

### Step 3 — Create the PostgreSQL Database

```bash
createdb prepwise_dev
```

Create the database schema:

```bash
psql -v ON_ERROR_STOP=1 -d prepwise_dev -f database/schema.sql
```

Apply the authentication and Kitchen Studio migration:

```bash
psql -v ON_ERROR_STOP=1 -d prepwise_dev -f database/prepwise3_migration.sql
```

Apply the MealDB migration:

```bash
psql -v ON_ERROR_STOP=1 -d prepwise_dev -f database/mealdb_migration.sql
```

Load sample data:

```bash
psql -v ON_ERROR_STOP=1 -d prepwise_dev -f database/seed.sql
```

Optional recipe images:

```bash
psql -d prepwise_dev -f database/recipe_images.sql
```

> Only run the seed script on a fresh development database. Do not reset or re-seed a shared production database.

The seeded demonstration user does not have a login password. Register your own account through the application.

### Step 4 — Configure Environment Variables

Create `backend/.env`.

Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

macOS or Linux:

```bash
cp backend/.env.example backend/.env
```

Configure the following:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/prepwise_dev

PORT=3001

NODE_ENV=development

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

GEMINI_MODEL=gemini-3.5-flash-lite
```

Replace the placeholders with your own database credentials and Gemini API key.

Use a Gemini model available to your Google AI Studio project.

Obtain an API key from:

[Google AI Studio](https://aistudio.google.com/)

> Never commit your .env file, API keys, real database connection strings, or passwords to GitHub.

### Step 5 — Start the Backend

```bash
cd backend

npm run dev
```

Backend:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

### Step 6 — Start the Frontend

Open a separate terminal from the project root:

```bash
cd frontend

npm run dev
```

Frontend:

```text
http://localhost:5173
```

Vite forwards API requests to the local Express backend.

### Step 7 — Open PrepWise

Visit:

[http://localhost:5173](http://localhost:5173)

Register a new account and begin managing your kitchen.

---

<a id="api-endpoints"></a>

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register an account |
| POST | /api/auth/login | Sign in |
| GET | /api/auth/me | Retrieve current user |
| POST | /api/auth/logout | Sign out |

### Pantry

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/pantry-items | List pantry ingredients |
| POST | /api/pantry-items | Add pantry item |
| PATCH | /api/pantry-items/:id | Update pantry item |
| DELETE | /api/pantry-items/:id | Delete pantry item |

### Recipes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | Retrieve recipes |
| GET | /api/recipes/:id | Retrieve recipe details |
| GET | /api/mealdb/search | Search external recipes |
| POST | /api/mealdb/import/:mealId | Import recipe |

### Meal Planning

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/meal-plan | Retrieve weekly meals |
| POST | /api/meal-plan | Schedule a meal |
| PATCH | /api/meal-plan/:id | Update planned meal |
| DELETE | /api/meal-plan/:id | Remove planned meal |
| POST | /api/chat/weekly-plan | Save confirmed AI meal plan |

### Shopping List

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/shopping-list | Retrieve shopping list |
| POST | /api/shopping-list/generate | Generate shopping requirements |

### Saved Recipes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/saved-recipes | Retrieve favorites |
| POST | /api/saved-recipes | Save recipe |
| DELETE | /api/saved-recipes/:recipeId | Remove favorite |

### AI Assistant

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Send AI chat request |

### Kitchen Studio

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/kitchen/summary | Retrieve kitchen summary |
| POST | /api/kitchen/cook | Record cooked meal |
| POST | /api/kitchen/waste | Record food waste |
| PATCH | /api/kitchen/goals | Update nutrition and budget goals |
| POST | /api/kitchen/nutrition | Add nutrition entry |
| DELETE | /api/kitchen/nutrition/:id | Remove nutrition entry |
| POST | /api/kitchen/expenses | Add grocery expense |
| DELETE | /api/kitchen/expenses/:id | Remove grocery expense |
| GET | /api/kitchen/product/:code | Retrieve barcode product |
| POST | /api/kitchen/scan | Analyze grocery photo |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Check backend health |

Application data endpoints require an authenticated session.

---

<a id="deployment"></a>

## ☁️ Deployment

<div align="center">

![Deployment Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=22&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Built.+Tested.+Deployed.;Live+on+Render;Available+on+Desktop+and+Android!)

[![Live Website](https://img.shields.io/badge/Production-Live_Website-success?style=for-the-badge&logo=render)](https://prepwise-backend-stln.onrender.com)

</div>

PrepWise is deployed on Render as a single web service serving the React frontend and Express backend.

### Production Website

https://prepwise-backend-stln.onrender.com

### Render Configuration

| Setting | Value |
|---------|-------|
| Service | Web Service |
| Production Branch | main |
| Runtime | Node.js |
| Root Directory | Repository root |
| Environment | production |
| Database | PostgreSQL |

### Build Command

```bash
npm --prefix backend install && npm --prefix frontend install --include=dev && npm --prefix frontend run build
```

### Start Command

```bash
cd backend && npm start
```

### Environment Variables

```env
NODE_ENV=production

DATABASE_URL=YOUR_RENDER_POSTGRESQL_URL

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

GEMINI_MODEL=YOUR_SUPPORTED_GEMINI_MODEL
```

Render supplies the hosting port when applicable.

Express serves the React production build from:

```text
frontend/dist
```

The server supports React Router navigation and page refreshes.

### Database Deployment

Required database files:

```text
database/schema.sql

database/prepwise3_migration.sql

database/mealdb_migration.sql
```

Back up existing database records before applying changes.

Monitor free-tier PostgreSQL expiration and storage limits. Redeploying application code does not extend the database's expiration date.

---

## 🎬 Project Demonstration

<div align="center">

### Experience PrepWise

[![Try PrepWise](https://img.shields.io/badge/Start_Your-Kitchen_Experience-C8553D?style=for-the-badge)](https://prepwise-backend-stln.onrender.com)

</div>

### Recommended Live Demo

1. Register or sign in.
2. Show the personalized dashboard.
3. Add ingredients to the pantry.
4. Discover and import a recipe.
5. Open PrepWise AI.
6. Enable voice output.
7. Ask for a seven-day dinner plan for next week.
8. Confirm and save the plan.
9. Switch between both meal planners.
10. Generate a shopping list.
11. Open Kitchen Studio.
12. Demonstrate grocery barcode lookup.
13. Show nutrition and budget tracking.
14. Switch between light and dark mode.
15. Demonstrate the Android mobile experience.

### Project GIF Demonstrations

| Pantry Management | Recipe Details |
|-------------------|----------------|
| ![Pantry](planning/assets/pantry-inventory.gif) | ![Recipe Details](planning/assets/recipe-detail-modal.gif) |

| Recipe Filtering | Shopping List |
|------------------|---------------|
| ![Filtering](planning/assets/recipe-filtering.gif) | ![Shopping List](planning/assets/shopping-list.gif) |

---

<a id="final-testing-results"></a>

## 🧪 Final Testing Results

<div align="center">

![Testing Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=21&duration=2500&pause=1000&color=47A447&center=true&vCenter=true&width=650&lines=Desktop+Testing+Passed;Android+Testing+Passed;Production+Build+Successful;PrepWise+3.1+Ready!)

![Build](https://img.shields.io/badge/Build-Passed-success?style=for-the-badge)
![Desktop](https://img.shields.io/badge/Desktop-Tested-success?style=for-the-badge)
![Android](https://img.shields.io/badge/Android-Tested-success?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-Live-success?style=for-the-badge)

</div>

PrepWise 3.1 has completed manual desktop and Android testing.

### Core Application

- [x] User registration and login
- [x] User logout
- [x] Dashboard
- [x] Pantry management
- [x] Recipe discovery
- [x] Recipe filtering
- [x] Recipe details
- [x] Saved recipes
- [x] Online recipe importing
- [x] Weekly meal planning
- [x] Shopping list generation
- [x] Light and dark mode

### AI and Voice

- [x] Gemini AI responses
- [x] AI recipe recommendations
- [x] Microphone input in Chrome
- [x] Spoken AI responses
- [x] Voice On / Off
- [x] Replay and Stop controls
- [x] Voice selection
- [x] Speech speed settings
- [x] Current date handling
- [x] User timezone awareness
- [x] Seven-day dinner planning
- [x] Existing meal preservation
- [x] Automatic calendar navigation
- [x] AI shopping list generation

### Recipe and Shopping Integration

- [x] TheMealDB search
- [x] External recipe importing
- [x] Duplicate ingredient handling
- [x] Measurement validation
- [x] Compatible measurement conversion
- [x] Shopping list regeneration
- [x] Corrected ingredient quantities

### Meal Planner Integration

- [x] Weekly Planner
- [x] Drag & Drop Planner
- [x] Shared meal plan data
- [x] Switching between both planners
- [x] AI navigation to the selected week
- [x] Dark-mode readability

### Kitchen Studio

- [x] Cook & Consume
- [x] Grocery Scanner
- [x] Barcode lookup
- [x] Nutrition tracking
- [x] Grocery budget tracking
- [x] Cooking history
- [x] Food waste tracking

### Production and Mobile

- [x] Frontend production build
- [x] GitHub merge conflict resolution
- [x] Main branch integration
- [x] Render deployment
- [x] Live Android website testing
- [x] Android voice input
- [x] Android voice output
- [x] Android installed voice configuration
- [x] Mobile application smoke testing

### Testing Notes

Desktop testing was completed locally before deployment.

Android testing was completed against the live Render website.

Additional Android voices may require installation through the device's text-to-speech settings.

These results represent manual feature testing, not exhaustive automated test coverage.

---

## 📈 Project Milestones

```mermaid
timeline
    title PrepWise Development Journey

    Milestone 1 : Project Planning
                : Wireframes
                : User Stories
                : Database Design

    Milestone 2 : Backend Foundation
                : PostgreSQL
                : Express API
                : React Frontend

    Milestone 3 : Pantry Management
                : Recipe Discovery
                : Saved Recipes

    Milestone 4 : Weekly Meal Planning
                : Shopping Lists
                : AI Integration

    Milestone 5 : Authentication
                : Kitchen Studio
                : Voice Assistant
                : Grocery Scanner
                : Dual Planner Integration
                : Production Deployment
                : Android Testing
```

---

## ⚠️ Current Limitations

- AI-generated responses may contain incorrect information.
- Dietary screening cannot guarantee allergy safety.
- Recipe preparation times, serving information, or dietary labels may be unavailable.
- Voice availability depends on browser and device support.
- Live barcode detection requires compatible browser features and camera permission.
- External product information may be incomplete.
- AI photo recognition may produce inaccurate estimates.
- Nutrition information requires label and serving-size verification.
- Chat history, dietary preferences, and appearance settings are browser-local.
- External APIs may have usage limits.
- Free-tier hosting services may have availability and expiration limits.

---

## 🔮 Future Improvements

- Native Android and iOS applications.
- Cross-device chat synchronization.
- Additional languages.
- Expanded voice customization.
- Grocery price comparison.
- Advanced nutrition recommendations.
- Improved recipe serving calculations.
- More meal variety over multiple weeks.
- Household and family accounts.
- Shared grocery lists.
- Mobile notifications.
- Expanded barcode compatibility.
- Automated frontend and backend testing.
- Advanced accessibility testing.
- Additional recipe and nutrition data sources.

---

<a id="project-team"></a>

## 👥 Project Team

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rounded&color=0:C8553D,100:743D2B&height=100&text=Meet%20Our%20Team&fontSize=35&fontColor=FFFFFF&animation=fadeIn" width="90%" />

### CodePath WEB103 Final Project Team

| Team Member |
|-------------|
| Lloani M |
| Kevon Dawkins |
| Victoria Zhunio |
| Dhimy Jean |
| Sarin Sigma |

**Developed collaboratively as part of the CodePath WEB103 Web Development program.**

![CodePath](https://img.shields.io/badge/CodePath-WEB103-blue?style=for-the-badge)

</div>

---

## 🙏 Acknowledgments

- [CodePath](https://www.codepath.org/) — WEB103 Web Development
- [Google Gemini](https://ai.google.dev/) — AI cooking assistance
- [TheMealDB](https://www.themealdb.com/) — Recipe data and food images
- [Open Food Facts](https://world.openfoodfacts.org/) — Product and nutrition information
- [React](https://react.dev/) — Frontend development
- [Node.js](https://nodejs.org/) — Backend runtime
- [Express](https://expressjs.com/) — REST API development
- [PostgreSQL](https://www.postgresql.org/) — Relational database
- [Vite](https://vite.dev/) — Frontend tooling
- [Render](https://render.com/) — Application hosting
- [GitHub](https://github.com/) — Version control
- [Shields.io](https://shields.io/) — Technology badges
- [Readme Typing SVG](https://readme-typing-svg.demolab.com/) — Typing animations
- [Capsule Render](https://github.com/kyechan99/capsule-render) — Animated SVG banners

---

<div align="center">

# 🍳 PrepWise

![Footer Animation](https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=22&duration=2500&pause=1000&color=C8553D&center=true&vCenter=true&width=650&lines=Plan+Smarter.;Cook+Better.;Waste+Less.;Your+Kitchen.+Your+AI+Chef.;Thank+You+For+Visiting+PrepWise!)

### Your Kitchen. Your Ingredients. Your AI Chef.

[![Visit PrepWise](https://img.shields.io/badge/Visit-Live_Application-C8553D?style=for-the-badge)](https://prepwise-backend-stln.onrender.com)

[![View Repository](https://img.shields.io/badge/View-GitHub_Repository-181717?style=for-the-badge&logo=github)](https://github.com/lloanim/web103_finalproject)

⭐ If you like this project, consider giving it a star!

**Built with teamwork, creativity, and technology.**

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:743D2B,50:BD5539,100:C8553D&height=150&section=footer&text=Plan%20Smarter.%20Cook%20Better.&fontSize=30&fontColor=FFFFFF&animation=fadeIn&fontAlignY=65" width="100%" />

</div>