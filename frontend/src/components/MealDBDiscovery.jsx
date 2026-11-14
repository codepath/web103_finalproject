
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

export default function MealDBDiscovery({
  onImported,
}) {
  // Search states.

  const [search, setSearch] = useState("");

  const [meals, setMeals] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [searched, setSearched] = useState(false);

  // Import states.

  const [importingId, setImportingId] =
    useState(null);

  const [importStatus, setImportStatus] =
    useState({});

  const [review, setReview] = useState(null);

  // Search recipes from TheMealDB.

  async function searchMeals(event) {
    event.preventDefault();

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

  // Import a recipe into PostgreSQL.

  async function importMeal(
    meal,
    measurements = {}
  ) {
    setImportingId(meal.id);

    setImportStatus((previous) => ({
      ...previous,
      [meal.id]: null,
    }));

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

      // Review unsupported measurements.

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
          result.error || "Failed to import recipe."
        );
      }

      setReview(null);

      setImportStatus((previous) => ({
        ...previous,

        [meal.id]: {
          success: true,

          message:
            result.message ||
            "Recipe imported successfully!",
        },
      }));

      // Refresh the local recipe catalog.

      onImported?.();

    } catch (err) {
      setImportStatus((previous) => ({
        ...previous,

        [meal.id]: {
          success: false,

          message: err.message,
        },
      }));

    } finally {
      setImportingId(null);
    }
  }

  // Update ingredient measurements.

  function updateReviewItem(
    index,
    field,
    value
  ) {
    setReview((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        items: previous.items.map((item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
        ),
      };
    });
  }

  // Confirm and import reviewed ingredients.

  function confirmImport(event, meal) {
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

    importMeal(meal, measurements);
  }

  // Main discovery interface.

  return (
    <section
      style={{
        marginTop: "32px",
      }}
    >

      <h2>
        Discover More Recipes
      </h2>

      <p className="muted">
        Explore recipes from around the world.
      </p>

      {/* Search form */}

      <form
        onSubmit={searchMeals}
        className="toolbar"

        style={{
          marginBottom: "20px",
        }}
      >

        <input
          type="search"
          placeholder="Search chicken, pasta, salmon..."
          value={search}

          onChange={(event) =>
            setSearch(event.target.value)
          }

          disabled={importingId !== null}
        />

        <button
          type="submit"
          className="btn"

          disabled={
            loading ||
            importingId !== null
          }
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>

      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {!loading &&
        searched &&
        !error &&
        meals.length === 0 && (
          <p className="muted">
            No recipes found. Try another search.
          </p>
        )}

      {/* Recipe results */}

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

            {/* Food image */}

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

            <div
              style={{
                padding: "16px",
              }}
            >

              <h3>{meal.title}</h3>

              <p className="muted">
                {meal.category}
              </p>

              {/* Recipe details */}

              <details>

                <summary
                  style={{
                    cursor: "pointer",
                  }}
                >
                  View recipe
                </summary>

                <h4>
                  Ingredients
                </h4>

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

                <h4>
                  Cooking Instructions
                </h4>

                <p
                  style={{
                    whiteSpace: "pre-wrap",

                    lineHeight: "1.7",
                  }}
                >
                  {meal.instructions}
                </p>

              </details>

              {/* Import button */}

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

                onClick={() =>
                  importMeal(meal)
                }
              >
                {importingId === meal.id
                  ? "Importing..."
                  : importStatus[meal.id]?.success
                    ? "✓ Imported"
                    : "+ Import Recipe"}
              </button>

              {/* Ingredient review form */}

              {review?.mealId === meal.id && (
                <form
                  onSubmit={(event) =>
                    confirmImport(event, meal)
                  }

                  style={{
                    marginTop: "16px",

                    padding: "14px",

                    background: "var(--surface, #f8f1e5)",

                    borderRadius: "12px",

                    border: "1px solid var(--border, #e6d4b8)",
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

                    style={{
                      fontSize: "13px",
                    }}
                  >
                    Confirm the quantities and units
                    below so PrepWise can calculate
                    your shopping list correctly.
                  </p>

                  {review.items.map((item, index) => (
                    <div
                      key={item.index}

                      style={{
                        marginBottom: "16px",

                        paddingBottom: "12px",

                        borderBottom:
                          "1px solid var(--border, #e6d4b8)",
                      }}
                    >

                      <strong>
                        {item.name}
                      </strong>

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

                      {/* Quantity input */}

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

                        onChange={(event) =>
                          updateReviewItem(
                            index,
                            "quantity",
                            event.target.value
                          )
                        }

                        style={{
                          width: "100%",

                          boxSizing: "border-box",
                        }}
                      />

                      {/* Unit selection */}

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

                        onChange={(event) =>
                          updateReviewItem(
                            index,
                            "unit",
                            event.target.value
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

                  <button
                    type="button"
                    className="btn"

                    disabled={importingId !== null}

                    onClick={() =>
                      setReview(null)
                    }

                    style={{
                      width: "100%",

                      marginTop: "8px",
                    }}
                  >
                    Cancel
                  </button>

                </form>
              )}

              {/* Import status */}

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
