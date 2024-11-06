import { pool } from '../config/database.js';

const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT *
             FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};


const updateUserProfile = async (req, res) => {
    const userId = req.user.id;
    const { user_name, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE users
             SET username = $1, email = $2
             WHERE id = $3
             RETURNING id, username, email`,
            [user_name, email, userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// Update user diet preferences
const updateUserDietPreferences = async (req, res) => {
    const userId = req.user.id;
    const { diets = [] } = req.body;
    try {
        const result = await pool.query(
            `UPDATE users
             SET diet_preferences = $1
             WHERE id = $2
             RETURNING id, username, email, diet_preferences`,
            [diets, userId]
        );
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating diet preferences:', error);
        res.status(500).json({ message: 'Error updating diet preferences' });
    }
}

export default { getUserProfile, updateUserProfile, updateUserDietPreferences };
