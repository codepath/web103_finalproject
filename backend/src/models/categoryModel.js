import pool from "../../config/db.js";

export async function getAllCategories() {
  const result = await pool.query(
    "SELECT id, name, color FROM categories ORDER BY name",
  );
  return result.rows;
}
