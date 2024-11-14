import { pool } from '../config/database.js'

const getUserDetailsByUserId = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const results = await pool.query('SELECT * FROM users WHERE id=$1', [user_id])
        
        if (results.rows.length === 0){
            res.status(404).json({ error: "No user found." })

        } else {
            res.status(200).json(results.rows);
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


const updateUserDetailsByUserId = async (req, res) => {
    const user_id = req.params.user_id;
    try {        
        const { username, email, full_name, phone_number } = req.body;
        const result = await pool.query(
            'UPDATE users SET username=$1, email=$2, full_name=$3, phone_number=$4 WHERE id=$5 RETURNING *', 
            [username, email, full_name, phone_number, user_id]
        )
        if (result.rows.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
            res.status(500).json({ error: error.message });
    }
}

const updateUserDetailsByUserId1 = async (req, res) => {
    const user_id = req.params.user_id;
    try {        
        const { username, password, email, full_name, phone_number } = req.body;
        const result = await pool.query(
            'UPDATE users SET username=$1, password=$2, email=$3, full_name=$4, phone_number=$5 WHERE id=$6 RETURNING *', 
            [username, password, email, full_name, phone_number, user_id]
        )
        if (result.rows.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
            res.status(500).json({ error: error.message });
    }
}

export default { getUserDetailsByUserId, updateUserDetailsByUserId }