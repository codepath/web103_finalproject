const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: 'You must be logged in to perform this action.' })
    }

    next()
}

export default isAuthenticated