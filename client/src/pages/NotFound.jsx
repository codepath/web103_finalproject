import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#334155",
            marginBottom: "0.75rem",
          }}
        >
          Page not found
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Back to Feed
        </Link>
      </div>
    </div>
  );
}