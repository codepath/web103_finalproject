// db/resetDatabase.js
//
// Run with: npm run reset
//
// Rebuilds the entire database from schema.sql, then inserts demo data
// from seedData.js. Safe to run as many times as you want — schema.sql
// drops and recreates every table, so you always end up in the same
// known state.
//

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import pool from "../config/database.js";
import {
    demoUsers,
    demoFollowedTeams,
    demoComments,
    demoPredictions,
    demoNotifications,
    demoVideoLinks,
} from "./seedData.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SALT_ROUNDS = 10;

async function rebuildSchema() {
    const schemaPath = path.resolve(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    await pool.query(schemaSql);
    console.log("✅ schema rebuilt (all 6 tables created)");
}

async function seedUsers() {
    // sequential, not Promise.all: each hash is deliberately slow and we want
    // predictable user_id ordering for the seed rows the other tables reference
    for (const user of demoUsers) {
        const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);
        await pool.query(
            `INSERT INTO users (username, email, password_hash, profile_image_url, total_points)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                user.username,
                user.email,
                passwordHash,
                user.profile_image_url,
                user.total_points,
            ],
        );
    }
    console.log(`✅ ${demoUsers.length} demo users inserted (passwords hashed)`);
}

async function seedFollowedTeams() {
    for (const follow of demoFollowedTeams) {
        await pool.query(
            `INSERT INTO followed_teams (user_id, api_team_id, team_name)
             VALUES ($1, $2, $3)`,
            [follow.user_id, follow.api_team_id, follow.team_name],
        );
    }
    console.log(`✅ ${demoFollowedTeams.length} demo followed_teams inserted`);
}

async function seedComments() {
    for (const comment of demoComments) {
        await pool.query(
            `INSERT INTO comments (user_id, api_match_id, content)
             VALUES ($1, $2, $3)`,
            [comment.user_id, comment.api_match_id, comment.content],
        );
    }
    console.log(`✅ ${demoComments.length} demo comments inserted`);
}

async function seedPredictions() {
    for (const prediction of demoPredictions) {
        await pool.query(
            `INSERT INTO predictions (user_id, api_match_id, predicted_home_score, predicted_away_score, points_awarded)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                prediction.user_id,
                prediction.api_match_id,
                prediction.predicted_home_score,
                prediction.predicted_away_score,
                prediction.points_awarded,
            ],
        );
    }
    console.log(`✅ ${demoPredictions.length} demo predictions inserted`);
}

async function seedNotifications() {
    for (const notification of demoNotifications) {
        await pool.query(
            `INSERT INTO notifications (user_id, api_team_id, api_match_id, notification_type, message)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                notification.user_id,
                notification.api_team_id,
                notification.api_match_id,
                notification.notification_type,
                notification.message,
            ],
        );
    }
    console.log(`✅ ${demoNotifications.length} demo notifications inserted`);
}

async function seedVideoLinks() {
    for (const video of demoVideoLinks) {
        await pool.query(
            `INSERT INTO video_links (user_id, api_match_id, title, video_url, provider)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                video.user_id,
                video.api_match_id,
                video.title,
                video.video_url,
                video.provider,
            ],
        );
    }
    console.log(`✅ ${demoVideoLinks.length} demo video_links inserted`);
}

async function main() {
    try {
        await rebuildSchema();
        await seedUsers();
        await seedFollowedTeams();
        await seedComments();
        await seedPredictions();
        await seedNotifications();
        await seedVideoLinks();
        console.log("🎉 database reset complete");
    } catch (err) {
        console.error("⚠️  reset failed:", err.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main();
