export default function Step4Review({
  formData,
  selectedCompany,
  prevStep,
  handleSubmit,
  currentStep,
  totalSteps,
  submitting,
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#64748b",
          marginBottom: "0.5rem",
          fontWeight: 600,
        }}
      >
        Step {currentStep} of {totalSteps}
      </p>

      <h2 style={{ marginBottom: "1rem" }}>Review Your Entry</h2>

      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1.5rem",
          lineHeight: 1.8,
        }}
      >
        <p>
          <strong>Company:</strong> {selectedCompany?.name || "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {formData.role || "N/A"}
        </p>
        <p>
          <strong>Job Type:</strong> {formData.job_type || "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {formData.location || "N/A"}
        </p>
        <p>
          <strong>Layoff Date:</strong> {formData.layoff_date || "N/A"}
        </p>
        <p>
          <strong>Severance Weeks:</strong>{" "}
          {formData.severance_weeks !== "" ? formData.severance_weeks : "N/A"}
        </p>
        <p>
          <strong>Job Search Weeks:</strong>{" "}
          {formData.job_search_weeks !== "" ? formData.job_search_weeks : "N/A"}
        </p>
        <p>
          <strong>Anonymous:</strong> {formData.is_anonymous ? "Yes" : "No"}
        </p>
        <p>
          <strong>Summary:</strong> {formData.summary || "N/A"}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" onClick={prevStep} disabled={submitting}>
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Story"}
        </button>
      </div>
    </div>
  );
}