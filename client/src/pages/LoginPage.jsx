import { Navigate, useSearchParams } from "react-router-dom";
import { useActiveUser } from "../context/ActiveUserContext.jsx";

const loginErrors = {
  state: 'Your sign-in attempt expired or its cookie was blocked. Start again using Continue with GitHub, and use localhost throughout.',
  migration: 'Sign-in is temporarily unavailable. The server database needs an update.',
  server: 'Sign-in could not be completed because of a server or provider error. Please try again.',
  github: 'GitHub sign-in was cancelled or could not be completed. Please try again.',
};

export default function LoginPage() {
  const { activeUser, loading, error } = useActiveUser();
  const [params] = useSearchParams();
  if (loading)
    return (
      <main className="main-content">
        <p role="status">Checking sign-in…</p>
      </main>
    );
  const requested = params.get("returnTo");
  const returnTo = requested && /^\/trips(?:[/?#]|$)/.test(requested) && !requested.includes("\\") ? requested : "/trips";
  if (activeUser) return <Navigate to={returnTo} replace />;
  return (
    <main className="main-content">
      <h1>Welcome to TripTogether</h1>
      <p>
        Sign in to plan trips, share activities, and track expenses with
        friends.
      </p>
      {error && <p role="alert">{error} Refresh the page to try again.</p>}
      {params.has("error") && (
        <p role="alert">
          {loginErrors[params.get("error")] || loginErrors.github}
        </p>
      )}
      <a className="nav-link" href={`/api/auth/github?returnTo=${encodeURIComponent(returnTo)}`}>
        Continue with GitHub
      </a>
    </main>
  );
}
