
import { useState } from "react";
import { api } from "../api.js";

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

export default function MealDBDiscovery({ onImported }) {
  // Search states
  const [search, setSearch] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Import states
  const [importingId, setImportingId] = useState(null);
  const [importStatus, setImportStatus] = useState({});

  // Ingredient review state
  const [review, setReview] = useState(null);

  // Search recipes from TheMealDB
  async function searchMeals(e) {
    e.preventDefault();

    if (!search.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setReview(null);

    try {
      const data = await api.get(
        `/mealdb/search?q=${encodeURIComponent(search.trim())}`
      );

      setMeals(data);
    } catch (err) {
      setError(err.message);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }

  // Import recipe into PrepWise
  async function importMeal(meal, measurements = {}) {
    setImportingId(meal.id);

    setImportStatus((prev) => ({
      ...prev,
      [meal.id]: null,
    }));

    try {
      const response = await fetch(
        `/api/mealdb/import/${meal.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ measurements }),
        }
      );

      const result = await response.json();

      // Review unsupported ingredient measurements
      if (
        response.status === 422 &&
        Array.isArray(result.ingredients) &&
        result.ingredients.length > 0
      ) {
        setReview({
          mealId: meal.id,
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
          result.error || "Failed to import recipe"
        );
      }

      setReview(null);

      setImportStatus((prev) => ({
        ...prev,
        [meal.id]: {
          success: true,
          message:
            result.message ||
            "Recipe imported successfully!",
        },
      }));

      // Refresh the main PrepWise recipe list
      onImported?.();
    } catch (err) {
      setImportStatus((prev) => ({
        ...prev,
        [meal.id]: {
          success: false,
          message: err.message,
        },
      }));
    } finally {
      setImportingId(null);
    }
  }

  // Update ingredient quantity or unit
  function updateReviewItem(index, field, value) {
    setReview((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: prev.items.map((item, i) =>
          i === index
            ? { ...item, [field]: value }
            : item
        ),
      };
    });
  }

  // Submit reviewed ingredient measurements
  function confirmImport(e, meal) {
    e.preventDefault();

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

    importMeal(meal, measurements);
  }

  return (
    <section style={{ marginTop: "32px" }}>
      {/* Section Header */}
      <h2>Discover More Recipes</h2>

      <p className="muted">
        Explore recipes from around the world.
      </p>

      {/* Search Form */}
      <form
        onSubmit={searchMeals}
        className="toolbar"
        style={{ marginBottom: "20px" }}
      >
        <input
          type="search"
          placeholder="Search chicken, pasta, salmon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={importingId !== null}
        />

        <button
          type="submit"
          className="btn"
          disabled={loading || importingId !== null}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Search Error */}
      {error && (
        <p className="error">{error}</p>
      )}

      {/* No Results */}
      {!loading &&
        searched &&
        !error &&
        meals.length === 0 && (
          <p className="muted">
            No recipes found. Try another search.
          </p>
        )}

      {/* Recipe Results */}
      <div className="recipe-grid">
        {meals.map((meal) => (
          <article
            className="card"
            key={meal.id}
            style={{
              overflow: "hidden",
              alignSelf: "start",
            }}
          >
            {/* Food Image */}
            <img
              src={meal.image_url}
              alt={meal.title}
              loading="lazy"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                display: "block",
              }}
            />

            <div style={{ padding: "16px" }}>
              {/* Recipe Title */}
              <h3>{meal.title}</h3>

              <p className="muted">
                {meal.category}
              </p>

              {/* Recipe Details */}
              <details>
                <summary
                  style={{ cursor: "pointer" }}
                >
                  View recipe
                </summary>

                {/* Ingredients */}
                <h4>Ingredients</h4>

                <ul
                  style={{
                    paddingLeft: "20px",
                    lineHeight: "1.8",
                  }}
                >
                  {meal.ingredients?.map(
                    (ingredient, index) => (
                      <li key={index}>
                        {ingredient.measure}{" "}
                        {ingredient.name}
                      </li>
                    )
                  )}
                </ul>

                {/* Instructions */}
                <h4>Cooking Instructions</h4>

                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.7",
                  }}
                >
                  {meal.instructions}
                </p>
              </details>

              {/* Import Recipe Button */}
              <button
                type="button"
                className="btn"
                style={{
                  marginTop: "12px",
                  width: "100%",
                }}
                disabled={
                  importingId !== null ||
                  importStatus[meal.id]?.success ||
                  review !== null
                }
                onClick={() => importMeal(meal)}
              >
                {importingId === meal.id
                  ? "Importing..."
                  : importStatus[meal.id]?.success
                  ? "✓ Imported"
                  : "+ Import Recipe"}
              </button>

              {/* Ingredient Review Form */}
              {review?.mealId === meal.id && (
                <form
                  onSubmit={(e) =>
                    confirmImport(e, meal)
                  }
                  style={{
                    marginTop: "16px",
                    padding: "14px",
                    background: "#f8f1e5",
                    borderRadius: "12px",
                    border: "1px solid #e6d4b8",
                  }}
                >
                  <h4
                    style={{
                      marginTop: 0,
                      marginBottom: "8px",
                    }}
                  >
                    Review Ingredients
                  </h4>

                  <p
                    className="muted"
                    style={{ fontSize: "13px" }}
                  >
                    Confirm the quantities and units
                    below so PrepWise can calculate
                    your shopping list correctly.
                  </p>

                  {review.items.map((item, i) => (
                    <div
                      key={item.index}
                      style={{
                        marginBottom: "16px",
                        paddingBottom: "12px",
                        borderBottom:
                          "1px solid #e6d4b8",
                      }}
                    >
                      {/* Ingredient Name */}
                      <strong>{item.name}</strong>

                      {/* Original Measurement */}
                      <p
                        className="muted"
                        style={{
                          fontSize: "13px",
                          margin: "6px 0",
                        }}
                      >
                        Original:{" "}
                        {item.measure ||
                          "Not specified"}
                      </p>

                      {/* Quantity Input */}
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          marginBottom: "4px",
                        }}
                      >
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="0.01"
                        max="99999999.99"
                        step="0.01"
                        placeholder="Enter quantity"
                        required
                        disabled={importingId !== null}
                        value={item.quantity}
                        onChange={(e) =>
                          updateReviewItem(
                            i,
                            "quantity",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />

                      {/* Unit Selection */}
                      <label
                        style={{
                          display: "block",
                          fontSize: "13px",
                          marginTop: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        Unit
                      </label>

                      <select
                        required
                        disabled={importingId !== null}
                        value={item.unit}
                        onChange={(e) =>
                          updateReviewItem(
                            i,
                            "unit",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                        }}
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

                  {/* Confirm Import */}
                  <button
                    type="submit"
                    className="btn"
                    disabled={importingId !== null}
                    style={{
                      width: "100%",
                      marginTop: "4px",
                    }}
                  >
                    {importingId === meal.id
                      ? "Importing..."
                      : "Confirm & Import"}
                  </button>

                  {/* Cancel Review */}
                  <button
                    type="button"
                    className="btn"
                    disabled={importingId !== null}
                    onClick={() => setReview(null)}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                    }}
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Import Success or Error */}
              {importStatus[meal.id] && (
                <p
                  role="status"
                  style={{
                    color: importStatus[meal.id].success
                      ? "green"
                      : "red",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  {importStatus[meal.id].message}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
