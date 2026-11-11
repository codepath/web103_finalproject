import TaskCard from "./TaskCard.jsx";

export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  );
}
