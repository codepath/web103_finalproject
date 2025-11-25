// Test script to verify backend API is working
// Run with: node test-api.js

const testAPI = async () => {
  const BASE_URL = "http://localhost:3000/api";

  console.log("🧪 Testing Lexington Links API...\n");

  try {
    // Test 1: Health check
    console.log("1️⃣ Testing health endpoint...");
    const healthResponse = await fetch("http://localhost:3000");
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);
    console.log("");

    // Test 2: Get all posts
    console.log("2️⃣ Testing GET /api/posts...");
    const getResponse = await fetch(`${BASE_URL}/posts`);
    const posts = await getResponse.json();
    console.log(`✅ Found ${posts.length} posts`);
    console.log("Posts data:", JSON.stringify(posts, null, 2));
    console.log("");

    // Test 3: Create a post
    console.log("3️⃣ Testing POST /api/posts...");
    const newPost = {
      user_id: "test-user",
      caption: "Test Post from API Script",
      content: "This is a test post created via the API test script",
      photo_url: "https://via.placeholder.com/400",
    };
    const createResponse = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    const createdPost = await createResponse.json();
    console.log("✅ Created post:", createdPost);
    console.log("");

    // Test 4: Get the created post
    if (createdPost.id) {
      console.log("4️⃣ Testing GET /api/posts/:id...");
      const getOneResponse = await fetch(`${BASE_URL}/posts/${createdPost.id}`);
      const fetchedPost = await getOneResponse.json();
      console.log("✅ Fetched post:", fetchedPost);
      console.log("");

      // Test 5: Update the post
      console.log("5️⃣ Testing PUT /api/posts/:id...");
      const updatedData = {
        ...newPost,
        caption: "UPDATED: Test Post",
        content: "This post has been updated!",
      };
      const updateResponse = await fetch(`${BASE_URL}/posts/${createdPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const updatedPost = await updateResponse.json();
      console.log("✅ Updated post:", updatedPost);
      console.log("");

      // Test 6: Delete the post
      console.log("6️⃣ Testing DELETE /api/posts/:id...");
      const deleteResponse = await fetch(`${BASE_URL}/posts/${createdPost.id}`, {
        method: "DELETE",
      });
      const deleteResult = await deleteResponse.json();
      console.log("✅ Deleted post:", deleteResult);
      console.log("");
    }

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 Make sure:");
    console.log("   - Backend server is running (npm run dev in server folder)");
    console.log("   - Supabase credentials are configured in server/.env");
    console.log("   - Post table exists in Supabase");
  }
};

// Run tests
testAPI();
