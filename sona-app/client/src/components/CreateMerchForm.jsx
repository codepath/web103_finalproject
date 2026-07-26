import { useState } from "react";
import { createMerch } from "../api.js";
import currentUser from "../currentUser.js";

export default function CreateMerchForm({ artistId, onCreated }) {
  const [form, setForm] = useState({ name: "", type: "", price: "", stock: "", photo: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const created = await createMerch(artistId, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        user_id: currentUser.id,
      });
      setSubmitted(true);
      onCreated(created);
    } catch (err) {
      setError("Failed to create merch.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        placeholder="Type"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />
      <input
        placeholder="Photo URL"
        value={form.photo}
        onChange={(e) => setForm({ ...form, photo: e.target.value })}
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={submitted}>
        {submitted ? "Created" : "Create Merch"}
      </button>
    </form>
  );
}