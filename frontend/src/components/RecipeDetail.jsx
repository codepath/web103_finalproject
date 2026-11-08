export default function RecipeDetail({ recipe }) {
    return (
        <div className="recipe-detail">
            <h2>{recipe.title}</h2>
            <p className="muted">(recipe.description)</p>

            <div className="recipe-meta">
                <span>⏱ Prep: {recipe.prep_minutes} min</span>
                <span>⏱ Cook: {recipe.cook_minutes} min</span>
                <span>🍽 {recipe.servings} {recipes.servings == 1 ? "serving" : "servings"}</span>
            </div>
        </div>
    ); 
}