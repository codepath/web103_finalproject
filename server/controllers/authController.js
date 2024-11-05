import security from '../utils/security.js'
import generateTokens from '../utils/generateTokens.js'
import jwt from 'jsonwebtoken'
import PostgresService from '../services/postgresService.js'

// create a new PostgresService instance for the users table
const User = new PostgresService('users')

/**
 * @description This controller will handle all authentication routes
 * @module controllers/authController
 * @method signup
 * @method login
 * @method refresh
 * @method logout
 * @method githubLogin
 * @method githubCallback
 */
const authController = {
    /**
     * @description This route will be used to sign up a new user
     * @requires req.body {
     * email: string,
     * password: string,
     * first_name: string,
     * last_name: string,
     * user_name: string
     * }
     * @param {*} req
     * @param {*} res
     * @returns access token and user data in response and refresh token in httpOnly cookie
     */
    async signup(req, res) {
        try {
            // get user from request
            const user = req.body

            // check if user already exists
            const users = await User.get_by_field('email', user.email)
            if (users.length > 0) {
                return res.status(409).json({ message: 'User already exists' })
            }

            // check if username already exists
            const userNames = await User.get_by_field('user_name', user.user_name)
            if (userNames.length > 0) {
                return res.status(409).json({ message: 'Username already exists' })
            }

            // hash user password
            user.password = await security.hashPassword(user.password)

            // save user to database
            const newUser = await User.save(user)
            if (!newUser) {
                return res.status(400).json({ message: 'Error creating user' })
            }

            // generate access and refresh tokens
            const tokens = await generateTokens(newUser)

            // set refresh token cookie in response
            res.cookie('refresh', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            })

            // format user data for response to remove password
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

            // send user data and tokens in response
            res.status(201).json({
                message: 'User created successfully',
                access_token: tokens.accessToken,
                user: formattedUser
            })
        } catch (error) {
            console.error('Signup error:', error)

            return res.status(500).json({
                message: 'Internal server error during signup'
            })
        }
    },

    /**
     * @description This route will be used to login the user
     * @requires req.body {
     * email: string,
     * password: string
     * }
     * @param {*} req 
     * @param {*} res 
     * @returns access token and user data in response and refresh token in httpOnly cookie
     */
    async login(req, res) {
        try {
            // username and password from login request
            const login_data = req.body

            // find user by username
            const users = await User.get_by_field('user_name', login_data.user_name)

            // access the user
            const user = users[0]
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
    
            // compare plain password to previously stored hashed password
            const isPasswordValid = await security.comparePasswords(login_data.password, user.password)

            if (!isPasswordValid) {
                // update failed login attempts (we could use this later to limit login attempts)
                await User.update(user.id, {
                    failed_login_attempts: (user.failed_login_attempts || 0) + 1,
                    last_login: new Date()
                })
    
                return res.status(401).json({
                    message: 'Invalid credentials'
                })
            }
    
            // successful login, update user fields
            await User.update(user.id, {
                failed_login_attempts: 0,
                last_login: new Date()
            })
    
            // generate access and refresh tokens
            const tokens = await generateTokens(user)
    
            // set refresh token cookie in response
            res.cookie('refresh', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
    
            // format user data for response to remove password
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
    
            return res.status(200).json({
                message: 'Login successful',
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
     * @description This route will be used to refresh the access token,
     * checks credentials for the httpOnly cookie
     * @requires req.cookies.refresh
     * @param {*} req 
     * @param {*} res 
     * @returns new access token and user data in response and new refresh token in httpOnly cookie
     */
    async refresh(req, res) {
        try {
            // get refresh token from http cookie
            const refresh_token = req.cookies.refresh

            if (!refresh_token) {
                return res.status(401).json({
                    message: "Refresh token not found"
                })
            }

            try {
                // verify the refresh token with the refresh token secret
                // store the decoded token data in the decoded variable
                const decoded = jwt.verify(
                    refresh_token,
                    process.env.REFRESH_TOKEN_SECRET
                )

                if (decoded.type !== 'refresh') {
                    return res.status(401).json({
                        message: "Invalid token"
                    })
                }

                // get user by id from the decoded token
                const user = await User.get_by_id(decoded.userId)

                // if there is no user with the id from the token
                // override their refresh token cookie by sending
                // a new cookie with a maxAge of 0, new cookies with
                // the same name will override old ones in the browser
                if (!user) {
                    res.cookie('refresh', '', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        maxAge: 0 // expires immediately
                    })
                    return res.status(404).json({
                        message: "User not found"
                    })
                }

                // generate new access and refresh tokens
                const tokens = await generateTokens(user)

                // set the new refresh token cookie in the response
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
     * @description This route will be used to logout the user
     * @param {*} req
     * @param {*} res
     */
    async logout(req, res) {
        try {
            // override their refresh token cookie by sending
            // a new cookie with a maxAge of 0, new cookies with
            // the same name will override old ones in the browser
            res.cookie('refresh', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 0 // expires immediately
            })
            
            // everything else is handled by the client
            // the client will remove the access token
            // and any user data stored in local storage
            // or state, send success message
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

    /**
     * @description This route will be used to initiate the GitHub OAuth flow
     * @requires req.query.code
     * @param {*} req 
     * @param {*} res
     * @returns GitHub login page URL
     */
    async githubLogin(req, res) {
        // send caller the GitHub login page URL
        // scope user:email is required to get the user's email from GitHub
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.BACKEND_URL}/auth/github/callback&scope=user:email`
        res.json({ url: githubUrl })
    },

    /**
     * @description Route to handle the GitHub OAuth callback with the query parameter user auth code
     * @example http://localhost:5173/auth/github/callback?code=123456
     * @param {*} req 
     * @param {*} res 
     * @returns Access token in query parameter and refresh token in httpOnly cookie
     */
    async githubCallback(req, res) {
        try {
            // get user auth code from query parameters
            const { code } = req.query

            // exchange code for access token with GitHub
            const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code
                })
            })

            // get access token from Github response
            const tokenData = await tokenRes.json()

            // get user data from GitHub
            const userRes = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Accept': 'application/json'
                }
            })

            // get user data from GitHub response
            const githubUser = await userRes.json()


            // get user's email (make separate request)
            // GitHub requires a separate request to get user email
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Accept': 'application/json'
                }
            })

            // get user's email from GitHub response
            const emails = await emailRes.json()

            // find primary email
            const primaryEmail = emails.find(email => email.primary)?.email
            if (!primaryEmail) {
                console.error("No primary email found")
                // redirect to frontend error page
                return res.redirect('http://localhost:5173/auth/github/error')
            }
    
            // find or create user
            const users = await User.get_by_field('github_id', githubUser.id.toString())
            let user = users[0]
    
            // create new user if they don't exist in the database
            if (!user) {
                const newUser = {
                    github_id: githubUser.id.toString(),
                    email: primaryEmail,  // Use the primary email we fetched
                    user_name: githubUser.login,
                    first_name: githubUser.name?.split(' ')[0] || githubUser.login,
                    last_name: githubUser.name?.split(' ')[1] || '',
                    image_url: githubUser.avatar_url,
                    password: null  // Since this is a GitHub user
                }
                user = await User.save(newUser)
            }
    
            // generate access and refresh tokens
            const tokens = await generateTokens(user)
    
            // set refresh token cookie in response
            res.cookie('refresh', tokens.refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
    
            // redirect to frontend success page with access token in query parameter
            return res.redirect(`http://localhost:5173/auth/github/success?access_token=${tokens.accessToken}`)
        
        } catch (error) {
            console.error('GitHub auth error:', error)
            // redirect to frontend error page
            return res.redirect('http://localhost:5173/auth/github/error')
        }
    }
}

export default authController