import express from 'express'
import pool from './db.js'
import { validateStudyPlan } from './studyPlanValidation.js'
import { createStudyPlan } from './studyPlanQueries.js'
import { validateCourse } from './courseValidation.js'
import assignmentRoutes from './routes/assignments.js'

// Builds the app without starting it.
// server.js starts listening on a port.
const app = express()

// Parse JSON request bodies for API endpoints
app.use(express.json())

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', db: 'ok' })
  } catch (err) {
    console.error('Health check failed:', err.message)
    res.status(503).json({
      status: 'error',
      db: 'unreachable'
    })
  }
})

// GET all courses
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, course_name, ta_id, created_at
      FROM courses
      ORDER BY id ASC
    `)

    return res.status(200).json(result.rows)
  } catch (error) {
    console.error('Error fetching courses:', error)

    return res.status(500).json({
      error: 'Failed to fetch courses'
    })
  }
})

// GET assignments belonging to a course
// This route is placed before /api/courses/:id for clarity.
app.get('/api/courses/:id/assignments', async (req, res) => {
  const courseId = Number(req.params.id)

  if (!Number.isSafeInteger(courseId) || courseId <= 0) {
    return res.status(400).json({
      error: 'Invalid course ID'
    })
  }

  try {
    const courseResult = await pool.query(
      'SELECT id FROM courses WHERE id = $1',
      [courseId]
    )

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Course not found'
      })
    }

    const assignmentResult = await pool.query(
      `SELECT
        id,
        course_id,
        topic_id,
        created_by,
        priority,
        title,
        description,
        due_date,
        created_at,
        updated_at
       FROM assignments
       WHERE course_id = $1
       ORDER BY due_date ASC, id ASC`,
      [courseId]
    )

    return res.status(200).json(assignmentResult.rows)
  } catch (error) {
    console.error('Error fetching course assignments:', error)

    return res.status(500).json({
      error: 'Failed to fetch course assignments'
    })
  }
})

// GET a single course
app.get('/api/courses/:id', async (req, res) => {
  const courseId = Number(req.params.id)

  if (!Number.isSafeInteger(courseId) || courseId <= 0) {
    return res.status(400).json({
      error: 'Invalid course ID'
    })
  }

  try {
    const result = await pool.query(
      `SELECT id, course_name, ta_id, created_at
       FROM courses
       WHERE id = $1`,
      [courseId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Course not found'
      })
    }

    return res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Error fetching course:', error)

    return res.status(500).json({
      error: 'Failed to fetch course'
    })
  }
})

// POST create a course
app.post('/api/courses', async (req, res) => {
  const validation = validateCourse(req.body)

  if (!validation.valid) {
    return res.status(400).json({
      errors: validation.errors
    })
  }

  try {
    const { course_name, ta_id } = req.body

    const result = await pool.query(
      `INSERT INTO courses (course_name, ta_id)
       VALUES ($1, $2)
       RETURNING id, course_name, ta_id, created_at`,
      [course_name.trim(), ta_id]
    )

    return res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Referenced TA does not exist'
      })
    }

    console.error('Error creating course:', error)

    return res.status(500).json({
      error: 'Failed to create course'
    })
  }
})

app.use('/api/assignments', assignmentRoutes)
// Study Plan Creation: validate and save a study plan
app.post('/api/study-plans', async (req, res) => {
  const result = validateStudyPlan(req.body)

  if (!result.valid) {
    return res.status(400).json({
      errors: result.errors
    })
  }

  try {
    const { course_id, topic_id, created_by, title, content } = req.body

    const studyPlan = await createStudyPlan({
      course_id,
      topic_id,
      created_by,
      title,
      content
    })

    return res.status(201).json(studyPlan)
  } catch (error) {
    // The topic exists but does not belong to the selected course,
    // or the topic does not exist.
    if (error.code === 'INVALID_TOPIC_COURSE') {
      return res.status(400).json({
        error: 'Topic does not belong to the selected course'
      })
    }

    // PostgreSQL foreign-key violation
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Referenced course, topic, or user does not exist'
      })
    }

    console.error('Error creating study plan:', error)

    return res.status(500).json({
      error: 'Failed to create study plan'
    })
  }
})

export default app
