import { useCallback, useEffect, useState } from "react";
import { listTasks } from "../api/tasks.js";

// Loads tasks for the given query and reloads whenever the query changes.
// `setTasks` lets pages apply successful edits without a full reload.
export default function useTaskList(query) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    listTasks(JSON.parse(queryKey), { signal: controller.signal })
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
  }, [queryKey, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { tasks, setTasks, isLoading, error, reload };
}
