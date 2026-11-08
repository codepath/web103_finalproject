import { useEffect, useMemo,useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import RecipeCard from "../components/RecipeCard.jsx";
import { SAMPLE_RECIPES } from "../data/sampleRecipes.js";
import "../styles/pantry.css";
import "../styles/recipes.css";

export default function Recipes() {
  // null = still loading, [] = loaded but empty, [...] = recipes to show
  const [recipes, setRecipes] = useState(null);
  const [search, setSearch] = useState("");
  const [mealType, setMealType] = useState("All");
  const [sortBy, setSortBy] = useState("name"); 

  useEffect(() => {
    // Pretend to load for a moment so the loading state is visible.
    // Later: api.get("/recipes").then(setRecipes)
    const timer = setTimeout(() => setRecipes(SAMPLE_RECIPES), 500);
    return () => clearTimeout(timer);
  }, []);

  const mealTypes = useMemo(() => {
    return [
      "All",
      ...new Set((recipes || []).map((recipe) => recipe.meal_type))
    ];
  }, [recipes]);

  const shownRecipes = useMemo(() => {
    const filtered = (recipes || []).filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(search.trim().toLowerCase());
      const matchesMealType = mealType === "All" || recipe.meal_type === mealType; 
      return matchesSearch && matchesMealType; 
    }); 

    return filtered.sort((a, b) => {
      if (sortBy === "time") {
        const timeA = (a.prep_minutes || 0) + (a.cook_minutes || 0); 
        const timeB = (b.prep_minutes || 0) + (b.cook_minutes || 0); 
        return timeA - timeB;
      }

      if (sortBy === "match") {
        const matchA = a.total_count > 0 ? a.have_count / a.total_count : 0; 
        const matchB = b.total_count > 0 ? b.have_count / b.total_count : 0; 
        return matchB - matchA;
      }
      // Default sort by title
      return a.title.localeCompare(b.title);
    }); 
  }, [recipes, search, mealType, sortBy]); 


  // Loading state
  if (recipes === null) return <p className="muted">Loading recipes…</p>;

  return (
    <>
      <PageHeader title="Discover Recipes" subtitle={`${shownRecipes.length} recipes to try`} />

      <div className="toolbar">
        <input 
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="tabs">
          {mealTypes.map((type) => (
            <button
              key={type}
              className={`tab ${mealType === type ? "on" : ""}`}
              onClick={() => setMealType(type)}
            >
              {type}
            </button>
          ))}
        </div>

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

      {/* Shown recipes */}
      {shownRecipes.length === 0 ? (
        <div className="empty card pad">
          No recipes match your search or filters. 
        </div>
      ) : (
        <div className="recipe-grid">
          {shownRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
}
