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
            // clear local storage of any previous tokens
            localStorage.clear()
            const response = await api.auth.signUp(data)
            if (response.access_token && response.user) {
                dispatch(setUser(response.user))
                dispatch(setAccessToken(response.access_token))
                return response
            }
            return rejectWithValue('Invalid response format')
        } catch (error) {
            return error
        }
    }
)

export const refreshSession = createAsyncThunk(
    'refreshSession',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.auth.refreshSession()
            if (response.access_token && response.user) {
                dispatch(setUser(response.user))
                dispatch(setAccessToken(response.access_token))
                return response
            }
            return rejectWithValue('Invalid response format')
        } catch (error) {
            return error
        }
    }
)

export const signIn = createAsyncThunk(
    'signIn',
    async (data: SignInData, { dispatch, rejectWithValue }) => {
        try {
            // Clear local storage of any previous tokens
            localStorage.clear()
            const response = await api.auth.signIn(data)
            if (response.access_token && response.user) {
                dispatch(setUser(response.user))
                dispatch(setAccessToken(response.access_token))
                return response
            }
            return rejectWithValue('Invalid response format')
        } catch (error) {
            return error
        }
    }
)


export const signOut = createAsyncThunk(
    'signOut',
    async (_, { dispatch, getState }) => {
        const state = getState() as { auth: AuthState }
        try {
            const access_token = state.auth.access_token
            console.log("SIGN OUT ACCESS TOKEN", access_token)
            if (!access_token) {
                console.log("NO ACCESS TOKEN")
                dispatch(clearUser())
                return true
            }
            console.log("SIGN OUT ACCESS TOKEN FOUND")
            localStorage.clear()
            dispatch(clearUser())
            await api.auth.signOut()
            return true
        } catch (error) {
            return error
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
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder.addCase(signUp.pending, (state) => {
            state.isFormLoading = true
            state.isLoading = true
            state.error = null
        })
        builder.addCase(signUp.fulfilled, (state, action) => {
            state.isAuthenticated = true
            state.isFormLoading = false
            state.isLoading = false
            console.log("SIGNUP FULFILLED", action.payload)
        })
        builder.addCase(signUp.rejected, (state, action) => {
            state.isAuthenticated = false
            state.isFormLoading = false
            state.isLoading = false
            state.error = action.payload as string
        })
        // Refresh Session
        builder.addCase(refreshSession.pending, (state) => {
            console.log("REFRESH SESSION PENDING")
            state.isLoading = true
            state.error = null
        })
        builder.addCase(refreshSession.fulfilled, (state, action) => {
            console.log("REFRESH SESSION FULFILLED", action.payload)
            state.isAuthenticated = true
            state.isLoading = false
        })
        builder.addCase(refreshSession.rejected, (state, action) => {
            console.log("REFRESH SESSION REJECTED")
            state.isAuthenticated = false
            state.isLoading = false
            state.error = action.error.message as string
        })

        // Sign Out
        builder.addCase(signOut.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        builder.addCase(signOut.fulfilled, (state) => {
            state.isLoading = false
            state.isAuthenticated = false
            state.access_token = null
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
            state.isFormLoading = false
            state.isAuthenticated = true
            state.isLoading = false
        })
        builder.addCase(signIn.rejected, (state, action) => {
            state.isFormLoading = false
            state.isLoading = false
            state.error = action.payload as string
        })
    }
})

export const { setAccessToken } = authSlice.actions
export default authSlice.reducer