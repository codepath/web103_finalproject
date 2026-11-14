import { useEffect, useState } from "react";
import { api } from "../api.js";

const CATEGORIES = ["Protein", "Grains", "Vegetables", "Fruit", "Dairy", "Oils", "Pantry Staples", "Other"];

export default function PantryForm({ initial, onSubmit, onCancel, submitLabel, hideExpiry }) {
  const editing = !!initial;
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState("Other");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [unit, setUnit] = useState(initial?.unit || "g");
  const [expiration, setExpiration] = useState(initial?.expiration_date || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/ingredients").then(setIngredients);
    api.get("/units").then(setUnits);
  }, []);

  const existing = ingredients.find((i) => i.name.toLowerCase() === name.trim().toLowerCase());

  async function submit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const payload = editing
        ? { quantity: Number(quantity), unit, expiration_date: expiration || null }
        : { ingredient_id: existing?.id, name: name.trim(), category, quantity: Number(quantity), unit, expiration_date: expiration || null };
      await onSubmit(payload);
    } catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <form className="form" onSubmit={submit}>
      {!editing && (
        <label>Ingredient
          <input list="catalog" value={name} onChange={(e) => setName(e.target.value)} placeholder="Start typing, e.g. Chicken Breast" required autoFocus />
          <datalist id="catalog">{ingredients.map((i) => <option key={i.id} value={i.name} />)}</datalist>
          <small className="muted">{name.trim() && (existing ? `Found in catalog · ${existing.category}` : "New ingredient — it will be added to the catalog")}</small>
        </label>
      )}
      {!editing && !existing && name.trim() && (
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
      )}
      <div className="row">
        <label>Quantity
          <input type="number" min="0" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </label>
        <label>Unit
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>{units.map((u) => <option key={u}>{u}</option>)}</select>
        </label>
      </div>
      {!hideExpiry && (
        <label>Expiration date <span className="muted">(optional)</span>
          <input type="date" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
        <button className="btn primary" disabled={busy}>{submitLabel}</button>
      </div>
    </form>
  );
}
