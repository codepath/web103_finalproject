
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import RecipeDetail from "../components/RecipeDetail.jsx";
import Modal from "../components/Modal.jsx";
import MealDBDiscovery from "../components/MealDBDiscovery.jsx";
import { getRecipes, getRecipe } from "../api.js";

import "../styles/pantry.css";
import "../styles/recipes.css";

const SORT_PARAMS = {
  name: undefined,
  time: "time",
  match: "availability",
};

const MAX_TIME_OPTIONS = [10, 15, 30, 45];

export default function Recipes() {
  // Recipe List State
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState("All");
  const [diet, setDiet] = useState("All");
  const [maxTime, setMaxTime] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter Options
  const [options, setOptions] = useState({
    mealTypes: [],
    diets: [],
  });

  // Recipe Detail Modal State
  const [selectedRecipe, setSelectedRecipe] =
    useState(null);

  const [recipeDetails, setRecipeDetails] =
    useState(null);

  const [detailLoading, setDetailLoading] =
    useState(false);

  const [detailError, setDetailError] =
    useState(null);

  // Load PrepWise recipes from PostgreSQL
  useEffect(() => {
    let ignore = false;

    const unfiltered =
      mealType === "All" &&
      diet === "All" &&
      !maxTime;

    setLoading(true);
    setError(null);

    getRecipes({
      mealType: mealType === "All" ? "" : mealType,
      diet: diet === "All" ? "" : diet,
      maxTime,
      sort: SORT_PARAMS[sortBy],
    })
      .then((rows) => {
        if (ignore) return;

        setRecipes(rows);

        if (unfiltered) {
          const unique = (key) =>
            [
              ...new Set(
                rows
                  .map((r) => r[key])
                  .filter(Boolean)
              ),
            ].sort();

          setOptions({
            mealTypes: unique("meal_type"),
            diets: unique("dietary_preference"),
          });
        }
      })
      .catch((e) => {
        if (!ignore) setError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [mealType, diet, maxTime, sortBy, reloadKey]);

  // Search local PrepWise recipes
  const shownRecipes = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (recipes || []).filter((recipe) =>
      recipe.title.toLowerCase().includes(term)
    );
  }, [recipes, search]);

  // Reload recipes after successful import
  const retry = () => {
    setReloadKey((k) => k + 1);
  };

  // Load individual recipe details
  useEffect(() => {
    if (!selectedRecipe) return;

    let ignore = false;

    setRecipeDetails(null);
    setDetailError(null);
    setDetailLoading(true);

    getRecipe(selectedRecipe.id)
      .then((data) => {
        if (!ignore) setRecipeDetails(data);
      })
      .catch((e) => {
        if (!ignore) setDetailError(e.message);
      })
      .finally(() => {
        if (!ignore) setDetailLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedRecipe]);

  // First Load
  if (recipes === null && loading) {
    return (
      <p className="muted">
        Loading recipes…
      </p>
    );
  }

  // Initial Error
  if (recipes === null && error) {
    return (
      <>
        <div className="empty card pad">
          <p>Couldn't load recipes: {error}</p>

          <button
            className="btn"
            onClick={retry}
          >
            Try again
          </button>
        </div>

        <MealDBDiscovery onImported={retry} />
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Discover Recipes"
        subtitle={
          loading
            ? "Updating…"
            : `${shownRecipes.length} recipes to try`
        }
      />

      {/* Search and Filters */}
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Meal Type Tabs */}
        <div className="tabs">
          {["All", ...options.mealTypes].map(
            (type) => (
              <button
                key={type}
                className={`tab ${
                  mealType === type ? "on" : ""
                }`}
                onClick={() => setMealType(type)}
              >
                {type}
              </button>
            )
          )}
        </div>

        {/* Diet Filter */}
        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          aria-label="Filter by diet"
        >
          <option value="All">
            Any diet
          </option>

          {options.diets.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Cooking Time Filter */}
        <select
          value={maxTime}
          onChange={(e) =>
            setMaxTime(e.target.value)
          }
          aria-label="Filter by total time"
        >
          <option value="">
            Any time
          </option>

          {MAX_TIME_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m} min or less
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          aria-label="Sort recipes"
        >
          <option value="name">
            Name (A-Z)
          </option>

          <option value="time">
            Cooking time (shortest first)
          </option>

          <option value="match">
            Best ingredient match
          </option>
        </select>
      </div>

      {/* PrepWise Recipe Cards */}
      {error ? (
        <div className="empty card pad">
          <p>
            Couldn't update recipes: {error}
          </p>

          <button
            className="btn"
            onClick={retry}
          >
            Try again
          </button>
        </div>
      ) : shownRecipes.length === 0 ? (
        <div className="empty card pad">
          No recipes match your search or filters.
        </div>
      ) : (
        <div
          className={`recipe-grid ${
            loading ? "is-loading" : ""
          }`}
          aria-busy={loading}
        >
          {shownRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() =>
                setSelectedRecipe(recipe)
              }
            />
          ))}
        </div>
      )}

      {/* External MealDB Discovery */}
      <MealDBDiscovery onImported={retry} />

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <Modal
          title={selectedRecipe.title}
          onClose={() => setSelectedRecipe(null)}
          wide
        >
          {detailLoading ? (
            <p className="muted">
              Loading recipe details...
            </p>
          ) : detailError ? (
            <p className="error">
              Couldn't load recipe: {detailError}
            </p>
          ) : recipeDetails ? (
            <RecipeDetail recipe={recipeDetails} />
          ) : (
            <p className="muted">
              Loading recipe details...
            </p>
          )}
        </Modal>
      )}
    </>
  );
}
