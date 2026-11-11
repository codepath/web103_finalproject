import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTask } from "../api/tasks.js";
import CategoryTags from "../components/CategoryTags.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { formatDueDate, formatPriority } from "../components/taskFormatting.js";

// 400 (bad id) and 404 (missing task) are final answers; only network and
// server failures are worth retrying.
function isRetryable(error) {
  return error.status === 0 || error.status === undefined || error.status >= 500;
}

function errorMessageFor(error) {
  if (error.status === 404 || error.status === 400) {
    return "Task not found.";
  }
  return "Unable to load this task. Please try again.";
}

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getTask(taskId, { signal: controller.signal })
      .then((loadedTask) => {
        setTask(loadedTask);
        setIsLoading(false);
      })
      .catch((loadError) => {
        if (loadError.name === "AbortError") {
          return;
        }
        if (isRetryable(loadError)) {
          console.error(loadError);
        }
        setError(loadError);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [taskId, reloadKey]);

  return (
    <section className="page">
      <p>
        <Link to="/tasks">← Back to tasks</Link>
      </p>
      {isLoading && <LoadingState message="Loading task..." />}
      {!isLoading && error && (
        <ErrorMessage
          message={errorMessageFor(error)}
          onRetry={isRetryable(error) ? () => setReloadKey((key) => key + 1) : undefined}
        />
      )}
      {!isLoading && !error && task && (
        <article className="task-details">
          <div className="task-card-header">
            <h1>{task.title}</h1>
            <span className={`priority-badge priority-${task.priority}`}>
              {formatPriority(task.priority)}
            </span>
          </div>
          <dl className="task-details-fields">
            <dt>Status</dt>
            <dd>{task.completed ? "Completed" : "Not completed"}</dd>
            <dt>Due</dt>
            <dd>{formatDueDate(task.due_date)}</dd>
            <dt>Description</dt>
            <dd>{task.description || "No description."}</dd>
            <dt>Categories</dt>
            <dd>
              {task.categories.length > 0 ? (
                <CategoryTags categories={task.categories} />
              ) : (
                "None"
              )}
            </dd>
          </dl>
        </article>
      )}
    </section>
  );
}
