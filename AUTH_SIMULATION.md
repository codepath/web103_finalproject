# Authentication Simulation Guide

## Current Setup: Mock Authentication

Since your teammate is working on real authentication, we've set up a **mock auth system** that simulates being logged in as "George Demo".

## How It Works

### 1. Mock Auth Context (`client/src/context/AuthContext.jsx`)
- Simulates a logged-in user
- Provides user data throughout the app
- **Default user**: `george-demo-id` (change this to match your DB)

### 2. Getting User Info Anywhere

In any component:

```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  // user.id → "george-demo-id"
  // user.username → "George Demo"
  // user.email → "george@example.com"
  
  // Use user.id when creating posts, joining groups, etc.
  const createSomething = async () => {
    await api.post("/something", {
      user_id: user.id, // Uses George's ID
      // ... other data
    });
  };
}
```

### 3. Current Implementations

**Posts** (`Home.jsx`):
- ✅ Uses `user.id` when creating posts
- Posts are attributed to "George Demo"

## How to Change the Mock User

Open `client/src/context/AuthContext.jsx` and update:

```jsx
const [user, setUser] = useState({
  id: "YOUR_ACTUAL_USER_ID_FROM_DB", // ← Change this
  username: "George Demo",
  email: "george@example.com",
});
```

**To find George's actual ID from Supabase:**
1. Go to Supabase Dashboard
2. Open the `user` table
3. Find George Demo's row
4. Copy the `id` value
5. Paste it in the code above

## When Real Auth is Ready

Your teammate will replace the mock system with real authentication:

1. **Login/Signup** will call real API endpoints
2. **JWT token** will be stored in localStorage
3. **Token** will be sent with every API request
4. **Backend** will validate token and extract real user ID

## What You Can Do Now

You can implement features that require a logged-in user:

- **Create posts** → Uses George's ID
- **Join groups** → Add George to group members
- **Send messages** → Attribute to George
- **Like/comment** → Track George's interactions

Just use `user.id` from the `useAuth()` hook everywhere!

## Backend Side (Optional Enhancement)

If you want the backend to validate the user, you could add middleware later:

```javascript
// server/middleware/auth.js (for future)
export const authMiddleware = (req, res, next) => {
  // For now, trust the user_id in the request
  // Later: validate JWT token here
  next();
};
```

## Testing Different Users

To test as a different user, change the ID in `AuthContext.jsx`:

```jsx
// Test as User 1
const [user, setUser] = useState({
  id: "user-1-id",
  username: "User One",
  // ...
});

// Test as User 2
const [user, setUser] = useState({
  id: "user-2-id",
  username: "User Two",
  // ...
});
```

## Transition Plan

When real auth is implemented:

1. Keep `AuthContext.jsx` structure the same
2. Replace mock `login()` with real API call
3. Add token storage/retrieval
4. Update `user` state from API response
5. Add token to API requests (already set up in `api.js`)

The rest of your code won't need to change! 🎉
