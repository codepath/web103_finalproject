import pool from './db.js'

export async function createStudyPlan({
  course_id,
  topic_id,
  created_by,
  title,
  content
}) {
  // If a topic is provided, verify that it belongs to the selected course.
  if (topic_id != null) {
    const topicResult = await pool.query(
      'SELECT id FROM topics WHERE id = $1 AND course_id = $2',
      [topic_id, course_id]
    )

    if (topicResult.rows.length === 0) {
      const error = new Error('Topic does not belong to the selected course')
      error.code = 'INVALID_TOPIC_COURSE'
      throw error
    }
  }

  // Insert the study plan using a parameterized PostgreSQL query.
  const query = `
    INSERT INTO study_plans (
      course_id,
      topic_id,
      created_by,
      title,
      content
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      course_id,
      topic_id,
      created_by,
      title,
      content,
      created_at,
      updated_at
  `

  const values = [
    course_id,
    topic_id ?? null,
    created_by,
    title.trim(),
    content.trim()
  ]

  const result = await pool.query(query, values)

  return result.rows[0]
}
