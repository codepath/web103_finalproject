export default function Step3LayoffDetails({
  formData,
  handleChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) {
  return (
    <>
      <p className="step-text">
        Step {currentStep} of {totalSteps}
      </p>

      <h1 className="title">Layoff Details</h1>
      <p className="subtitle">
        Share details about your experience.
      </p>

      <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="form-group">
          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date of Layoff</label>
          <input
            type="date"
            name="layoff_date"
            value={formData.layoff_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Severance Weeks</label>
          <input
            type="number"
            name="severance_weeks"
            value={formData.severance_weeks}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Job Search Weeks</label>
          <input
            type="number"
            name="job_search_weeks"
            value={formData.job_search_weeks}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
            />
            Submit anonymously
          </label>
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="5"
          />
        </div>
      </div>

      <div className="button-row">
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </>
  );
}