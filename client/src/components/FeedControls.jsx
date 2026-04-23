import { useNavigate } from "react-router-dom";

export default function FeedControls({
  companyFilter,
  setCompanyFilter,
  jobTypeFilter,
  setJobTypeFilter,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
  uniqueCompanies,
  onReset,
}) {
  const navigate = useNavigate();

  const hasActiveFilters =
    companyFilter !== "" ||
    jobTypeFilter !== "" ||
    sortOrder !== "newest" ||
    searchTerm.trim() !== "";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
      }}
    >
      <input
        type="text"
        placeholder="Search by company, role, or keyword..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "0.9rem 1rem",
          borderRadius: "14px",
          border: "1px solid #cbd5e1",
          fontSize: "1rem",
          marginBottom: "1rem",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={companyFilter}
          onChange={(e) => {
            const selectedCompany = e.target.value;
            setCompanyFilter(selectedCompany);

            if (selectedCompany) {
              navigate(`/company/${encodeURIComponent(selectedCompany)}`);
            } else {
              navigate("/");
            }
          }}
          style={{
            padding: "0.9rem 1rem",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            minWidth: "180px",
          }}
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          style={{
            padding: "0.9rem 1rem",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            minWidth: "180px",
          }}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "0.9rem 1rem",
            borderRadius: "14px",
            border: "1px solid #cbd5e1",
            fontSize: "1rem",
            minWidth: "180px",
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          onClick={onReset}
          disabled={!hasActiveFilters}
          style={{
            padding: "0.9rem 1.25rem",
            borderRadius: "14px",
            border: "none",
            backgroundColor: hasActiveFilters ? "#2563eb" : "#94a3b8",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: hasActiveFilters ? "pointer" : "not-allowed",
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}