# User Table Merge - Implementation Guide

## Problem
- Two overlapping tables: `user` (your code) and `profiles` (James's code)
- Caused conflicts and duplicate data
- `user` table had integer IDs, incompatible with Supabase Auth UUIDs

## Solution
Merged both tables into a single **`user`** table with the best fields from both.

---

## Unified User Table Schema

```sql
CREATE TABLE "user" (
  -- Core Identity
  id UUID PRIMARY KEY,              -- From Supabase Auth
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  -- Profile Info
  username TEXT UNIQUE,              -- Required, unique
  display_name TEXT,                 -- Optional display name
  pfp TEXT,                          -- Profile picture URL
  bio TEXT,                          -- User bio
  
  -- School Info
  borough TEXT,                      -- User's NYC borough
  year TEXT,                         -- Freshman/Sophomore/Junior/Senior
  
  -- Social Data
  interests JSONB DEFAULT '{}',      -- {"activity": true}
  follows_ids JSONB DEFAULT '{}',    -- {"friend_uuid": true}
  
  -- Legacy (can remove later if unused)
  post_ids JSONB,
  group_ids JSONB,
  message_ids JSONB
);
```

---

## Migration Steps

### 1. Run SQL Migration in Supabase
Go to Supabase SQL Editor and run:
```
server/tables/FINAL_USER_TABLE_MIGRATION.sql
```

This will:
- ✅ Drop old `user` and `profiles` tables
- ✅ Create new unified `user` table with UUID IDs
- ✅ Recreate `conversations` and `messages` tables with UUID foreign keys
- ✅ Set up Row Level Security (RLS) policies
- ✅ Create indexes for performance

**⚠️ WARNING:** This deletes all existing data! Export first if needed.

### 2. Code Already Updated
All code has been updated to use the merged schema:

**Frontend:**
- ✅ `SignUp.jsx` - Creates users with all fields (username, display_name, bio, borough, year, interests)
- ✅ `AuthContext.jsx` - Handles UUID auth IDs, creates users with merged schema
- ✅ `Login.jsx` - Uses AuthContext
- ✅ `Profile.jsx` - Uses unified `user` table (not `profiles`)
- ✅ `Home.jsx` - Already uses `user` table
- ✅ `Messages.jsx` - Already uses `user` table
- ✅ `UserLookup.jsx` - Already uses `user` table

**Backend:**
- ✅ `controllers/messages.js` - Updated to handle UUID strings (not integers)
- ✅ `controllers/user.js` - Already uses `user` table
- ✅ `controllers/post.js` - Already uses `user` table

---

## What Changed

### Field Name Mappings

| Old (`profiles`) | Old (`user`) | New (merged) |
|-----------------|--------------|--------------|
| pfp_url | pfp | **pfp** |
| display_name | - | **display_name** |
| bio | - | **bio** |
| borough | - | **borough** |
| year | - | **year** |
| interests (array) | interests (jsonb) | **interests** (jsonb) |
| - | follows_ids | **follows_ids** |

### UUID Changes

**Before:**
- `user.id` was `integer` (auto-increment)
- Supabase Auth generated UUIDs like `"6fd12224-1339-43d6-876a-884450807363"`
- **Incompatible!** ❌

**After:**
- `user.id` is `uuid` (matches Supabase Auth)
- All foreign keys updated: `conversations.user_id_1`, `conversations.user_id_2`, `messages.sender_id`
- **Compatible!** ✅

---

## How It Works Now

### 1. Sign Up Flow
```javascript
// User signs up
supabase.auth.signUp({ email, password })

// Creates user in 'user' table with Supabase Auth UUID
supabase.from("user").insert({
  id: authUser.id,  // UUID from auth
  username: formData.username,
  display_name: formData.displayName,
  borough: formData.borough,
  year: formData.year,
  interests: {"hiking": true, "coding": true},
  follows_ids: {}
})
```

### 2. Login Flow
```javascript
// User logs in
supabase.auth.signInWithPassword({ email, password })

// AuthContext automatically loads user from 'user' table
const { data: userData } = await supabase
  .from("user")
  .select("*")
  .eq("id", authUser.id)
```

### 3. Creating Posts
```javascript
// Uses real authenticated user UUID
await createPost({
  user_id: user.id,  // UUID like "6fd12224-..."
  caption: "Hello!",
  content: "My first post"
})
```

### 4. Adding Friends
```javascript
// Updates follows_ids with friend's UUID
await supabase
  .from("user")
  .update({
    follows_ids: {
      ...currentFollows,
      "friend-uuid-here": true
    }
  })
  .eq("id", user.id)
```

### 5. Messaging
```javascript
// Creates conversation with two UUIDs
await supabase
  .from("conversations")
  .insert({
    user_id_1: "uuid-1",  // Alphabetically first
    user_id_2: "uuid-2"   // Alphabetically second
  })
```

---

## Testing Checklist

After running the migration:

- [ ] Sign up a new user → Check `user` table has UUID id
- [ ] Log in → User loads correctly
- [ ] Create a post → Uses UUID user_id
- [ ] View profile → Shows all fields (username, display_name, bio, etc.)
- [ ] Edit profile → Updates correctly
- [ ] Search for user → Find by username
- [ ] Add friend → Updates follows_ids
- [ ] Send message → Creates conversation with UUIDs
- [ ] Log out → Clears auth state
- [ ] Try accessing protected route while logged out → Redirects to login

---

## Row Level Security (RLS)

The migration enables RLS with these policies:

### User Table
- ✅ **Anyone can view** all profiles (for user lookup, friends list)
- ✅ **Users can only update** their own profile
- ✅ **Users can only insert** their own profile (during signup)

### Conversations
- ✅ Users can only see conversations they're part of
- ✅ Users can only create conversations with themselves as a participant

### Messages
- ✅ Users can only see messages in their own conversations
- ✅ Users can only send messages in their own conversations
- ✅ Users can only mark messages as read in their own conversations

---

## Benefits

1. **Single Source of Truth** - No more conflicts between `user` and `profiles`
2. **Supabase Auth Compatible** - UUID IDs work seamlessly
3. **All Features Available** - Has fields from both old tables
4. **Secure** - RLS policies protect user data
5. **Performant** - Indexed fields for fast queries
6. **Automatic Timestamps** - `updated_at` auto-updates on changes

---

## If You Need to Preserve Existing Data

If you have important data in the current tables:

1. **Export current data:**
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM "user";
   SELECT * FROM profiles;
   ```

2. **Save as CSV** (Supabase has export button)

3. **Run migration** (creates new empty tables)

4. **Import data** with UUID conversion:
   ```sql
   -- You'll need to manually map integer IDs to new UUIDs
   -- Or let users re-signup with same emails
   ```

---

## Future Improvements

- Remove legacy fields (`post_ids`, `group_ids`, `message_ids`) if unused
- Add more profile fields (avatar customization, theme preferences, etc.)
- Add email verification requirement
- Add password reset functionality
- Add social login (Google, GitHub, etc.)
