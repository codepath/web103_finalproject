import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: parseInt(decoded.id, 10) }; // Ensure user ID is an integer
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token. Session Expired. login again!!!' });
    }
};

export default authMiddleware;