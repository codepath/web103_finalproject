// gets courses + assignments from App.jsx as props
// onViewAssignments runs when you click the button
export default function CoursesPage({ courses, assignments, onViewAssignments }) {
  // counts how many assignments belong to a course
  const countFor = (courseId) =>
    assignments.filter((a) => a.course_id === courseId).length

  return (
    <section className="content-card">
      <h2>All courses</h2>

      {/* show message if no courses, otherwise the list */}
      {courses.length === 0 ? (
        <p className="empty-message">No courses available.</p>
      ) : (
        <ul className="item-list">
          {/* one row per course */}
          {courses.map((course) => (
            <li key={course.id}>
              <div className="assignment-info">
                <span className="item-name">{course.course_name}</span>
                {/* "1 assignment" vs "2 assignments" */}
                <small>
                  {countFor(course.id)}{' '}
                  {countFor(course.id) === 1 ? 'assignment' : 'assignments'}
                </small>
              </div>

              {/* sends you to assignments page filtered to this course */}
              <button
                type="button"
                className="reset-filter-button"
                onClick={() => onViewAssignments(course.id)}
              >
                View assignments
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}