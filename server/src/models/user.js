import { pool } from "../configs/db.config.js";

const findAll = () => {
  const query = "SELECT * FROM users";
  return pool.query(query);
};

const findOne = (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  return pool.query(query, [id]);
};

const create = ({ email, githubId, username, profilePicture, accessToken }) => {
  const query = `
    INSERT INTO users (email, github_id, username, profile_picture, access_token)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  return pool.query(query, [
    email,
    githubId,
    username,
    profilePicture,
    accessToken,
  ]);
};

const update = (id, { role, bio, school_id, subject_id, year }) => {
  const query = `
    UPDATE users
    SET role = $2, bio = $3, school_id = $4, subject_id = $5, year = $6
    WHERE id = $1`;
  return pool.query(query, [id, role, bio, school_id, subject_id, year]);
};

const remove = (id) => {
  const query = "DELETE FROM users WHERE id = $1";
  return pool.query(query, [id]);
};

export default {
  findAll,
  findOne,
  create,
  update,
  remove,
};
