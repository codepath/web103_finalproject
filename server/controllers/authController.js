import User from '../models/User.js'
import security from '../utils/security.js'
import generateTokens from '../utils/generateTokens.js'

const authController = {
    /**
     * @requires user: {
     * email: string,
     * password: string,
     * first_name: string,
     * last_name: string,
     * user_name: string
     * }
     */
    async signup(req, res) {
        try {
            const user = req.body.user
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
            res.status(201).json({
                accessToken: tokens.accessToken,
                user: newUser
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