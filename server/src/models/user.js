import { pool } from "../configs/db.config.js";

const findAll = () => {
  const query = "SELECT * FROM users";
  return pool.query(query);
};

const findOne = (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  return pool.query(query, [id]);
};

const findOneByGithubId = (githubId) => {
  const query = "SELECT * FROM users WHERE github_id = $1";
  return pool.query(query, [githubId]);
};

const create = ({ email, githubId, username, profilePicture }) => {
  const query = `
    INSERT INTO users (email, github_id, username, profile_picture)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  return pool.query(query, [email, githubId, username, profilePicture]);
};

const update = (id, { role, bio, school_id, subject_id, year }) => {
  const query = `
    UPDATE users
    SET role = $2, bio = $3, school_id = $4, subject_id = $5, year = $6
    WHERE id = $1
    RETURNING *
  `;
  return pool.query(query, [id, role, bio, school_id, subject_id, year]);
};

const remove = (id) => {
  const query = "DELETE FROM users WHERE id = $1";
  return pool.query(query, [id]);
};

export default {
  findAll,
  findOne,
  findOneByGithubId,
  create,
  update,
  remove,
};
