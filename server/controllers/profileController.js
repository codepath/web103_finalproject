import { pool } from "../config/database.js";

const getProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const profile = await pool.query(`SELECT * FROM profiles WHERE id = $1`, [id]);
        if (profile.rows.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error fetching profile', error: err.message });    
    }
}

const createProfile = async (req, res) => {
    const userId = req.user?.id;
    const {bio, location, links} = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const newProfile = await pool.query(
            `INSERT INTO profiles (user_id, bio, location, links) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, bio, location, links]
        );
        res.status(201).json(newProfile.rows[0]);
    }
    catch (err) {
        res.status(409).json({ message: 'Error creating profile', error: err.message });    
    }
}

export default {
    getProfile,
    createProfile
}