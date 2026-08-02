import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { fetchCurrentUser, updateCurrentUser } from "../services/users.js";
import { CURRENCIES } from "../helpers/currencies.js";
import "../css/Profile.css";

const DEFAULT_CURRENCY = "USD";

const formatMemberSince = (createdAt) => {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const Profile = () => {
  // Profile data as last confirmed by the server.
  const [user, setUser] = useState(null);
  const [loadStatus, setLoadStatus] = useState("loading"); // loading | ready | error
  const [loadError, setLoadError] = useState("");

  // Edit form state -- kept separate from `user` so a failed save never
  // clobbers the last-known-good profile info on screen.
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ displayName: "", homeCurrency: DEFAULT_CURRENCY });
  const [formError, setFormError] = useState("");

  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | error
  const [saveError, setSaveError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const loadProfile = () => {
    setLoadStatus("loading");
    setLoadError("");
    fetchCurrentUser()
      .then((data) => {
        setUser(data);
        setLoadStatus("ready");
      })
      .catch((err) => {
        setLoadError(err.message || "Something went wrong loading your profile.");
        setLoadStatus("error");
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Owns the toast's own lifecycle so callers just flip `justSaved` to true
  // and don't need to know or manage the timeout themselves.
  useEffect(() => {
    if (!justSaved) return;
    const id = window.setTimeout(() => setJustSaved(false), 3000);
    return () => window.clearTimeout(id);
  }, [justSaved]);

  // Clears out any leftover validation/save state from a previous edit attempt.
  const resetFormStatus = () => {
    setFormError("");
    setSaveStatus("idle");
    setSaveError("");
  };

  const startEditing = () => {
    setForm({
      displayName: user?.display_name || "",
      homeCurrency: user?.home_currency || DEFAULT_CURRENCY,
    });
    resetFormStatus();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    resetFormStatus();
  };

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === "displayName" && formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = form.displayName.trim();
    if (!trimmedName) {
      setFormError("Display name is required.");
      return;
    }

    setFormError("");
    setSaveStatus("saving");
    setSaveError("");

    try {
      const updated = await updateCurrentUser({
        displayName: trimmedName,
        homeCurrency: form.homeCurrency || DEFAULT_CURRENCY,
      });
      // Update from the server's response so the screen reflects exactly what was persisted.
      setUser(updated);
      setIsEditing(false);
      setSaveStatus("idle");
      setJustSaved(true);
    } catch (err) {
      // Keep the existing profile info on screen; only surface the error.
      setSaveStatus("error");
      setSaveError(err.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="page">
      <Sidebar />

      <main className="profile">
        <header className="profile__header">
          <h1>Profile</h1>
        </header>

        {loadStatus === "loading" && (
          <div className="profile__card profile__loading">Loading your profile…</div>
        )}

        {loadStatus === "error" && (
          <div className="profile__card profile__error-card">
            <p>{loadError}</p>
            <button type="button" className="btn btn--secondary" onClick={loadProfile}>
              Try again
            </button>
          </div>
        )}

        {loadStatus === "ready" && user && (
          <>
            <section className="profile__card profile__identity">
              <div className="profile__identity-left">
                <div className="profile__avatar" aria-hidden="true">
                  {getInitials(user.display_name)}
                </div>
                <div>
                  <h2 className="profile__name">{user.display_name}</h2>
                  <p className="profile__subtitle">
                    {formatMemberSince(user.created_at)
                      ? `Explorer since ${formatMemberSince(user.created_at)}`
                      : "Explorer"}
                  </p>
                </div>
              </div>

              {!isEditing && (
                <button type="button" className="btn btn--secondary" onClick={startEditing}>
                  Edit Profile
                </button>
              )}
            </section>

            {justSaved && !isEditing && (
              <div className="profile__toast" role="status">
                Profile updated.
              </div>
            )}

            <section className="profile__card profile__settings">
              <h3 className="profile__settings-title">Account Settings</h3>

              {!isEditing && (
                <>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row__label">Display Name</div>
                      <div className="settings-row__value">{user.display_name}</div>
                    </div>
                  </div>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row__label">Home Currency</div>
                      <div className="settings-row__value">{user.home_currency || DEFAULT_CURRENCY}</div>
                    </div>
                  </div>
                  <div className="settings-row settings-row--muted">
                    <div className="settings-row__label">Notifications</div>
                    <span className="settings-row__badge">Coming soon</span>
                  </div>
                  <div className="settings-row settings-row--muted">
                    <div className="settings-row__label">Help &amp; Support</div>
                    <span className="settings-row__badge">Coming soon</span>
                  </div>
                </>
              )}

              {isEditing && (
                <form className="profile__form" onSubmit={handleSubmit}>
                  {saveStatus === "error" && (
                    <div className="profile__form-error" role="alert">
                      {saveError}
                    </div>
                  )}

                  <label className="field">
                    <span className="field__label">Display Name</span>
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={handleFieldChange("displayName")}
                      placeholder="e.g. Zainab Ahmed"
                      disabled={saveStatus === "saving"}
                    />
                    {formError && <span className="field__error">{formError}</span>}
                  </label>

                  <label className="field">
                    <span className="field__label">Home Currency</span>
                    <select
                      value={form.homeCurrency}
                      onChange={handleFieldChange("homeCurrency")}
                      disabled={saveStatus === "saving"}
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                    <span className="field__hint">
                      Used to show exchange rates for your trips. Defaults to USD.
                    </span>
                  </label>

                  <div className="profile__form-actions">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={cancelEditing}
                      disabled={saveStatus === "saving"}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn--primary" disabled={saveStatus === "saving"}>
                      {saveStatus === "saving" ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
