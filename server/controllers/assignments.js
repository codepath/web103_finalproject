import pool from '../db.js'
import { validateAssignment } from '../assignmentValidation.js'

const createAssignment = async (req, res) => {
  const { valid, errors } = validateAssignment(req.body)

  if (!valid) {
    return res.status(400).json({ errors })
  }

  const { course_id, topic_id, created_by, priority, title, description, due_date } = req.body

  try {
    if (topic_id != null) {
      const topic = await pool.query(
        'SELECT 1 FROM topics WHERE id = $1 AND course_id = $2',
        [topic_id, course_id]
      )

      if (topic.rowCount === 0) {
        return res.status(400).json({ errors: ['Topic does not belong to the course'] })
      }
    }

    const result = await pool.query(
      `INSERT INTO assignments (course_id, topic_id, created_by, priority, title, description, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [course_id, topic_id ?? null, created_by, priority ?? null, title.trim(), description ?? null, due_date]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    // 23503 = foreign key violation: the course or creator does not exist
    if (err.code === '23503') {
      return res.status(400).json({ errors: ['Course or creator does not exist'] })
    }

    console.error('Create assignment failed:', err.message)
    res.status(500).json({ error: 'Could not create assignment' })
  }
}

export default {
  createAssignment
}
