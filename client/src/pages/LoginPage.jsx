import Spinner from '../components/Spinner.jsx'
import { Navigate, useSearchParams } from "react-router-dom";
import { useActiveUser } from "../context/ActiveUserContext.jsx";
import Icon from '../components/Icon.jsx'

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
      <main className="login-page">
        <Spinner label="Checking sign-in…" />
      </main>
    );
  const requested = params.get("returnTo");
  const returnTo = requested && /^\/trips(?:[/?#]|$)/.test(requested) && !requested.includes("\\") ? requested : "/trips";
  if (activeUser) return <Navigate to={returnTo} replace />;
  return (
    <main className="login-page">
      <div className="login-story">
        <img src="/images/journey-landscape.jpg" alt="A travel-poster illustration of green mountains, a lake and a little train" width="1536" height="1024" />
        <div className="login-brand"><span className="brand-mark"><Icon /></span>TripTogether</div>
        <div className="login-story-copy"><span className="eyebrow">GOOD COMPANY. GREAT PLACES.</span><h2>Less planning.<br />More <em>going together.</em></h2><p>For the spontaneous detours, the shared tables,<br className="desktop-break" /> and the stories you’ll tell for years.</p></div>
        <span className="login-story-foot"><Icon name="leaf" />Take the scenic route.</span>
      </div>
      <div className="login-panel">
      <div className="card login-card">
        <span className="eyebrow">WELCOME ABOARD</span>
        <h1>Your next adventure<br />starts here.</h1>
        <p className="page-note">
          A shared space for your plans, your people, and all the places you’ll go.
        </p>
        {error && <p className="error" role="alert">{error} Refresh the page to try again.</p>}
        {params.has("error") && (
          <p className="error" role="alert">
            {loginErrors[params.get("error")] || loginErrors.github}
          </p>
        )}
        <a className="btn btn-primary login-button" href={`/api/auth/github?returnTo=${encodeURIComponent(returnTo)}`}>
          <Icon name="compass" />Log in with GitHub<Icon name="arrow" />
        </a>
        <p className="login-reassurance">Sign in securely with your GitHub account.</p>
        <div className="login-features"><span><Icon name="check" />One plan, everyone in the loop</span><span><Icon name="check" />Activities, votes & shared expenses</span></div>
      </div>
      <p className="login-footer">A little planning goes a long way.</p>
      </div>
    </main>
  );
}
