import React from 'react'
import '../css/LoginPage.css'

export default function LoginPage() {
    return (
        <div>
            <div className="login-container">
                <h2>Login</h2>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button className="login-button">Login</button>
                <a href="#" className="signup-link">Don't have an account? Sign up</a>
            </div>
        </div>
    )
}
