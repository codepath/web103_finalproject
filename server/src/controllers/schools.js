import School from "../models/school.js";

const getSchools = async (req, res) => {
  try {
    const { rows } = await School.findAll();
    return res.status(200).json(rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const { rows } = await School.findOne(req.params.id);
    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getSchools,
  getSchoolById,
};
