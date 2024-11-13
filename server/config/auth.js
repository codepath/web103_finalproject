import jwt from 'jsonwebtoken';

const secretKey = process.env.GITHUB_CLIENT_SECRET; // Replace with your own secret key

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}

// Function to generate JWT
function generateJWT(user) {
    const payload = {
        id: user.id,
        username: user.username
    };

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

module.exports = {
    authenticateJWT,
    generateJWT
};