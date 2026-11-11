import TaskCard from "./TaskCard.jsx";

export default function TaskList({
  tasks,
  emptyMessage = "No tasks yet.",
  busyTaskIds = [],
  onToggleComplete,
  onEdit,
  onDelete,
}) {
  if (tasks.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            isBusy={busyTaskIds.includes(task.id)}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
