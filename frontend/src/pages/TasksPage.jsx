import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createTask, updateTask } from "../api/tasks.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Modal from "../components/Modal.jsx";
import TaskFilters, { FILTER_NAMES } from "../components/TaskFilters.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import useTaskActions from "../hooks/useTaskActions.js";
import useTaskList from "../hooks/useTaskList.js";

export default function TasksPage() {
  // Filters live in the URL so a filtered view can be refreshed or shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(
    FILTER_NAMES.map((name) => [name, searchParams.get(name) ?? ""]),
  );

  const { tasks, setTasks, isLoading, error, reload } = useTaskList(filters);
  const { busyTaskIds, actionError, clearActionError, toggleComplete, removeTask, replaceTask } =
    useTaskActions(setTasks);
  // null when closed, otherwise { task } (task is undefined when creating).
  const [formState, setFormState] = useState(null);

  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value === "") {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    // The backend only accepts "order" together with "sort".
    if (name === "sort" && value === "") {
      next.delete("order");
    }
    setSearchParams(next, { replace: true });
  }

  async function handleSubmit(fields) {
    if (formState.task) {
      replaceTask(await updateTask(formState.task.id, fields));
    } else {
      await createTask(fields);
      reload();
    }
    setFormState(null);
  }

  const hasFilters = FILTER_NAMES.some((name) => filters[name] !== "");

  return (
    <section className="page">
      <div className="page-header">
        <h1>Tasks</h1>
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            clearActionError();
            setFormState({});
          }}
        >
          Add task
        </button>
      </div>

      <TaskFilters
        values={filters}
        onChange={updateFilter}
        onClear={() => setSearchParams({}, { replace: true })}
      />

      {actionError && <ErrorMessage message={actionError} />}

      {isLoading && <LoadingState message="Loading tasks..." />}
      {!isLoading && error && (
        <ErrorMessage
          message={
            error.status === 400 ? error.message : "Unable to load tasks. Please try again."
          }
          onRetry={error.status === 400 ? undefined : reload}
        />
      )}
      {!isLoading && !error && (
        <TaskList
          tasks={tasks}
          emptyMessage={hasFilters ? "No tasks match these filters." : "No tasks yet. Add your first task."}
          busyTaskIds={busyTaskIds}
          onToggleComplete={toggleComplete}
          onEdit={(task) => {
            clearActionError();
            setFormState({ task });
          }}
          onDelete={removeTask}
        />
      )}

      {formState && (
        <Modal title={formState.task ? "Edit task" : "Add task"} onClose={() => setFormState(null)}>
          <TaskForm
            task={formState.task}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}
    </section>
  );
}
