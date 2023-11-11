import { pool } from '../config/database.js';

export const getAllPosts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "POST"');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPost = async (req, res) => {
    const { content, userId, title } = req.body;

    try {
        const result = await pool.query('INSERT INTO "POST" (content, userId,title) VALUES ($1, $2, $3) RETURNING *', [content, userId, title]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "POST" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updatePost = async (req, res) => {
    const postId = req.params.id; 
    const { content, title } = req.body; 
  
    try {
      const result = await pool.query(
        'UPDATE "POST" SET content = $1, title = $2 WHERE id = $3 RETURNING *',
        [content, title, postId]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  export const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const result = await pool.query('DELETE FROM "POST" WHERE id = $1', [postId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

