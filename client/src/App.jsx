import React, { useEffect, useState } from 'react'
import StudyPlanForm from './components/StudyPlanForm.jsx'

const emptyForm = {
  course_id: '',
  priority: '',
  title: '',
  description: '',
  due_date: ''
}

const formatDue = (due) => {
  if (!due) return 'No due date'

  const date = new Date(due)

  if (Number.isNaN(date.getTime())) return 'Invalid date'

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function App() {
  const [health, setHealth] = useState('checking...')
  const [page, setPage] = useState('dashboard')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentTime] = useState(() => Date.now())
  const [assignmentCourseFilter, setAssignmentCourseFilter] = useState('all')

  // Assignments page filtering
  const filteredPageAssignments =
    assignmentCourseFilter === 'all'
      ? assignments
      : assignments.filter(
          (assignment) => String(assignment.course_id) === assignmentCourseFilter
        )

  useEffect(() => {
    const controller = new AbortController()

    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health', {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Health check failed')
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          setHealth(`${data.status} (db: ${data.db})`)
        }
      } catch {
        if (!controller.signal.aborted) {
          setHealth('unreachable')
        }
      }
    }

    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const coursesResponse = await fetch('/api/courses', {
          signal: controller.signal
        })

        if (!coursesResponse.ok) {
          throw new Error('Could not load courses')
        }

        const courseData = await coursesResponse.json()

        if (!Array.isArray(courseData)) {
          throw new Error('Invalid courses response')
        }

        const assignmentLists = await Promise.all(
          courseData.map(async (course) => {
            const response = await fetch(
              `/api/courses/${course.id}/assignments`,
              { signal: controller.signal }
            )

            if (!response.ok) {
              throw new Error(
                `Could not load assignments for ${course.course_name}`
              )
            }

            const data = await response.json()

            if (!Array.isArray(data)) {
              throw new Error('Invalid assignments response')
            }

            return data
          })
        )

        const allAssignments = assignmentLists
          .flat()
          .sort(
            (a, b) =>
              new Date(a.due_date).getTime() -
              new Date(b.due_date).getTime()
          )

        if (!controller.signal.aborted) {
          setCourses(courseData)
          setAssignments(allAssignments)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err.message || 'Could not load dashboard data'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadHealth()
    loadDashboard()

    return () => controller.abort()
  }, [])

  const courseName = (id) =>
    courses.find((course) => course.id === id)?.course_name ??
    'Unknown course'

    const updateField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value })

  const submitAssignment = async (event) => {
    event.preventDefault()
    setFormErrors([])
    setSuccess('')

    if (submitting) return
    setSubmitting(true)

    // TEMPORARY: no auth yet, so the course's TA stands in as creator.
    // Replace with the logged-in user's id once auth exists.
    const course = courses.find((c) => c.id === Number(form.course_id))

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course ? course.id : null,
          created_by: course ? course.ta_id : null,
          priority: form.priority === '' ? null : Number(form.priority),
          title: form.title,
          description: form.description === '' ? null : form.description,
          due_date: form.due_date
        })
      })
      const data = await res.json()

      if (!res.ok) {
        setFormErrors(data.errors ?? [data.error ?? 'Could not create assignment'])
        return
      }

      setAssignments((prev) =>
        [...prev, data].sort(
          (a, b) => new Date(a.due_date) - new Date(b.due_date)
        )
      )
      setForm(emptyForm)
      setSuccess(`Created "${data.title}"`)
    } catch {
      setFormErrors(['Server unreachable'])
    } finally {
      setSubmitting(false)
    }
  }

  const upcomingAssignments = assignments.filter((assignment) => {
    if (!assignment.due_date) return false

    const dueDate = new Date(assignment.due_date)

    return (
      !Number.isNaN(dueDate.getTime()) &&
      dueDate.getTime() >= currentTime
    )
  })

  const visibleAssignments =
    selectedCourse === null
      ? upcomingAssignments
      : upcomingAssignments.filter(
          (assignment) => assignment.course_id === selectedCourse
        )

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true" />
          <span>StudySync</span>
        </div>

        <nav className="navigation" aria-label="Main navigation">
          <button
            type="button"
            className={
              page === 'dashboard'
                ? 'nav-link active'
                : 'nav-link'
            }
            aria-current={
              page === 'dashboard' ? 'page' : undefined
            }
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </button>

          <span className="nav-link">Courses</span>

          <button
            type="button"
            className={
              page === 'assignments'
                ? 'nav-link active'
                : 'nav-link'
            }
            aria-current={
              page === 'assignments' ? 'page' : undefined
            }
            onClick={() => setPage('assignments')}
          >
            Assignments
          </button>

          <button
            type="button"
            className={
              page === 'study-plans'
                ? 'nav-link active'
                : 'nav-link'
            }
            aria-current={
              page === 'study-plans' ? 'page' : undefined
            }
            onClick={() => setPage('study-plans')}
          >
            Study Plans
          </button>
        </nav>

        <div className="profile-avatar" aria-label="Demo user">
          ME
        </div>
      </header>

      <main className="dashboard">
        {page === 'dashboard' && (
          <>
            <section className="welcome-section">
              <div>
                <h1>Good morning!</h1>
                <p>Here is your coursework at a glance.</p>
              </div>
            </section>

            {error && (
              <p className="empty-message" role="alert">
                {error}
              </p>
            )}

            {loading ? (
              <p role="status">Loading dashboard...</p>
            ) : error ? (
              <p className="empty-message" role="status">
                Dashboard data is unavailable. Please try
                refreshing the page.
              </p>
            ) : (
              <>
                <section
                  className="summary-grid"
                  aria-label="Dashboard summary"
                >
                  <article className="summary-card purple">
                    <div
                      className="summary-icon"
                      aria-hidden="true"
                    >
                      📚
                    </div>

                    <div>
                      <p>My courses</p>
                      <strong>{courses.length}</strong>
                    </div>
                  </article>

                  <article className="summary-card peach">
                    <div
                      className="summary-icon"
                      aria-hidden="true"
                    >
                      ✓
                    </div>

                    <div>
                      <p>Upcoming assignments</p>
                      <strong>{visibleAssignments.length}</strong>
                    </div>
                  </article>

                  <article className="summary-card green">
                    <div
                      className="summary-icon"
                      aria-hidden="true"
                    >
                      📝
                    </div>

                    <div>
                      <p>Study plans</p>
                      <strong>—</strong>
                    </div>
                  </article>
                </section>

                <section className="content-grid">
                  <article className="content-card">
                    <h2>My courses</h2>

                    {courses.length === 0 ? (
                      <p className="empty-message">
                        No courses available.
                      </p>
                    ) : (
                      <ul className="item-list">
                        {courses.map((course) => (
                          <li key={course.id}>
                            <button
                              type="button"
                              className="course-button"
                              aria-pressed={
                                selectedCourse === course.id
                              }
                              onClick={() =>
                                setSelectedCourse(
                                  selectedCourse === course.id
                                    ? null
                                    : course.id
                                )
                              }
                            >
                              {course.course_name}
                            </button>

                            <span className="item-tag">
                              Course
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>

                  <article className="content-card">
                    <h2>Due soon</h2>

                    {selectedCourse !== null && (
                      <div className="course-filter">
                        <p>
                          Showing assignments for{' '}
                          <strong>
                            {courseName(selectedCourse)}
                          </strong>
                        </p>

                        <button
                          type="button"
                          className="reset-filter-button"
                          onClick={() =>
                            setSelectedCourse(null)
                          }
                        >
                          Show all courses
                        </button>
                      </div>
                    )}

                    {visibleAssignments.length > 0 ? (
                      <ul className="item-list">
                        {visibleAssignments.map((assignment) => (
                          <li key={assignment.id}>
                            <div className="assignment-info">
                              <span className="item-name">
                                {assignment.title}
                              </span>

                              <small>
                                {courseName(
                                  assignment.course_id
                                )}
                              </small>
                            </div>

                            <span className="item-tag due-tag">
                              {formatDue(
                                assignment.due_date
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-message">
                        {selectedCourse !== null
                          ? 'No upcoming assignments for this course.'
                          : 'No upcoming assignments.'}
                      </p>
                    )}
                  </article>
                </section>
              </>
            )}
          </>
        )}

        {page === 'assignments' && (
          <>
            <section className="welcome-section">
              <div>
                <h1>Assignments</h1>
                <p>Create assignments and see what is due.</p>
              </div>
            </section>

            {loading ? (
              <p role="status">
                Loading assignments...
              </p>
            ) : error ? (
              <p
                className="empty-message"
                role="alert"
              >
                {error}
              </p>
            ) : (
              <>
              <section className="content-card">
                <h2>All assignments</h2>

                <div className="course-filter">
                  <label htmlFor="assignment-course-filter">
                    Filter by course
                  </label>
                  <select
                    id="assignment-course-filter"
                    value={assignmentCourseFilter}
                    onChange={(event) =>
                      setAssignmentCourseFilter(event.target.value)
                    }
                  >
                    <option value="all">All Courses</option>
                    {courses.map((course) => (
                      <option key={course.id} value={String(course.id)}>
                        {course.course_name}
                      </option>
                    ))}
                  </select>
                  {assignmentCourseFilter !== 'all' && (
                    <button
                      type="button"
                      className="reset-filter-button"
                      onClick={() => setAssignmentCourseFilter('all')}
                    >
                      Clear filter
                    </button>
                  )}
                </div>

                <p role="status" aria-live="polite">
                  Showing {filteredPageAssignments.length}{' '}
                  {filteredPageAssignments.length === 1
                    ? 'assignment'
                    : 'assignments'}
                </p>

                {filteredPageAssignments.length > 0 ? (
                  <ul className="item-list">
                    {filteredPageAssignments.map((assignment) => (
                      <li key={assignment.id}>
                        <div className="assignment-info">
                          <span className="item-name">
                            {assignment.title}
                          </span>
                          <small>{courseName(assignment.course_id)}</small>
                        </div>
                        <span className="item-tag due-tag">
                          {formatDue(assignment.due_date)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">
                    {assignmentCourseFilter === 'all'
                      ? 'No assignments available.'
                      : 'No assignments found for this course.'}
                  </p>
                )}
              </section>

              <section className="content-card form-card">
                <h2>Create assignment</h2>
                <form className="assignment-form" onSubmit={submitAssignment}>
                  <label>
                    Course
                    <select name="course_id" value={form.course_id} onChange={updateField} required>
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.course_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Title
                    <input name="title" value={form.title} onChange={updateField} required />
                  </label>

                  <label>
                    Due date
                    <input
                      type="datetime-local"
                      name="due_date"
                      value={form.due_date}
                      onChange={updateField}
                      required
                    />
                  </label>

                  <label>
                    Priority
                    <input
                      type="number"
                      min="1"
                      name="priority"
                      value={form.priority}
                      onChange={updateField}
                    />
                  </label>

                  <label className="wide">
                    Description
                    <textarea
                      name="description"
                      rows="3"
                      value={form.description}
                      onChange={updateField}
                    />
                  </label>

                  {formErrors.length > 0 && (
                    <ul className="form-errors wide" role="alert">
                      {formErrors.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  )}
                  {success && <p className="form-success wide" role="status">{success}</p>}

                  <button type="submit" className="wide" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create assignment'}
                  </button>
                </form>
              </section>
              </>
            )}
          </>
        )}

        {page === 'study-plans' && (
          <>
            <section className="welcome-section">
              <div>
                <h1>Study Plans</h1>
                <p>
                  Create and organize your study plans
                  for each course.
                </p>
              </div>
            </section>

            <StudyPlanForm />
          </>
        )}

        <p className="api-status" role="status">
          API status: {health}
        </p>
      </main>
    </div>
  )
}

export default App
