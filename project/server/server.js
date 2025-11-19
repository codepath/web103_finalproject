import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "./passport.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import fs from "fs";
import { getPages, getPageById, getPagesByJournalId } from "./data/pages.js";
import { getJournals, addJournal, getJournalById } from './data/journals.js';

let journals = [];
let pages = [];

const app = express();
const PORT = 3000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "SECRET123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

// --------------------------------------------------
// Multer Upload Setup
// --------------------------------------------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  }
});

const upload = multer({ storage });

// --------------------------------------------------
// Auth Middleware
// --------------------------------------------------
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

// --------------------------------------------------
// Auth Routes
// --------------------------------------------------
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/journals",
    failureRedirect: "http://localhost:5173",
  })
);

app.get("/auth/me", (req, res) => {
  if (!req.user) return res.json(null);
  res.json(req.user);
});

// --------------------------------------------------
// JOURNAL ROUTES
// --------------------------------------------------

/**
 * CREATE A JOURNAL
 * Supports both:
 * - multipart/form-data (with image upload)
 * - application/json (preset covers)
 */

app.post("/api/journals", requireAuth, upload.single("coverImage"), (req, res) => {
  try {
    const { name, description, coverColor, coverName, coverImage } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Journal name is required." });
    }

    const userId = req.user.id || req.user.googleId;

    const newJournal = {
      id: Date.now(),
      name: name.trim(),
      description: description?.trim() || "",
      coverColor: coverColor || null,
      coverName: coverName || null,

      // Uploaded image OR preset image
      coverImage: req.file
        ? `/uploads/${req.file.filename}`
        : coverImage || null,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,

      pageCount: 0,
      tags: [],
      location: ""
    };

    journals.push(newJournal);
    res.status(201).json(newJournal);
  } catch (err) {
    console.error("Error creating journal:", err);
    res.status(500).json({ error: "Failed to create journal" });
  }
});

// Get all journals for the logged-in user
app.get("/api/journals", requireAuth, (req, res) => {
  const userId = req.user.id || req.user.googleId;
  const userJournals = journals.filter(j => j.userId === userId);
  res.json(userJournals);
});

// --------------------------------------------------
// PAGE ROUTES
// --------------------------------------------------

// Create page
app.post("/api/journals/:journalId/pages", requireAuth, (req, res) => {
  const journalId = req.params.journalId;
  const journal = journals.find(j => j.id == journalId);

  if (!journal) return res.status(404).json({ error: "Journal not found" });

  const { title, content, tags, location } = req.body;

  const newPage = {
    id: Date.now(),
    journalId,
    title,
    content,
    tags: tags || [],
    location: location || "",
    createdAt: new Date().toISOString(),
  };

  pages.push(newPage);

  journal.pageCount = pages.filter(p => p.journalId == journalId).length;

  res.status(201).json(newPage);
});

// Get single page
app.get("/api/journals/:journalId/pages/:pageId", requireAuth, (req, res) => {
  const page = pages.find(p => p.id == req.params.pageId);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});

// Get all pages for a journal
app.get("/api/journals/:journalId/pages", requireAuth, (req, res) => {
  const journalId = parseInt(req.params.journalId, 10);
  const journalPages = pages.filter(p => p.journalId === journalId);
  res.json(journalPages);
});

// Delete a page
app.delete("/api/journals/:journalId/pages/:pageId", requireAuth, (req, res) => {
  const index = pages.findIndex(p => p.id == req.params.pageId);
  if (index === -1) return res.status(404).json({ error: "Page not found" });

  pages.splice(index, 1);
  res.json({ message: "Page deleted" });
});

// --------------------------------------------------
// JOURNAL :id ROUTES (these must come LAST)
// --------------------------------------------------

// Get a single journal
app.get("/api/journals/:id", requireAuth, (req, res) => {
  const journalId = parseInt(req.params.id, 10);
  const userId = req.user.id || req.user.googleId;
  
  console.log('\n=== GET JOURNAL REQUEST ===');
  console.log('📍 URL:', req.url);
  console.log('🔢 Requested ID (raw):', req.params.id, typeof req.params.id);
  console.log('🔢 Parsed ID:', journalId, typeof journalId);
  console.log('👤 User ID:', userId);
  console.log('📚 Total journals in memory:', journals.length);
  console.log('📋 All journals:', JSON.stringify(journals.map(j => ({ 
    id: j.id, 
    type: typeof j.id,
    name: j.name, 
    userId: j.userId 
  })), null, 2));
  
  const journal = journals.find(j => {
    console.log(`   Comparing: j.id (${j.id}, ${typeof j.id}) === journalId (${journalId}, ${typeof journalId}) = ${j.id === journalId}`);
    return j.id === journalId;
  });
  
  if (!journal) {
    console.log('❌ Journal NOT FOUND');
    console.log('=========================\n');
    return res.status(404).json({ error: "Journal not found" });
  }
  
  console.log('✅ Journal FOUND:', journal.name);
  console.log('=========================\n');
  res.json(journal);
});

// Update a journal
app.put("/api/journals/:id", requireAuth, upload.single("coverImage"), (req, res) => {
  const journalId = parseInt(req.params.id, 10);
  const journal = journals.find(j => j.id === journalId);
  
  if (!journal) return res.status(404).json({ error: "Journal not found" });

  const { name, description, coverColor, coverName, coverImage } = req.body;

  journal.name = name?.trim() || journal.name;
  journal.description = description?.trim() || journal.description;
  journal.coverColor = coverColor || journal.coverColor;
  journal.coverName = coverName || journal.coverName;

  if (req.file) {
    journal.coverImage = `/uploads/${req.file.filename}`;
  } else if (coverImage) {
    journal.coverImage = coverImage;
  }

  journal.updatedAt = new Date().toISOString();

  res.json(journal);
});

// Delete a journal
app.delete("/api/journals/:id", requireAuth, (req, res) => {
  const journalId = parseInt(req.params.id, 10);
  const index = journals.findIndex(j => j.id === journalId);
  
  if (index === -1) return res.status(404).json({ error: "Journal not found" });

  journals.splice(index, 1);
  res.json({ message: "Journal deleted" });
});

// --------------------------------------------------
// STATIC FILE SERVING FOR UPLOADS
// --------------------------------------------------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --------------------------------------------------
// Start Server
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
