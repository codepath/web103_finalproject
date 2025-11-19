import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function FinishedTimerView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const habit = state?.habit;
  const minutes = state?.minutes ?? 0;
  const pointsEarned = state?.pointsEarned ?? minutes;

  if (!habit) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Timer Finished</h1>
        <p>Could not load habit details, but your session is done.</p>
        <button onClick={() => navigate("/habits")}>Back to Habits</button>
      </div>
    );
  }

  const handleOk = () => {
    navigate("/habits");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{habit.title}</h1>
      <p>Done!</p>
      <p>+{pointsEarned} pts!</p>
      <p>Good job!</p>
      <button onClick={handleOk}>Ok</button>
    </div>
  );
}
