import React, { useEffect, useState } from 'react'
import StudyPlanForm from './components/StudyPlanForm.jsx'

const courses = [
  { id: 1, name: 'Biology 101' },
  { id: 2, name: 'Calculus 200' },
  { id: 3, name: 'English 110' },
  { id: 4, name: 'Computer Science 201' }
]

const assignments = [
  { id: 1, title: 'Lab report', course: 'Biology 101', due: 'Friday' },
  { id: 2, title: 'Quiz 2', course: 'Calculus 200', due: 'Monday' },
  { id: 3, title: 'Reading response', course: 'English 110', due: 'Tuesday' }
]

function App() {
  const [health, setHealth] = useState('checking...')
  const [page, setPage] = useState('dashboard')
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Independent filter for the Assignments page
  const [assignmentCourseFilter, setAssignmentCourseFilter] = useState('all')

  // Existing Dashboard filtering
  const visibleAssignments = selectedCourse
    ? assignments.filter(
        (assignment) => assignment.course === selectedCourse
      )
    : assignments

  // Assignments page filtering
  const filteredPageAssignments =
    assignmentCourseFilter === 'all'
      ? assignments
      : assignments.filter(
          (assignment) => assignment.course === assignmentCourseFilter
        )

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(`${data.status} (db: ${data.db})`))
      .catch(() => setHealth('unreachable'))
  }, [])

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
            className={page === 'dashboard' ? 'nav-link active' : 'nav-link'}
            aria-current={page === 'dashboard' ? 'page' : undefined}
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </button>

          <span className="nav-link">Courses</span>

          <button
            type="button"
            className={page === 'assignments' ? 'nav-link active' : 'nav-link'}
            aria-current={page === 'assignments' ? 'page' : undefined}
            onClick={() => setPage('assignments')}
          >
            Assignments
          </button>

          <button
            type="button"
            className={page === 'study-plans' ? 'nav-link active' : 'nav-link'}
            aria-current={page === 'study-plans' ? 'page' : undefined}
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

            <section className="summary-grid" aria-label="Dashboard summary">
              <article className="summary-card purple">
                <div className="summary-icon" aria-hidden="true">
                  📚
                </div>
                <div>
                  <p>My courses</p>
                  <strong>{courses.length}</strong>
                </div>
              </article>

              <article className="summary-card peach">
                <div className="summary-icon" aria-hidden="true">
                  ✓
                </div>
                <div>
                  <p>Upcoming assignments</p>
                  <strong>{visibleAssignments.length}</strong>
                </div>
              </article>

              <article className="summary-card green">
                <div className="summary-icon" aria-hidden="true">
                  📝
                </div>
                <div>
                  <p>Study plans</p>
                  <strong>0</strong>
                </div>
              </article>
            </section>

            <section className="content-grid">
              <article className="content-card">
                <h2>My courses</h2>

                <ul className="item-list">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <button
                        type="button"
                        className="course-button"
                        aria-pressed={selectedCourse === course.name}
                        onClick={() =>
                          setSelectedCourse(
                            selectedCourse === course.name
                              ? null
                              : course.name
                          )
                        }
                      >
                        {course.name}
                      </button>

                      <span className="item-tag">Course</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="content-card">
                <h2>Due soon</h2>

                {selectedCourse && (
                  <div className="course-filter">
                    <p>
                      Showing assignments for{' '}
                      <strong>{selectedCourse}</strong>
                    </p>

                    <button
                      type="button"
                      className="reset-filter-button"
                      onClick={() => setSelectedCourse(null)}
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
                          <small>{assignment.course}</small>
                        </div>

                        <span className="item-tag due-tag">
                          {assignment.due}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-message">
                    No upcoming assignments for this course.
                  </p>
                )}
              </article>
            </section>

            <p className="demo-note">
              Demo dashboard — sample data shown until the API is connected.
            </p>
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

            <section className="content-card">
              <h2>All assignments</h2>

              {/* Course filter controls */}
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
                    <option key={course.id} value={course.name}>
                      {course.name}
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
                        <small>{assignment.course}</small>
                      </div>

                      <span className="item-tag due-tag">
                        {assignment.due}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-message">
                  No assignments found for this course.
                </p>
              )}
            </section>
          </>
        )}

        {page === 'study-plans' && (
          <>
            <section className="welcome-section">
              <div>
                <h1>Study Plans</h1>
                <p>Create and organize your study plans for each course.</p>
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
