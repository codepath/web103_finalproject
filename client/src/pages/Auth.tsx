import { useState, useEffect } from 'react'

const Auth = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [user_name, setUserName] = useState('')

    const [login_password, setLoginPassword] = useState('')
    const [login_user_name, setLoginUserName] = useState('')

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
        const res = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    email,
                    password,
                    first_name,
                    last_name,
                    user_name,
                },
            }),
        })
        console.log(res)
        const data = await res.json()
        localStorage.setItem('access', JSON.stringify(data.accessToken))
        localStorage.setItem('user', JSON.stringify(data.user))
        setApiRes(data)
        console.log(data)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    user_name: login_user_name,
                    password: login_password,
                },
            }),
        })
        console.log(res)
        const data = await res.json()
        setApiRes(data)
        console.log(data)
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl text-blue-600">Auth</h1>
            <p className="text-2xl font-regular">Sign Up / Login</p>
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
            <code>{login_user_name}</code>
            <code>{login_password}</code>
            <form onSubmit={handleLogin} className="flex flex-col items-center w-[400px]">
                <label>Login</label>
                <input
                    type="text"
                    placeholder="User Name"
                    value={login_user_name}
                    onChange={(e) => setLoginUserName(e.target.value)}
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
        </div>
    )
}

export default Auth