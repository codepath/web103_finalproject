import express from "express";
import bcrypt from "bcrypt";
import OpenAI from "openai";
var router = express.Router();
import { pool } from "../database/database.js";

/* GET home page. */
router.get("/", async function (req, res) {
  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database query failed" });
    }
    return res.json({
      message: "Database connection successful",
      time: result.rows[0].now,
    });
  });
});

// --- AUTHENTICATION ---

//login endpoint
router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.json({
      message: `User ${user.username} logged in successfully!`,
      success: true,
      userID: user.id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//registration endpoint with validation
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Email Validation (Standard format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Requirements: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashedPassword],
    );

    const userID = result.rows[0].id;

    return res.status(201).json({
      message: `User ${username} created successfully!`,
      success: true,
      userID: userID,
      username: username,
    });
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique violation code
      return res.status(400).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

async function hashPassword(password) {
  const newpassword = await bcrypt.hash(password, 10);
  return newpassword;
}

// --- NOTES ---

//create note endpoint
// ***NOTE: user must create a category before creating a note ***
router.post("/notes", async (req, res) => {
  //user must create a category before creating a note, so we can check if the categoryID exists in the database before creating the note
  const { userID, categoryID, title, content, color, is_pinned } = req.body;

  if (!userID || !categoryID || !title || !content || !color) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      categoryID,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Category does not exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, category_id, title, content, color, is_pinned) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [userID, categoryID, title, content, color, is_pinned ?? false],
    );
    return res.status(201).json({
      message: `Note ${title} created successfully!`,
      success: true,
      noteID: result.rows[0].id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/notes/:userID", async (req, res) => {
  // JOINs with categories to get the name instead of just the ID
  const query = `
    SELECT n.*, c.name as category_name 
    FROM notes n 
    LEFT JOIN categories c ON n.category_id = c.id 
    WHERE n.user_id = $1
  `;
  const result = await pool.query(query, [req.params.userID]);
  res.json(result.rows);
});

router.put("/notes/:id", async (req, res) => {
  const { userID, title, content, color, categoryID, is_pinned } = req.body;
  const result = await pool.query(
    "UPDATE notes SET title=$1, content=$2, color=$3, category_id=$4, is_pinned=$5 WHERE id=$6 AND user_id=$7 RETURNING *",
    [title, content, color, categoryID, is_pinned, req.params.id, userID],
  );
  res.json(result.rows[0]);
});

router.delete("/notes/:id", async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }
  await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [
    req.params.id,
    userID,
  ]);
  res.json({ message: "Note deleted", success: true });
});

//create category endpoint
router.post("/categories", async (req, res) => {
  const { userID, name } = req.body;

  if (!userID || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingCategory = await pool.query(
      "SELECT * FROM categories WHERE user_id = $1 AND LOWER(name) = LOWER($2)",
      [userID, name.trim()],
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: "Category already exists" });
    }
    await pool.query("INSERT INTO categories (user_id, name) VALUES ($1, $2)", [
      userID,
      name.trim(),
    ]);

    return res.status(201).json({
      message: `Category ${name} created successfully!`,
      success: true,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  const { userID } = req.body; // userID to ensure they own it
  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }
  await pool.query("DELETE FROM categories WHERE id = $1 AND user_id = $2", [
    req.params.id,
    userID,
  ]);
  res.json({ message: "Deleted", success: true });
});

// Add this to your backend router file
router.get("/categories/:userID", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC",
      [req.params.userID],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update category name
router.put("/categories/:id", async (req, res) => {
  const { userID, name } = req.body;
  const { id } = req.params;

  if (!userID || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [name, id, userID],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Category not found or unauthorized" });
    }

    return res.json({
      message: "Category updated successfully",
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// --- TAGS ---

router.post("/tags", async (req, res) => {
  const { userID, name } = req.body;

  if (!userID || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM tags WHERE user_id = $1 AND LOWER(name) = LOWER($2)",
      [userID, name],
    );
    if (existing.rows.length > 0) {
      return res.status(200).json({ success: true, tagID: existing.rows[0].id });
    }
    const result = await pool.query(
      "INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING id",
      [userID, name],
    );
    return res.status(201).json({
      message: `Tag ${name} created successfully!`,
      success: true,
      tagID: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/notes/tag", async (req, res) => {
  const { noteID, tagID } = req.body;
  if (!noteID || !tagID) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await pool.query("INSERT INTO note_tag (note_id, tag_id) VALUES ($1, $2)", [
      noteID,
      tagID,
    ]);
    res.json({ message: "Tag linked to note", success: true });
  } catch (error) {
    res.status(400).json({ error: "Already tagged" });
  }
});

router.get("/notes/:noteID/tags", async (req, res) => {
  const { noteID } = req.params;
  try {
    const result = await pool.query(
      `SELECT t.* FROM tags t
       JOIN note_tag nt ON t.id = nt.tag_id
       WHERE nt.note_id = $1`,
      [noteID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:noteID/tags", async (req, res) => {
  try {
    await pool.query("DELETE FROM note_tag WHERE note_id = $1", [req.params.noteID]);
    res.json({ message: "Tags cleared", success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tags/:userID", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC",
      [req.params.userID]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- SETTINGS ---

router.get("/settings/:userID", async (req, res) => {
  const result = await pool.query("SELECT * FROM settings WHERE user_id = $1", [
    req.params.userID,
  ]);
  res.json(result.rows[0]);
});

router.put("/settings/:userID", async (req, res) => {
  const { theme, default_color, ai_enabled } = req.body;
  const result = await pool.query(
    "UPDATE settings SET theme=$1, default_color=$2, ai_enabled=$3 WHERE user_id=$4 RETURNING *",
    [theme, default_color, ai_enabled, req.params.userID],
  );
  res.json(result.rows[0]);
});

//AI feature
router.post("/ai/transform", async (req, res) => {
  const { userID, email, content, tone } = req.body;

  try {
    // Verify user exists and email matches
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND email = $2",
      [userID, email],
    );

    if (userCheck.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User verification failed" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!content) return res.status(400).json({ error: "No content provided" });
    if (!tone) return res.status(400).json({ error: "No tone provided" });
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" for more spped
      messages: [
        {
          role: "system",
          content: `You are a helpful note-taking assistant. Rewrite the user's note to be ${tone}. 
                    Keep the core meaning but change the style. Do not include any intro text like "Here is your note".`,
        },
        { role: "user", content: content },
      ],
    });

    const aiText = completion.choices[0].message.content;
    res.json({ aiText });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI transformation failed" });
  }
});

export default router;
