import { pool } from '../config/database.js';

export const getAllResources = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT R.*, T.name as type FROM "RESOURCE" R ' +
            'INNER JOIN "TYPE" T ON R.typeId = T.id'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createResource = async (req, res) => {
    const { link, typeId, userId } = req.body;

    try {
        const resourceResult = await pool.query(
            'INSERT INTO "RESOURCE" (link, typeId) VALUES ($1, $2) RETURNING *', 
            [link, typeId]
        );
        const resourceId = resourceResult.rows[0].id;

        await pool.query(
            'INSERT INTO "USER_RESOURCE" (userId, resourceId) VALUES ($1, $2)', 
            [userId, resourceId]
        );

        res.status(201).json(resourceResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const shareResource = async (req, res) => {
    const { userId, resourceId } = req.body;

    try {
        await pool.query(
            'INSERT INTO "USER_RESOURCE" (userId, resourceId) VALUES ($1, $2) ON CONFLICT (userId, resourceId) DO NOTHING', 
            [userId, resourceId]
        );

        res.status(200).json({ message: 'Resource shared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
