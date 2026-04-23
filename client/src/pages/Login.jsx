export default function Login({ apiUrl }) {
  const error = new URLSearchParams(window.location.search).get('error');

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>LayoffLens</h1>
      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          Login failed. Please try again.
        </p>
      )}
      <a href={`${apiUrl}/auth/github`}>
        <button>Sign in with GitHub</button>
      </a>
    </div>
  );
}
