export function validateAssignment(input) {
  const errors = []

  if (
    !Number.isInteger(input?.course_id) ||
    input.course_id <= 0
  ) {
    errors.push('Course ID must be a positive integer')
  }

  if (
    input?.topic_id != null &&
    (!Number.isInteger(input.topic_id) || input.topic_id <= 0)
  ) {
    errors.push('Topic ID must be a positive integer')
  }

  if (
    !Number.isInteger(input?.created_by) ||
    input.created_by <= 0
  ) {
    errors.push('Creator ID must be a positive integer')
  }

  if (
    input?.priority != null &&
    (!Number.isInteger(input.priority) || input.priority <= 0)
  ) {
    errors.push('Priority must be a positive integer')
  }

  if (
    typeof input?.title !== 'string' ||
    input.title.trim().length === 0
  ) {
    errors.push('Assignment title is required')
  }

  if (
    input?.description != null &&
    typeof input.description !== 'string'
  ) {
    errors.push('Assignment description must be a string')
  }

  const dueDate =
    typeof input?.due_date === 'string' ? new Date(input.due_date) : null

  if (!dueDate || Number.isNaN(dueDate.getTime())) {
    errors.push('Due date must be a valid date')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
