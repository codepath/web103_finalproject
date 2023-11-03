import { pool } from "../config/database.js";

const addFavoriteLease = async (req, res) => {
    const { userId, listingId } = req.body;

    try {
        const results = await pool.query(
            `INSERT INTO lease_favorites (user_id, listing_id) VALUES ($1, $2) RETURNING *`,
            [userId, listingId]
        );
        res.status(201).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const deleteFavoriteLease = async (req, res) => {
    const { userId, listingId } = req.body;

    try {
        const results = await pool.query(
            `DELETE FROM lease_favorites WHERE user_id = $1 AND listing_id = $2`,
            [userId, listingId]
        );
        res.status(201).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const getAllFavoriteLeasesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const results = await pool.query(
            `SELECT * FROM lease_favorites WHERE user_id = $1`,
            [userId]
        );
        res.status(201).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export default {
    addFavoriteLease,
    deleteFavoriteLease,
    getAllFavoriteLeasesByUser
}