// One recipe shown as a card in the grid.
export default function RecipeCard({ recipe }) {
  const totalMinutes = recipe.prep_minutes + recipe.cook_minutes;
  const haveAll = recipe.have_count === recipe.total_count;
  const haveNone = recipe.have_count === 0;

  // Pick the badge color: green = have everything, red = have nothing, amber = in between
  let badgeClass = "match-badge partial";
  if (haveAll) badgeClass = "match-badge full";
  if (haveNone) badgeClass = "match-badge none";

  return (
    <article className="recipe-card card">
      <span className="meal-type">{recipe.meal_type}</span>
      <h3>{recipe.title}</h3>
      <p className="muted">{recipe.description}</p>

      <div className="recipe-meta">
        <span>⏱ {totalMinutes} min</span>
        <span>🍽 {recipe.servings} {recipe.servings === 1 ? "serving" : "servings"}</span>
      </div>

      <span className={badgeClass}>
        You have {recipe.have_count}/{recipe.total_count} ingredients
      </span>
    </article>
  );
}
