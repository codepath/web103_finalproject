import pool from '../config/database.js'

const getCategories = async (_, res) => {
  try{
    const results = await pool.query('SELECT * FROM categories ORDER BY id ASC')
    res.status(200).json(results.rows)
  } catch (err) {
    console.error('get Categories error: ', err)
    res.status(409).json({error: err})
  }
}

const getCategoryById = async (req, res) => {
  try{
    const categoryId = req.params.categoryId
    const selectQuery = `
      SELECT * FROM categories WHERE categories.id = $1
    `
    const result = await pool.query(selectQuery, [categoryId])
    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('get Category by Id error: ', err)
    res.status(409).json({error: err})
  }
}

export default {getCategories, getCategoryById}