import { runReset } from "../config/runReset.js";

const resetDatabase = async (req, res) => {
  try {
    await runReset();
    return res.status(200).json({
      message: "Database reset and seeded successfully.",
    });
  } catch (error) {
    console.error("Error resetting database:", error);
    return res.status(500).json({
      error: "Failed to reset database.",
    });
  }
};

export default { resetDatabase };