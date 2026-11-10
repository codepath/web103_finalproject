import { useState } from "react";

const toFormValues = (book) => ({
  title: book?.title ?? "",
  author: book?.author ?? "",
  genre: book?.genre ?? "",
  year: book?.year ?? "",
  pageCount: book?.page_count ?? "",
  coverImage: book?.cover_image ?? "",
  status: book?.status ?? "UNREAD",
});

const BookForm = ({ initialValues, onSubmit, onSuccess, onCancel, submitLabel = "Save" }) => {
  const [form, setForm] = useState(toFormValues(initialValues));
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saved = await onSubmit({
        ...form,
        year: form.year ? Number(form.year) : null,
        pageCount: form.pageCount ? Number(form.pageCount) : null,
        coverImage: form.coverImage || null,
      });
      setError(null);
      onSuccess(saved);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} />
      <input name="pageCount" type="number" placeholder="Page count" value={form.pageCount} onChange={handleChange} />
      <input name="coverImage" placeholder="Cover image URL" value={form.coverImage} onChange={handleChange} />

      {initialValues && (
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="UNREAD">Unread</option>
          <option value="READING">Reading</option>
          <option value="FINISHED">Finished</option>
        </select>
      )}

      <button type="submit">{submitLabel}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default BookForm;