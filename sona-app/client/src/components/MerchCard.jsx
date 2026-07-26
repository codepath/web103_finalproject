import { useState } from "react";
import { deleteMerch } from "../api.js";
import currentUser from "../currentUser.js";
import EditMerchForm from "./EditMerchForm.jsx";

export default function MerchCard({ merch, isAdmin, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete ${merch.name}?`)) return;
    await deleteMerch(merch.id, currentUser.id);
    setDeleted(true);
    onDeleted(merch.id);
  }

  if (editing) {
    return (
      <div className="card">
        <EditMerchForm
          merch={merch}
          onSaved={(updated) => {
            setEditing(false);
            onUpdated(updated);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <img src={merch.photo} alt={merch.name} className="card-photo" />

      <div className="name-bar">{merch.name}</div>
      <span className="genre-tag">{merch.type}</span>

      <div className="card-actions">
        <span className="price-tag">${Number(merch.price).toFixed(2)}</span>
      </div>

      {isAdmin && (
        <div className="admin-controls">
          <button type="button" onClick={() => setEditing(true)}>Edit</button>
          <button type="button" onClick={handleDelete} className="btn-danger" disabled={deleted}>
            {deleted ? "Deleted" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}