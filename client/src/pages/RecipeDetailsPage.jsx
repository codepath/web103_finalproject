import React from 'react'
import '../css/RecipeDetailsPage.css'

export default function RecipeDetailsPage() {
    return (
        <div>
            <div className="navbar">
                <h1>Recipe Guru</h1>
            </div>

            <div className="container">
                <img src="https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg" alt="Recipe Image" class="recipe-image" />

                <h1>Delicious Pasta</h1>

                <div className="meta-info">
                    <span>Prep Time: 20 mins</span>
                    <span>Cook Time: 30 mins</span>
                </div>

                <div className="ingredients">
                    <h2>Ingredients</h2>
                    <ul>
                        <li>200g pasta</li>
                        <li>2 tbsp olive oil</li>
                        <li>1 clove garlic, minced</li>
                        <li>1/2 cup parmesan cheese</li>
                        <li>Salt and pepper to taste</li>
                    </ul>
                </div>

                <div className="instructions">
                    <h2>Instructions</h2>
                    <ol>
                        <li>Boil the pasta in salted water until al dente.</li>
                        <li>In a pan, heat olive oil and sauté garlic until fragrant.</li>
                        <li>Add the cooked pasta and mix well.</li>
                        <li>Sprinkle with parmesan cheese, salt, and pepper.</li>
                        <li>Serve hot and enjoy your delicious pasta!</li>
                    </ol>
                </div>

                <button className="save-button">Save to Favorites</button>
            </div>
        </div>
    )
}
