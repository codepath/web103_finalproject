import { useEffect, useState } from "react";
import { listCategories } from "../api/categories.js";
import { describeTaskActionError } from "./actionErrors.js";

const PRIORITIES = ["low", "medium", "high"];

// Mirrors the backend check: a real calendar date in YYYY-MM-DD format.
function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validate(values) {
  const errors = {};

  if (values.title.trim().length === 0) {
    errors.title = "Task title is required.";
  }
  if (!PRIORITIES.includes(values.priority)) {
    errors.priority = "Choose a priority: low, medium, or high.";
  }
  if (values.due_date !== "" && !isValidDateString(values.due_date)) {
    errors.due_date = "Enter a valid due date.";
  }
  if (typeof values.completed !== "boolean") {
    errors.completed = "Completion must be checked or unchecked.";
  }

  return errors;
}

// Used for both creating and editing. `onSubmit` receives API-ready fields
// and should throw (an ApiError) if the save fails.
export default function TaskForm({ task, onSubmit, onCancel }) {
  const isEditing = Boolean(task);
  const [values, setValues] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "medium",
    due_date: task?.due_date ?? "",
    completed: task?.completed ?? false,
    category_ids: task?.categories.map((category) => category.id) ?? [],
  });
  const [categories, setCategories] = useState([]);
  // "loading" | "ready" | "failed"
  const [categoryStatus, setCategoryStatus] = useState("loading");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    listCategories({ signal: controller.signal })
      .then((loaded) => {
        setCategories(loaded);
        setCategoryStatus("ready");
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        console.error(error);
        setCategoryStatus("failed");
      });

    return () => controller.abort();
  }, []);

  function toggleCategory(categoryId) {
    setValues((current) => ({
      ...current,
      category_ids: current.category_ids.includes(categoryId)
        ? current.category_ids.filter((id) => id !== categoryId)
        : [...current.category_ids, categoryId],
    }));
  }

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSaving(true);
    setSubmitError(null);

    try {
      await onSubmit({
        title: values.title.trim(),
        description: values.description,
        priority: values.priority,
        due_date: values.due_date === "" ? null : values.due_date,
        ...(isEditing ? { completed: values.completed } : {}),
        // If categories never loaded, leave the task's existing ones untouched.
        ...(categoryStatus === "ready" ? { category_ids: values.category_ids } : {}),
      });
    } catch (error) {
      console.error(error);
      setSubmitError(
        describeTaskActionError(error, "Unable to save the task. Please try again."),
      );
      setIsSaving(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}

      <label className="form-field">
        <span>Title *</span>
        <input
          type="text"
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
          autoFocus
        />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </label>

      <label className="form-field">
        <span>Description</span>
        <textarea
          rows={3}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
      </label>

      <div className="form-row">
        <label className="form-field">
          <span>Priority</span>
          <select
            value={values.priority}
            onChange={(event) => updateField("priority", event.target.value)}
            aria-invalid={Boolean(fieldErrors.priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {fieldErrors.priority && (
            <span className="field-error">{fieldErrors.priority}</span>
          )}
        </label>

        <label className="form-field">
          <span>Due date</span>
          <input
            type="date"
            value={values.due_date}
            onChange={(event) => updateField("due_date", event.target.value)}
            aria-invalid={Boolean(fieldErrors.due_date)}
          />
          {fieldErrors.due_date && (
            <span className="field-error">{fieldErrors.due_date}</span>
          )}
        </label>
      </div>

      <fieldset className="form-field category-picker">
        <legend>Categories</legend>
        {categoryStatus === "loading" && <span className="field-hint">Loading categories...</span>}
        {categoryStatus === "failed" && (
          <span className="field-error">
            Unable to load categories. The task will be saved without changing them.
          </span>
        )}
        {categoryStatus === "ready" && (
          <div className="category-options">
            {categories.map((category) => (
              <label
                key={category.id}
                className="category-option"
                style={{ "--category-color": category.color }}
              >
                <input
                  type="checkbox"
                  checked={values.category_ids.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      {isEditing && (
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={values.completed}
            onChange={(event) => updateField("completed", event.target.checked)}
          />
          <span>Completed</span>
        </label>
      )}

      <div className="form-actions">
        <button type="button" className="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={isSaving}>
          {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add task"}
        </button>
      </div>
    </form>
  );
}
