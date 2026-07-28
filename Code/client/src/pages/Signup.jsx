import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UsersAPI from '../services/UsersAPI'
import AuthLayout from '../components/AuthLayout'
import { TextField, PasswordField } from '../components/AuthFields'
import { validateSignup } from '../utilities/validateSignup'

const Signup = ({ title }) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.title = title
    }, [title])

    const handleSignUp = async (event) => {
        event.preventDefault()

        // Quick client-side check for instant feedback...
        const validationError = validateSignup(email, username, password, confirmPassword)
        if (validationError) {
            setError(validationError)
            return
        }

        // ...but the server owns uniqueness, so it has the final say.
        try {
            setLoading(true)
            const user = await UsersAPI.createUser({ username, email, password })
            localStorage.setItem('matchlens_user', JSON.stringify(user))
            navigate('/', { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join MatchLens to track matches and compete with friends"
            paddingClassName="pt-10 pb-6"
            gapClassName="gap-[24px]"
            footerPrompt="Already have an account?"
            footerLinkLabel="Sign In"
            footerLinkTo="/login"
        >
            <form onSubmit={handleSignUp} noValidate className="flex w-full flex-col gap-[24px]">
                <div className="flex w-full flex-col gap-[14px]">
                    <TextField
                        id="username"
                        label="Username"
                        type="text"
                        placeholder="your_username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(null) }}
                        autoComplete="username"
                    />

                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null) }}
                        autoComplete="email"
                    />

                    <PasswordField
                        id="password"
                        label="Password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null) }}
                        autoComplete="new-password"
                    />

                    <PasswordField
                        id="confirm-password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
                        autoComplete="new-password"
                    />
                </div>

                <div className="flex w-full flex-col gap-3">
                    { error && <p className="text-[13px] text-dash-live">{error}</p> }

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-4 text-[16px] font-bold text-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        { loading ? 'Creating Account...' : 'Create Account' }
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}

export default Signup
