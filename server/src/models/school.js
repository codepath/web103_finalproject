import { pool } from "../configs/db.config.js";

const findAll = () => {
  const query = "SELECT * FROM schools ORDER BY name";
  return pool.query(query);
};

const findOne = (id) => {
  const query = "SELECT * FROM schools WHERE id = $1";
  return pool.query(query, [id]);
};

export default {
  findAll,
  findOne,
};
