import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        );

        const user = result.rows[0];
        const token = generateToken(user.id);

        res.status(201).json({ token, user: { id: user.id, username, email } });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials: user not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials: incorrect password' });
        }

        const token = generateToken(user.id);
        res.json({ token, user: { id: user.id, username: user.username, email } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Login error', error });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

export default { register, login, logout };
