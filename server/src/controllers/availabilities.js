import Availability from "../models/availability.js";
  
  const getTimeTutors = async (req, res) => {
    try {
      const { rows } = await Availability.findTime(req.params.time);
      return res.status(200).json(rows);
    } catch (error) {
      res.status(409).json({ error: error.message });
    }
  };
  
  const addTimeTutor = async (req, res) => {
    try {
      const { rows } = await Availability.create(req.body);
      return res.status(201).json(rows[0]);
    } catch (error) {
      res.status(409).json({ error: error.message });
    }
  };

  export default {
    getTimeTutors,
    addTimeTutor,
  };
