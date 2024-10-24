# Recipe Guru powered by AI

CodePath WEB103 Final Project

Designed and developed by: [Mahidhar Vukkem](https://github.com/MahidharCodes) 🗿 [Aymerick Osse](https://github.com/Aymerick116) 🤖 [Amrita Dubey](https://github.com/amrita-20) 💃

🔗 Link to deployed app:
        TODO
## About

### Description and Purpose

Recipe Guru is a smart recipe suggestion system designed to help users find recipes based on the ingredients they have available and their dietary preferences (e.g., vegetarian, vegan, gluten-free). The system uses AI to provide tailored recipe suggestions, helping users maximize the use of available ingredients while considering dietary restrictions. Users can save their favorite recipes, view their search history, and manage their profiles. This tool is aimed at enhancing the cooking experience by offering intelligent recipe recommendations.


### Inspiration

The idea behind Recipe Guru was born from the need for a user-friendly tool to make cooking easier by suggesting recipes tailored to the ingredients users have on hand, while also accommodating dietary needs. By leveraging AI and real-time data, Recipe Guru brings convenience and customization to cooking.


## Tech Stack

- **Frontend:** React (JavaScript)
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL (via Railway)
- **APIs:** Spoonacular API for recipe and ingredient analysis, Axios for making HTTP requests
- **Hosting:** Railway

## **Features**

### **User Account Management**

Users can **sign up, log in, and manage their accounts** seamlessly via the application interface. Account management includes updating personal information and managing preferences.

![User Account Management](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExankxZmE5NDBuY3RldGN4dWx1d211dnEwdDlja3JsN204ZXE4aWRtNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/52qtwCtj9OLTi/giphy.gif)

---

### **Ingredient and Dietary Preference Input**

Users can **input available ingredients** and specify **dietary preferences** (e.g., vegan, vegetarian) to personalize their recipe suggestions.

![Ingredient Input](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExankxZmE5NDBuY3RldGN4dWx1d211dnEwdDlja3JsN204ZXE4aWRtNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/52qtwCtj9OLTi/giphy.gif)

---

### **Tailored Recipe Suggestions**

Based on the user’s inputs, the system provides **personalized recipe recommendations** through the Spoonacular API, ensuring recipes align with user preferences.

![Recipe Suggestions](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExankxZmE5NDBuY3RldGN4dWx1d211dnEwdDlja3JsN204ZXE4aWRtNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/52qtwCtj9OLTi/giphy.gif)

---

### **Favorites and Search History Management**

Users can **save their favorite recipes** for quick access and **view their search history**, making it easy to revisit past searches and recommendations.

![Favorites and Search History](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExankxZmE5NDBuY3RldGN4dWx1d211dnEwdDlja3JsN204ZXE4aWRtNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/52qtwCtj9OLTi/giphy.gif)

---

### **User Authentication and Secure Data Storage**

The system handles **secure user authentication via Supabase** and stores user data and preferences in **Supabase’s real-time database** for high availability and security.

![Authentication and Data Storage](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExankxZmE5NDBuY3RldGN4dWx1d211dnEwdDlja3JsN204ZXE4aWRtNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/52qtwCtj9OLTi/giphy.gif)

---


### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

### 1. **Clone the repository from GitHub:**

```bash
git clone <repository-url>
```
Replace `<repository-url>` with the URL of the repository.

### 2. **Navigate into the project folder:**

```bash
cd <project-folder>
```
Replace `<project-folder>` with the name of the folder that was cloned.

### 3. **Install dependencies for both React (frontend) and Node.js (backend):**

**For the frontend:**

Navigate into the React folder:
```bash
cd client
```

Install dependencies:

```bash
npm install
```

**For the backend:**

Navigate into the backend folder:

```bash
cd ../server
```

Install backend dependencies:

```bash
npm install
```

### 4. **Set up environment variables (if required):**

Check for a `.env.example` file in the root, backend, or frontend folder. Copy it to create your own `.env` file:

```bash
cp .env.example .env
```
Then, fill in any required environment variables.


### 5. **Run the backend server:**

```bash
cd server
npm start
```

### 6. **Run the frontend client:**

```bash
cd client
npm run dev
```
