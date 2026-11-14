
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { api } from "../api.js";

import PageHeader from "../components/PageHeader.jsx";

import "../styles/planner.css";

// ==========================================
// MEAL PLANNER SETTINGS
// ==========================================

const SLOTS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

// Convert a local date to YYYY-MM-DD.

function dateKey(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Find Monday of the current week.

function monday() {
  const date = new Date();

  date.setHours(12, 0, 0, 0);

  date.setDate(
    date.getDate() -
    ((date.getDay() + 6) % 7)
  );

  return date;
}

// ==========================================
// MAIN MEAL PLANNER
// ==========================================

export default function MealPlanner() {

  const [week, setWeek] =
    useState(monday);

  const [entries, setEntries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [reload, setReload] =
    useState(0);

  const [target, setTarget] =
    useState("");

  const drag = useRef(null);

  const lock = useRef(false);

  const start = dateKey(week);

  // Create seven days for this week.

  const days = Array.from(
    { length: 7 },

    (_, index) => {
      const date = new Date(week);

      date.setDate(
        date.getDate() + index
      );

      return date;
    }
  );

  // ========================================
  // LOAD THE WEEKLY MEAL PLAN
  // ========================================

  useEffect(() => {

    let active = true;

    setLoading(true);

    setError("");

    api.get(`/meal-plan?start=${start}`)

      .then((rows) => {

        if (active) {
          setEntries(rows);
        }
      })

      .catch((error) => {

        if (active) {

          setEntries([]);

          setError(error.message);
        }
      })

      .finally(() => {

        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };

  }, [start, reload]);

  // ========================================
  // NAVIGATE BETWEEN WEEKS
  // ========================================

  function shift(direction) {

    setWeek((previous) => {

      const date = new Date(previous);

      date.setDate(
        date.getDate() + direction * 7
      );

      return date;
    });
  }

  // ========================================
  // MOVE A MEAL
  // ========================================

  async function move(id, date, slot) {

    if (lock.current) return;

    const original = entries.find(
      (meal) => meal.id === id
    );

    if (
      !original ||

      (
        original.planned_date === date &&

        original.meal_type === slot
      )
    ) {
      return;
    }

    lock.current = true;

    setBusy(true);

    setError("");

    try {

      const updated = await api.patch(
        `/meal-plan/${id}`,

        {
          planned_date: date,

          meal_type: slot,
        }
      );

      setEntries((previous) =>

        previous.map((meal) =>

          meal.id === id

            ? updated

            : meal
        )
      );

    } catch (error) {

      setError(error.message);

    } finally {

      lock.current = false;

      setBusy(false);
    }
  }

  // ========================================
  // REMOVE A MEAL
  // ========================================

  async function remove(id) {

    if (
      lock.current ||

      !window.confirm(
        "Remove this meal?"
      )
    ) {
      return;
    }

    lock.current = true;

    setBusy(true);

    setError("");

    try {

      await api.del(
        `/meal-plan/${id}`
      );

      setEntries((previous) =>

        previous.filter(
          (meal) => meal.id !== id
        )
      );

    } catch (error) {

      setError(error.message);

    } finally {

      lock.current = false;

      setBusy(false);
    }
  }

  // ========================================
  // DRAG AND DROP FUNCTIONS
  // ========================================

  function startDrag(event, meal) {

    if (busy || lock.current) {

      event.preventDefault();

      return;
    }

    drag.current = meal.id;

    event.dataTransfer.setData(
      "text/plain",
      String(meal.id)
    );

    event.dataTransfer.effectAllowed =
      "move";
  }

  function endDrag() {

    drag.current = null;

    setTarget("");
  }

  function dragOver(event, key) {

    if (
      drag.current === null ||
      lock.current
    ) {
      return;
    }

    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setTarget(key);
  }

  function dragLeave(event, key) {

    if (
      !event.currentTarget.contains(
        event.relatedTarget
      )
    ) {

      setTarget((previous) =>

        previous === key

          ? ""

          : previous
      );
    }
  }

  function dropMeal(event, date, slot) {

    event.preventDefault();

    const id = drag.current;

    endDrag();

    if (id !== null) {

      move(
        id,
        date,
        slot
      );
    }
  }

  // ========================================
  // RENDER THE WEEKLY CALENDAR
  // ========================================

  return (
    <>

      <PageHeader
        title="Weekly Meal Planner"

        subtitle="Drag meals between days and meal times."
      />

      {/* CALENDAR CONTROLS */}

      <div className="planner-toolbar">

        <button
          type="button"

          className="btn"

          disabled={busy}

          onClick={() => shift(-1)}
        >
          ← Previous
        </button>

        <strong>
          {start} – {dateKey(days[6])}
        </strong>

        <button
          type="button"

          className="btn"

          disabled={busy}

          onClick={() => shift(1)}
        >
          Next →
        </button>

        <button
          type="button"

          className="btn"

          disabled={busy}

          onClick={() =>
            setWeek(monday())
          }
        >
          This week
        </button>

        <button
          type="button"

          className="btn"

          disabled={busy}

          onClick={() =>
            setReload(
              (previous) => previous + 1
            )
          }
        >
          Refresh
        </button>

      </div>

      <p className="muted">
        Drag meals between slots or use the move
        menus for keyboard and touch.
      </p>

      {/* ERROR MESSAGE */}

      {error && (

        <p
          className="error"

          role="alert"
        >
          {error}
        </p>

      )}

      {busy && (

        <p role="status">
          Saving changes...
        </p>

      )}

      {/* CALENDAR DAYS */}

      {loading ? (

        <p>
          Loading your meal plan...
        </p>

      ) : (

        <div className="planner-grid">

          {days.map((day) => {

            const date = dateKey(day);

            const isToday =
              date === dateKey(new Date());

            return (
              <section
                key={date}

                className={`planner-day ${
                  isToday
                    ? "planner-today"
                    : ""
                }`}
              >

                {/* DAY HEADER */}

                <header className="planner-day-header">

                  <h3>

                    {day.toLocaleDateString(
                      "en-US",

                      {
                        weekday: "long",
                      }
                    )}

                  </h3>

                  <span>
                    {date}
                  </span>

                </header>

                {/* BREAKFAST, LUNCH, DINNER, SNACK */}

                {SLOTS.map((slot) => {

                  const key = date + slot;

                  const meals = entries.filter(

                    (meal) =>

                      meal.planned_date === date &&

                      meal.meal_type === slot
                  );

                  return (
                    <div
                      key={slot}

                      className={`pw-drop ${
                        target === key
                          ? "pw-drop-active"
                          : ""
                      }`}

                      onDragOver={(event) =>
                        dragOver(event, key)
                      }

                      onDragLeave={(event) =>
                        dragLeave(event, key)
                      }

                      onDrop={(event) =>
                        dropMeal(
                          event,
                          date,
                          slot
                        )
                      }
                    >

                      <h4>
                        {slot}
                      </h4>

                      {!meals.length && (

                        <small className="muted">
                          Drop a meal here
                        </small>

                      )}

                      {/* MEAL CARDS */}

                      {meals.map((meal) => (

                        <article
                          key={meal.id}

                          className="planner-meal"

                          draggable={!busy}

                          onDragStart={(event) =>
                            startDrag(
                              event,
                              meal
                            )
                          }

                          onDragEnd={endDrag}
                        >

                          {meal.image_url && (

                            <img
                              src={meal.image_url}

                              alt={meal.title}

                              draggable={false}

                              loading="lazy"
                            />

                          )}

                          <div className="planner-meal-body">

                            <h4>
                              {meal.title}
                            </h4>

                            {/* MOVE TO ANOTHER DAY */}

                            <label>

                              Day

                              <select
                                value={meal.planned_date}

                                disabled={busy}

                                aria-label={`Move ${meal.title} to another day`}

                                onChange={(event) =>

                                  move(
                                    meal.id,

                                    event.target.value,

                                    meal.meal_type
                                  )
                                }
                              >

                                {days.map((option) => (

                                  <option
                                    key={dateKey(option)}

                                    value={dateKey(option)}
                                  >

                                    {option.toLocaleDateString(
                                      "en-US",

                                      {
                                        weekday: "short",
                                      }
                                    )}

                                  </option>

                                ))}

                              </select>

                            </label>

                            {/* CHANGE MEAL TYPE */}

                            <label>

                              Meal

                              <select
                                value={meal.meal_type}

                                disabled={busy}

                                aria-label={`Change meal type for ${meal.title}`}

                                onChange={(event) =>

                                  move(
                                    meal.id,

                                    meal.planned_date,

                                    event.target.value
                                  )
                                }
                              >

                                {SLOTS.map((option) => (

                                  <option
                                    key={option}

                                    value={option}
                                  >
                                    {option}
                                  </option>

                                ))}

                              </select>

                            </label>

                            {/* REMOVE MEAL */}

                            <button
                              type="button"

                              className="planner-remove"

                              disabled={busy}

                              onClick={() =>
                                remove(meal.id)
                              }
                            >
                              Remove
                            </button>

                          </div>

                        </article>

                      ))}

                    </div>
                  );
                })}

              </section>
            );
          })}

        </div>
      )}

    </>
  );
}

