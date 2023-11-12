import Subject from "../models/subject.js";

const getSubjects = async (req, res) => {
  try {
    const { rows } = await Subject.findAll();
    return res.status(200).json(rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const { rows } = await Subject.findOne(req.params.id);
    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getSubjects,
  getSubjectById,
};
