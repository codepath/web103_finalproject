import pool from "../config/database.js";

const CompanyModel = {
  async getAll() {
    const result = await pool.query(`
      SELECT id, name, website, industry_id
      FROM companies
      ORDER BY name ASC
    `);

    return result.rows;
  },

  async getOne(id) {
    const result = await pool.query(
      `
      SELECT id, name, website, industry_id
      FROM companies
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  },
};

export default CompanyModel;