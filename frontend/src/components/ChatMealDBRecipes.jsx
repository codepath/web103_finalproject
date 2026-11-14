
import { useState } from "react";
import { Link } from "react-router-dom";

import { getRecipe } from "../api.js";
import ChatRecipeCard from "./ChatRecipeCard.jsx";

const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "pieces",
  "cloves",
  "slices",
  "bulb",
];

function MealDBCard({ meal }) {
  const [loading, setLoading] = useState(false);

  const [imported, setImported] = useState(false);

  const [localRecipe, setLocalRecipe] =
    useState(null);

  const [review, setReview] = useState(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // Import an external recipe into PrepWise.

  async function importMeal(measurements = {}) {
    if (loading || imported) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/mealdb/import/${encodeURIComponent(meal.id)}`,
        {
          method: "POST",

          credentials: "same-origin",

          headers: {
            "Content-Type": "application/json",
            "X-PrepWise-Request": "1",
          },

          body: JSON.stringify({
            measurements,
          }),
        }
      );

      const result = await response.json();

      // Request clarification of ingredient measurements.

      if (
        response.status === 422 &&
        Array.isArray(result.ingredients) &&
        result.ingredients.length > 0
      ) {
        setReview({
          measurements,

          items: result.ingredients.map((item) => ({
            ...item,
            quantity: "",
            unit: "",
          })),
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to import recipe."
        );
      }

      setImported(true);
      setReview(null);

      setMessage(
        result.message ||
        "Recipe imported successfully!"
      );

      // Retrieve the recipe using its PostgreSQL ID.

      try {
        const details = await getRecipe(
          result.recipe.id
        );

        const ingredients =
          details.ingredients || [];

        const haveCount = ingredients.filter(
          (item) => item.have
        ).length;

        setLocalRecipe({
          ...details,

          total_count: ingredients.length,

          have_count: haveCount,

          missing_count:
            ingredients.length - haveCount,
        });
      } catch {
        setMessage(
          "Recipe imported! Open Discover Recipes to view its details."
        );
      }

    } catch (err) {
      setError(
        err.message ||
        "Something went wrong while importing."
      );

    } finally {
      setLoading(false);
    }
  }

  // Update reviewed ingredient measurements.

  function updateMeasurement(index, field, value) {
    setReview((previous) => ({
      ...previous,

      items: previous.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  }

  // Confirm ingredient measurements and import.

  function confirmImport(event) {
    event.preventDefault();

    const measurements = {
      ...review.measurements,

      ...Object.fromEntries(
        review.items.map((item) => [
          item.index,

          {
            quantity: Number(item.quantity),

            unit: item.unit,
          },
        ])
      ),
    };

    importMeal(measurements);
  }

  // Display the imported local recipe.

  if (localRecipe) {
    return (
      <div className="chat-external-imported">

        <p className="chat-shopping-success">
          ✓ {message}
        </p>

        <ChatRecipeCard
          recipe={localRecipe}
        />

      </div>
    );
  }

  // Display the external recipe.

  return (
    <article className="chat-recipe-card">

      {meal.image_url && (
        <img
          className="chat-recipe-image"
          src={meal.image_url}
          alt={meal.title}
          loading="lazy"
        />
      )}

      <div className="chat-recipe-body">

        <span className="chat-external-source">
          🌐 TheMealDB
        </span>

        <h4>{meal.title}</h4>

        <p className="chat-recipe-meta">
          {meal.category || "Online recipe"}
        </p>

        {/* Recipe details */}

        <details className="chat-external-details">

          <summary>
            View Ingredients & Recipe
          </summary>

          <h4>Ingredients</h4>

          <ul>
            {meal.ingredients?.map((item, index) => (
              <li key={index}>
                {item.measure} {item.name}
              </li>
            ))}
          </ul>

          <h4>Cooking Instructions</h4>

          <p className="chat-external-instructions">
            {meal.instructions}
          </p>

        </details>

        {/* Import recipe */}

        <button
          type="button"
          className="chat-shopping-confirm"

          disabled={
            loading ||
            imported ||
            review !== null
          }

          onClick={() => importMeal()}
        >
          {loading
            ? "Importing..."
            : imported
              ? "✓ Imported"
              : "+ Import into PrepWise"}
        </button>

        {/* Review unsupported measurements */}

        {review && (
          <form
            className="chat-shopping-review"
            onSubmit={confirmImport}
          >

            <h4>Review Ingredients</h4>

            <p className="chat-recipe-meta">
              Confirm the measurements below
              before importing.
            </p>

            {review.items.map((item, index) => (
              <div
                key={item.index}
                className="chat-measurement-row"
              >

                <strong>{item.name}</strong>

                <p className="chat-recipe-meta">
                  Original:{" "}
                  {item.measure || "Not specified"}
                </p>

                <label>Quantity</label>

                <input
                  type="number"
                  min="0.01"
                  max="99999999.99"
                  step="0.01"
                  placeholder="Quantity"

                  value={item.quantity}

                  required
                  disabled={loading}

                  onChange={(event) =>
                    updateMeasurement(
                      index,
                      "quantity",
                      event.target.value
                    )
                  }
                />

                <label>Unit</label>

                <select
                  value={item.unit}

                  required
                  disabled={loading}

                  onChange={(event) =>
                    updateMeasurement(
                      index,
                      "unit",
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Select unit
                  </option>

                  {UNITS.map((unit) => (
                    <option
                      key={unit}
                      value={unit}
                    >
                      {unit}
                    </option>
                  ))}

                </select>

              </div>
            ))}

            <button
              type="submit"
              className="chat-shopping-confirm"
              disabled={loading}
            >
              {loading
                ? "Importing..."
                : "Confirm & Import"}
            </button>

            <button
              type="button"
              className="chat-shopping-btn"
              disabled={loading}

              onClick={() =>
                setReview(null)
              }
            >
              Cancel
            </button>

          </form>
        )}

        {/* Success and error messages */}

        {message && (
          <p
            className="chat-shopping-success"
            role="status"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            className="chat-shopping-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {imported && (
          <Link
            to="/recipes"
            className="chat-external-link"
          >
            Open Discover Recipes →
          </Link>
        )}

      </div>

    </article>
  );
}

export default function ChatMealDBRecipes({
  recipes = [],
}) {
  return (
    <section className="chat-recipe-list">

      <h4>
        🌐 Discover New Recipes
      </h4>

      <p className="chat-recipe-meta">
        Live results from TheMealDB.
        Import a recipe to save it, plan meals,
        or create shopping lists.
      </p>

      {recipes.map((meal) => (
        <MealDBCard
          key={meal.id}
          meal={meal}
        />
      ))}

      <p className="chat-weekly-note">
        Recipe data and photos provided by TheMealDB.
        Verify ingredients and dietary suitability.
      </p>

    </section>
  );
}
