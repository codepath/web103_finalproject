import { pool, USER_ID } from '../config/db.js';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Each entry is joined with the recipe fields the planner card shows
const SELECT = `
  SELECT m.id, m.recipe_id, TO_CHAR(m.planned_date, 'YYYY-MM-DD') AS planned_date,
         LOWER(m.meal_type) AS meal_type, r.title, r.image_url, r.prep_minutes
  FROM meal_plan_entries m JOIN recipes r ON r.id = m.recipe_id`;

const isValidDate = (s) => typeof s === 'string' && DATE_RE.test(s) && !isNaN(Date.parse(s));
const normalizeMealType = (t) => (typeof t === 'string' ? t.trim().toLowerCase() : '');

// GET /api/meal-plan?start=YYYY-MM-DD  → entries from start through start + 6 days
export async function getMealPlan(req, res, next) {
  try {
    const { start } = req.query;
    if (!isValidDate(start)) return res.status(400).json({ error: 'start must be a date in YYYY-MM-DD format.' });
    const { rows } = await pool.query(
      `${SELECT} WHERE m.user_id = $1 AND m.planned_date BETWEEN $2::date AND $2::date + 6
       ORDER BY m.planned_date, ARRAY_POSITION($3::text[], LOWER(m.meal_type)), m.id`,
      [USER_ID, start, MEAL_TYPES]
    );
    res.json(rows);
  } catch (e) { next(e); }
}

// POST /api/meal-plan { recipe_id, planned_date, meal_type }
export async function addMealPlanEntry(req, res, next) {
  try {
    const recipe_id = Number(req.body.recipe_id);
    const { planned_date } = req.body;
    const meal_type = normalizeMealType(req.body.meal_type);
    if (!Number.isInteger(recipe_id) || recipe_id <= 0) return res.status(400).json({ error: 'recipe_id must be a positive integer.' });
    if (!isValidDate(planned_date)) return res.status(400).json({ error: 'planned_date must be a date in YYYY-MM-DD format.' });
    if (!MEAL_TYPES.includes(meal_type)) return res.status(400).json({ error: `meal_type must be one of: ${MEAL_TYPES.join(', ')}.` });

    const recipe = await pool.query('SELECT id FROM recipes WHERE id = $1', [recipe_id]);
    if (!recipe.rows[0]) return res.status(404).json({ error: 'Recipe not found.' });

    const ins = await pool.query(
      `INSERT INTO meal_plan_entries (user_id, recipe_id, planned_date, meal_type)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [USER_ID, recipe_id, planned_date, meal_type]
    );
    const { rows } = await pool.query(`${SELECT} WHERE m.id = $1`, [ins.rows[0].id]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
}

// PATCH /api/meal-plan/:id { planned_date?, meal_type? }  → move to another day and/or slot
export async function updateMealPlanEntry(req, res, next) {
  try {
    const { planned_date } = req.body;
    let { meal_type } = req.body;
    if (planned_date === undefined && meal_type === undefined) {
      return res.status(400).json({ error: 'Provide planned_date and/or meal_type.' });
    }
    if (planned_date !== undefined && !isValidDate(planned_date)) {
      return res.status(400).json({ error: 'planned_date must be a date in YYYY-MM-DD format.' });
    }
    if (meal_type !== undefined) {
      meal_type = normalizeMealType(meal_type);
      if (!MEAL_TYPES.includes(meal_type)) return res.status(400).json({ error: `meal_type must be one of: ${MEAL_TYPES.join(', ')}.` });
    }

    const upd = await pool.query(
      `UPDATE meal_plan_entries SET
         planned_date = COALESCE($1::date, planned_date),
         meal_type = COALESCE($2, meal_type)
       WHERE id = $3 AND user_id = $4 RETURNING id`,
      [planned_date ?? null, meal_type ?? null, req.params.id, USER_ID]
    );
    if (!upd.rows[0]) return res.status(404).json({ error: 'Meal plan entry not found.' });
    const { rows } = await pool.query(`${SELECT} WHERE m.id = $1`, [upd.rows[0].id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
}

// DELETE /api/meal-plan/:id
export async function deleteMealPlanEntry(req, res, next) {
  try {
    const del = await pool.query(
      'DELETE FROM meal_plan_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, USER_ID]
    );
    if (!del.rows[0]) return res.status(404).json({ error: 'Meal plan entry not found.' });
    res.status(204).end();
  } catch (e) { next(e); }
}
