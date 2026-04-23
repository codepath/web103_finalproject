import EntryModel from "../models/EntryModel.js";

class EntryController {
  static async getEntries(req, res) {
    try {
      const entries = await EntryModel.getAll();
      res.status(200).json(entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      res.status(500).json({ error: "Failed to fetch entries." });
    }
  }

  static async getEntryById(req, res) {
    try {
      const { entryId } = req.params;
      const entry = await EntryModel.getOne(entryId);

      if (!entry) {
        return res.status(404).json({ error: "Entry not found." });
      }

      res.status(200).json(entry);
    } catch (error) {
      console.error("Error fetching entry:", error);
      res.status(500).json({ error: "Failed to fetch entry." });
    }
  }

  static async createEntry(req, res) {
    try {
      const {
        user_id,
        company_id,
        role,
        job_type,
        location,
        layoff_date,
        severance_weeks,
        job_search_weeks,
        is_anonymous,
        summary,
      } = req.body;

      const isBlank = (value) =>
        value === undefined || value === null || String(value).trim() === "";

      const parsedUserId = Number(user_id);
      const parsedCompanyId = Number(company_id);
      const parsedSeveranceWeeks = Number(severance_weeks);
      const parsedJobSearchWeeks = Number(job_search_weeks);

      if (Number.isNaN(parsedUserId)) {
        return res.status(400).json({ error: "user_id must be a valid number." });
      }

      if (Number.isNaN(parsedCompanyId)) {
        return res.status(400).json({ error: "company_id must be a valid number." });
      }

      if (isBlank(role)) {
        return res.status(400).json({ error: "Role is required." });
      }

      if (isBlank(job_type)) {
        return res.status(400).json({ error: "Job type is required." });
      }

      if (isBlank(location)) {
        return res.status(400).json({ error: "Location is required." });
      }

      if (isBlank(layoff_date)) {
        return res.status(400).json({ error: "Layoff date is required." });
      }

      if (isBlank(summary)) {
        return res.status(400).json({ error: "Summary is required." });
      }

      if (Number.isNaN(parsedSeveranceWeeks) || parsedSeveranceWeeks < 0) {
        return res.status(400).json({
          error: "severance_weeks must be a non-negative number.",
        });
      }

      if (Number.isNaN(parsedJobSearchWeeks) || parsedJobSearchWeeks < 0) {
        return res.status(400).json({
          error: "job_search_weeks must be a non-negative number.",
        });
      }

      const parsedDate = new Date(layoff_date);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "layoff_date must be a valid date." });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate >= today) {
        return res.status(400).json({
          error: "layoff_date must be before today.",
        });
      }

      const newEntry = await EntryModel.createOne({
        user_id: parsedUserId,
        company_id: parsedCompanyId,
        role: role.trim(),
        job_type: job_type.trim(),
        location: location.trim(),
        layoff_date,
        severance_weeks: parsedSeveranceWeeks,
        job_search_weeks: parsedJobSearchWeeks,
        is_anonymous: Boolean(is_anonymous),
        summary: summary.trim(),
      });

      return res.status(201).json(newEntry);
    } catch (error) {
      console.error("Error creating entry:", error);
      return res.status(500).json({ error: "Failed to create entry." });
    }
  }

  static async updateEntry(req, res) {
    try {
      const { entryId } = req.params;
      const updatedEntry = await EntryModel.updateOne(entryId, req.body);

      if (!updatedEntry) {
        return res.status(404).json({ error: "Entry not found." });
      }

      res.status(200).json(updatedEntry);
    } catch (error) {
      console.error("Error updating entry:", error);
      res.status(500).json({ error: "Failed to update entry." });
    }
  }

  static async deleteEntry(req, res) {
    try {
      const { entryId } = req.params;
      const deletedEntry = await EntryModel.deleteOne(entryId);

      if (!deletedEntry) {
        return res.status(404).json({ error: "Entry not found." });
      }

      res.status(200).json({ message: "Entry deleted successfully." });
    } catch (error) {
      console.error("Error deleting entry:", error);
      res.status(500).json({ error: "Failed to delete entry." });
    }
  }
}

export default EntryController;