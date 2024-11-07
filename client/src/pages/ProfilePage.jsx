import React from 'react'
import '../css/ProfilePage.css'

export default function ProfilePage() {
    return (
        <div>
            <div className="navbar">
                <h1>Recipe Guru</h1>
            </div>

            <div className="profile-container">
                <h2>Profile Information</h2>
                <input type="text" placeholder="Username" value="John Doe" />
                <input type="email" placeholder="Email" value="john@example.com" />
                <select>
                    <option selected>Vegan</option>
                    <option>Vegetarian</option>
                    <option>Gluten-Free</option>
                </select>
                <button className="save-button">Save Changes</button>
            </div>
        </div>
    )
}
