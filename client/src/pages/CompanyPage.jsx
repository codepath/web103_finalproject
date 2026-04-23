import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EntryModal from "../components/EntryModal";
import NotFound from "./NotFound";

export default function CompanyPage() {
  const { companyName } = useParams();
  const decodedCompany = decodeURIComponent(companyName);

  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = location.state?.success;

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/entries");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate, location.pathname]);

  const handleDeleteEntry = async (entryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this story? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await axios.delete(`http://localhost:3001/api/entries/${entryId}`);
      setSelectedEntry(null);
      await fetchEntries();
      navigate(location.pathname, {
        replace: true,
        state: { success: "Story deleted successfully." },
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeleting(false);
    }
  };

  const companyExists = entries.some(
    (entry) => entry.company_name === decodedCompany
  );

  const companyEntries = entries
    .filter((entry) => entry.company_name === decodedCompany)
    .sort((a, b) => new Date(b.layoff_date) - new Date(a.layoff_date));

  if (!loading && !companyExists) {
    return <NotFound />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "920px",
          margin: "0 auto",
        }}
      >
        {successMessage && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
              padding: "0.9rem 1rem",
              borderRadius: "12px",
              marginBottom: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(22, 101, 52, 0.08)",
            }}
          >
            {successMessage}
          </div>
        )}

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginBottom: "1.25rem",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.98rem",
          }}
        >
          ← Back to Feed
        </Link>

        <div
          style={{
            borderRadius: "20px",
            padding: "0 0 1.5rem 0",
            marginBottom: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "0.5rem",
            }}
          >
            {decodedCompany} Stories
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "1.05rem",
              marginBottom: "0.85rem",
            }}
          >
            Layoff experiences shared from professionals at {decodedCompany}.
          </p>

          {!loading && (
            <div
              style={{
                display: "inline-block",
                padding: "0.5rem 0.85rem",
                borderRadius: "999px",
                backgroundColor: "#e0f2fe",
                color: "#0369a1",
                fontSize: "0.9rem",
                fontWeight: 700,
              }}
            >
              {companyEntries.length} stor{companyEntries.length === 1 ? "y" : "ies"}
            </div>
          )}
        </div>

        {loading ? (
          <div
            style={{
              padding: "2rem",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              textAlign: "center",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            Loading company stories...
          </div>
        ) : companyEntries.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#334155",
                fontSize: "1rem",
                marginBottom: "1rem",
              }}
            >
              No layoff stories found for {decodedCompany} yet.
            </p>

            <Link
              to="/submit"
              style={{
                display: "inline-block",
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Submit the first story
            </Link>
          </div>
        ) : (
          companyEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(15, 23, 42, 0.08)";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(15, 23, 42, 0.04)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "1rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <h3
                style={{
                  marginBottom: "0.5rem",
                  fontSize: "1.55rem",
                  fontWeight: 700,
                  color: "#475569",
                  textAlign: "left",
                }}
              >
                {entry.role || "Unknown role"}
              </h3>

              <p
                style={{
                  color: "#475569",
                  marginBottom: "0.9rem",
                  fontSize: "1.05rem",
                  lineHeight: 1.5,
                  textAlign: "left",
                }}
              >
                {entry.summary || "No summary provided."}
              </p>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  marginBottom: "0.75rem",
                  textAlign: "left",
                }}
              >
                {entry.location || "Unknown location"} •{" "}
                {entry.job_type || "Unknown job type"} •{" "}
                {entry.layoff_date
                  ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown date"}
              </p>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                Severance:{" "}
                {entry.severance_weeks !== null &&
                entry.severance_weeks !== undefined
                  ? `${entry.severance_weeks} week${
                      entry.severance_weeks === 1 ? "" : "s"
                    }`
                  : "N/A"}{" "}
                • Job search:{" "}
                {entry.job_search_weeks !== null &&
                entry.job_search_weeks !== undefined
                  ? `${entry.job_search_weeks} week${
                      entry.job_search_weeks === 1 ? "" : "s"
                    }`
                  : "N/A"}{" "}
                • {entry.is_anonymous ? "Anonymous" : "Named"}
              </p>

              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.55rem 0.9rem",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    borderRadius: "999px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  View Details →
                </span>
              </div>
            </div>
          ))
        )}

        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDeleteEntry}
          deleting={deleting}
        />
      </div>
    </div>
  );
}