import CompanyModel from "../models/CompanyModel.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await CompanyModel.getAll();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await CompanyModel.getOne(req.params.id);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};