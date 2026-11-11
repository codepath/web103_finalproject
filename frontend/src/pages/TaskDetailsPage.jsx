import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTask, getTask, updateTask } from "../api/tasks.js";
import { describeTaskActionError } from "../components/actionErrors.js";
import CategoryTags from "../components/CategoryTags.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Modal from "../components/Modal.jsx";
import TaskForm from "../components/TaskForm.jsx";
import { formatDueDate, formatPriority, isOverdue } from "../components/taskFormatting.js";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const navigate = useNavigate();

  async function runAction(action, fallbackMessage) {
    setIsBusy(true);
    setActionError(null);
    try {
      await action();
    } catch (actionFailure) {
      console.error(actionFailure);
      setActionError(describeTaskActionError(actionFailure, fallbackMessage));
    } finally {
      setIsBusy(false);
    }
  }

  function handleToggleComplete() {
    return runAction(
      async () => setTask(await updateTask(task.id, { completed: !task.completed })),
      "Unable to update the task. Please try again.",
    );
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }
    runAction(async () => {
      await deleteTask(task.id);
      navigate("/tasks", { replace: true });
    }, "Unable to delete the task. Please try again.");
  }

  async function handleEdit(fields) {
    setTask(await updateTask(task.id, fields));
    setIsEditing(false);
  }

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
            <dd className={isOverdue(task) ? "overdue" : undefined}>
              {formatDueDate(task.due_date)}
              {isOverdue(task) && " (overdue)"}
            </dd>
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
          {actionError && <ErrorMessage message={actionError} />}
          <div className="task-card-actions">
            <button
              type="button"
              className="button button-primary"
              disabled={isBusy}
              onClick={handleToggleComplete}
            >
              {task.completed ? "Mark incomplete" : "Mark complete"}
            </button>
            <button
              type="button"
              className="button"
              disabled={isBusy}
              onClick={() => {
                setActionError(null);
                setIsEditing(true);
              }}
            >
              Edit
            </button>
            <button type="button" className="button button-danger" disabled={isBusy} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </article>
      )}
      {isEditing && task && (
        <Modal title="Edit task" onClose={() => setIsEditing(false)}>
          <TaskForm task={task} onSubmit={handleEdit} onCancel={() => setIsEditing(false)} />
        </Modal>
      )}
    </section>
  );
}
