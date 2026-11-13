
import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";

import ChatRecipeCard from "./ChatRecipeCard.jsx";
import ChatWeeklyPlan from "./ChatWeeklyPlan.jsx";
import ChatMealDBRecipes from "./ChatMealDBRecipes.jsx";
import ChefMascot from "./ChefMascot.jsx";

import "../styles/chat.css";

// ============================================
// CHAT SETTINGS
// ============================================

const CHAT_KEY = "prepwise_ai_chat_v1";

const PREFERENCES_KEY =
  "prepwise_ai_preferences_v1";

const DIETS = [
  "Any",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten Free",
  "High Protein",
];

const ALLERGIES = [
  { value: "milk", label: "Milk / Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "peanuts", label: "Peanuts" },
  { value: "tree nuts", label: "Tree Nuts" },
  { value: "soy", label: "Soy" },
  { value: "wheat", label: "Wheat" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
];

const suggestions = [
  "What can I cook with my pantry?",
  "Find new recipes online",
  "Create a 7-day dinner plan",
  "What ingredients will expire soon?",
  "Recommend meals based on my allergies",
];

const welcomeMessage = {
  role: "assistant",

  text:
    "Hi! 👨‍🍳 I'm your PrepWise AI chef! " +
    "I can help you find recipes, check your pantry, " +
    "discover new meals online, plan your week, " +
    "and recommend meals based on your dietary preferences. " +
    "What would you like to cook today?",
};

// ============================================
// LOCAL STORAGE
// ============================================

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.warn(
      "Unable to save chatbot data:",
      error.message
    );
  }
}

// ============================================
// LOAD SAVED PREFERENCES
// ============================================

function loadPreferences() {
  const saved = readStorage(
    PREFERENCES_KEY,
    {}
  );

  return {
    diet: DIETS.includes(saved?.diet)
      ? saved.diet
      : "Any",

    allergies: Array.isArray(saved?.allergies)
      ? saved.allergies.filter(
          (item) => typeof item === "string"
        )
      : [],
  };
}

// ============================================
// LOAD SAVED CHAT HISTORY
// ============================================

function loadMessages() {
  const saved = readStorage(
    CHAT_KEY,
    []
  );

  if (!Array.isArray(saved)) {
    return [welcomeMessage];
  }

  const history = saved
    .filter(
      (item) =>
        item &&
        ["user", "assistant"].includes(
          item.role
        ) &&
        typeof item.text === "string"
    )
    .slice(-50)
    .map((item) => ({
      role: item.role,
      text: item.text,
    }));

  return [
    welcomeMessage,
    ...history,
  ];
}

// ============================================
// FORMAT AI RESPONSES
// ============================================

function ChatText({ text }) {
  // Display basic bold text without installing
  // another package or rendering unsafe HTML.

  const parts = String(text || "").split(
    /(\*\*[^*]+\*\*)/g
  );

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") &&
        part.endsWith("**") ? (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>
            {part}
          </span>
        )
      )}
    </>
  );
}

// ============================================
// MAIN PREPWISE AI COMPONENT
// ============================================

export default function PrepWiseChat() {
  const [open, setOpen] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState(loadMessages);

  const [preferences, setPreferences] =
    useState(loadPreferences);

  const [
    showPreferences,
    setShowPreferences,
  ] = useState(false);

  const [draft, setDraft] =
    useState(preferences);

  const [customAllergy, setCustomAllergy] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const messagesRef = useRef(null);

  const requestRef = useRef(false);

  // ==========================================
  // SAVE CONVERSATION MEMORY
  // ==========================================

  useEffect(() => {
    const history = messages
      .slice(1)
      .filter(
        (item) => !item.isError
      )
      .slice(-50)
      .map((item) => ({
        role: item.role,
        text: item.text,
      }));

    writeStorage(
      CHAT_KEY,
      history
    );
  }, [messages]);

  // ==========================================
  // SAVE USER PREFERENCES
  // ==========================================

  useEffect(() => {
    writeStorage(
      PREFERENCES_KEY,
      preferences
    );
  }, [preferences]);

  // ==========================================
  // SCROLL TO LATEST MESSAGE
  // ==========================================

  useEffect(() => {
    if (open && messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [
    messages,
    loading,
    open,
  ]);

  // ==========================================
  // SEND AI MESSAGE
  // ==========================================

  async function sendMessage(text) {
    const message = text.trim();

    if (
      !message ||
      loading ||
      requestRef.current
    ) {
      return;
    }

    requestRef.current = true;

    const history = messages
      .slice(1)
      .filter(
        (item) => !item.isError
      )
      .slice(-10)
      .map((item) => ({
        role: item.role,
        text: item.text,
      }));

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");

    setNotice("");

    setLoading(true);

    try {
      const result = await api.post(
        "/chat",
        {
          message,
          history,
          preferences,
        }
      );

      setMessages((previous) => [
        ...previous,

        {
          role: "assistant",

          text: result.reply,

          recipes:
            result.recommendations || [],

          externalRecipes:
            result.externalRecipes || [],

          weeklyPlan:
            result.weeklyPlan || null,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,

        {
          role: "assistant",

          isError: true,

          text:
            error.message ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      requestRef.current = false;

      setLoading(false);
    }
  }

  // ==========================================
  // NEW CHAT
  // ==========================================

  function clearChat() {
    if (loading) return;

    setMessages([
      welcomeMessage,
    ]);

    setInput("");

    setNotice("");

    try {
      localStorage.removeItem(
        CHAT_KEY
      );
    } catch {
      // Local storage may be disabled.
    }
  }

  // ==========================================
  // OPEN PREFERENCES
  // ==========================================

  function openPreferences() {
    setDraft({
      diet: preferences.diet,

      allergies: [
        ...preferences.allergies,
      ],
    });

    setCustomAllergy("");

    setShowPreferences(true);
  }

  // ==========================================
  // SELECT ALLERGIES
  // ==========================================

  function toggleAllergy(value) {
    setDraft((previous) => ({
      ...previous,

      allergies:
        previous.allergies.includes(value)
          ? previous.allergies.filter(
              (item) => item !== value
            )
          : [
              ...previous.allergies,
              value,
            ].slice(0, 15),
    }));
  }

  // ==========================================
  // ADD CUSTOM ALLERGIES
  // ==========================================

  function addCustomAllergy() {
    const value = customAllergy
      .trim()
      .toLowerCase()
      .slice(0, 60);

    if (!value) return;

    setDraft((previous) => ({
      ...previous,

      allergies: [
        ...new Set([
          ...previous.allergies,
          value,
        ]),
      ].slice(0, 15),
    }));

    setCustomAllergy("");
  }

  // ==========================================
  // SAVE PREFERENCES
  // ==========================================

  function savePreferences(event) {
    event.preventDefault();

    setPreferences({
      diet: draft.diet,

      allergies:
        draft.allergies.slice(0, 15),
    });

    setShowPreferences(false);

    setNotice(
      "✓ Preferences saved! New recommendations will use them."
    );

    // Remove old interactive recommendations
    // because the dietary preferences changed.

    setMessages((previous) =>
      previous.map((item) => ({
        role: item.role,

        text: item.text,

        isError: item.isError,
      }))
    );
  }

  // ==========================================
  // CHEF 2.0 — REPLY AND ERROR STATE
  // ==========================================

  const latestMessage =
    messages.at(-1);

  const latestReply =
    messages.length > 1 &&
    latestMessage?.role === "assistant" &&
    !latestMessage?.isError
      ? latestMessage.text
      : "";

  const hasError = Boolean(
    latestMessage?.isError
  );

  // ==========================================
  // RENDER CHAT INTERFACE
  // ==========================================

  return (
    <>
      {open && (
        <section
          className="prepwise-chat-panel"
          aria-label="PrepWise AI assistant"
        >

          {/* ==============================
              CHAT HEADER
          ============================== */}

          <header className="chat-header">

            <div className="chat-avatar">
              👨‍🍳
            </div>

            <div className="chat-heading">
              <h3>PrepWise AI</h3>

              <span>
                Your personal cooking assistant
              </span>
            </div>

            <button
              type="button"
              className="chat-close"
              aria-label="Close chat"
              onClick={() =>
                setOpen(false)
              }
            >
              ×
            </button>

          </header>

          {/* ==============================
              CHAT TOOLBAR
          ============================== */}

          <div className="chat-toolbar">

            <span>
              ● Smart Cooking Assistant
            </span>

            <div className="chat-toolbar-actions">

              <button
                type="button"
                onClick={() =>
                  showPreferences
                    ? setShowPreferences(false)
                    : openPreferences()
                }
                disabled={loading}
              >
                ⚙ Preferences
              </button>

              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
              >
                New chat
              </button>

            </div>

          </div>

          {/* ==============================
              PREFERENCES PANEL
          ============================== */}

          {showPreferences && (
            <form
              className="chat-preferences"
              onSubmit={savePreferences}
            >

              <h3>
                Your Food Preferences
              </h3>

              <p className="chat-preference-help">
                Personalize your recipe
                recommendations.
              </p>

              <label htmlFor="chat-diet">
                Dietary preference
              </label>

              <select
                id="chat-diet"
                value={draft.diet}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,

                    diet: event.target.value,
                  }))
                }
              >

                {DIETS.map((diet) => (
                  <option
                    key={diet}
                    value={diet}
                  >
                    {diet === "Any"
                      ? "No preference"
                      : diet}
                  </option>
                ))}

              </select>

              {/* FOOD ALLERGIES */}

              <h4>
                Food Allergies
              </h4>

              <div className="chat-allergy-grid">

                {ALLERGIES.map((allergy) => (
                  <label
                    key={allergy.value}
                    className="chat-allergy-option"
                  >

                    <input
                      type="checkbox"

                      checked={
                        draft.allergies.includes(
                          allergy.value
                        )
                      }

                      onChange={() =>
                        toggleAllergy(
                          allergy.value
                        )
                      }
                    />

                    <span>
                      {allergy.label}
                    </span>

                  </label>
                ))}

              </div>

              {/* CUSTOM INGREDIENT RESTRICTIONS */}

              <label htmlFor="custom-allergy">
                Other ingredient to avoid
              </label>

              <div className="chat-custom-allergy">

                <input
                  id="custom-allergy"
                  placeholder="Example: shrimp"
                  value={customAllergy}
                  maxLength={60}

                  onChange={(event) =>
                    setCustomAllergy(
                      event.target.value
                    )
                  }

                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      customAllergy.trim()
                    ) {
                      event.preventDefault();

                      addCustomAllergy();
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={addCustomAllergy}
                  disabled={
                    !customAllergy.trim()
                  }
                >
                  Add
                </button>

              </div>

              {/* SELECTED ALLERGY TAGS */}

              {draft.allergies.length > 0 && (
                <div className="chat-allergy-tags">

                  {draft.allergies.map((allergy) => (
                    <button
                      key={allergy}
                      type="button"

                      onClick={() =>
                        toggleAllergy(allergy)
                      }

                      aria-label={
                        `Remove ${allergy}`
                      }
                    >
                      {allergy} ×
                    </button>
                  ))}

                </div>
              )}

              <p className="chat-allergy-warning">
                AI screening cannot guarantee
                a recipe is allergy-safe.
                Always verify ingredients,
                food labels and
                cross-contamination risks.
              </p>

              <button
                type="submit"
                className="chat-shopping-confirm"
              >
                Save Preferences
              </button>

              <button
                type="button"
                className="chat-shopping-btn"

                onClick={() =>
                  setShowPreferences(false)
                }
              >
                Cancel
              </button>

            </form>
          )}

          {/* ==============================
              ACTIVE USER PREFERENCES
          ============================== */}

          {!showPreferences &&
            (
              preferences.diet !== "Any" ||
              preferences.allergies.length > 0
            ) && (
              <div className="chat-active-preferences">

                {preferences.diet !== "Any" && (
                  <span>
                    {preferences.diet}
                  </span>
                )}

                {preferences.allergies.length > 0 && (
                  <span
                    title={
                      preferences.allergies.join(", ")
                    }
                  >
                    {preferences.allergies.length}
                    {" "}
                    ingredient restriction(s)
                  </span>
                )}

              </div>
            )}

          {/* ==============================
              STATUS NOTICE
          ============================== */}

          {notice && (
            <div
              className="chat-preference-notice"
              role="status"
            >
              {notice}
            </div>
          )}

          {/* ==============================
              CHAT MESSAGES
          ============================== */}

          <div
            className="chat-messages"
            ref={messagesRef}
            aria-live="polite"
          >

            {messages.map(
              (message, index) => (
                <div
                  key={index}

                  className={
                    `chat-message ${message.role}`
                  }
                >

                  {message.role === "assistant" && (
                    <div className="message-avatar">
                      👨‍🍳
                    </div>
                  )}

                  <div className="chat-message-content">

                    {/* TEXT RESPONSE */}

                    <div
                      className={`chat-bubble ${
                        message.isError
                          ? "chat-error-bubble"
                          : ""
                      }`}
                    >
                      <ChatText
                        text={message.text}
                      />
                    </div>

                    {/* ======================
                        LOCAL RECIPE CARDS
                    ====================== */}

                    {message.recipes?.length > 0 && (
                      <div className="chat-recipe-list">

                        <h4>
                          Matching PrepWise Recipes
                        </h4>

                        {message.recipes.map(
                          (recipe) => (
                            <ChatRecipeCard
                              key={recipe.id}
                              recipe={recipe}
                            />
                          )
                        )}

                      </div>
                    )}

                    {/* ======================
                        LIVE MEALDB RECIPES
                    ====================== */}

                    {message.externalRecipes?.length > 0 && (
                      <ChatMealDBRecipes
                        recipes={
                          message.externalRecipes
                        }
                      />
                    )}

                    {/* ======================
                        WEEKLY MEAL PLANNER
                    ====================== */}

                    {message.weeklyPlan && (
                      <ChatWeeklyPlan
                        plan={message.weeklyPlan}
                      />
                    )}

                  </div>

                </div>
              )
            )}

            {/* ==============================
                QUICK QUESTIONS
            ============================== */}

            {messages.length === 1 && !loading && (
              <div className="chat-suggestions">

                <p>
                  Try asking me:
                </p>

                {suggestions.map((question) => (
                  <button
                    key={question}
                    type="button"

                    onClick={() =>
                      sendMessage(question)
                    }
                  >
                    {question}
                  </button>
                ))}

              </div>
            )}

            {/* ==============================
                AI THINKING INDICATOR
            ============================== */}

            {loading && (
              <div className="chat-message assistant">

                <div className="message-avatar">
                  👨‍🍳
                </div>

                <div className="chat-bubble typing">
                  <span />
                  <span />
                  <span />
                </div>

              </div>
            )}

          </div>

          {/* ==============================
              MESSAGE INPUT
          ============================== */}

          <form
            className="chat-input-form"

            onSubmit={(event) => {
              event.preventDefault();

              sendMessage(input);
            }}
          >

            <input
              type="text"
              placeholder="Ask PrepWise AI..."
              aria-label="Chat message"
              value={input}
              maxLength={2000}
              disabled={loading}

              onChange={(event) =>
                setInput(event.target.value)
              }
            />

            <button
              type="submit"

              disabled={
                loading ||
                !input.trim()
              }

              aria-label="Send message"
            >
              ➤
            </button>

          </form>

          {/* ==============================
              FOOTER
          ============================== */}

          <footer className="chat-footer">
            AI can make mistakes.
            Verify ingredients and cooking advice.
          </footer>

        </section>
      )}

      {/* ==================================
          CHEF 2.0 — ALL 12 FEATURES
      ================================== */}

      <ChefMascot

        open={open}

        loading={loading}

        preferences={preferences}

        reply={latestReply}

        hasError={hasError}

        onToggle={() =>
          setOpen((previous) => !previous)
        }

      />

    </>
  );
}
