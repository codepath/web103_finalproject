import pool from '../config/database.js'

const findAll = (constraint, value) => {
  if (value) {
    const query = 'SELECT * FROM company WHERE $1 = $2 ORDER BY id ASC'
    return pool.query(query, [constraint, value])
  }
  else {
    const query = 'SELECT * FROM company ORDER BY id ASC'
    return pool.query(query)
  }
}

const findOne = (constraint, value) => {
  const query = 'SELECT * FROM company WHERE $1 = $2'
  return pool.query(query, [constraint, value])
}

const create = ( githubId, name, description, picture_url) => {
  
    const query = 'INSERT INTO company ( githubId, name, description, picture_url) VALUES ($1, $2, $3, $4) RETURNING *'
    return pool.query(query, [ githubId, name, description, picture_url])
  }
  
const update = (id, githubId, name, description, picture_url) => {
    const query = 'UPDATE company SET githubId = $2, name = $3, description = $4, picture_url = $5 WHERE id = $1'
    return pool.query(query, [id, githubId, name, description, picture_url])
  }
  
const deleteCompany = (constraint, value) => {
    const query = 'DELETE FROM company WHERE $1 = $2'
    return pool.query(query, [constraint, value])
  }
export default {
  findAll,
  findOne,
  create,
  update,
  deleteCompany
}
