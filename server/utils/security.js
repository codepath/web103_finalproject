import bcrypt from 'bcrypt';

const security = {
    hashPassword: async (password) => {
        return await bcrypt.hash(password, 10);
    },
    comparePasswords: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    }
}

export default security