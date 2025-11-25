# Frontend-Backend Integration - Posts Feature

## ✅ Completed Integration

The frontend and backend are now connected for **Post CRUD operations**. All users (even unauthenticated) can create, read, update, and delete posts.

## 🏗️ What Was Implemented

### Backend (Already Complete)
- ✅ Express server with CORS enabled
- ✅ Supabase database integration
- ✅ Full CRUD API endpoints at `/api/posts`
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/:id` - Get single post
  - `POST /api/posts` - Create new post
  - `PUT /api/posts/:id` - Update post
  - `DELETE /api/posts/:id` - Delete post

### Frontend (Newly Added)
- ✅ Axios installed and configured
- ✅ API service layer created
- ✅ Vite proxy configured
- ✅ Post UI components integrated into Home page
- ✅ Full CRUD operations in UI

## 📁 New Files Created

```
client/
├── .env                          # Environment variables
├── src/
│   ├── services/
│   │   ├── api.js               # Axios base configuration
│   │   └── postService.js       # Post API calls
│   └── pages/
│       └── Posts.css            # Post styling
```

## 🚀 How to Run

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:3000`

### 2. Start the Frontend
```bash
cd client
npm install
npm run dev
```
Client runs on: `http://localhost:5173`

## 🎯 Features Implemented

### Create Post
- Fill in caption, content, and optional photo URL
- Click "Post" button
- Post is created in Supabase database

### Read Posts
- All posts automatically load when Home page opens
- Posts display with user, timestamp, caption, content, and image

### Update Post
- Click "Edit" button on any post
- Modify caption, content, or photo URL
- Click "Update" to save changes

### Delete Post
- Click "Delete" button on any post
- Confirm deletion in popup
- Post is removed from database

## 🔧 Post Data Structure

Based on `server/tables/post.json`:
```json
{
  "id": "auto-generated",
  "user_id": "anonymous (for now)",
  "photo_url": "optional image URL",
  "caption": "post title/caption",
  "content": "post body text",
  "user_ids": {},
  "group_limit": ""
}
```

## 🌐 API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Fetch all posts |
| GET | `/api/posts/:id` | Fetch single post |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/:id` | Update existing post |
| DELETE | `/api/posts/:id` | Delete post |

## 🎨 UI Location

Posts are displayed on the **Home page** (`/home`) below the groups section.

## ⚠️ Important Notes

1. **Authentication is disabled** - As requested, anyone can create/edit/delete posts
2. **Supabase must be configured** - Make sure `server/.env` has valid Supabase credentials
3. **Proxy is configured** - Frontend `/api` calls are proxied to `http://localhost:3000`
4. **Both servers must run** - Backend on port 3000, frontend on port 5173

## 🔮 Next Steps (When Ready)

- Add authentication (your teammate's work)
- Restrict edit/delete to post owners
- Add user profiles
- Implement groups integration
- Add real-time updates
- Image upload functionality

## 🐛 Troubleshooting

### "Failed to load posts"
- Ensure backend server is running on port 3000
- Check Supabase credentials in `server/.env`
- Verify `post` table exists in Supabase

### "Network Error"
- Backend server not running
- Check console for CORS errors

### Posts not showing after creation
- Check browser console for errors
- Verify Supabase table has correct schema
- Check network tab to see API responses
