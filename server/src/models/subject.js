import { pool } from "../configs/db.config.js";

const findAll = () => {
  const query = "SELECT * FROM subjects ORDER BY name";
  return pool.query(query);
};

const findOne = (id) => {
  const query = "SELECT * FROM subjects WHERE id = $1";
  return pool.query(query, [id]);
};

export default {
  findAll,
  findOne,
};
