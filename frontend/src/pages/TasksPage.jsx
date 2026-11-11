import { useEffect, useState } from "react";
import { listTasks } from "../api/tasks.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import LoadingState from "../components/LoadingState.jsx";
import TaskList from "../components/TaskList.jsx";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    listTasks({ signal: controller.signal })
      .then((loadedTasks) => {
        setTasks(loadedTasks);
        setIsLoading(false);
      })
      .catch((loadError) => {
        if (loadError.name === "AbortError") {
          return;
        }
        console.error(loadError);
        setError(loadError);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return (
    <section className="page">
      <h1>Tasks</h1>
      {isLoading && <LoadingState message="Loading tasks..." />}
      {!isLoading && error && (
        <ErrorMessage
          message="Unable to load tasks. Please try again."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      )}
      {!isLoading && !error && <TaskList tasks={tasks} />}
    </section>
  );
}
