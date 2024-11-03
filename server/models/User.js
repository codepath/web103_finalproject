import PostgresService from "../services/postgresService.js";

const userService = new PostgresService('users')

const User = {
    async create(data) {
        try {
            console.log("about to send user to db",data)
            const newUser = await userService.save(data)
            console.log("db result",newUser)
            return newUser
        } catch (error) {
            throw error
        }
    },
    async getAll() {
        try {
            const users = await userService.get_all()
            return users
        } catch (error) {
            throw error
        }
    },
    async getOne(id) {
        try {
            const user = await userService.get_by_id(id)
            return user
        } catch (error) {
            throw error
        }
    },
    async update(id, data) {
        try {
            const updatedUser = await userService.update(id, data)
            return updatedUser
        } catch (error) {
            throw error
        }
    },
    async delete(id) {
        try {
            const deletedUser = await userService.delete(id)
            return deletedUser
        } catch (error) {
            throw error
        }
    }
}

export default User