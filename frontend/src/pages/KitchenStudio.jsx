
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  api,
  getRecipes,
  getRecipe,
} from "../api.js";

import PageHeader from "../components/PageHeader.jsx";
import GroceryScanner from "../components/GroceryScanner.jsx";

// ==========================================
// SETTINGS
// ==========================================

const TABS = [
  ["cook", "🍳 Cook & Consume"],
  ["scan", "📸 Grocery Scanner"],
  ["nutrition", "🥗 Nutrition"],
  ["budget", "💰 Budget"],
  ["activity", "📊 Activity & Achievements"],
];

const MACROS = [
  ["calories", "Calories", "kcal"],
  ["protein", "Protein", "g"],
  ["carbs", "Carbs", "g"],
  ["fat", "Fat", "g"],
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function dateKey(date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function weekKey() {
  const date = new Date();

  date.setDate(
    date.getDate() -
      ((date.getDay() + 6) % 7)
  );

  return dateKey(date);
}

function round(value) {
  return Math.round(
    (Number(value) + Number.EPSILON) * 100
  ) / 100;
}

function format(value) {
  return round(value).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 2,
    }
  );
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function validPositive(value) {
  return (
    Number.isFinite(Number(value)) &&
    Number(value) > 0
  );
}

function emptyNutrition() {
  return {
    label: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    source: "Nutrition label",
  };
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function Card({ title, children }) {
  return (
    <section className="pw-kitchen-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="pw-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = "0.01",
  max = "100000",
  required = true,
  disabled = false,
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        step="0.01"
        min={min}
        max={max}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </Field>
  );
}

// ==========================================
// KITCHEN STUDIO
// ==========================================

export default function KitchenStudio() {
  const [params, setParams] = useSearchParams();

  const requestedTab = params.get("tab");

  const tab = TABS.some(
    ([id]) => id === requestedTab
  )
    ? requestedTab
    : "cook";

  const recipeId =
    params.get("recipe") || "";

  const today = dateKey(new Date());

  const week = weekKey();

  // ========================================
  // APPLICATION DATA
  // ========================================

  const [summary, setSummary] =
    useState(null);

  const [pantry, setPantry] =
    useState([]);

  const [recipes, setRecipes] =
    useState([]);

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [refresh, setRefresh] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const lock = useRef(false);

  const goalsLoaded = useRef(false);

  // ========================================
  // COOKING STATE
  // ========================================

  const [recipe, setRecipe] =
    useState(null);

  const [servings, setServings] =
    useState("1");

  const [amounts, setAmounts] =
    useState({});

  const [confirmed, setConfirmed] =
    useState(false);

  const cookId = useRef(null);

  // ========================================
  // NUTRITION STATE
  // ========================================

  const [nutrition, setNutrition] =
    useState(emptyNutrition);

  const [goals, setGoals] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  // ========================================
  // BUDGET STATE
  // ========================================

  const [budget, setBudget] =
    useState("");

  const [expense, setExpense] =
    useState({
      label: "",
      amount: "",
    });

  // ========================================
  // FOOD WASTE STATE
  // ========================================

  const [waste, setWaste] =
    useState({
      pantry_id: "",
      quantity: "",
      note: "",
    });

  // ========================================
  // LOAD KITCHEN DATA
  // ========================================

  useEffect(() => {
    let active = true;

    setLoading(true);

    Promise.all([
      api.get(
        `/kitchen/summary?date=${today}&week=${week}`
      ),

      api.get("/pantry-items"),

      getRecipes(),
    ])
      .then(([data, pantryRows, recipeRows]) => {
        if (!active) return;

        setSummary(data);
        setPantry(pantryRows);
        setRecipes(recipeRows);

        // Don't overwrite goals that the user
        // is currently editing.

        if (!goalsLoaded.current) {
          const saved = data.goals || {};

          setGoals(
            Object.fromEntries(
              MACROS.map(([key]) => [
                key,
                saved[key] ?? "",
              ])
            )
          );

          setBudget(
            saved.weekly_budget ?? ""
          );

          goalsLoaded.current = true;
        }
      })

      .catch((err) => {
        if (active) {
          setError(err.message);
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
  }, [today, week, refresh]);

  // ========================================
  // LOAD THE SELECTED RECIPE
  // ========================================

  useEffect(() => {
    let active = true;

    setConfirmed(false);
    cookId.current = null;

    setRecipe(null);
    setAmounts({});

    if (!recipeId) {
      return;
    }

    getRecipe(recipeId)
      .then((result) => {
        if (!active) return;

        setRecipe(result);

        setServings(
          String(result.servings || 1)
        );

        setAmounts(
          Object.fromEntries(
            (result.ingredients || []).map(
              (item) => [
                item.id,
                String(item.quantity),
              ]
            )
          )
        );
      })

      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      });

    return () => {
      active = false;
    };
  }, [recipeId]);

  // ========================================
  // NAVIGATION
  // ========================================

  function changeTab(value) {
    setError("");
    setNotice("");

    const next = { tab: value };

    if (recipeId) {
      next.recipe = recipeId;
    }

    setParams(next);
  }

  function selectRecipe(id) {
    const next = { tab: "cook" };

    if (id) {
      next.recipe = id;
    }

    setParams(next);
  }

  // ========================================
  // SHARED API REQUEST HANDLER
  // ========================================

  async function run(fn) {
    if (lock.current) return;

    lock.current = true;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await fn();

      setRefresh(
        (previous) => previous + 1
      );

    } catch (err) {
      setError(
        err.message ||
        "Something went wrong."
      );

    } finally {
      lock.current = false;

      setBusy(false);
    }
  }

  // ========================================
  // COOK & CONSUME
  // ========================================

  function changeServings(value) {
    setServings(value);

    setConfirmed(false);

    cookId.current = null;

    if (!recipe || !validPositive(value)) {
      return;
    }

    setAmounts(
      Object.fromEntries(
        recipe.ingredients.map((item) => [
          item.id,

          String(
            round(
              Number(item.quantity) *
                Number(value) /
                Number(recipe.servings || 1)
            )
          ),
        ])
      )
    );
  }

  function cook(event) {
    event.preventDefault();

    if (!confirmed || !recipe) {
      return;
    }

    run(async () => {
      // Keep the same ID on a retry so a
      // cooking session cannot be duplicated.

      if (!cookId.current) {
        cookId.current = crypto.randomUUID();
      }

      const result = await api.post(
        "/kitchen/cook",
        {
          recipe_id: recipe.id,

          servings: Number(servings),

          date: today,

          request_id: cookId.current,

          items: recipe.ingredients.map(
            (item) => ({
              ingredient_id: item.id,

              quantity: Number(
                amounts[item.id]
              ),
            })
          ),
        }
      );

      setNotice(
        result.alreadyRecorded
          ? "This cooking session was already recorded."

          : "Meal recorded! Your pantry has been updated."
      );

      setConfirmed(false);

      cookId.current = null;

      selectRecipe("");
    });
  }

  // ========================================
  // RECEIVE NUTRITION FROM GROCERY SCANNER
  // ========================================

  function receiveNutrition(values) {
    setNutrition(values);

    changeTab("nutrition");

    setNotice(
      "Product nutrition copied! Review the serving and click Log food to save it."
    );
  }

  // ========================================
  // NUTRITION
  // ========================================

  function logNutrition(event) {
    event.preventDefault();

    run(async () => {
      await api.post(
        "/kitchen/nutrition",
        {
          ...nutrition,

          date: today,

          ...Object.fromEntries(
            MACROS.map(([key]) => [
              key,
              Number(nutrition[key]),
            ])
          ),
        }
      );

      setNutrition(emptyNutrition());

      setNotice("Nutrition entry saved.");
    });
  }

  function saveGoals(event) {
    event.preventDefault();

    run(async () => {
      await api.patch(
        "/kitchen/goals",

        Object.fromEntries(
          MACROS.map(([key]) => [
            key,

            goals[key] === ""
              ? null
              : Number(goals[key]),
          ])
        )
      );

      setNotice("Nutrition goals saved.");
    });
  }

  // ========================================
  // GROCERY BUDGET
  // ========================================

  function saveBudget(event) {
    event.preventDefault();

    run(async () => {
      await api.patch(
        "/kitchen/goals",
        {
          weekly_budget:
            budget === ""
              ? null
              : Number(budget),
        }
      );

      setNotice("Weekly budget saved.");
    });
  }

  function addExpense(event) {
    event.preventDefault();

    run(async () => {
      await api.post(
        "/kitchen/expenses",
        {
          label: expense.label,

          amount: Number(expense.amount),

          date: today,
        }
      );

      setExpense({
        label: "",
        amount: "",
      });

      setNotice("Expense recorded.");
    });
  }

  // ========================================
  // FOOD WASTE
  // ========================================

  function recordWaste(event) {
    event.preventDefault();

    if (
      !window.confirm(
        "Record this amount as discarded and deduct it from your pantry?"
      )
    ) {
      return;
    }

    run(async () => {
      await api.post(
        "/kitchen/waste",
        {
          ...waste,

          pantry_id: Number(
            waste.pantry_id
          ),

          quantity: Number(
            waste.quantity
          ),

          date: today,
        }
      );

      setWaste({
        pantry_id: "",
        quantity: "",
        note: "",
      });

      setNotice(
        "Waste logged and pantry updated."
      );
    });
  }

  // ========================================
  // CALCULATE NUTRITION TOTALS
  // ========================================

  const totals = Object.fromEntries(
    MACROS.map(([key]) => [
      key,

      round(
        (summary?.nutrition || []).reduce(
          (sum, entry) =>
            sum + Number(entry[key] || 0),

          0
        )
      ),
    ])
  );

  // ========================================
  // CALCULATE BUDGET TOTALS
  // ========================================

  const spent = round(
    (summary?.expenses || []).reduce(
      (sum, item) =>
        sum + Number(item.amount),

      0
    )
  );

  const weeklyBudget = Number(
    summary?.goals?.weekly_budget || 0
  );

  // ========================================
  // ACHIEVEMENTS
  // ========================================

  const counts = summary?.counts || {};

  const badges = [
    [
      "🥇 First meal",
      counts.cooked >= 1,
      "Record your first cooked meal",
    ],

    [
      "👨‍🍳 Home chef",
      counts.cooked >= 5,
      "Cook five meals",
    ],

    [
      "❤️ Recipe collector",
      counts.saved >= 5,
      "Save five recipes",
    ],

    [
      "📅 Planner",
      counts.planned >= 7,
      "Have seven planned meals",
    ],

    [
      "🌱 Waste aware",
      counts.waste_logs >= 1,
      "Record a discarded ingredient",
    ],

    [
      "🥗 Nutrition tracker",
      counts.nutrition_logs >= 5,
      "Log five nutrition entries",
    ],
  ];

  const wasteItem = pantry.find(
    (item) =>
      String(item.id) === waste.pantry_id
  );

  // ========================================
  // MAIN INTERFACE
  // ========================================

  return (
    <div className="pw-kitchen">

      <PageHeader
        title="Kitchen Studio"

        subtitle="Cook, scan, track and grow your smart kitchen."
      />

      {/* TAB NAVIGATION */}

      <div
        className="pw-kitchen-tabs"
        role="navigation"
        aria-label="Kitchen Studio sections"
      >
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={
              tab === id ? "active" : ""
            }
            aria-current={
              tab === id ? "page" : undefined
            }
            disabled={busy}
            onClick={() => changeTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* STATUS MESSAGES */}

      {error && (
        <p
          className="pw-notice pw-error"
          role="alert"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          className="pw-notice"
          role="status"
        >
          {notice}
        </p>
      )}

      {loading && (
        <p className="muted">
          Updating your kitchen data…
        </p>
      )}

      {/* ==================================
          TAB 1: COOK & CONSUME
      ================================== */}

      {tab === "cook" && (
        <>

          <Card title="Cook & Consume">

            <p>
              Finish cooking first. Then confirm
              the amounts actually used. Every
              ingredient must be available in
              compatible units; nothing is deducted
              if any ingredient is insufficient.
            </p>

            <form onSubmit={cook}>

              <Field label="Recipe">
                <select
                  value={recipeId}
                  disabled={busy}
                  onChange={(event) =>
                    selectRecipe(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Choose a recipe
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
              </Field>

              {recipe && (
                <>

                  <NumberField
                    label="Servings cooked"
                    value={servings}
                    onChange={changeServings}
                    max="100"
                    disabled={busy}
                  />

                  <div className="pw-rows">

                    {recipe.ingredients?.map(
                      (item) => (
                        <div
                          className="pw-ingredient-row"
                          key={item.id}
                        >

                          <strong>
                            {item.name}
                          </strong>

                          <NumberField
                            label={`Actual amount (${item.unit})`}

                            value={
                              amounts[item.id] ?? ""
                            }

                            disabled={busy}

                            onChange={(value) => {
                              setAmounts(
                                (previous) => ({
                                  ...previous,

                                  [item.id]: value,
                                })
                              );

                              setConfirmed(false);

                              cookId.current = null;
                            }}
                          />

                          <span className="muted">
                            Pantry:{" "}

                            {
                              pantry
                                .filter(
                                  (row) =>
                                    row.ingredient_id ===
                                    item.id
                                )
                                .map(
                                  (row) =>
                                    `${row.quantity} ${row.unit}`
                                )
                                .join(", ")

                              || "not recorded"
                            }
                          </span>

                        </div>
                      )
                    )}

                  </div>

                  <label className="pw-check">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      disabled={busy}
                      onChange={(event) =>
                        setConfirmed(
                          event.target.checked
                        )
                      }
                    />

                    I cooked this recipe and confirm
                    these amounts were used.
                  </label>

                  <button
                    className="pw-primary"

                    disabled={
                      busy ||
                      !confirmed ||
                      !recipe.ingredients?.length
                    }
                  >
                    Record meal & update pantry
                  </button>

                </>
              )}

            </form>

          </Card>

          <Card title="Recent cooking history">

            {summary?.cooking?.length ? (

              summary.cooking.map((item) => (
                <div
                  className="pw-list"
                  key={item.id}
                >
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.cooked_on}
                    {" · "}
                    {item.servings} servings
                  </span>
                </div>
              ))

            ) : (
              <p className="muted">
                No cooked meals recorded yet.
              </p>
            )}

          </Card>

        </>
      )}

      {/* ==================================
          TAB 2: GROCERY SCANNER 2.0
      ================================== */}

      <div hidden={tab !== "scan"}>

        <GroceryScanner
          active={tab === "scan"}

          busy={busy}

          run={run}

          setError={setError}

          setNotice={setNotice}

          onNutrition={receiveNutrition}
        />

      </div>

      {/* ==================================
          TAB 3: NUTRITION
      ================================== */}

      {tab === "nutrition" && (
        <>

          <Card title={`Nutrition · ${today}`}>

            <p>
              Track what you actually ate.
              Use the package label or another
              reliable source. Nutrition values
              are not guessed by AI.
            </p>

            <div className="pw-macro-grid">

              {MACROS.map(
                ([key, label, unit]) => {
                  const goal = Number(
                    summary?.goals?.[key]
                  );

                  return (
                    <div key={key}>

                      <span>{label}</span>

                      <strong>
                        {format(totals[key])}
                        {" "}
                        {unit}
                      </strong>

                      {goal > 0 && (
                        <>
                          <progress
                            value={
                              Math.min(
                                totals[key],
                                goal
                              )
                            }
                            max={goal}
                          />

                          <small>
                            {format(goal)}
                            {" "}
                            {unit} goal
                          </small>
                        </>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </Card>

          <div className="pw-kitchen-grid">

            {/* DAILY NUTRITION GOALS */}

            <Card title="Your daily goals">

              <form onSubmit={saveGoals}>

                {MACROS.map(
                  ([key, label, unit]) => (
                    <NumberField
                      key={key}

                      label={`${label} (${unit})`}

                      value={goals[key]}

                      required={false}

                      disabled={busy}

                      max="10000"

                      onChange={(value) =>
                        setGoals(
                          (previous) => ({
                            ...previous,

                            [key]: value,
                          })
                        )
                      }
                    />
                  )
                )}

                <p className="muted">
                  Optional self-selected goals;
                  not medical advice.
                </p>

                <button
                  className="pw-primary"
                  disabled={busy}
                >
                  Save goals
                </button>

              </form>

            </Card>

            {/* LOG FOOD */}

            <Card title="Log food">

              <form onSubmit={logNutrition}>

                <Field label="Food / portion description">
                  <input
                    value={nutrition.label}

                    required

                    maxLength={150}

                    disabled={busy}

                    onChange={(event) =>
                      setNutrition(
                        (previous) => ({
                          ...previous,

                          label: event.target.value,
                        })
                      )
                    }
                  />
                </Field>

                {MACROS.map(
                  ([key, label, unit]) => (
                    <NumberField
                      key={key}

                      label={`${label} (${unit})`}

                      min="0"

                      value={nutrition[key]}

                      disabled={busy}

                      onChange={(value) =>
                        setNutrition(
                          (previous) => ({
                            ...previous,

                            [key]: value,
                          })
                        )
                      }
                    />
                  )
                )}

                <Field label="Source (label, database, etc.)">
                  <input
                    value={nutrition.source}

                    required

                    maxLength={200}

                    disabled={busy}

                    onChange={(event) =>
                      setNutrition(
                        (previous) => ({
                          ...previous,

                          source: event.target.value,
                        })
                      )
                    }
                  />
                </Field>

                <button
                  className="pw-primary"
                  disabled={busy}
                >
                  Log food
                </button>

              </form>

            </Card>

          </div>

          {/* TODAY'S FOOD LOG */}

          <Card title="Today's food log">

            {summary?.nutrition?.length ? (

              summary.nutrition.map((item) => (
                <div
                  className="pw-list"
                  key={item.id}
                >
                  <div>
                    <strong>
                      {item.label}
                    </strong>

                    <small>
                      {format(item.calories)} kcal
                      {" · "}
                      P {format(item.protein)}g
                      {" · "}
                      C {format(item.carbs)}g
                      {" · "}
                      F {format(item.fat)}g
                      {" · "}
                      {item.source}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn"
                    disabled={busy}
                    onClick={() =>
                      run(() =>
                        api.del(
                          `/kitchen/nutrition/${item.id}`
                        )
                      )
                    }
                  >
                    Remove
                  </button>

                </div>
              ))

            ) : (
              <p>No food entries yet.</p>
            )}

          </Card>

        </>
      )}

      {/* ==================================
          TAB 4: BUDGET
      ================================== */}

      {tab === "budget" && (
        <>

          <Card
            title={`Weekly grocery budget · Week of ${week}`}
          >

            <div className="pw-macro-grid">

              <div>
                <span>Spent</span>

                <strong>
                  {money(spent)}
                </strong>
              </div>

              <div>
                <span>Budget</span>

                <strong>
                  {weeklyBudget > 0
                    ? money(weeklyBudget)
                    : "Not set"}
                </strong>
              </div>

              <div>
                <span>Remaining</span>

                <strong>
                  {weeklyBudget > 0
                    ? money(weeklyBudget - spent)
                    : "—"}
                </strong>
              </div>

            </div>

            {weeklyBudget > 0 && (
              <>
                <progress
                  value={
                    Math.min(
                      spent,
                      weeklyBudget
                    )
                  }
                  max={weeklyBudget}
                />

                {spent > weeklyBudget && (
                  <p className="pw-notice pw-error">
                    You are{" "}
                    {money(spent - weeklyBudget)}
                    {" "}
                    over your weekly grocery budget.
                  </p>
                )}
              </>
            )}

          </Card>

          <div className="pw-kitchen-grid">

            {/* SET BUDGET */}

            <Card title="Set weekly budget">

              <form onSubmit={saveBudget}>

                <NumberField
                  label="Budget (USD)"

                  value={budget}

                  onChange={setBudget}

                  disabled={busy}

                  required={false}
                />

                <button
                  className="pw-primary"
                  disabled={busy}
                >
                  Save budget
                </button>

              </form>

            </Card>

            {/* RECORD EXPENSE */}

            <Card title="Record grocery expense">

              <form onSubmit={addExpense}>

                <Field label="Store or purchase">
                  <input
                    value={expense.label}
                    maxLength={150}
                    required
                    disabled={busy}
                    onChange={(event) =>
                      setExpense(
                        (previous) => ({
                          ...previous,

                          label: event.target.value,
                        })
                      )
                    }
                  />
                </Field>

                <NumberField
                  label="Amount (USD)"

                  value={expense.amount}

                  disabled={busy}

                  onChange={(value) =>
                    setExpense(
                      (previous) => ({
                        ...previous,

                        amount: value,
                      })
                    )
                  }
                />

                <button
                  className="pw-primary"
                  disabled={busy}
                >
                  Add expense
                </button>

              </form>

            </Card>

          </div>

          {/* WEEKLY PURCHASES */}

          <Card title="This week's purchases">

            {summary?.expenses?.length ? (

              summary.expenses.map((item) => (
                <div
                  className="pw-list"
                  key={item.id}
                >
                  <div>
                    <strong>{item.label}</strong>

                    <small>
                      {item.purchased_on}

                      {" · "}

                      {money(item.amount)}
                    </small>
                  </div>

                  <button
                    className="btn"
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      run(() =>
                        api.del(
                          `/kitchen/expenses/${item.id}`
                        )
                      )
                    }
                  >
                    Remove
                  </button>

                </div>
              ))

            ) : (
              <p>
                No expenses recorded yet.
              </p>
            )}

          </Card>

        </>
      )}

      {/* ==================================
          TAB 5: ACTIVITY & ACHIEVEMENTS
      ================================== */}

      {tab === "activity" && (
        <>

          {/* FOOD USAGE AND WASTE */}

          <Card title="Food usage and waste">

            <p>
              Actual recorded amounts this week,
              grouped by unit. Different units
              are not added together. Expired
              ingredients are not automatically
              counted as waste.
            </p>

            {summary?.totals?.length ? (

              summary.totals.map((item) => (
                <div
                  className="pw-list"
                  key={item.kind + item.unit}
                >

                  <strong>
                    {item.kind === "used"
                      ? "Used"
                      : "Discarded"}
                  </strong>

                  <span>
                    {format(item.quantity)}
                    {" "}
                    {item.unit}
                  </span>

                </div>
              ))

            ) : (
              <p className="muted">
                No activity recorded this week.
              </p>
            )}

          </Card>

          {/* RECORD FOOD WASTE */}

          <Card title="Record discarded food">

            <form onSubmit={recordWaste}>

              <Field label="Pantry ingredient">
                <select
                  required

                  value={waste.pantry_id}

                  disabled={busy}

                  onChange={(event) =>
                    setWaste(
                      (previous) => ({
                        ...previous,

                        pantry_id:
                          event.target.value,

                        quantity: "",
                      })
                    )
                  }
                >
                  <option value="">
                    Choose ingredient
                  </option>

                  {pantry
                    .filter(
                      (item) =>
                        Number(item.quantity) > 0
                    )
                    .map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                        {" "}
                        ({item.quantity} {item.unit})
                      </option>
                    ))}

                </select>
              </Field>

              <NumberField
                label={
                  `Discarded quantity${
                    wasteItem
                      ? ` (${wasteItem.unit})`
                      : ""
                  }`
                }

                value={waste.quantity}

                disabled={busy}

                max={
                  wasteItem?.quantity || 100000
                }

                onChange={(value) =>
                  setWaste(
                    (previous) => ({
                      ...previous,

                      quantity: value,
                    })
                  )
                }
              />

              <Field label="Reason (optional)">
                <input
                  value={waste.note}

                  maxLength={200}

                  disabled={busy}

                  onChange={(event) =>
                    setWaste(
                      (previous) => ({
                        ...previous,

                        note: event.target.value,
                      })
                    )
                  }
                />
              </Field>

              <button
                className="pw-primary"
                disabled={busy || !wasteItem}
              >
                Record waste & deduct stock
              </button>

            </form>

          </Card>

          {/* WEEKLY ACTIVITY LOG */}

          <Card title="Weekly activity log">

            {summary?.activity?.length ? (

              summary.activity.map((item) => (
                <div
                  className="pw-list"
                  key={item.id}
                >
                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      {item.occurred_on}
                      {" · "}
                      {item.kind}
                      {" "}
                      {format(item.quantity)}
                      {" "}
                      {item.unit}

                      {item.note &&
                        ` · ${item.note}`}
                    </small>

                  </div>
                </div>
              ))

            ) : (
              <p>No activity yet.</p>
            )}

          </Card>

          {/* ACHIEVEMENT BADGES */}

          <Card title="Your achievements">

            <p>
              Badges reflect your recorded activity
              and current saved recipes and meal plans.
            </p>

            <div className="pw-achievements">

              {badges.map(
                ([name, earned, hint]) => (
                  <div
                    className={
                      earned ? "earned" : ""
                    }

                    key={name}
                  >

                    <strong>{name}</strong>

                    <small>
                      {earned
                        ? "Unlocked ✓"
                        : hint}
                    </small>

                  </div>
                )
              )}

            </div>

          </Card>

        </>
      )}

    </div>
  );
}
