// client/src/pages/TimerView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";   // whatever file you put UserContext in

export default function TimerView() {
  const { id } = useParams();             // habit id from route /habit/:id/timer
  const navigate = useNavigate();
  const { points, setPoints } = useUser(); // points shown in header

  const [minutesInput, setMinutesInput] = useState("20");
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [startedMinutes, setStartedMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [status, setStatus] = useState("");

  // format MM:SS
  const displayMinutes = Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(1, "0");
  const displaySeconds = (secondsRemaining % 60).toString().padStart(2, "0");

  function handleStart() {
    const mins = parseInt(minutesInput, 10);
    if (!Number.isFinite(mins) || mins <= 0) {
      alert("Enter a positive number of minutes");
      return;
    }
    setStartedMinutes(mins);
    setSecondsRemaining(mins * 60);
    setHasCompleted(false);
    setIsRunning(true);
    setStatus("");
  }

  function handleCancel() {
    setIsRunning(false);
    setSecondsRemaining(0);
    setStatus("Timer cancelled");
  }

  async function completeHabit() {
    // prevent double calls
    if (hasCompleted) return;
    setHasCompleted(true);
    setIsRunning(false);

    try {
      const res = await fetch(
        `http://localhost:3001/api/habits/${id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ minutes: startedMinutes || 1 }), // award at least something
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to complete habit:", errData);
        alert(errData.error || "Server error when completing habit.");
        return;
      }

      const data = await res.json();
      console.log("Complete response:", data);

      if (setPoints && typeof data.totalPoints === "number") {
        setPoints(data.totalPoints);
      }

      setStatus(
        `Done! +${data.pointsEarned ?? startedMinutes} pts. Total: ${
          data.totalPoints ?? "?"
        }`
      );
    } catch (err) {
      console.error("Error calling /complete:", err);
      alert("Network error when completing habit.");
    }
  }

  // countdown effect
  useEffect(() => {
    if (!isRunning) return;

    if (secondsRemaining <= 0) {
      // reached zero → finish and award points once
      completeHabit();
      return;
    }

    const id = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
    // we deliberately don't include completeHabit in deps to avoid re-creating interval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, secondsRemaining]);

  // debug: finish immediately button
  async function handleFinishNow() {
    if (!startedMinutes) {
      const mins = parseInt(minutesInput, 10);
      if (Number.isFinite(mins) && mins > 0) {
        setStartedMinutes(mins);
      } else {
        setStartedMinutes(1);
      }
    }
    await completeHabit();
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Timer</h1>

      <label>
        Minutes:
        <input
          type="number"
          min="1"
          value={minutesInput}
          onChange={(e) => setMinutesInput(e.target.value.replace(/^0+/, ""))}
          disabled={isRunning}
        />
      </label>

      <div style={{ fontSize: "2rem", margin: "1rem 0" }}>
        {displayMinutes}:{displaySeconds} remaining
      </div>

      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={handleCancel} disabled={!isRunning}>
        Cancel
      </button>

      <button onClick={handleFinishNow} style={{ marginLeft: "1rem" }}>
        Finish Now
      </button>

      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}

      <button onClick={() => navigate("/habits")} style={{ marginTop: "1rem" }}>
        Back to Habits
      </button>
    </div>
  );
}
