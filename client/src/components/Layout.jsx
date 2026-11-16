import { useCallback, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Icon } from "./Icon.jsx";
import { api } from "../lib/api.js";
import { useToast } from "../hooks/useToast.js";

export function Layout() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [resetRevision, setResetRevision] = useState(0);
  const [accountError, setAccountError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const invalidate = useCallback(({ reset = false } = {}) => {
    setRevision((value) => value + 1);
    if (reset) setResetRevision((value) => value + 1);
  }, []);
  const signIn = useCallback(() => {
    const url = `/auth/github?returnTo=${encodeURIComponent(pathname + search.replace(/([?&])authError=[^&]*&?/, "$1").replace(/[?&]$/, "") + hash)}`;
    // The current page stays on screen until GitHub responds, so the toast
    // renders and spins while the redirect is in flight.
    toast.loading("Taking you to GitHub…", {
      title: "Signing in",
      key: "sign-in",
    });
    window.location.assign(url);
  }, [pathname, search, hash, toast]);
  // Coming back with the browser's Back button restores this page from
  // cache, so clear the "Signing in" toast instead of leaving it spinning.
  useEffect(() => {
    const restored = (event) => {
      if (event.persisted) toast.dismiss("sign-in");
    };
    window.addEventListener("pageshow", restored);
    return () => window.removeEventListener("pageshow", restored);
  }, [toast]);
  // GitHub sends people back with ?authError=… when sign-in is cancelled or
  // fails. The parameter stays in the URL so the dashboard does not redirect
  // straight back to GitHub; the toast offers a retry instead.
  const authFailed = new URLSearchParams(search).has("authError");
  const signInRef = useRef(signIn);
  useEffect(() => {
    signInRef.current = signIn;
  }, [signIn]);
  useEffect(() => {
    if (!authFailed) return;
    toast.error("Nothing was changed. You can try again.", {
      title: "GitHub sign-in didn’t finish",
      key: "auth-error",
      action: { label: "Try again", onClick: () => signInRef.current() },
    });
  }, [authFailed, toast]);
  useEffect(() => {
    const controller = new AbortController();
    api("/auth/me", { signal: controller.signal })
      .then((data) => setUser(data.user))
      .catch((error) => {
        if (error.name !== "AbortError" && error.status !== 401)
          setAccountError("Unable to check your account. Reload to try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setAuthLoading(false);
      });
    return () => controller.abort();
  }, []);
  async function logout() {
    setLoggingOut(true);
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
      invalidate();
      toast.success("See you next quest.", {
        title: "Signed out",
        variant: "signout",
      });
      if (pathname === "/dashboard") navigate("/");
    } catch (error) {
      setAccountError(error.message);
    } finally {
      setLoggingOut(false);
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-shell">
          <Link to="/" className="brand" aria-label="SkillForge home">
            <span className="brand-mark">
              <Icon name="bolt" size={24} />
            </span>
            Skill<span>Forge</span>
            <span className="brand-dot">.</span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>
              <Icon name="branch" size={16} /> Skill trees
            </NavLink>
            <NavLink to="/dashboard">
              <Icon name="clock" size={16} /> Dashboard
            </NavLink>
          </nav>
          <div className="account">
            {authLoading ? (
              <span>Checking account…</span>
            ) : user ? (
              <>
                {user.avatar_url ? (
                  <img className="avatar" src={user.avatar_url} alt="" />
                ) : (
                  <span className="avatar" aria-hidden="true">
                    {user.display_name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="account-name">{user.display_name}</span>
                <button
                  className="text-button"
                  onClick={logout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <button className="button secondary" onClick={signIn}>
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      </header>
      <main id="main" className="main-shell" tabIndex={-1}>
        {accountError && (
          <div className="inline-error" role="alert">
            {accountError}{" "}
            <button className="text-button" onClick={signIn}>
              Retry sign-in
            </button>
          </div>
        )}
        <Outlet
          context={{
            user,
            authLoading,
            authError: accountError,
            revision,
            resetRevision,
            invalidate,
            signIn,
          }}
        />
      </main>
      <footer className="site-footer">
        <span>Small quests. Real progress.</span>
        <span>
          SKILLFORGE <span className="footer-spark">✦</span> BUILT FOR
          DEVELOPERS
        </span>
      </footer>
    </>
  );
}
