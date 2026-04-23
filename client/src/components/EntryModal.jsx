import { useEffect } from "react";

export default function EntryModal({ entry, onClose, onDelete, deleting = false }) {
  useEffect(() => {
    if (!entry) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const formattedDate = entry.layoff_date
    ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            backgroundColor: "#f8fafc",
            color: "#334155",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div style={{ paddingRight: "3rem" }}>
          <h2
            style={{
              margin: 0,
              marginBottom: "0.35rem",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
            }}
          >
            {entry.role || "Unknown role"}{" "}
            <span style={{ color: "#2563eb" }}>
              @ {entry.company_name || "Unknown company"}
            </span>
          </h2>

          <p
            style={{
              marginTop: 0,
              marginBottom: "1.5rem",
              color: "#64748b",
              fontSize: "1rem",
            }}
          >
            Full story details
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          {[
            ["Location", entry.location || "Unknown"],
            ["Job Type", entry.job_type || "Unknown"],
            ["Layoff Date", formattedDate],
            [
              "Severance",
              entry.severance_weeks !== null && entry.severance_weeks !== undefined
                ? `${entry.severance_weeks} week${entry.severance_weeks === 1 ? "" : "s"}`
                : "N/A",
            ],
            [
              "Job Search Time",
              entry.job_search_weeks !== null && entry.job_search_weeks !== undefined
                ? `${entry.job_search_weeks} week${entry.job_search_weeks === 1 ? "" : "s"}`
                : "N/A",
            ],
            ["Visibility", entry.is_anonymous ? "Anonymous" : "Named"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: "0.35rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "1.15rem",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#334155",
              marginBottom: "0.75rem",
            }}
          >
            Summary
          </div>

          <p
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "1rem",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {entry.summary || "No summary provided."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            disabled={deleting}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#334155",
              fontWeight: 600,
              cursor: deleting ? "not-allowed" : "pointer",
              opacity: deleting ? 0.7 : 1,
            }}
          >
            Close
          </button>

          <button
            onClick={() => onDelete?.(entry.id)}
            disabled={deleting}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontWeight: 700,
              cursor: deleting ? "not-allowed" : "pointer",
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? "Deleting..." : "Delete Story"}
          </button>
        </div>
      </div>
    </div>
  );
}