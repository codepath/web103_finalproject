import pool from '../config/database.js'

const findAll = () => {
  
    const query = 'SELECT * FROM users ORDER BY id ASC'
    return pool.query(query)
  
}

const findAllByConstraint = (constraint, value) => {
  if (value) {
    const query = `SELECT * FROM users WHERE ${constraint}= $1 ORDER BY id ASC`
    //console.log(pool.query(query, [constraint, value]))
    return pool.query(query, [ value])
  }
  
}

const findOne = (constraint, value) => {
  
  const query = `SELECT * FROM users WHERE ${constraint}= $1`
  return pool.query(query, [value])
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
    const query = `DELETE FROM users WHERE ${constraint} = $1`
    return pool.query(query, [value])
  }
export default {
  findAll,
  findAllByConstraint,
  findOne,
  create,
  update,
  deleteUser
}