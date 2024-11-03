import jwt from 'jsonwebtoken';
/**
 * Generate JWT access and refresh tokens from a user object
 * with an id and email property
 * @param {Object} user 
 * @returns {Object} {accessToken, refreshToken}
 */
const generateTokens = async (user) => {
    const accessToken = jwt.sign({
        userId: user.id,
        email: user.email,
        type: 'access'
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({
        userId: user.id,
        type: 'refresh'
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

export default generateTokens