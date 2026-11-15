import { useCallback, useEffect, useState } from "react";
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
    window.location.href = `/auth/github?returnTo=${encodeURIComponent(pathname + search.replace(/([?&])authError=[^&]*&?/, "$1").replace(/[?&]$/, "") + hash)}`;
  }, [pathname, search, hash]);
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
        {(accountError || new URLSearchParams(search).has("authError")) && (
          <div className="inline-error" role="alert">
            {accountError || "GitHub sign-in did not finish. Please try again."}{" "}
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
