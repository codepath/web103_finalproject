import pool from '../config/database.js'

const findAll = (constraint, value) => {
  if (value) {
    const query = 'SELECT * FROM users WHERE $1 = $2 ORDER BY id ASC'
    return pool.query(query, [constraint, value])
  }
  else {
    const query = 'SELECT * FROM users ORDER BY id ASC'
    return pool.query(query)
  }
}

const findOne = (constraint, value) => {
  const query = 'SELECT * FROM users WHERE $1 = $2'
  return pool.query(query, [constraint,value])
}

const create = (githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin ) => {
  
    const query = 'INSERT INTO users ( githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    return pool.query(query, [ githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin])
  }
  
const update = (id, githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin) => {
    const query = 'UPDATE users SET githubId = $2, username = $3, avatarUrl = $4, accessToken = $5, savedJobs = $6, Role = $7, is_admin=$8  WHERE id = $1'
    return pool.query(query, [id, githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin])
  }
  
const deleteUser = (constraint,value) => {
    const query = 'DELETE FROM users WHERE $1 = $2'
    return pool.query(query, [constraint, value])
  }
export default {
  findAll,
  findOne,
  create,
  update,
  deleteUser
}