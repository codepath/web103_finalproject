import { Link } from "react-router-dom";
import CategoryTags from "./CategoryTags.jsx";
import { formatDueDate, formatPriority, isOverdue } from "./taskFormatting.js";

// Action handlers are optional so the card can also be shown read-only.
export default function TaskCard({ task, isBusy = false, onToggleComplete, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  return (
    <article className={task.completed ? "task-card completed" : "task-card"}>
      <div className="task-card-header">
        {onToggleComplete && (
          <input
            type="checkbox"
            className="task-card-check"
            checked={task.completed}
            disabled={isBusy}
            onChange={() => onToggleComplete(task)}
            aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
          />
        )}
        <h2 className="task-card-title">
          <Link to={`/tasks/${task.id}`}>{task.title}</Link>
        </h2>
        <span className={`priority-badge priority-${task.priority}`}>
          {formatPriority(task.priority)}
        </span>
      </div>
      <p className="task-card-meta">
        {task.completed ? "Completed" : "Not completed"} ·{" "}
        <span className={overdue ? "overdue" : undefined}>
          {task.due_date === null
            ? "No due date"
            : `${overdue ? "Overdue: " : "Due "}${formatDueDate(task.due_date)}`}
        </span>
      </p>
      <CategoryTags categories={task.categories} />
      {(onEdit || onDelete) && (
        <div className="task-card-actions">
          {onEdit && (
            <button type="button" className="button" disabled={isBusy} onClick={() => onEdit(task)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="button button-danger"
              disabled={isBusy}
              onClick={() => onDelete(task)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}
