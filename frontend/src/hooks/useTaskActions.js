import { useState } from "react";
import { deleteTask, updateTask } from "../api/tasks.js";
import { describeTaskActionError } from "../components/actionErrors.js";

// Same-page task actions (complete/uncomplete, delete) that update the list
// held by useTaskList. Failures are shown through `actionError`.
export default function useTaskActions(setTasks) {
  const [busyTaskIds, setBusyTaskIds] = useState([]);
  const [actionError, setActionError] = useState(null);

  async function runForTask(taskId, action, fallbackMessage) {
    setBusyTaskIds((ids) => [...ids, taskId]);
    setActionError(null);

    try {
      await action();
    } catch (error) {
      console.error(error);
      setActionError(describeTaskActionError(error, fallbackMessage));
    } finally {
      setBusyTaskIds((ids) => ids.filter((id) => id !== taskId));
    }
  }

  function replaceTask(updatedTask) {
    setTasks((tasks) => tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  }

  function toggleComplete(task) {
    return runForTask(
      task.id,
      async () => replaceTask(await updateTask(task.id, { completed: !task.completed })),
      "Unable to update the task. Please try again.",
    );
  }

  function removeTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return Promise.resolve();
    }

    return runForTask(
      task.id,
      async () => {
        await deleteTask(task.id);
        setTasks((tasks) => tasks.filter((existing) => existing.id !== task.id));
      },
      "Unable to delete the task. Please try again.",
    );
  }

  return {
    busyTaskIds,
    actionError,
    clearActionError: () => setActionError(null),
    toggleComplete,
    removeTask,
    replaceTask,
  };
}
