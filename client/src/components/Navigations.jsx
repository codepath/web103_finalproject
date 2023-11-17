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
                <li><a href='/' role='button'>View Movies</a></li>
                <li><a href='/wishlist' role='button'>Wish List</a></li>
                <li><a href='/create' role='button'>Create New Movie Profile</a></li>
            </ul>
            
        </nav>
    )
}

export default Navigation