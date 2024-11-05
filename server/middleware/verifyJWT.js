import jwt from 'jsonwebtoken'

export default verifyJWT = (req, res, next) => {
    // get the authorization header from the request
    const authHeader = req.headers['authorization']
    // split the header into an array of strings, and get the second value, the access token
    const token = authHeader?.split(' ')[1]

    // if there is no token, return an error
    if (!token) {
        return res.status(401).send('Access denied')
    }

    try {
        // verify the token, store the decoded token in a variable
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

        // if the token is not an access token, return an error
        if (decodedToken.type !== 'access') {
            return res.status(401).send('Not an access token')
        }

        // set the user property of the request to the decoded token
        req.jwt_user = decodedToken
        // call the next middleware
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Token expired')
        }
        
        return res.status(400).send('Invalid token')
    }
}