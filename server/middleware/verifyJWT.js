import jwt from 'jsonwebtoken'

export default verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return res.status(401).send('Access denied')
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        if (decodedToken.type !== 'access') {
            return res.status(401).send('Not an access token')
        }
        req.user = decodedToken
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Token expired')
        }
        return res.status(400).send('Invalid token')
    }
}