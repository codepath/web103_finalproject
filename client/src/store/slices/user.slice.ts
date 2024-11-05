import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { User } from '../../types/db'

interface UserState {
    user: User
    isLoading: boolean
    error : string | null
}

const defaultUserSettings: User = {
    id: '',
    email: '',
    user_name: '',
    first_name: '',
    last_name: '',
    image_url: undefined,
    created_at: undefined,
    last_login: undefined,
    last_updated: undefined,
    failed_login_attempts: undefined
}

const initialState: UserState = {
    user: defaultUserSettings,
    isLoading: false,
    error: null
}

export const refreshUser = createAsyncThunk(
    'refreshUser',
    async (access_token: string, { dispatch }) => {
        const response = await api.user.getMe(access_token)
        dispatch(setUser(response.data))
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            console.log("SETTING USER", action.payload)
            state.user = action.payload
        },
        clearUser(state) {
            state.user = defaultUserSettings
        }
    },
    extraReducers: (builder) => {
        // Refresh User
        builder.addCase(refreshUser.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(refreshUser.fulfilled, (state) => {
            state.isLoading = false
            state.error = null
        })
        builder.addCase(refreshUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message as string
        })
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer