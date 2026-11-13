
import { useState } from "react";
import AddToMealPlan from "./AddToMealPlan.jsx";
import { api, getRecipe } from "../api.js";
import SaveRecipeButton from "./SaveRecipeButton.jsx";

export default function ChatRecipeCard({ recipe }) {
  const [missing, setMissing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalMinutes =
    recipe.prep_minutes == null &&
    recipe.cook_minutes == null
      ? null
      : (recipe.prep_minutes || 0) +
        (recipe.cook_minutes || 0);

  const haveAll =
    recipe.total_count > 0 &&
    recipe.have_count === recipe.total_count;

  // Review missing ingredients before adding
  async function reviewIngredients() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const details = await getRecipe(recipe.id);

      const missingItems = details.ingredients.filter(
        (ingredient) => !ingredient.have
      );

      setMissing(missingItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Add missing ingredients to the shopping list
  async function addMissingIngredients() {
    if (loading || added || !missing?.length) return;

    setLoading(true);
    setError("");

    try {
      const result = await api.post(
        `/shopping-list/from-recipe/${recipe.id}`
      );

      setAdded(true);
      setMissing(null);

      setMessage(
        `✓ ${result.added} missing ingredient(s) added to your shopping list!`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="chat-recipe-card">

      {/* Recipe Image */}
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="chat-recipe-image"
          loading="lazy"
        />
      )}

      <div className="chat-recipe-body">

        {/* Recipe Information */}
        <h4>{recipe.title}</h4>

        <p className="chat-recipe-meta">
          {totalMinutes !== null
            ? `${totalMinutes} min`
            : "Time not specified"}

          {recipe.servings
            ? ` · ${recipe.servings} servings`
            : ""}
        </p>

        {/* Pantry Matching */}
        <span
          className={`chat-recipe-match ${
            haveAll ? "full" : "partial"
          }`}
        >
          {haveAll
            ? "✓ All ingredients in pantry"
            : `${recipe.have_count}/${recipe.total_count} ingredients in pantry`}
        </span>

        {recipe.missing_count > 0 && (
          <p className="chat-recipe-missing">
            {recipe.missing_count} missing ingredients
          </p>
        )}

        {/* Add to Meal Planner */}
        <SaveRecipeButton key={recipe.id} recipe={recipe} />
        <details className="chat-recipe-actions">
          <summary>+ Add to Meal Plan</summary>

          <AddToMealPlan recipe={recipe} />
        </details>

        {/* Shopping List Button */}
        <button
          type="button"
          className="chat-shopping-btn"
          disabled={loading || added}
          onClick={reviewIngredients}
        >
          {loading
            ? "Loading..."
            : added
            ? "✓ Added to Shopping List"
            : "🛒 Review Missing Ingredients"}
        </button>

        {/* Ingredient Review */}
        {missing !== null && (
          <div className="chat-shopping-review">
            <h4>Missing Ingredients</h4>

            {missing.length === 0 ? (
              <p>
                All recipe ingredients are already
                in your pantry.
              </p>
            ) : (
              <>
                <ul>
                  {missing.map((ingredient) => (
                    <li key={ingredient.id}>
                      <strong>{ingredient.name}</strong>
                      <span>
                        {ingredient.quantity}{" "}
                        {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="chat-shopping-confirm"
                  disabled={loading}
                  onClick={addMissingIngredients}
                >
                  {loading
                    ? "Adding..."
                    : "Confirm & Add"}
                </button>
              </>
            )}

            <button
              type="button"
              className="chat-shopping-btn"
              disabled={loading}
              onClick={() => setMissing(null)}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success Message */}
        {message && (
          <p className="chat-shopping-success">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="chat-shopping-error">
            {error}
          </p>
        )}

      </div>
    </article>
  );
}
