import { pool } from "../config/db.js";
import { UNITS } from "../config/units.js";

export function listUnits(_req, res) {
  res.json(UNITS);
}

export async function listIngredients(_req, res, next) {
  try {
    const { rows } = await pool.query("SELECT id, name, category FROM ingredients ORDER BY name");
    res.json(rows);
  } catch (e) { next(e); }
}
