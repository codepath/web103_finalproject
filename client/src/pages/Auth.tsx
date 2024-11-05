import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { signUp, signIn } from '../store/slices/auth.slice'
import GithubLogin from '../auth/GithubLogin'


const Auth = () => {
    const dispatch = useAppDispatch()
    const { error, isLoading, isFormLoading } = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [user_name, setUserName] = useState('')

    const [login_password, setLoginPassword] = useState('')
    const [login_email, setLoginEmail] = useState('')

    const [apiRes, setApiRes] = useState({ accessToken: '', user: '' })

    useEffect(() => {
        const accessToken = localStorage.getItem('access')
        const user = localStorage.getItem('user')

        if (user && accessToken) {
            setApiRes({ accessToken, user })
        }
    }, [])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userData = {
                email,
                password,
                user_name,
                first_name,
                last_name
            }
            // Make sure we wrap the user data in a user object
            console.log("FIRST USER FORM", userData)
            const result = await dispatch(signUp(userData))
            console.log("Signup successful:", result)
            // Handle successful signup (e.g., redirect to login or dashboard)
        } catch (error) {
            console.error("Signup failed:", error)
            // Handle error (e.g., show error message to user)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const userData = {
                email: login_email,
                password: login_password
            }
            const result = await dispatch(signIn(userData))
            console.log("Login successful:", result)
            // Handle successful login (e.g., redirect to dashboard)            
        } catch (error) {
            console.error("Login failed:", error)
            // Handle error (e.g., show error message to user)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl text-blue-600">Auth</h1>
            <p className="text-2xl font-regular">Sign Up / Login</p>
            {error && <p className="text-red-600">{error}</p>}
            {isLoading && <p>Loading...</p>}
            {isFormLoading && <p>Form Loading...</p>}
            <p>State:</p>
            <code>{email}</code>
            <code>{password}</code>
            <code>{first_name}</code>
            <code>{last_name}</code>
            <code>{user_name}</code>
            {apiRes && 
                <div className='flex flex-col text-center text-wrap'>
                    <code className='xs flex justify-center text-balance'>
                        {apiRes.accessToken}
                    </code>
                    <br/>
                    <code>
                        {apiRes.user}
                    </code>
                </div>
            }
            <form onSubmit={handleSignUp} className="flex flex-col items-center w-[400px]">
                <label>Sign Up</label>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <input
                    type="text"
                    placeholder="First Name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <input
                    type="text"
                    placeholder="User Name"
                    value={user_name}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 m-2">Sign Up</button>
            </form>
            <p>State:</p>
            <code>{login_email}</code>
            <code>{login_password}</code>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-[400px]">
                <label>Login</label>
                <input
                    type="text"
                    placeholder="Email"
                    value={login_email}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={login_password}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border border-gray-400 p-2 m-2 w-full"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 m-2">Login</button>
            </form>
            <GithubLogin />
        </div>
    )
}

export default Auth