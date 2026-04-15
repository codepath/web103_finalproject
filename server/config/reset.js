import './dotenv.js';
import { pool } from './database.js';
import hashtagData from '../data/hashtags.js';

//🧹 DROP All tables

const dropTables = async () => {
    const query =`
    DROP TABLE IF EXISTS post_hashtags;
    DROP TABLE IF EXISTS profile_hashtags;
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS bookmarks;
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS network;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS profiles;
    DROP TABLE IF EXISTS hashtags;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS auth.users;
    `;

    try {
        await pool.query(query);
        console.log('🧹 All tables dropped successfully!');
    } catch (err) {
        console.error('⚠️Error dropping table:', err);
    }
};


/* 🪄 Create all tables */

//Table 1 of 11 - Authorized Users
const createUsersTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE,
            encrypted_password TEXT,
            github_id TEXT UNIQUE,
            username TEXT UNIQUE,
            avatar_url TEXT,
            provider TEXT DEFAULT 'github',
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Users table created successfully');
    } catch (err) {
        console.error('Error creating Users table:', err);
    }
};

//Table 2 of 11 - Hashtags
const createHashtagsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            tag_text TEXT UNIQUE,
            category TEXT,
            created_at TIMESTAMP DEFAULT now()
        );

        -- Function: auto-convert tags to lowercase before saving
        CREATE OR REPLACE FUNCTION tag_case()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.tag_text := LOWER(NEW.tag_text);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Trigger: applies lowercase conversion before insert or update
        CREATE TRIGGER tag_case_trigger
        BEFORE INSERT OR UPDATE ON hashtags
        FOR EACH ROW EXECUTE FUNCTION tag_case();
    `;

    try {
        await pool.query(query);
        console.log('Hashtags table created successfully');
    } catch (err) {
        console.error('Error creating hashtags table:', err);
    }
};

//Table 3 of 11 - Profiles
const createProfilesTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            bio TEXT,
            location TEXT,
            links TEXT,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Profiles table created successfully');
    } catch (err) {
        console.error('Error creating profiles table:', err);
    }
};

//Table 4 of 11 - Posts
const createPostsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            title TEXT,
            description TEXT,
            media_url TEXT,
            link TEXT,
            likes_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Posts table created successfully');
    } catch (err) {
        console.error('Error creating posts table:', err);
    }
};

//Table 5 of 11 - Projects
const createProjectsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            title TEXT,
            description TEXT,
            tech_stack TEXT,
            demo_url TEXT,
            collaborators TEXT,
            links TEXT,
            license TEXT,
            md_content TEXT,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Projects table created successfully');
    } catch (err) {
        console.error('Error creating projects table:', err);
    }
};

//Table 6 of 11 - Network
const createNetworkTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS network (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
            status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
            created_at TIMESTAMP DEFAULT now(),
            CHECK (requester_id <> receiver_id),
            UNIQUE (requester_id, receiver_id)
        );
    `;

    try {
        await pool.query(query);
        console.log('Network table created successfully');
    } catch (err) {
        console.error('Error creating network table:', err);
    }
};

//Table 7 of 11 - Messages
const createMessagesTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            status TEXT CHECK (status IN ('read', 'unread')),
            content TEXT,
            created_at TIMESTAMP DEFAULT now()
        );
    `;

    try {
        await pool.query(query);
        console.log('Messages table created successfully');
    } catch (err) {
        console.error('Error creating messages table:', err);
    }
};

//Table 8 of 11 - Bookmarks
const createBookmarksTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS bookmarks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
            project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT now(),
            CHECK (
                (post_id IS NOT NULL AND project_id IS NULL)
                OR (post_id IS NULL AND project_id IS NOT NULL)
            ),
            UNIQUE (profile_id, post_id),
            UNIQUE (profile_id, project_id)
        );
    `;

    try {
        await pool.query(query);
        console.log('Bookmarks table created successfully');
    } catch (err) {
        console.error('Error creating bookmarks table:', err);
    }
};

//Table 9 of 11 - Comments
const createCommentsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
            profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            content TEXT,
            created_at TIMESTAMP DEFAULT now(),
            UNIQUE (post_id, profile_id, content)
        );
    `;

    try {
        await pool.query(query);
        console.log('Comments table created successfully');
    } catch (err) {
        console.error('Error creating comments table:', err);
    }
};

//Table 10 of 11 - Profile Hashtags
const createProfileHashtagsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS profile_hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            hashtag_id UUID REFERENCES hashtags(id) ON DELETE CASCADE
        );
    `;

    try {
        await pool.query(query);
        console.log('Profile hashtags table created successfully');
    } catch (err) {
        console.error('Error creating profile hashtags table:', err);
    }
};

//Table 11 of 11 - Post Hashtags
const createPostHashtagsTable = async () => {

    const query = `
        CREATE TABLE IF NOT EXISTS post_hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
            hashtag_id UUID REFERENCES hashtags(id) ON DELETE CASCADE,
            UNIQUE (post_id, hashtag_id)
        );

        CREATE INDEX IF NOT EXISTS idx_post_hashtags_post_id ON post_hashtags(post_id);
        CREATE INDEX IF NOT EXISTS idx_post_hashtags_hashtag_id ON post_hashtags(hashtag_id);
        CREATE INDEX IF NOT EXISTS idx_hashtags_tag_text ON hashtags(tag_text);
    `;

    try {
        await pool.query(query);
        console.log('Post hashtags table created successfully');
    } catch (err) {
        console.error('Error creating post hashtags table:', err);
    }
};



/* 🌱 Seed tables */

//Table 2: Hashtags
const seedHashtagsTable = async () => {
    const client = await pool.connect();

    try{
        for (const hashtag of hashtagData) {
            const insertQuery = `
                INSERT INTO hashtags (tag_text, category)
                VALUES ($1, $2)
            `;

            const values = [
                hashtag.tag_text,
                hashtag.category
            ];

            await client.query(insertQuery, values);
            console.log(`Hashtag added successfully: ${hashtag.tag_text}!`);
        }
    } catch (err) {
            console.error('Error inserting hashtag:', err);
    } finally {
        client.release();
    }
};

//Reset function to drop, create, and seed tables in the correct order
const resetDatabase = async () => {
    await dropTables();

    await createUsersTable();
    await createHashtagsTable();
    await createProfilesTable();
    await createPostsTable();
    await createProjectsTable();
    await createNetworkTable();
    await createMessagesTable();
    await createBookmarksTable();
    await createCommentsTable();
    await createProfileHashtagsTable();
    await createPostHashtagsTable();

    await seedHashtagsTable();

    console.log('🎉 Database reset complete!');

    //close all connections once scrip has run
    await pool.end();
}

resetDatabase();
