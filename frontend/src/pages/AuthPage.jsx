
import { useState } from "react";

import { api } from "../api.js";

import "../styles/auth.css";

// ==========================================
// LOGIN AND REGISTRATION PAGE
// ==========================================

export default function AuthPage({
  onLogin,
}) {

  const [register, setRegister] =
    useState(false);

  const [form, setForm] = useState({
    name: "",

    email: "",

    password: "",

    confirm: "",
  });

  const [show, setShow] =
    useState(false);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  // Update a form field.

  function field(event) {

    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));
  }

  // Switch between login and registration.

  function switchMode() {

    setRegister(
      (previous) => !previous
    );

    setError("");

    setForm((previous) => ({
      ...previous,

      password: "",

      confirm: "",
    }));
  }

  // ========================================
  // SUBMIT AUTHENTICATION FORM
  // ========================================

  async function submit(event) {

    event.preventDefault();

    if (busy) return;

    setError("");

    if (register) {

      if (form.password.length < 12) {

        setError(
          "Use a password with at least 12 characters."
        );

        return;
      }

      if (form.password !== form.confirm) {

        setError(
          "Passwords do not match."
        );

        return;
      }
    }

    setBusy(true);

    try {

      const { user } = await api.post(

        register

          ? "/auth/register"

          : "/auth/login",

        {
          name: form.name,

          email: form.email,

          password: form.password,
        }
      );

      onLogin(user);

    } catch (error) {

      setError(error.message);

    } finally {

      setBusy(false);
    }
  }

  // ========================================
  // RENDER AUTHENTICATION PAGE
  // ========================================

  return (
    <main className="pw-auth">

      <section className="pw-auth-card">

        {/* BRANDING PANEL */}

        <div className="pw-auth-brand">

          <span>
            YOUR SMART KITCHEN
          </span>

          <div className="pw-auth-chef">
            👨‍🍳
          </div>

          <h1>
            PrepWise
          </h1>

          <p>
            Plan smarter. Cook better. Waste less.
          </p>

          <p>
            🥗 Your own pantry and meal plan
          </p>

          <p>
            🛒 Smart grocery shopping
          </p>

          <p>
            🤖 Your personal AI chef
          </p>

        </div>

        {/* LOGIN / REGISTRATION FORM */}

        <div className="pw-auth-form">

          <h2>

            {register

              ? "Create your account"

              : "Welcome back!"}

          </h2>

          <p className="muted">

            {register

              ? "Start your smart kitchen journey."

              : "Your kitchen is waiting for you."}

          </p>

          <form onSubmit={submit}>

            {/* FULL NAME */}

            {register && (

              <label>

                Full name

                <input
                  name="name"

                  value={form.name}

                  onChange={field}

                  autoComplete="name"

                  placeholder="Your full name"

                  maxLength={100}

                  required
                />

              </label>

            )}

            {/* EMAIL ADDRESS */}

            <label>

              Email

              <input
                name="email"

                type="email"

                value={form.email}

                onChange={field}

                autoComplete="email"

                placeholder="you@example.com"

                maxLength={255}

                required
              />

            </label>

            {/* PASSWORD */}

            <label>

              Password

              <input
                name="password"

                type={show ? "text" : "password"}

                value={form.password}

                onChange={field}

                autoComplete={

                  register

                    ? "new-password"

                    : "current-password"
                }

                placeholder={

                  register

                    ? "At least 12 characters"

                    : "Enter your password"
                }

                maxLength={128}

                required
              />

            </label>

            {/* CONFIRM PASSWORD */}

            {register && (

              <label>

                Confirm password

                <input
                  name="confirm"

                  type={show ? "text" : "password"}

                  value={form.confirm}

                  onChange={field}

                  autoComplete="new-password"

                  placeholder="Repeat your password"

                  maxLength={128}

                  required
                />

              </label>

            )}

            {/* SHOW PASSWORD */}

            <label className="pw-auth-check">

              <input
                type="checkbox"

                checked={show}

                onChange={(event) =>
                  setShow(event.target.checked)
                }
              />

              Show password

            </label>

            {/* ERROR MESSAGE */}

            {error && (

              <p
                className="pw-auth-error"

                role="alert"
              >
                {error}
              </p>

            )}

            {/* SUBMIT BUTTON */}

            <button
              type="submit"

              className="pw-auth-submit"

              disabled={busy}
            >

              {busy

                ? "Please wait…"

                : register

                  ? "Create account"

                  : "Sign in"}

            </button>

          </form>

          {/* SWITCH LOGIN MODE */}

          <button
            type="button"

            className="pw-auth-switch"

            disabled={busy}

            onClick={switchMode}
          >

            {register

              ? "Already have an account? Sign in"

              : "New to PrepWise? Create an account"}

          </button>

        </div>

      </section>

    </main>
  );
}
