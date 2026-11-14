
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../api.js";
import "../styles/dashboard.css";

// ==========================================
// DASHBOARD SETTINGS
// ==========================================

const MACROS = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    color: "#C8553D",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    color: "#759B65",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    color: "#D6A34D",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    color: "#9678C0",
  },
];

const QUICK_ACTIONS = [
  {
    icon: "📸",
    title: "Scan Groceries",
    description: "Identify groceries or scan a barcode",
    to: "/kitchen?tab=scan",
  },
  {
    icon: "🍳",
    title: "Cook a Meal",
    description: "Cook and update your pantry",
    to: "/kitchen?tab=cook",
  },
  {
    icon: "🥗",
    title: "Log Nutrition",
    description: "Track calories and macros",
    to: "/kitchen?tab=nutrition",
  },
  {
    icon: "📅",
    title: "Plan Your Week",
    description: "Organize your upcoming meals",
    to: "/planner",
  },
  {
    icon: "➕",
    title: "Add Ingredient",
    description: "Update your kitchen inventory",
    to: "/pantry/new",
  },
  {
    icon: "🔍",
    title: "Discover Recipes",
    description: "Find something delicious",
    to: "/recipes",
  },
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

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

function mondayKey(date) {
  const monday = new Date(date);

  monday.setHours(12, 0, 0, 0);

  monday.setDate(
    monday.getDate() -
      ((monday.getDay() + 6) % 7)
  );

  return dateKey(monday);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 2,
    }
  );
}

function money(value) {
  return Number(value || 0).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    }
  );
}

function percent(value, goal) {
  if (!goal || Number(goal) <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, (Number(value) / Number(goal)) * 100)
  );
}

function greeting(hour) {
  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function prettyDate(value) {
  if (!value) return "";

  const date = new Date(
    String(value).slice(0, 10) + "T12:00:00"
  );

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function expiryLabel(days) {
  const number = Number(days);

  if (number < 0) {
    return "Past expiration date";
  }

  if (number === 0) {
    return "Expires today";
  }

  if (number === 1) {
    return "Expires tomorrow";
  }

  return `${number} days left`;
}

// ==========================================
// REUSABLE DASHBOARD COMPONENTS
// ==========================================

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <section className={`d3-panel ${className}`}>
      <header className="d3-panel-header">
        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        {action}
      </header>

      {children}
    </section>
  );
}

function EmptyState({
  icon,
  message,
  description,
  to,
  button,
}) {
  return (
    <div className="d3-empty">
      <span className="d3-empty-icon">
        {icon}
      </span>

      <strong>{message}</strong>

      {description && (
        <p>{description}</p>
      )}

      {to && (
        <Link to={to} className="d3-link">
          {button || "Get started"} →
        </Link>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  to,
  color,
}) {
  return (
    <Link
      to={to}
      className="d3-stat"
      style={{ "--stat-color": color }}
    >
      <span className="d3-stat-icon">
        {icon}
      </span>

      <div className="d3-stat-info">
        <span>{label}</span>

        <strong>
          {value == null ? "—" : value}
        </strong>
      </div>

      <span className="d3-stat-arrow">
        ↗
      </span>
    </Link>
  );
}

// ==========================================
// ANIMATED NUTRITION PROGRESS RING
// ==========================================

function NutritionRing({
  label,
  value,
  goal,
  unit,
  color,
}) {
  const hasGoal =
    goal != null && Number(goal) > 0;

  const progress = percent(value, goal);

  const radius = 46;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <div className="d3-nutrition-item">

      <div
        className="d3-ring"
        style={{ "--ring-color": color }}
      >
        <svg
          viewBox="0 0 112 112"
          aria-hidden="true"
        >
          {/* Background circle */}

          <circle
            cx="56"
            cy="56"
            r={radius}
            className="d3-ring-track"
            strokeWidth="9"
            fill="none"
          />

          {/* Animated progress circle */}

          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 56 56)"
            className="d3-ring-progress"
            style={{
              "--ring-length": circumference,
              "--ring-offset": offset,
            }}
          />
        </svg>

        <div className="d3-ring-center">
          <strong>{formatNumber(value)}</strong>
          <small>{unit}</small>
        </div>
      </div>

      <strong className="d3-macro-label">
        {label}
      </strong>

      <small className="d3-macro-goal">
        {hasGoal
          ? `Goal: ${formatNumber(goal)} ${unit}`
          : "No goal set"}
      </small>

      <span className="d3-macro-percent">
        {hasGoal
          ? `${Math.round(
              (Number(value) / Number(goal)) * 100
            )}% of goal`
          : "Set a daily goal"}
      </span>

    </div>
  );
}

// ==========================================
// MAIN DASHBOARD
// ==========================================

export default function Dashboard() {
  const [now, setNow] = useState(
    () => new Date()
  );

  const [data, setData] = useState({});

  const [failed, setFailed] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refresh, setRefresh] =
    useState(0);

  const today = dateKey(now);

  const week = mondayKey(now);

  // ========================================
  // LIVE CLOCK
  // ========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ========================================
  // REFRESH AFTER APPLICATION ACTIONS
  // ========================================

  useEffect(() => {
    function update() {
      setRefresh((previous) => previous + 1);
    }

    function handleChefEvent(event) {
      const type = event.detail?.type;

      if (
        type === "pantry-updated" ||
        type === "celebrate"
      ) {
        update();
      }
    }

    window.addEventListener(
      "focus",
      update
    );

    window.addEventListener(
      "prepwise:chef",
      handleChefEvent
    );

    return () => {
      window.removeEventListener(
        "focus",
        update
      );

      window.removeEventListener(
        "prepwise:chef",
        handleChefEvent
      );
    };
  }, []);

  // ========================================
  // LOAD REAL ACCOUNT DATA
  // ========================================

  useEffect(() => {
    let active = true;

    const requests = [
      ["account", "/auth/me"],
      ["pantry", "/pantry-items"],
      ["meals", `/meal-plan?start=${week}`],
      ["saved", "/saved-recipes"],
      ["shopping", "/shopping-list"],
      [
        "summary",
        `/kitchen/summary?date=${today}&week=${week}`,
      ],
    ];

    setLoading(true);

    // One failed request will not hide
    // the entire dashboard.

    Promise.allSettled(
      requests.map(([, path]) =>
        api.get(path)
      )
    )
      .then((results) => {
        if (!active) return;

        const next = {};
        const errors = [];

        results.forEach((result, index) => {
          const key = requests[index][0];

          if (result.status === "fulfilled") {
            next[key] = result.value;
          } else {
            errors.push({
              key,
              message:
                result.reason?.message ||
                "Request failed",
            });
          }
        });

        setData(next);
        setFailed(errors);
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
  // PREPARE DASHBOARD INFORMATION
  // ========================================

  const user = data.account?.user;

  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    "Chef";

  const pantryLoaded =
    Array.isArray(data.pantry);

  const mealsLoaded =
    Array.isArray(data.meals);

  const savedLoaded =
    Array.isArray(data.saved);

  const shoppingLoaded =
    Array.isArray(data.shopping);

  const summary = data.summary;

  const pantry = data.pantry || [];

  const meals = data.meals || [];

  const saved = data.saved || [];

  const shopping = data.shopping || [];

  const todayMeals = meals.filter(
    (meal) => meal.planned_date === today
  );

  const upcomingMeals = meals
    .filter(
      (meal) => meal.planned_date > today
    )
    .slice(0, 4);

  const activePantry = pantry.filter(
    (item) => Number(item.quantity) > 0
  );

  const expiring = activePantry
    .filter(
      (item) =>
        item.days_until_expiry != null &&
        Number(item.days_until_expiry) <= 3
    )
    .sort(
      (a, b) =>
        Number(a.days_until_expiry) -
        Number(b.days_until_expiry)
    );

  const itemsToBuy = shopping.filter(
    (item) => !item.is_checked
  );

  const goals = summary?.goals || {};

  const nutrition = summary?.nutrition || [];

  const expenses = summary?.expenses || [];

  const cooking = summary?.cooking || [];

  const counts = summary?.counts || {};

  // Sum only today's logged nutrition.

  const totals = nutrition.reduce(
    (total, entry) => ({
      calories:
        total.calories +
        Number(entry.calories || 0),

      protein:
        total.protein +
        Number(entry.protein || 0),

      carbs:
        total.carbs +
        Number(entry.carbs || 0),

      fat:
        total.fat +
        Number(entry.fat || 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );

  // Total recorded grocery expenses this week.

  const spent = expenses.reduce(
    (total, item) =>
      total + Number(item.amount || 0),

    0
  );

  const budget = Number(
    goals.weekly_budget || 0
  );

  const hasBudget = budget > 0;

  const remaining = budget - spent;

  const budgetProgress = percent(
    spent,
    budget
  );

  // Achievement progress.

  const achievements = [
    {
      icon: "🍳",
      title: "First meal",
      description: "Record your first cooked meal",
      value: Number(counts.cooked || 0),
      goal: 1,
    },
    {
      icon: "👨‍🍳",
      title: "Home chef",
      description: "Cook five meals",
      value: Number(counts.cooked || 0),
      goal: 5,
    },
    {
      icon: "💖",
      title: "Recipe collector",
      description: "Save five recipes",
      value: Number(counts.saved || 0),
      goal: 5,
    },
  ];

  const earned = achievements.filter(
    (item) => item.value >= item.goal
  );

  const formattedDate =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formattedTime =
    now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });

  // ========================================
  // RENDER DASHBOARD
  // ========================================

  return (
    <div className="d3-dashboard">

      {/* PAGE HEADER */}

      <header className="d3-header">
        <div>
          <span className="d3-eyebrow">
            YOUR KITCHEN AT A GLANCE
          </span>

          <h1>Dashboard</h1>

          <p>
            {formattedDate} · {formattedTime}
          </p>
        </div>

        <button
          type="button"
          className="d3-button d3-refresh"
          disabled={loading}
          onClick={() =>
            setRefresh((previous) => previous + 1)
          }
        >
          <span>↻</span>

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </header>

      {/* PERSONALIZED WELCOME BANNER */}

      <section className="d3-hero">
        <div className="d3-hero-copy">
          <span>WELCOME TO YOUR SMART KITCHEN</span>

          <h2>
            {greeting(now.getHours())},{" "}
            {firstName}! 👋
          </h2>

          <p>
            Your ingredients, your goals,
            your personal chef.
            Let's make something delicious today.
          </p>

          <div className="d3-hero-actions">
            <Link
              to="/recipes"
              className="d3-hero-button"
            >
              Discover Recipes →
            </Link>

            <Link
              to="/kitchen?tab=scan"
              className="d3-hero-outline"
            >
              📸 Scan Groceries
            </Link>
          </div>
        </div>

        <div
          className="d3-hero-art"
          aria-hidden="true"
        >
          <span className="d3-food food-one">
            🥑
          </span>

          <span className="d3-food food-two">
            🍅
          </span>

          <span className="d3-food food-three">
            🥕
          </span>

          <span className="d3-food food-four">
            🥦
          </span>

          <span className="d3-food food-five">
            🍋
          </span>

          <span className="d3-main-food">
            🍳
          </span>
        </div>
      </section>

      {/* LOADING AND ERROR MESSAGES */}

      {loading && (
        <p className="d3-status" role="status">
          Updating your kitchen dashboard...
        </p>
      )}

      {failed.length > 0 && (
        <div className="d3-error" role="alert">
          <strong>
            Some kitchen information could not load.
          </strong>

          <p>
            {failed.map((item) => item.key).join(", ")}
          </p>

          <button
            type="button"
            className="d3-button"
            onClick={() =>
              setRefresh((previous) => previous + 1)
            }
          >
            Try again
          </button>
        </div>
      )}

      {/* QUICK STATISTICS */}

      <div className="d3-stats">

        <StatCard
          icon="🥦"
          label="Pantry ingredients"
          value={
            pantryLoaded
              ? activePantry.length
              : null
          }
          to="/pantry"
          color="#719653"
        />

        <StatCard
          icon="🍽️"
          label="Today's meals"
          value={
            mealsLoaded
              ? todayMeals.length
              : null
          }
          to="/planner"
          color="#D6A34D"
        />

        <StatCard
          icon="❤️"
          label="Saved recipes"
          value={
            savedLoaded
              ? saved.length
              : null
          }
          to="/saved"
          color="#C8553D"
        />

        <StatCard
          icon="🛒"
          label="Items to buy"
          value={
            shoppingLoaded
              ? itemsToBuy.length
              : null
          }
          to="/shopping"
          color="#9678C0"
        />

      </div>

      {/* NUTRITION AND GROCERY BUDGET */}

      <div className="d3-overview">

        <Panel
          title="Today's Nutrition"
          subtitle="Track your daily food goals"
          action={
            <Link
              className="d3-link"
              to="/kitchen?tab=nutrition"
            >
              Nutrition →
            </Link>
          }
        >

          {summary ? (
            <>
              <div className="d3-nutrition-grid">

                {MACROS.map((macro) => (
                  <NutritionRing
                    key={macro.key}
                    label={macro.label}
                    value={totals[macro.key]}
                    goal={goals[macro.key]}
                    unit={macro.unit}
                    color={macro.color}
                  />
                ))}

              </div>

              <div className="d3-nutrition-footer">

                <span>
                  {nutrition.length} food{" "}
                  {nutrition.length === 1
                    ? "entry"
                    : "entries"}{" "}
                  logged today
                </span>

                <Link
                  to="/kitchen?tab=nutrition"
                  className="d3-button"
                >
                  + Log Food
                </Link>

              </div>
            </>
          ) : (
            <EmptyState
              icon="🥗"
              message={
                loading
                  ? "Loading nutrition..."
                  : "Nutrition unavailable"
              }
            />
          )}

        </Panel>

        <Panel
          title="Weekly Budget"
          subtitle={`Week of ${prettyDate(week)}`}
          action={
            <Link
              className="d3-link"
              to="/kitchen?tab=budget"
            >
              Budget →
            </Link>
          }
        >

          {summary ? (
            <div className="d3-budget">

              <div className="d3-budget-icon">
                💰
              </div>

              <span className="d3-muted">
                Grocery spending
              </span>

              <strong className="d3-budget-total">
                {money(spent)}
              </strong>

              {hasBudget ? (
                <>
                  <p>
                    of {money(budget)} weekly budget
                  </p>

                  <div
                    className={`d3-progress ${
                      remaining < 0
                        ? "over-budget"
                        : ""
                    }`}
                    role="progressbar"
                    aria-label="Weekly budget used"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={
                      Math.round(budgetProgress)
                    }
                  >
                    <span
                      style={{
                        width: `${budgetProgress}%`,
                      }}
                    />
                  </div>

                  <div className="d3-budget-bottom">
                    <span>
                      {remaining < 0
                        ? "Over budget"
                        : "Remaining"}
                    </span>

                    <strong>
                      {money(Math.abs(remaining))}
                    </strong>
                  </div>
                </>
              ) : (
                <p>
                  Set a weekly budget to track
                  how much you have left.
                </p>
              )}

              <Link
                to="/kitchen?tab=budget"
                className="d3-button d3-full-button"
              >
                {hasBudget
                  ? "+ Add Expense"
                  : "Set Your Budget"}
              </Link>

            </div>
          ) : (
            <EmptyState
              icon="💰"
              message={
                loading
                  ? "Loading budget..."
                  : "Budget unavailable"
              }
            />
          )}

        </Panel>

      </div>

      {/* TODAY'S MEALS AND PANTRY ALERTS */}

      <div className="d3-columns">

        <Panel
          title="Today's Meals"
          subtitle="What's cooking today?"
          action={
            <Link
              className="d3-link"
              to="/planner"
            >
              Meal Planner →
            </Link>
          }
        >

          {!mealsLoaded ? (
            <EmptyState
              icon="📅"
              message="Meal plan unavailable"
            />
          ) : todayMeals.length === 0 ? (
            <EmptyState
              icon="🍽️"
              message="No meals planned"
              description="Plan something delicious for today."
              to="/recipes"
              button="Choose a recipe"
            />
          ) : (
            <div className="d3-list">

              {todayMeals.map((meal) => (
                <div
                  className="d3-meal-row"
                  key={meal.id}
                >

                  {meal.image_url ? (
                    <img
                      src={meal.image_url}
                      alt={meal.title}
                      loading="lazy"
                      className="d3-meal-image"
                    />
                  ) : (
                    <span className="d3-meal-placeholder">
                      🍲
                    </span>
                  )}

                  <div className="d3-row-content">
                    <strong>{meal.title}</strong>

                    <small>
                      {meal.meal_type}

                      {meal.prep_minutes != null &&
                        ` · ${meal.prep_minutes} min prep`}
                    </small>
                  </div>

                  <Link
                    to={`/kitchen?tab=cook&recipe=${encodeURIComponent(
                      meal.recipe_id
                    )}`}
                    className="d3-button d3-small-button"
                  >
                    Cook
                  </Link>

                </div>
              ))}

            </div>
          )}

        </Panel>

        <Panel
          title="Pantry Alerts"
          subtitle="Reduce food waste"
          action={
            <Link
              className="d3-link"
              to="/pantry"
            >
              My Pantry →
            </Link>
          }
        >

          {!pantryLoaded ? (
            <EmptyState
              icon="🥦"
              message="Pantry unavailable"
            />
          ) : expiring.length === 0 ? (
            <EmptyState
              icon="🌱"
              message="You're all caught up!"
              description={
                activePantry.length
                  ? "No recorded pantry dates are within the next three days or past due."
                  : "Add groceries and expiration dates to start receiving alerts."
              }
              to="/pantry"
              button="Manage pantry"
            />
          ) : (
            <div className="d3-list">

              {expiring.slice(0, 5).map((item) => (
                <div
                  className="d3-alert-row"
                  key={item.id}
                >

                  <span className="d3-alert-icon">
                    {Number(item.days_until_expiry) < 0
                      ? "⚠️"
                      : "⏳"}
                  </span>

                  <div className="d3-row-content">

                    <strong>{item.name}</strong>

                    <small>
                      {formatNumber(item.quantity)}{" "}
                      {item.unit}
                    </small>

                  </div>

                  <span
                    className={`d3-expiry ${
                      Number(item.days_until_expiry) <= 0
                        ? "urgent"
                        : ""
                    }`}
                  >
                    {expiryLabel(
                      item.days_until_expiry
                    )}
                  </span>

                </div>
              ))}

              <Link
                className="d3-link"
                to="/pantry"
              >
                View all {expiring.length} alerts →
              </Link>

            </div>
          )}

        </Panel>

      </div>

      {/* QUICK ACTIONS */}

      <Panel
        title="Quick Actions"
        subtitle="Everything you need, one click away"
      >

        <div className="d3-actions">

          {QUICK_ACTIONS.map((action) => (
            <Link
              className="d3-action"
              key={action.title}
              to={action.to}
            >

              <span className="d3-action-icon">
                {action.icon}
              </span>

              <div>
                <strong>{action.title}</strong>
                <small>{action.description}</small>
              </div>

              <span className="d3-action-arrow">
                →
              </span>

            </Link>
          ))}

        </div>

      </Panel>

      {/* COOKING ACTIVITY AND ACHIEVEMENTS */}

      <div className="d3-columns">

        <Panel
          title="Recent Cooking"
          subtitle="Your kitchen activity"
          action={
            <Link
              to="/kitchen?tab=activity"
              className="d3-link"
            >
              View History →
            </Link>
          }
        >

          {!summary ? (
            <EmptyState
              icon="🍳"
              message="Cooking history unavailable"
            />
          ) : cooking.length === 0 ? (
            <EmptyState
              icon="👨‍🍳"
              message="Your cooking journey starts here"
              description="Record your first cooked recipe to build your history."
              to="/kitchen?tab=cook"
              button="Cook a meal"
            />
          ) : (
            <div className="d3-list">

              {cooking.slice(0, 4).map((meal) => (
                <div
                  key={meal.id}
                  className="d3-activity-row"
                >

                  <span className="d3-activity-icon">
                    🍳
                  </span>

                  <div className="d3-row-content">

                    <strong>{meal.title}</strong>

                    <small>
                      {formatNumber(meal.servings)}{" "}
                      serving(s)
                    </small>

                  </div>

                  <small>
                    {prettyDate(meal.cooked_on)}
                  </small>

                </div>
              ))}

            </div>
          )}

        </Panel>

        <Panel
          title="Your Achievements"
          subtitle={
            summary
              ? `${earned.length} of ${achievements.length} featured badges earned`
              : "Track your cooking milestones"
          }
          action={
            <Link
              className="d3-link"
              to="/kitchen?tab=activity"
            >
              All Badges →
            </Link>
          }
        >

          {summary ? (
            <div className="d3-achievements">

              {achievements.map((item) => {
                const unlocked =
                  item.value >= item.goal;

                return (
                  <div
                    key={item.title}
                    className={`d3-achievement ${
                      unlocked ? "earned" : ""
                    }`}
                  >

                    <span className="d3-achievement-icon">
                      {unlocked ? item.icon : "🔒"}
                    </span>

                    <strong>{item.title}</strong>

                    <small>
                      {unlocked
                        ? "Unlocked!"
                        : item.description}
                    </small>

                    <span className="d3-achievement-progress">
                      {Math.min(
                        item.value,
                        item.goal
                      )}{" "}
                      / {item.goal}
                    </span>

                  </div>
                );
              })}

            </div>
          ) : (
            <EmptyState
              icon="🏆"
              message="Achievements unavailable"
            />
          )}

        </Panel>

      </div>

      {/* UPCOMING MEALS */}

      <Panel
        title="Coming Up This Week"
        subtitle="Your next planned meals"
        action={
          <Link
            className="d3-link"
            to="/planner"
          >
            Full Calendar →
          </Link>
        }
      >

        {!mealsLoaded ? (
          <EmptyState
            icon="📅"
            message="Upcoming meals unavailable"
          />
        ) : upcomingMeals.length === 0 ? (
          <EmptyState
            icon="📅"
            message="No upcoming meals this week"
            description="Build your weekly meal plan to stay organized."
            to="/planner"
            button="Plan your week"
          />
        ) : (
          <div className="d3-upcoming">

            {upcomingMeals.map((meal) => (
              <Link
                to="/planner"
                className="d3-upcoming-card"
                key={meal.id}
              >

                {meal.image_url ? (
                  <img
                    src={meal.image_url}
                    alt={meal.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="d3-upcoming-placeholder">
                    🍲
                  </div>
                )}

                <div>
                  <small>
                    {prettyDate(meal.planned_date)}
                    {" · "}
                    {meal.meal_type}
                  </small>

                  <strong>{meal.title}</strong>
                </div>

              </Link>
            ))}

          </div>
        )}

      </Panel>

      <footer className="d3-footer">
        🍳 PrepWise — Plan smarter.
        Cook better. Waste less.
      </footer>

    </div>
  );
}
