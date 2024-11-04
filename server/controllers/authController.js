import security from '../utils/security.js'
import generateTokens from '../utils/generateTokens.js'
import jwt from 'jsonwebtoken'
import PostgresService from '../services/postgresService.js'

const User = new PostgresService('users')

const authController = {
    /**
     * @requires req.body {
     * email: string,
     * password: string,
     * first_name: string,
     * last_name: string,
     * user_name: string
     * }
     */
    async signup(req, res) {
        try {
            console.log("HEY MOTHER FUCKER", req.body)
            const user = req.body
            user.password = await security.hashPassword(user.password)
            console.log(user)
            const newUser = await User.save(user)
            const tokens = await generateTokens(newUser)
            console.log("AUTH TOKENS",tokens)
            console.log("CREATED DB USER",newUser)
            res.cookie('refresh', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })
            const formattedUser = {
                id: newUser.id,
                email: newUser.email,
                user_name: newUser.user_name,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                image_url: newUser.image_url,
                created_at: newUser.created_at,
                last_login: newUser.last_login,
                last_updated: newUser.last_updated,
                failed_login_attempts: newUser.failed_login_attempts,
            }
            console.log("FORMATTED USER",formattedUser)
            res.status(201).json({
                access_token: tokens.accessToken,
                user: formattedUser
            })
        } catch (error) {
            return res.status(400).send(error)
        }
    },

    /**
     * @requires req.body {
     * email: string,
     * password: string
     * }
     * @param {*} req 
     * @param {*} res 
     */
    async login(req, res) {
        try {
            // Check if we're getting user_name or email
            const { user_name, password } = req.body
    
            // Find user by username
            const user = await User.get_by_field('user_name', user_name)
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
    
            // Compare password
            const isPasswordValid = await security.comparePassword(password, user.password)
            if (!isPasswordValid) {
                // Update failed login attempts
                await User.update(user.id, {
                    failed_login_attempts: (user.failed_login_attempts || 0) + 1,
                    last_login: new Date()
                })
    
                return res.status(401).json({
                    message: 'Invalid credentials'
                })
            }
    
            // Successful login - update user record
            await User.update(user.id, {
                failed_login_attempts: 0,
                last_login: new Date()
            })
    
            // Generate tokens
            const tokens = await generateTokens(user)
    
            // Set refresh token cookie
            res.cookie('refresh', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
    
            // Format user data for response
            const formattedUser = {
                id: user.id,
                email: user.email,
                user_name: user.user_name,
                first_name: user.first_name,
                last_name: user.last_name,
                image_url: user.image_url,
                created_at: user.created_at,
                last_login: user.last_login,
                last_updated: user.last_updated,
                failed_login_attempts: user.failed_login_attempts,
            }
    
            // Send response
            return res.status(200).json({
                access_token: tokens.accessToken,
                user: formattedUser
            })
        } catch (error) {
            console.error('Login error:', error)
            return res.status(500).json({
                message: 'Internal server error during login'
            })
        }
    },

    /**
     * This route will be used to refresh the access token
     * check credentials for the httpOnly cookie
     * @param {*} req 
     * @param {*} res 
     */
    async refresh(req, res) {
        try {
            console.log("REFRESHING")
            const refresh_token = req.cookies.refresh
            console.log("REFRESH TOKEN, ",refresh_token)
            if (!refresh_token) {
                return res.status(401).json({
                    message: "Refresh token not found"
                })
            }

            try {
                const decoded = jwt.verify(
                    refresh_token,
                    process.env.REFRESH_TOKEN_SECRET
                )
                console.log("DECODED",decoded)
                if (decoded.type !== 'refresh') {
                    return res.status(401).json({
                        message: "Invalid token"
                    })
                }

                const user = await User.get_by_id(decoded.userId)
                console.log("USER",user)
                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    })
                }
                console.log("USER",user)

                const tokens = await generateTokens(user)
                console.log("TOKENS",tokens)

                res.cookie('refresh', tokens.refreshToken, {
                    httpOnly: true,
                    sameSite: 'None',
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                const formattedUser = {
                    id: user.id,
                    email: user.email,
                    user_name: user.user_name,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    image_url: user.image_url,
                    created_at: user.created_at,
                    last_login: user.last_login,
                    last_updated: user.last_updated,
                    failed_login_attempts: user.failed_login_attempts,
                }
                console.log("FORMATTED USER",formattedUser)

                res.status(200).json({
                    access_token: tokens.accessToken,
                    user: formattedUser
                })
            } catch (error) {
                if (error instanceof jwt.TokenExpiredError) {
                    return res.status(401).json({ 
                        message: 'Refresh token expired' 
                    })
                }
                if (error instanceof jwt.JsonWebTokenError) {
                    return res.status(401).json({ 
                        message: 'Invalid refresh token' 
                    })
                }
                throw error
            }
        } catch (error) {
            console.error('Refresh error:', error)
            return res.status(500).json({ 
                message: 'Internal server error during refresh' 
            })
        }
    },

    /**
     * This route will be used to logout the user
     * @param {*} req
     * @param {*} res
     */
    async logout(req, res) {
        try {
            res.cookie('refresh', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 0 // Expires immediately
            })

            console.log("LOGGED OUT")
            
            // Optional: Clear any user-related data from response
            return res.status(200).json({
                message: 'Logged out successfully'
            })
        } catch (error) {
            console.error('Logout error:', error)
            return res.status(500).json({
                message: 'Internal server error during logout'
            })
        }
    },

    // OAuth routes (do later)
    async github(req, res) {},

    async githubCallback(req, res) {},

}

export default authController