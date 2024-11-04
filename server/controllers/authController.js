import User from '../models/User.js'
import security from '../utils/security.js'
import generateTokens from '../utils/generateTokens.js'

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
            const newUser = await User.create(user)
            const tokens = await generateTokens({user: newUser})
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

    async login(req, res) {},

    async github(req, res) {},

    async githubCallback(req, res) {},

    async refresh(req, res) {},

    async logout(req, res) {}

}

export default authController