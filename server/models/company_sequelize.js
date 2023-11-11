import pool from '../config/database.js'

const findAll = () => {
  
    const query = 'SELECT * FROM company ORDER BY id ASC'
    return pool.query(query)
  
}

const findAllByConstraint = (constraint, value) => {
  if (value) {
    const query = `SELECT * FROM company WHERE ${constraint} = $1 ORDER BY id ASC`
    return pool.query(query, [value])
  }
  else {
    const query = 'SELECT * FROM company ORDER BY id ASC'
    return pool.query(query)
  }
}

const findOne = (constraint, value) => {
  const query = `SELECT * FROM company WHERE ${constraint} = $1`
  return pool.query(query, [value])
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
    const query = `DELETE FROM company WHERE ${constraint} = $1`
    return pool.query(query, [value])
  }
export default {
  findAll,
  findAllByConstraint,
  findOne,
  create,
  update,
  deleteCompany
}
