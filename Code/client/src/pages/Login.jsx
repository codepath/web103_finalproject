import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import UsersAPI from '../services/UsersAPI'
import AuthLayout from '../components/AuthLayout'
import { TextField, PasswordField } from '../components/AuthFields'
import { validateLogin } from '../utilities/validateLogin'

// The OAuth callback can only hand us a short code in the query string, so it
// redirects here with ?error=<code> rather than failing silently.
const OAUTH_ERRORS = {
    oauth_denied: 'Sign-in was cancelled.',
    oauth_failed: 'Something went wrong signing in with GitHub. Please try again.',
    account_conflict: 'That email is already registered to a different account. Try signing in with your password.'
}

const Login = ({ title }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // Where RequireAuth turned this visitor away from, so signing in resumes
    // the page they actually asked for instead of always landing on the dashboard.
    const destination = location.state?.from?.pathname ?? '/'

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        const code = searchParams.get('error')
        if (code) setError(OAUTH_ERRORS[code] ?? OAUTH_ERRORS.oauth_failed)
    }, [searchParams])

    const handleSignIn = async (event) => {
        event.preventDefault()

        // Quick client-side check for instant feedback...
        const validationError = validateLogin(email, password)
        if (validationError) {
            setError(validationError)
            return
        }

        // ...but the server has the final say on whether login succeeds.
        try {
            setLoading(true)
            const user = await UsersAPI.login(email, password)
            localStorage.setItem('matchlens_user', JSON.stringify(user))
            navigate(destination, { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter your details to access your dashboard"
            paddingClassName="pt-[60px] pb-8"
            gapClassName="gap-[28px]"
            footerPrompt="Don't have an account?"
            footerLinkLabel="Sign Up"
            footerLinkTo="/signup"
        >
            <form onSubmit={handleSignIn} noValidate className="flex w-full flex-col gap-[28px]">
                <div className="flex w-full flex-col gap-[18px]">
                    <TextField
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null) }}
                        autoComplete="email"
                    />

                    <div className="flex flex-col gap-2">
                        <PasswordField
                            id="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(null) }}
                            autoComplete="current-password"
                        />
                        <p className="text-right text-[13px] font-semibold text-primary">Forgot Password?</p>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-3">
                    { error && <p className="text-[13px] text-dash-live">{error}</p> }

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-4 text-[16px] font-bold text-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        { loading ? 'Signing In...' : 'Sign In' }
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}

export default Login
