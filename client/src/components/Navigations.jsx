import React from 'react'
// import '../App.css'
// import '../css/Navigation.css'

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><h1>CineMundo 🎥</h1></li>
            </ul>

            <ul>
                <li><a href='/' role='button'>Create New Movie Profile</a></li>
                <li><a href='/customcars' role='button'>View Movies</a></li>
            </ul>
            
        </nav>
    )
}

export default Navigation