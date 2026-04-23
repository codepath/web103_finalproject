import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SubmitEntryPage.css";

import Step1Intro from "../components/submit/Step1Intro";
import Step2CompanyRole from "../components/submit/Step2CompanyRole";
import Step3LayoffDetails from "../components/submit/Step3LayoffDetails";
import Step4Review from "../components/submit/Step4Review";

export default function SubmitEntryPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user_id: 1,
    company_id: "",
    role: "",
    job_type: "",
    location: "",
    layoff_date: "",
    severance_weeks: "",
    job_search_weeks: "",
    is_anonymous: false,
    summary: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setErrorMessage("Failed to load companies.");
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => {
    setErrorMessage("");

    if (step === 2) {
      if (!formData.company_id || !formData.role || !formData.job_type) {
        setErrorMessage("Please complete all fields before continuing.");
        return;
      }
    }

    if (step === 3) {
      if (
        !formData.location ||
        !formData.layoff_date ||
        formData.severance_weeks === "" ||
        formData.job_search_weeks === "" ||
        !formData.summary
      ) {
        setErrorMessage("Please complete all fields before continuing.");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMessage("");
    setStep((prev) => prev - 1);
  };

  const selectedCompany = companies.find(
    (company) => String(company.id) === String(formData.company_id)
  );

  const handleSubmit = async () => {
    if (submitting) return;

    setErrorMessage("");
    setSubmitting(true);

    try {
      await axios.post("http://localhost:3001/api/entries", {
        ...formData,
        company_id: Number(formData.company_id),
        severance_weeks: Number(formData.severance_weeks),
        job_search_weeks: Number(formData.job_search_weeks),
      });

      const companyName = selectedCompany?.name;

      if (companyName) {
        navigate(`/company/${encodeURIComponent(companyName)}`, {
          state: {
            success: `Your layoff story was submitted successfully for ${companyName}.`,
          },
        });
      } else {
        navigate("/", {
          state: {
            success: "Your layoff story was submitted successfully.",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting entry:", error);
      setErrorMessage("Failed to submit entry. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      {errorMessage && (
        <p style={{ color: "crimson", marginBottom: "1rem" }}>
          {errorMessage}
        </p>
      )}

      <div className="card">
        {step === 1 && (
          <Step1Intro nextStep={nextStep} currentStep={step} totalSteps={4} />
        )}

        {step === 2 && (
          <Step2CompanyRole
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            companies={companies}
            currentStep={step}
            totalSteps={4}
          />
        )}

        {step === 3 && (
          <Step3LayoffDetails
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={step}
            totalSteps={4}
          />
        )}

        {step === 4 && (
          <Step4Review
            formData={formData}
            selectedCompany={selectedCompany}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            currentStep={step}
            totalSteps={4}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
