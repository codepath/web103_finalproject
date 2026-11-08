export default function RecipeDetail({ recipe }) {
    return (
        <div className="recipe-detail">
            <h2>{recipe.title}</h2>
            <p className="muted">{recipe.description}</p>

            {/* Add recipe meta information */}
            <div className="recipe-meta">
                <span>⏱ Prep: {recipe.prep_minutes} min</span>
                <span>⏱ Cook: {recipe.cook_minutes} min</span>
                <span>🍽 {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}</span>
            </div>

            {/* Add ingredients list */}
            <h3>Ingredients</h3>
            <ul className="ingredient-list">
                {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>
                        <span>
                            {ingredient.name} — {ingredient.quantity} {ingredient.unit}
                        </span>
                        <span className={`match-badge ${ingredient.have ? "full" : "none"}`}>
                            {ingredient.have ? "✓ Have" : "Missing"}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Add cooking instructions */}
            <h3>Instructions</h3>
            <p>{recipe.instructions}</p>
        </div>
    ); 
}