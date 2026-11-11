import { Link } from "react-router-dom";
import CategoryTags from "./CategoryTags.jsx";
import { formatDueDate, formatPriority } from "./taskFormatting.js";

export default function TaskCard({ task }) {
  return (
    <article className={task.completed ? "task-card completed" : "task-card"}>
      <div className="task-card-header">
        <h2 className="task-card-title">
          <Link to={`/tasks/${task.id}`}>{task.title}</Link>
        </h2>
        <span className={`priority-badge priority-${task.priority}`}>
          {formatPriority(task.priority)}
        </span>
      </div>
      <p className="task-card-meta">
        {task.completed ? "Completed" : "Not completed"} · Due {formatDueDate(task.due_date)}
      </p>
      <CategoryTags categories={task.categories} />
    </article>
  );
}
