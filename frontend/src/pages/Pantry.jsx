import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { prettyDate, fmtQty } from "../utils.js";
import "../styles/pantry.css";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import PantryForm from "../components/PantryForm.jsx";

export default function Pantry() {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const load = () => api.get("/pantry-items").then(setItems);
  useEffect(() => { load(); }, []);

  const categories = useMemo(() => ["All", ...new Set((items || []).map((i) => i.category))], [items]);
  const shown = (items || []).filter((i) => (cat === "All" || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase()));
  const grouped = shown.reduce((acc, i) => ((acc[i.category] ||= []).push(i), acc), {});

  async function remove() {
    await api.del(`/pantry-items/${deleting.id}`);
    setDeleting(null);
    load();
  }

  if (!items) return <p className="muted">Loading…</p>;
  return (
    <>
      <PageHeader title="My Pantry" subtitle={`${items.length} ingredients on hand`}>
        <Link to="/pantry/new" className="btn primary">+ Add ingredient</Link>
      </PageHeader>

      <div className="toolbar">
        <input type="search" placeholder="Search pantry…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tabs">
          {categories.map((c) => <button key={c} className={`tab ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      </div>

      {shown.length === 0 && <div className="empty card pad">No ingredients found. <Link to="/pantry/new">Add one →</Link></div>}
      {Object.entries(grouped).map(([category, list]) => (
        <section key={category} className="group">
          <h3 className="group-title">{category}</h3>
          <div className="card table">
            {list.map((i) => (
              <div key={i.id} className="trow">
                <div className="grow"><strong>{i.name}</strong></div>
                <div className="qty">{fmtQty(i.quantity)} {i.unit}</div>
                <div className="exp">
                  {i.expiration_date ? (
                    <span className={`pill ${i.days_until_expiry < 0 ? "danger" : i.days_until_expiry <= 3 ? "danger" : i.days_until_expiry <= 7 ? "warn" : ""}`}>
                      {i.days_until_expiry < 0 ? "Expired" : `Exp ${prettyDate(i.expiration_date)}`}
                    </span>
                  ) : <span className="muted">—</span>}
                </div>
                <div className="actions">
                  <button className="btn small" onClick={() => setEditing(i)}>Edit</button>
                  <button className="btn small danger" onClick={() => setDeleting(i)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2>Edit {editing.name}</h2>
          <PantryForm initial={editing} submitLabel="Save changes" onCancel={() => setEditing(null)}
            onSubmit={async (p) => { await api.patch(`/pantry-items/${editing.id}`, p); setEditing(null); load(); }} />
        </Modal>
      )}
      {deleting && (
        <Modal onClose={() => setDeleting(null)}>
          <h2>Remove {deleting.name}?</h2>
          <p className="muted">This takes it out of your pantry. Recipe matches will update.</p>
          <div className="form-actions"><button className="btn" onClick={() => setDeleting(null)}>Cancel</button><button className="btn danger solid" onClick={remove}>Delete</button></div>
        </Modal>
      )}
    </>
  );
}
