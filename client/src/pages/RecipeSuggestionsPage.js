import React from 'react'
import '../css/RecipeSuggestionsPage.css'

export default function RecipeSuggestionsPage() {
    return (
        <div>
            <div className="navbar">
                <h1>Recipe Guru</h1>
            </div>

            <div className="container">
                <div className="search-bar">
                    <input type="text" placeholder="Enter ingredients..." />
                    <button className="search-button">Search Recipes</button>
                </div>

                <div className="recipe-grid">
                    <div class="recipe-card">
                        <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg" alt="Recipe Image" />
                        <h3>Recipe 1</h3>
                        <p>A delightful recipe using your selected ingredients.</p>
                        <button>View Details</button>
                    </div>

                    <div className="recipe-card">
                        <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg" alt="Recipe Image" />
                        <h3>Recipe 2</h3>
                        <p>A quick, easy and tasty meal to try today!</p>
                        <button>View Details</button>
                    </div>

                    <div className="recipe-card">
                        <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg" alt="Recipe Image" />
                        <h3>Recipe 3</h3>
                        <p>An exciting new dish perfect for any occasion.</p>
                        <button>View Details</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
