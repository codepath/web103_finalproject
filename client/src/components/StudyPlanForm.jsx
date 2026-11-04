import { useEffect, useState } from 'react'

export default function StudyPlanForm() {
  const [courses, setCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [courseError, setCourseError] = useState('')

  const [form, setForm] = useState({
    course_id: '',
    topic_id: '',
    title: '',
    content: ''
  })

  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCourses() {
      try {
        const response = await fetch('/api/courses', {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Unable to load courses.')
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected course data received.')
        }

        setCourses(data)
        setCourseError('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCourseError(error.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCourses(false)
        }
      }
    }

    loadCourses()

    return () => controller.abort()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))

    setErrors([])
    setSuccess('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = []

    const selectedCourse = courses.find(
      (course) => String(course.id) === form.course_id
    )

    if (!selectedCourse) {
      validationErrors.push('Please select a valid course.')
    }

    if (
      form.topic_id &&
      (!Number.isInteger(Number(form.topic_id)) ||
        Number(form.topic_id) <= 0)
    ) {
      validationErrors.push('Please enter a valid topic ID.')
    }

    if (!form.title.trim()) {
      validationErrors.push('Please enter a study plan title.')
    }

    if (!form.content.trim()) {
      validationErrors.push('Please enter study plan content.')
    }

    setErrors(validationErrors)

    if (validationErrors.length === 0) {
      setSuccess(
        'Study plan validated successfully. Saving will be enabled after user authentication is integrated.'
      )
    }
  }

  return (
    <section className="content-card">
      <h2>Create Study Plan</h2>
      <p>Organize your study goals and notes.</p>

      <form className="study-plan-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="study-course">Course</label>

          <select
            id="study-course"
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            disabled={loadingCourses || Boolean(courseError)}
          >
            <option value="">
              {loadingCourses
                ? 'Loading courses...'
                : 'Select a course'}
            </option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </div>

        {courseError && (
          <p role="alert">{courseError}</p>
        )}

        <div>
          <label htmlFor="study-topic">Topic ID (optional)</label>
          <input
            id="study-topic"
            name="topic_id"
            type="number"
            min="1"
            value={form.topic_id}
            onChange={handleChange}
            placeholder="Enter a topic ID if applicable"
          />
        </div>

        <div>
          <label htmlFor="study-title">Title</label>
          <input
            id="study-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Web Development Exam Preparation"
          />
        </div>

        <div>
          <label htmlFor="study-content">Study Plan Content</label>
          <textarea
            id="study-content"
            name="content"
            rows="6"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your study plan here..."
          />
        </div>

        {errors.length > 0 && (
          <div role="alert">
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {success && (
          <p role="status">{success}</p>
        )}

        <button
          type="submit"
          disabled={loadingCourses || Boolean(courseError)}
        >
          Validate Study Plan
        </button>
      </form>
    </section>
  )
}
