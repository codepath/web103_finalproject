import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { getRecipes } from "../api.js";
import "../styles/pantry.css";
import "../styles/recipes.css";

// Sort dropdown value -> `sort` query param for GET /api/recipes (name is the API default)
const SORT_PARAMS = { name: undefined, time: "time", match: "availability" };
const MAX_TIME_OPTIONS = [10, 15, 30, 45];

export default function Recipes() {
  // null = first load not finished, [] = loaded but empty, [...] = recipes to show
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState("All");
  const [diet, setDiet] = useState("All");
  const [maxTime, setMaxTime] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter choices come from the unfiltered list, so picking one option doesn't hide the others
  const [options, setOptions] = useState({ mealTypes: [], diets: [] });

  // Meal type, diet, max time and sort are applied by the API; search stays on the client
  useEffect(() => {
    let ignore = false;
    const unfiltered = mealType === "All" && diet === "All" && !maxTime;
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
          const unique = (key) => [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort();
          setOptions({ mealTypes: unique("meal_type"), diets: unique("dietary_preference") });
        }
      })
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));

    return () => { ignore = true; };
  }, [mealType, diet, maxTime, sortBy, reloadKey]);

  const shownRecipes = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (recipes || []).filter((recipe) => recipe.title.toLowerCase().includes(term));
  }, [recipes, search]);

  const retry = () => setReloadKey((k) => k + 1);

  // First load: nothing to show yet
  if (recipes === null && loading) return <p className="muted">Loading recipes…</p>;
  if (recipes === null && error) {
    return (
      <div className="empty card pad">
        <p>Couldn't load recipes: {error}</p>
        <button className="btn" onClick={retry}>Try again</button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Discover Recipes"
        subtitle={loading ? "Updating…" : `${shownRecipes.length} recipes to try`}
      />

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tabs">
          {["All", ...options.mealTypes].map((type) => (
            <button
              key={type}
              className={`tab ${mealType === type ? "on" : ""}`}
              onClick={() => setMealType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <select value={diet} onChange={(e) => setDiet(e.target.value)} aria-label="Filter by diet">
          <option value="All">Any diet</option>
          {options.diets.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={maxTime} onChange={(e) => setMaxTime(e.target.value)} aria-label="Filter by total time">
          <option value="">Any time</option>
          {MAX_TIME_OPTIONS.map((m) => <option key={m} value={m}>{m} min or less</option>)}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort recipes"
        >
          <option value="name">Name (A-Z)</option>
          <option value="time">Cooking time (shortest first)</option>
          <option value="match">Best ingredient match</option>
        </select>
      </div>

      {error ? (
        <div className="empty card pad">
          <p>Couldn't update recipes: {error}</p>
          <button className="btn" onClick={retry}>Try again</button>
        </div>
      ) : shownRecipes.length === 0 ? (
        <div className="empty card pad">
          No recipes match your search or filters.
        </div>
      ) : (
        <div className={`recipe-grid ${loading ? "is-loading" : ""}`} aria-busy={loading}>
          {shownRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
}
