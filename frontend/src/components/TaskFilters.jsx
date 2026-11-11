import { useEffect, useState } from "react";
import { listCategories } from "../api/categories.js";

export const FILTER_NAMES = ["completed", "priority", "category", "sort", "order"];

// Filter and sort controls. `values` holds the current query (strings,
// "" meaning "any"); `onChange(name, value)` updates one of them.
export default function TaskFilters({ values, onChange, onClear }) {
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    listCategories({ signal: controller.signal })
      .then(setCategories)
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        console.error(error);
        setCategoryError(true);
      });

    return () => controller.abort();
  }, []);

  const hasFilters = FILTER_NAMES.some((name) => values[name] !== "");

  return (
    <div className="task-filters" role="search" aria-label="Filter and sort tasks">
      <label className="form-field">
        <span>Status</span>
        <select value={values.completed} onChange={(event) => onChange("completed", event.target.value)}>
          <option value="">All</option>
          <option value="false">Not completed</option>
          <option value="true">Completed</option>
        </select>
      </label>

      <label className="form-field">
        <span>Priority</span>
        <select value={values.priority} onChange={(event) => onChange("priority", event.target.value)}>
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <label className="form-field">
        <span>Category</span>
        <select
          value={values.category}
          onChange={(event) => onChange("category", event.target.value)}
          disabled={categoryError}
          title={categoryError ? "Unable to load categories." : undefined}
        >
          <option value="">{categoryError ? "Unavailable" : "All"}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="form-field">
        <span>Sort by</span>
        <select value={values.sort} onChange={(event) => onChange("sort", event.target.value)}>
          <option value="">Due date (default)</option>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
          <option value="created_at">Created date</option>
          <option value="title">Title</option>
        </select>
      </label>

      <label className="form-field">
        <span>Order</span>
        <select
          value={values.order}
          onChange={(event) => onChange("order", event.target.value)}
          disabled={values.sort === ""}
        >
          <option value="">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>

      {hasFilters && (
        <button type="button" className="button button-quiet" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}
