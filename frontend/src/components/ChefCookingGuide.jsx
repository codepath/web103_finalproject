
import { useEffect, useRef, useState } from "react";
import { getRecipes, getRecipe } from "../api.js";

function splitInstructions(instructions) {
  const text = String(instructions || "").trim();

  if (!text) return [];

  // Keep the original recipe instructions.
  // Split them into paragraphs, numbered steps,
  // or sentences without inventing new instructions.

  const paragraphs = text
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    return paragraphs;
  }

  const numbered = text
    .split(/(?=\b\d+[.)]\s+)/)
    .map((step) => step.trim())
    .filter(Boolean);

  if (numbered.length > 1) {
    return numbered;
  }

  return (
    text.match(/[^.!?]+[.!?]*/g) || [text]
  )
    .map((step) => step.trim())
    .filter(Boolean);
}

export default function ChefCookingGuide({
  initialRecipe,
  onClose,
  onComplete,
  onSpeak,
  onStopSpeaking,
  voiceSupported,
  preferences,
}) {
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState(
    initialRecipe || null
  );

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [minutes, setMinutes] = useState("5");

  const [deadline, setDeadline] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [timerFinished, setTimerFinished] =
    useState(false);

  const requestId = useRef(0);
  const mounted = useRef(true);

  const steps = splitInstructions(
    recipe?.instructions
  );

  const remaining = deadline
    ? Math.max(
        0,
        Math.ceil((deadline - now) / 1000)
      )
    : 0;

  useEffect(() => {
    mounted.current = true;

    getRecipes()
      .then((rows) => {
        if (mounted.current) {
          setRecipes(rows);
        }
      })
      .catch((err) => {
        if (mounted.current) {
          setError(err.message);
        }
      });

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const time = Date.now();
      setNow(time);

      if (time >= deadline) {
        setDeadline(null);
        setTimerFinished(true);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [deadline]);

  async function chooseRecipe(id) {
    if (deadline) {
      const proceed = window.confirm(
        "Changing recipes will stop your current timer. Continue?"
      );

      if (!proceed) return;
    }

    const currentRequest = ++requestId.current;

    setDeadline(null);
    setTimerFinished(false);
    setStep(0);
    setError("");
    onStopSpeaking?.();

    if (!id) {
      setRecipe(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getRecipe(id);

      if (
        mounted.current &&
        currentRequest === requestId.current
      ) {
        setRecipe(data);
      }
    } catch (err) {
      if (
        mounted.current &&
        currentRequest === requestId.current
      ) {
        setError(err.message);
      }
    } finally {
      if (
        mounted.current &&
        currentRequest === requestId.current
      ) {
        setLoading(false);
      }
    }
  }

  function startTimer() {
    const duration = Number(minutes);

    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      duration > 180
    ) {
      setError(
        "Enter a timer between 0.1 and 180 minutes."
      );
      return;
    }

    setError("");
    setTimerFinished(false);

    const time = Date.now();

    setNow(time);
    setDeadline(time + duration * 60000);
  }

  function stopTimer() {
    setDeadline(null);
    setTimerFinished(false);
  }

  function closeGuide() {
    if (
      deadline &&
      !window.confirm(
        "Close cooking mode and stop your timer?"
      )
    ) {
      return;
    }

    onStopSpeaking?.();
    onClose();
  }

  function finishCooking() {
    if (
      deadline &&
      !window.confirm(
        "Finish cooking and stop your remaining timer?"
      )
    ) {
      return;
    }

    onStopSpeaking?.();
    onComplete();
  }

  return (
    <section
      className="chef-guide"
      role="dialog"
      aria-label="PrepWise guided cooking"
    >
      <header className="chef-guide-header">
        <div className="chef-guide-pot">
          <span className="chef-steam steam-one">
            ~
          </span>
          <span className="chef-steam steam-two">
            ~
          </span>
          <span className="chef-stirring-spoon">
            🥄
          </span>
          <span>🍲</span>
        </div>

        <div>
          <h3>Chef's Cooking Mode</h3>
          <small>One step at a time</small>
        </div>

        <button
          type="button"
          className="chef-guide-close"
          aria-label="Close cooking guide"
          onClick={closeGuide}
        >
          ×
        </button>
      </header>

      <div className="chef-guide-body">
        <label htmlFor="chef-recipe">
          Choose a recipe
        </label>

        <select
          id="chef-recipe"
          value={recipe?.id || ""}
          disabled={loading}
          onChange={(e) =>
            chooseRecipe(e.target.value)
          }
        >
          <option value="">
            Select a recipe...
          </option>

          {recipes.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.title}
            </option>
          ))}
        </select>

        {error && (
          <p className="chef-guide-error" role="alert">
            {error}
          </p>
        )}

        {loading && <p>Loading recipe...</p>}

        {recipe && !loading && (
          <>
            {recipe.image_url && (
              <img
                className="chef-guide-image"
                src={recipe.image_url}
                alt={recipe.title}
              />
            )}

            <h3>{recipe.title}</h3>

            <details className="chef-guide-ingredients">
              <summary>Review ingredients</summary>

              <ul>
                {recipe.ingredients?.map(
                  (item, index) => (
                    <li key={item.id ?? index}>
                      {item.quantity} {item.unit}{" "}
                      {item.name}
                    </li>
                  )
                )}
              </ul>
            </details>

            {preferences?.allergies?.length > 0 && (
              <p className="chef-guide-warning">
                Your saved ingredient restrictions:
                {" "}
                {preferences.allergies.join(", ")}.
                Verify every ingredient before cooking.
                This guide does not certify allergy safety.
              </p>
            )}

            {steps.length > 0 ? (
              <>
                <div className="chef-step-progress">
                  Step {step + 1} of {steps.length}
                </div>

                <progress
                  value={step + 1}
                  max={steps.length}
                />

                <div className="chef-current-step">
                  {steps[step]}
                </div>

                {voiceSupported && (
                  <button
                    type="button"
                    className="chef-secondary-btn"
                    onClick={() =>
                      onSpeak?.(steps[step])
                    }
                  >
                    🔊 Read this step
                  </button>
                )}

                <div className="chef-guide-navigation">
                  <button
                    type="button"
                    className="chef-secondary-btn"
                    disabled={step === 0}
                    onClick={() => {
                      onStopSpeaking?.();
                      setStep((n) => n - 1);
                    }}
                  >
                    Previous
                  </button>

                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      className="chef-primary-btn"
                      onClick={() => {
                        onStopSpeaking?.();
                        setStep((n) => n + 1);
                      }}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="chef-primary-btn"
                      onClick={finishCooking}
                    >
                      Finish Cooking ✓
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p>
                Cooking instructions are not available
                for this recipe.
              </p>
            )}

            <div className="chef-timer">
              <h4>⏱ Cooking Timer</h4>

              {deadline ? (
                <>
                  <div className="chef-timer-clock">
                    {String(
                      Math.floor(remaining / 60)
                    ).padStart(2, "0")}
                    :
                    {String(
                      remaining % 60
                    ).padStart(2, "0")}
                  </div>

                  <button
                    type="button"
                    className="chef-secondary-btn"
                    onClick={stopTimer}
                  >
                    Stop Timer
                  </button>
                </>
              ) : (
                <div className="chef-timer-controls">
                  <label htmlFor="chef-minutes">
                    Minutes
                  </label>

                  <input
                    id="chef-minutes"
                    type="number"
                    min="0.1"
                    max="180"
                    step="0.1"
                    value={minutes}
                    onChange={(e) =>
                      setMinutes(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="chef-primary-btn"
                    onClick={startTimer}
                  >
                    Start
                  </button>
                </div>
              )}

              {timerFinished && (
                <p
                  className="chef-timer-finished"
                  role="status"
                >
                  🔔 Time's up! Check your food.
                </p>
              )}

              <small>
                Set the timer according to the recipe.
                Check actual food doneness.
                Keep this page open.
              </small>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
