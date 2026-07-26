import { useState } from "react";
import { updateMerch } from "../api.js";
import currentUser from "../currentUser.js";

export default function EditMerchForm({ merch, onSaved, onCancel }) {
  const [form, setForm] = useState({
    name: merch.name,
    price: merch.price,
    stock: merch.stock,
    photo: merch.photo || "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const updated = await updateMerch(merch.id, {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      user_id: currentUser.id,
    });
    onSaved(updated);
  }

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="number"
        step="0.01"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        placeholder="Price"
      />
      <input
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
        placeholder="Stock"
      />
      <input
        value={form.photo}
        onChange={(e) => setForm({ ...form, photo: e.target.value })}
        placeholder="Photo URL"
      />
      <div className="admin-controls">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}