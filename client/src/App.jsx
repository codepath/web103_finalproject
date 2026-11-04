import React, { useEffect, useState } from 'react'

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
  const [selectedCourse, setSelectedCourse] = useState(null)

  const visibleAssignments = selectedCourse
    ? assignments.filter(
        (assignment) => assignment.course === selectedCourse
      )
    : assignments

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
          <span className="nav-link active" aria-current="page">
            Dashboard
          </span>
          <span className="nav-link">Courses</span>
          <span className="nav-link">Assignments</span>
          <span className="nav-link">Study Plans</span>
        </nav>

        <div className="profile-avatar" aria-label="Demo user">
          ME
        </div>
      </header>

      <main className="dashboard">
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

        <p className="api-status" role="status">
          API status: {health}
        </p>
      </main>
    </div>
  )
}

export default App
