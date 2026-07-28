const BASE_URL = '/api'

const UsersAPI = {
    // Log in — server decides whether access is granted
    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Login failed')
        return data
    },

    // Fan leaderboard — all users ranked by points
    getAllUsers: async () => {
        const res = await fetch(`${BASE_URL}/users`)
        if (!res.ok) throw new Error('Failed to fetch users')
        return res.json()
    },

    // Sign up
    createUser: async (user) => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Failed to create user')
        return data
    }
}

export default UsersAPI
