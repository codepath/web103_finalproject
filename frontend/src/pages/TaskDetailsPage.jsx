import { useParams } from "react-router-dom";

export default function TaskDetailsPage() {
  const { taskId } = useParams();

  return (
    <section className="page">
      <h1>Task #{taskId}</h1>
      <p className="page-placeholder">Task details will appear here.</p>
    </section>
  );
}
