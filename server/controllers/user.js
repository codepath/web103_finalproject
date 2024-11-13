import { pool } from '../config/database.js';
import { hash, compare, signToken, verifyToken } from '../util/auth.js'

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).send('Please provide all required fields');
        }

        const hashedPassword = await hash(password);

        pool.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.error('Database connection test failed:', err);
            } else {
                console.log('Database connected successfully:', res.rows[0]);
            }
        });
        
        const userEntry = await pool.query(
            `INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3) RETURNING *`,
            [username, hashedPassword, email]
        );

        console.log('userEntry:', userEntry);

        const user = userEntry.rows[0];
        res.status(201).send({
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                created_at: user.created_at
            },
            message: 'User created successfully'
            });

    } catch (error) {
        res.status(500).send({ error: error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Please provide all required fields');
        }

        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isCorrectPassword = await compare(password, user.password_hash);
        if(!isCorrectPassword){
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT
        const token = signToken({
            user_id: user.user_id,
            username: user.username
        });

        res.json({
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                token_type: "Bearer",
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
    }

};

export default {
    registerUser,
    loginUser
}