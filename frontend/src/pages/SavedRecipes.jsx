
import { useEffect, useState } from "react";
import { api, getRecipe } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import RecipeDetail from "../components/RecipeDetail.jsx";
import "../styles/recipes.css";

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  async function loadSaved() {
    setLoading(true);
    setError("");

    try {
      const data = await api.get("/saved-recipes");
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSaved();
  }, []);

  async function openRecipe(recipeId) {
    setDetailLoading(true);
    setError("");

    try {
      const data = await getRecipe(recipeId);
      setSelected(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  }

  async function removeRecipe(recipeId) {
    setRemovingId(recipeId);
    setError("");

    try {
      await api.del(`/saved-recipes/${recipeId}`);

      setRecipes((previous) =>
        previous.filter(
          (recipe) => recipe.recipe_id !== recipeId
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Saved Recipes"
        subtitle={`${recipes.length} favorite recipes`}
      />

      {error && (
        <p className="error">{error}</p>
      )}

      {loading ? (
        <p className="muted">
          Loading your saved recipes...
        </p>
      ) : recipes.length === 0 ? (
        <div className="empty card pad">
          <h3>No saved recipes yet</h3>

          <p>
            Discover recipes you love and save
            them to your favorites.
          </p>

          <a className="btn" href="/recipes">
            Discover Recipes
          </a>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <article
              key={recipe.recipe_id}
              className="recipe-card card"
            >
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "190px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              )}

              <h3>{recipe.title}</h3>

              <p className="muted">
                {recipe.prep_minutes != null
                  ? `Prep: ${recipe.prep_minutes} min`
                  : "Prep time not specified"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "auto",
                }}
              >
                <button
                  className="btn"
                  disabled={detailLoading}
                  onClick={() =>
                    openRecipe(recipe.recipe_id)
                  }
                >
                  View Recipe
                </button>

                <button
                  className="btn"
                  style={{ color: "#bd5539" }}
                  disabled={removingId !== null}
                  onClick={() =>
                    removeRecipe(recipe.recipe_id)
                  }
                >
                  {removingId === recipe.recipe_id
                    ? "Removing..."
                    : "♥ Remove"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <Modal
          title={selected.title}
          wide
          onClose={() => {
            setSelected(null);
            loadSaved();
          }}
        >
          <RecipeDetail
            key={selected.id}
            recipe={selected}
          />
        </Modal>
      )}
    </>
  );
}
