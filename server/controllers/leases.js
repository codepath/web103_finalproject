import { pool } from "../config/database.js";

const createLeaseListing = async (req, res) => {
    try {
        const {
            listing_type,
            tenant_names,
            room_setup,
            appliances,
            amenities,
            preference_gender,
            preference_age,
            other_preferences,
            deal_breakers,
            location,
            rent,
            utilities,
            lease_length,
            start_date,
            pictures,
            user_id,
        } = req.body;

        const results = await pool.query(
            `INSERT INTO listings 
            (listing_type, tenant_names, room_setup, appliances, amenities, 
                preference_gender, preference_age, other_preferences, 
                deal_breakers, location, rent, utilities, lease_length, 
                start_date, pictures, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                $11, $12, $13, $14, $15, $16)
            RETURNING *`,
            [
                listing_type,
                tenant_names,
                room_setup,
                appliances,
                amenities,
                preference_gender,
                preference_age,
                other_preferences,
                deal_breakers,
                location,
                rent,
                utilities,
                lease_length,
                start_date,
                pictures,
                user_id,
            ]
        );
        res.status(201).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const updateLeaseListing = async (req, res) => {
    const { listingId } = req.params.id;
    const {
        room_setup,
        appliances,
        amenities,
        preference_gender,
        preference_age,
        other_preferences,
        deal_breakers,
        location,
        rent,
        utilities,
        lease_length,
        start_date,
        pictures
    } = req.body;

    try {
        const results = await pool.query(
            `UPDATE listings SET room_setup = $1, appliances = $2, amenities = $3,
            preference_gender = $4, preference_age = $5, other_preferences = $6,
            deal_breakers = $7, location = $8, rent = $9, utilities = $10,
            lease_length = $11, start_date = $12, pictures = $13
            WHERE id = $14
            RETURNING *`,
            [
                room_setup,
                appliances,
                amenities,
                preference_gender,
                preference_age,
                other_preferences,
                deal_breakers,
                location,
                rent,
                utilities,
                lease_length,
                start_date,
                pictures,
                listingId,
            ]
        );
        res.status(201).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const deleteLeaseListing = async (req, res) => {
    const { listingId } = req.params.id;

    try {
        const results = await pool.query(`DELETE FROM listings WHERE id = $1`, [
            listingId,
        ]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getLeaseListingById = async (req, res) => {
    const { listingId } = req.params.id;

    try {
        const results = await pool.query(
            `SELECT * FROM listings WHERE id = $1`,
            [listingId]
        );
        if (results.rows.length === 0) {
            res.status(404).json({ error: "Listing not found" });
        } else {
            res.status(201).json(results.rows[0]);
        }
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getAllLeaseListings = async (req, res) => {
    try {
        const results = await pool.query(`SELECT * FROM listings`);
        res.status(201).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getLeaseListingsByUserId = async (req, res) => {
    const { userId } = req.params.userId;

    try {
        const results = await pool.query(
            `SELECT * FROM listings WHERE user_id = $1`,
            [userId]
        );
        res.status(201).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getLeaseListingsByLeaseType = async (req, res) => {
    const leaseType = req.params.leaseType;

    try {
        const results = await pool.query(
            `SELECT * FROM listings WHERE listing_type = $1`,
            [leaseType]
        );
        res.status(201).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export default {
    createLeaseListing,
    updateLeaseListing,
    deleteLeaseListing,
    getLeaseListingById,
    getAllLeaseListings,
    getLeaseListingsByUserId,
    getLeaseListingsByLeaseType,
};
