import React, { useEffect, useState } from 'react'
import StudyPlanForm from './components/StudyPlanForm.jsx'

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

  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Capture time during initialization to avoid calling
  // an impure function during React rendering.
  const [currentTime] = useState(() => Date.now())

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
                <p>Every assignment across your courses.</p>
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
              <section className="content-card">
                <h2>All assignments</h2>

                {assignments.length > 0 ? (
                  <ul className="item-list">
                    {assignments.map((assignment) => (
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
                    No assignments available.
                  </p>
                )}
              </section>
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
