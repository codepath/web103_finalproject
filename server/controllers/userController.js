import PostgresService from '../services/postgresService.js'

const User = new PostgresService('users')

const userController = {
    async create(req, res) {
        try {
            const user = await User.save(req.body)
            return res.status(201).send(user)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async getAll(req, res) {
        try {
            const users = await User.get_all()
            return res.status(200).send(users)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async getOne(req, res) {
        try {
            const user = await User.get_by_id(req.params.id)
            return res.status(200).send(user)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async update(req, res) {
        try {
            const user = await User.update(req.params.id, req.body)
            return res.status(200).send(user)
        } catch (error) {
            return res.status(400).send(error)
        }
    },
    async delete(req, res) {
        try {
            const user = await User.delete(req.params.id)
            return res.status(204).send(user)
        } catch (error) {
            return res.status(400).send(error)
        }
    }
}

export default userController