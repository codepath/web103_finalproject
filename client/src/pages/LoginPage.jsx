import { Navigate, useSearchParams } from "react-router-dom";
import { useActiveUser } from "../context/ActiveUserContext.jsx";

const loginErrors = {
  state: 'Your sign-in attempt expired or its cookie was blocked. Start again using Continue with Google, and use localhost throughout.',
  email: 'Google did not provide a verified email address. Please try another Google account.',
  account: 'An account with this email already exists. It must be linked separately before you can sign in with Google.',
  migration: 'Sign-in is temporarily unavailable. The server database needs an update.',
  server: 'Sign-in could not be completed because of a server or provider error. Please try again.',
  google: 'Google sign-in was cancelled or could not be completed. Please try again.',
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
  if (activeUser) return <Navigate to="/trips" replace />;
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
          {loginErrors[params.get("error")] || loginErrors.google}
        </p>
      )}
      <a className="nav-link" href="/api/auth/google">
        Continue with Google
      </a>
    </main>
  );
}
