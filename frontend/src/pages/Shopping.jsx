import { useEffect, useState } from "react";
import { api, getRecipes } from "../api.js";
import { fmtQty } from "../utils.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import PantryForm from "../components/PantryForm.jsx";
import "../styles/pantry.css";
import "../styles/shopping.css";

export default function Shopping() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipeId, setRecipeId] = useState("");
  const [message, setMessage] = useState("");

  const load = () => api.get("/shopping-list").then(setItems).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    getRecipes().then(setRecipes).catch(() => setRecipes([]));
  }, []);

  async function run(action) {
    setError("");
    setMessage("");
    try { await action(); await load(); }
    catch (e) { setError(e.message); }
  }

  const toggle = (item) => run(() => api.patch(`/shopping-list/${item.id}`, { is_checked: !item.is_checked }));
  const remove = (item) => run(() => api.del(`/shopping-list/${item.id}`));
  const clearChecked = () => run(() => api.del("/shopping-list/checked"));

  function moveToPantry() {
    run(async () => {
      const { moved, skipped } = await api.post("/shopping-list/checked/to-pantry");
      let text = `Moved ${moved} item${moved === 1 ? "" : "s"} to your pantry.`;
      if (skipped) text += ` ${skipped} stayed here because the unit doesn't match your pantry.`;
      setMessage(text);
    });
  }

  function addMissing() {
    run(async () => {
      const { added } = await api.post(`/shopping-list/from-recipe/${recipeId}`);
      setMessage(added ? `Added ${added} missing ingredient${added === 1 ? "" : "s"}.` : "You already have everything for that recipe.");
    });
  }

  if (!items && error) return <div className="empty card pad">Couldn't load your shopping list: {error}</div>;
  if (!items) return <p className="muted">Loading…</p>;

  const toBuy = items.filter((i) => !i.is_checked);
  const inCart = items.filter((i) => i.is_checked);

  const row = (i) => (
    <div key={i.id} className={`trow ${i.is_checked ? "checked" : ""}`}>
      <input type="checkbox" checked={i.is_checked} onChange={() => toggle(i)} aria-label={`Mark ${i.name} as bought`} />
      <div className="grow"><strong>{i.name}</strong> {i.source === "recipe" && <span className="pill info">from recipe</span>}</div>
      <div className="qty">{fmtQty(i.quantity)} {i.unit}</div>
      <button className="x" onClick={() => remove(i)} aria-label={`Delete ${i.name}`}>×</button>
    </div>
  );

  return (
    <>
      <PageHeader title="Shopping List" subtitle={`${toBuy.length} ${toBuy.length === 1 ? "item" : "items"} to buy`}>
        <button className="btn primary" onClick={() => setAdding(true)}>+ Add item</button>
      </PageHeader>

      <div className="toolbar">
        <select value={recipeId} onChange={(e) => setRecipeId(e.target.value)} aria-label="Recipe">
          <option value="">Choose a recipe…</option>
          {recipes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
        <button className="btn" onClick={addMissing} disabled={!recipeId}>Add missing ingredients</button>
      </div>

      {message && <p className="success banner">{message}</p>}
      {error && <p className="error banner">{error}</p>}

      {items.length === 0 && <div className="empty card pad">Your shopping list is empty.</div>}

      {toBuy.length > 0 && (
        <section className="group">
          <h3 className="group-title">To buy</h3>
          <div className="card table">{toBuy.map(row)}</div>
        </section>
      )}

      {inCart.length > 0 && (
        <section className="group">
          <div className="group-head">
            <h3 className="group-title">In cart</h3>
            <div className="actions">
              <button className="btn small primary" onClick={moveToPantry}>Move to pantry</button>
              <button className="btn small" onClick={clearChecked}>Clear checked</button>
            </div>
          </div>
          <div className="card table">{inCart.map(row)}</div>
        </section>
      )}

      {adding && (
        <Modal onClose={() => setAdding(false)}>
          <h2>Add to shopping list</h2>
          <PantryForm hideExpiry submitLabel="Add to list" onCancel={() => setAdding(false)}
            onSubmit={async (p) => { await api.post("/shopping-list", p); setAdding(false); load(); }} />
        </Modal>
      )}
    </>
  );
}
