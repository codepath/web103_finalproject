import pool from '../config/database.js'

const findAll = () => {
  
    const query = 'SELECT * FROM post ORDER BY id ASC'
    return pool.query(query)
  
}

const findAllByConstraint = (constraint, value) => {
  if (value) {
    const query = `SELECT * FROM post WHERE ${constraint} = $1 ORDER BY id ASC`
    return pool.query(query, [value])
  }
  
}

const findOne = (constraint, value) => {
  const query = `SELECT * FROM post WHERE ${constraint} = $1`
  return pool.query(query, [value])
}

const create = ( githubId, title, body, likes, pending) => {
  
    const query = 'INSERT INTO post ( githubId, title, body, likes, pending) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    return pool.query(query, [ githubId, title, body, likes, pending])
  }
  
const update = (id, githubId, title, body, likes, pending) => {
    const query = 'UPDATE post SET githubId = $2, title = $3, body = $4, likes = $5, pending = $6 WHERE id = $1'
    return pool.query(query, [id, githubId, title, body, likes, pending])
  }
  
const deletePost = (constraint, value) => {
    const query = `DELETE FROM post WHERE ${constraint} = $1`
    return pool.query(query, [value])
  }
export default {
  findAll,
  findAllByConstraint,
  findOne,
  create,
  update,
  deletePost
}