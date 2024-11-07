import React from 'react'
import '../css/HomePage.css'
export default function HomePage() {
    return (
        <div>
            <div className="navbar">
                <h1>Recipe Guru</h1>
            </div>

            <div className="container">
                <div className="welcome">
                    Welcome, <strong>John!</strong> Ready to find your next favorite recipe?
                </div>

                <div className="buttons">
                    <button className="button">Enter Ingredients</button>
                    <button className="button">View Saved Recipes</button>
                </div>

                <div className="recommendations">
                    <h2>Quick Recommendations</h2>
                    <div className="recipe-card">
                        <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg" alt="Recipe Image" />
                        <h3>Recipe 1</h3>
                        <p>A delicious meal you can make with your ingredients.</p>
                    </div>

                    <div className="recipe-card">
                        <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg" alt="Recipe Image" />
                        <h3>Recipe 2</h3>
                        <p>A quick dish to try for any occasion.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
