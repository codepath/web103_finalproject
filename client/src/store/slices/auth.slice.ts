import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { SignUpData, SignInData } from '../../types/db'
import { setUser, clearUser } from './user.slice'

interface AuthState {
    access_token: string | null
    isLoading: boolean
    isFormLoading: boolean
    isAuthenticated: boolean
    error: string | null
}

const initialState: AuthState = {
    access_token: null,
    isLoading: false,
    isFormLoading: false,
    isAuthenticated: false,
    error: null,
}


export const signUp = createAsyncThunk(
    'signUp',
    async (data: SignUpData, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.auth.signUp(data)
            dispatch(setUser(response.user))
            dispatch(setAccessToken(response.access_token))
             return response
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
        }
    }
)

export const refreshSession = createAsyncThunk(
    'refreshSession',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            // if you have an access token, you have a refresh token
            // expired refresh tokens in http cookies are automatically
            // not sent to the server because of how browsers work
            const access_token = localStorage.getItem('access_token')
            if (!access_token) {
                return
            }
            const response = await api.auth.refreshSession()
            dispatch(setUser(response.user))
            dispatch(setAccessToken(response.access_token))
            return response
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
        }
    }
)

export const signIn = createAsyncThunk(
    'signIn',
    async (data: SignInData, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.auth.signIn(data)
            dispatch(setUser(response.user))
            dispatch(setAccessToken(response.access_token))
            return response
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
        }
    }
)


export const signOut = createAsyncThunk(
    'signOut',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(clearAccessToken())
            dispatch(clearUser())
            await api.auth.signOut()
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred')
        }
    }
)



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken(state, action) {
            state.access_token = action.payload
            localStorage.setItem('access_token', action.payload)
            state.isAuthenticated = true
        },
        clearAccessToken(state) {
            state.access_token = null
            localStorage.removeItem('access_token')
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder.addCase(signUp.pending, (state) => {
            state.isFormLoading = true
            state.isLoading = true
            state.error = null
        })
        builder.addCase(signUp.fulfilled, (state) => {
            state.isFormLoading = false
            state.isLoading = false
            state.error = null
        })
        builder.addCase(signUp.rejected, (state, action) => {
            state.isAuthenticated = false
            state.isFormLoading = false
            state.isLoading = false
            state.error = action.payload as string
        })

        // Refresh Session
        builder.addCase(refreshSession.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(refreshSession.fulfilled, (state) => {
            state.isLoading = false
            state.error = null
        })
        builder.addCase(refreshSession.rejected, (state) => {
            state.isAuthenticated = false
            state.isLoading = false
            state.error = null
        })

        // Sign Out
        builder.addCase(signOut.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(signOut.fulfilled, (state) => {
            state.isLoading = false
            state.error = null
        })
        builder.addCase(signOut.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message as string
        })

        // Sign In
        builder.addCase(signIn.pending, (state) => {
            state.isFormLoading = true
            state.isLoading = true
            state.error = null
        })
        builder.addCase(signIn.fulfilled, (state) => {
            state.error = null
            state.isFormLoading = false
            state.isLoading = false
        })
        builder.addCase(signIn.rejected, (state, action) => {
            state.isFormLoading = false
            state.isLoading = false
            state.error = action.payload as string
        })
    }
})

export const { setAccessToken, clearAccessToken } = authSlice.actions
export default authSlice.reducer