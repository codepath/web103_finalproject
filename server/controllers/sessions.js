import { pool } from '../config/database.js';

const createSession = async (req, res) => {
    try {
        const sessions = req.body; // Expecting an array of sessions

        if (!Array.isArray(sessions)) {
            return res.status(400).json({ error: "Payload must be an array of sessions." });
        }

        const results = [];
        for (const session of sessions) {
            const { group_id, proposed_by, proposed_day, proposed_time } = session;

            const result = await pool.query(
                `INSERT INTO sessions (group_id, proposed_by, proposed_day, proposed_time)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [group_id, proposed_by, proposed_day, proposed_time]
            );

            results.push(result.rows[0]);
        }

        res.status(201).json(results); // Return all created sessions
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllSessions = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM sessions ORDER BY group_id, proposed_date, proposed_time`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getSessionsByGroup = async (req, res) => {
    try {
        const group_id = parseInt(req.params.group_id);
        const result = await pool.query(
            `SELECT * FROM sessions WHERE group_id = $1 ORDER BY proposed_date, proposed_time`,
            [group_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const deleteSession = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await pool.query(`DELETE FROM sessions WHERE id = $1`, [id]);
        res.status(204).json();
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const voteForSession = async (req, res) => {
    try {
        const { session_id, user_id, proposed_time } = req.body;

        // Record the user's vote in the sessions_users table
        const result = await pool.query(
            `INSERT INTO sessions_users (session_id, user_id, proposed_time, voted)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (session_id, user_id, proposed_time)
            DO NOTHING RETURNING *`,
            [session_id, user_id, proposed_time]
        );

        if (result.rows.length === 0) {
            return res.status(409).json({ error: "User already voted for this session time." });
        }

        // Increment the total_votes in the sessions table
        await pool.query(
            `UPDATE sessions
            SET total_votes = total_votes + 1
            WHERE id = $1`,
            [session_id]
        );

        res.status(200).json({ message: "Vote registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export default {
    getAllSessions,
    createSession,
    getSessionsByGroup,
    deleteSession,
    voteForSession
};
