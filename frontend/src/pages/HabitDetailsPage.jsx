import { useParams } from "react-router-dom";

export default function HabitDetailsPage() {
  const { habitId } = useParams();

  return (
    <section className="page">
      <h1>Habit #{habitId}</h1>
      <p className="page-placeholder">Habit details and completion history will appear here.</p>
    </section>
  );
}
