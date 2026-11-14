
import { useState } from "react";
import { api } from "../api.js";

export default function ChatWeeklyPlan({ plan }) {
  const [loading, setLoading] = useState(false);

  const [saved, setSaved] = useState(false);

  const [generated, setGenerated] =
    useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // Convert YYYY-MM-DD into a readable date
  function formatDate(date) {
    return new Date(
      date + "T00:00:00Z"
    ).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  // Confirm and save weekly meal plan
  async function savePlan() {
    if (loading || saved) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await api.post(
        "/chat/weekly-plan",
        {
          start: plan.start,
          entries: plan.entries,
        }
      );

      setSaved(true);

      setMessage(
        `${result.added} dinners added. ` +
        `${result.skipped} occupied dinner slots preserved.`
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to save weekly plan."
      );
    } finally {
      setLoading(false);
    }
  }

  // Generate shopping list for this week
  async function generateShopping() {
    if (loading || generated) return;

    const confirmed = window.confirm(
      "Generate a shopping list for these seven days?\n\n" +
      "This replaces previously generated shopping items. " +
      "Manually added shopping items will be preserved."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await api.post(
        "/shopping-list/generate",
        {
          start: plan.start,
        }
      );

      setGenerated(true);

      setMessage(
        `✓ Shopping list generated! ` +
        `${result.generated} items needed.`
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to generate shopping list."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat-weekly-plan">

      {/* HEADER */}

      <h4>📅 Your Weekly Dinner Plan</h4>

      <p className="chat-recipe-meta">
        Starting {formatDate(plan.start)}
      </p>

      {/* WEEKLY RECIPE CARDS */}

      {plan.entries.map((entry) => (
        <div
          className="chat-weekly-meal"
          key={entry.planned_date}
        >
          {entry.image_url && (
            <img
              src={entry.image_url}
              alt={entry.title}
              loading="lazy"
            />
          )}

          <div className="chat-weekly-meal-info">
            <p className="chat-weekly-date">
              {formatDate(entry.planned_date)}
            </p>

            <strong>{entry.title}</strong>

            <p className="chat-recipe-meta">
              {entry.have_count}/
              {entry.total_count} ingredients
              in pantry
            </p>

            {entry.missing_count > 0 && (
              <p className="chat-weekly-missing">
                {entry.missing_count} missing
                ingredient
                {entry.missing_count === 1
                  ? ""
                  : "s"}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* EXISTING MEALS */}

      {plan.skippedDates?.length > 0 && (
        <div className="chat-weekly-notice">
          <strong>Existing meals preserved</strong>

          <p>
            {plan.skippedDates.length} days
            already have dinners planned.
          </p>

          <p>
            {plan.skippedDates
              .map(formatDate)
              .join(", ")}
          </p>
        </div>
      )}

      {/* NO OPEN DINNER SLOTS */}

      {plan.entries.length === 0 && (
        <p className="chat-recipe-meta">
          All seven days already have dinners
          planned.
        </p>
      )}

      {/* SAVE PLAN BUTTON */}

      {plan.entries.length > 0 && (
        <button
          type="button"
          className="chat-shopping-confirm"
          onClick={savePlan}
          disabled={loading || saved}
        >
          {saved
            ? "✓ Weekly Plan Saved"
            : loading
            ? "Please wait..."
            : "Confirm & Save Weekly Plan"}
        </button>
      )}

      {/* GENERATE SHOPPING LIST BUTTON */}

      {(saved || plan.entries.length === 0) && (
        <button
          type="button"
          className="chat-shopping-btn"
          onClick={generateShopping}
          disabled={loading || generated}
        >
          {generated
            ? "✓ Shopping List Generated"
            : "🛒 Generate Shopping List"}
        </button>
      )}

      {/* SUCCESS MESSAGE */}

      {message && (
        <p
          className="chat-shopping-success"
          role="status"
        >
          {message}
        </p>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <p
          className="chat-shopping-error"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* HELPER TEXT */}

      <p className="chat-weekly-note">
        Pantry matches show ingredient availability.
        Your shopping list calculates the quantities
        needed for your planned meals.
      </p>

    </section>
  );
}
