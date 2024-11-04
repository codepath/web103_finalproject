import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { SignUpData } from '../../types/db'
import { setUser, clearUser } from './user.slice'

interface AuthState {
    access_token: string | null
    isLoading: boolean
    isFormLoading: boolean
    error: string | null
}

const initialState: AuthState = {
    access_token: null,
    isLoading: false,
    isFormLoading: false,
    error: null,
}


export const signUp = createAsyncThunk(
    'signUp',
    async (data: SignUpData, { dispatch }) => {
        try {
            localStorage.clear()
            console.log("SECOND USER FORM", data)
            const response = await api.auth.signUp(data)
            console.log("THIRD USER FORM", response)
            console.log(response)
            if (response.access_token && response.user) {
                console.log("FOURTH USER FORM DISPATCHING")
                dispatch(setUser(response.user))
                dispatch(setAccessToken(response.access_token))
            }
            return response
        } catch (error) {
            return error
        }
    }
)

export const refreshSession = createAsyncThunk(
    'refreshSession',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            console.log("REFRESH SESSION SEARCHING")
            const response = await api.auth.refreshSession()
            console.log("REFRESH SESSION FOUND", response)
            if (response.access_token && response.user) {
                dispatch(setUser(response.user))
                dispatch(setAccessToken(response.access_token))
                return response
            }
            return rejectWithValue('Invalid response format')
        } catch (error) {
            console.log("REFRESH SESSION ERROR, NOT FOUND", error)
            return error
        }
    }
)

// export const signIn = createAsyncThunk(


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
            state.isFormLoading = false
            state.isLoading = false
            console.log("SIGNUP FULFILLED", action.payload)
        })
        builder.addCase(signUp.rejected, (state, action) => {
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
            state.isLoading = false
        })
        builder.addCase(refreshSession.rejected, (state, action) => {
            console.log("REFRESH SESSION REJECTED")
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
            state.access_token = null
        })
        builder.addCase(signOut.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message as string
        })

    }
})

export const { setAccessToken } = authSlice.actions
export default authSlice.reducer