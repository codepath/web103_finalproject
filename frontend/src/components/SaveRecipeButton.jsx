
import { useState } from "react";
import { api } from "../api.js";

export default function SaveRecipeButton({ recipe }) {
  const [saved, setSaved] = useState(
    Boolean(recipe.is_saved)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggleSave() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      if (saved) {
        await api.del(`/saved-recipes/${recipe.id}`);
        setSaved(false);
      } else {
        await api.post("/saved-recipes", {
          recipe_id: recipe.id,
        });

        setSaved(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ margin: "12px 0" }}>
      <button
        type="button"
        className="btn"
        onClick={toggleSave}
        disabled={loading}
        aria-pressed={saved}
        style={{
          width: "100%",
          background: saved ? "#bd5539" : "#fffdf8",
          color: saved ? "white" : "#bd5539",
          border: "1px solid #bd5539",
          fontWeight: "600",
        }}
      >
        {loading
          ? "Please wait..."
          : saved
          ? "♥ Saved Recipe"
          : "♡ Save Recipe"}
      </button>

      {error && (
        <p
          style={{
            color: "#bd5539",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
