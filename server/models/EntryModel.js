import pool from "../config/database.js";

const EntryModel = {
  async getAll() {
    const query = `
      SELECT
        e.id,
        e.user_id,
        e.company_id,
        e.role,
        e.job_type,
        e.location,
        e.severance_weeks,
        e.layoff_date,
        e.job_search_weeks,
        e.is_anonymous,
        e.summary,
        e.created_at,
        e.updated_at,
        c.name AS company_name,
        u.username
      FROM entries e
      JOIN companies c ON e.company_id = c.id
      LEFT JOIN users u ON e.user_id = u.id
      ORDER BY e.layoff_date DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getOne(entryId) {
    const query = `
      SELECT
        e.id,
        e.user_id,
        e.company_id,
        e.role,
        e.job_type,
        e.location,
        e.severance_weeks,
        e.layoff_date,
        e.job_search_weeks,
        e.is_anonymous,
        e.summary,
        e.created_at,
        e.updated_at,
        c.name AS company_name,
        u.username
      FROM entries e
      JOIN companies c ON e.company_id = c.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = $1;
    `;
    const result = await pool.query(query, [entryId]);
    return result.rows[0];
  },

  async createOne(entryData) {
    const {
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
    } = entryData;

    const query = `
      INSERT INTO entries (
        user_id,
        company_id,
        role,
        job_type,
        location,
        severance_weeks,
        layoff_date,
        job_search_weeks,
        is_anonymous,
        summary
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateOne(entryId, entryData) {
    const {
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
    } = entryData;

    const query = `
      UPDATE entries
      SET
        user_id = $1,
        company_id = $2,
        role = $3,
        job_type = $4,
        location = $5,
        severance_weeks = $6,
        layoff_date = $7,
        job_search_weeks = $8,
        is_anonymous = $9,
        summary = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
      entryId,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async deleteOne(entryId) {
    const query = `
      DELETE FROM entries
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [entryId]);
    return result.rows[0];
  },
};

export default EntryModel;