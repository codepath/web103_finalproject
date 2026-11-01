import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { SAMPLE_RECIPES } from "../data/sampleRecipes.js";
import "../styles/pantry.css";
import "../styles/recipes.css";

export default function Recipes() {
  // null = still loading, [] = loaded but empty, [...] = recipes to show
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    // Pretend to load for a moment so the loading state is visible.
    // Later: api.get("/recipes").then(setRecipes)
    const timer = setTimeout(() => setRecipes(SAMPLE_RECIPES), 500);
    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (recipes === null) return <p className="muted">Loading recipes…</p>;

  return (
    <>
      <PageHeader title="Discover Recipes" subtitle={`${recipes.length} recipes to try`} />

      {/* Empty state */}
      {recipes.length === 0 && (
        <div className="empty card pad">No recipes yet. Check back soon!</div>
      )}

      {/* Recipe grid */}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}
