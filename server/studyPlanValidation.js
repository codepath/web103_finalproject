export function validateStudyPlan(input) {
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
    typeof input?.title !== 'string' ||
    input.title.trim().length === 0
  ) {
    errors.push('Study plan title is required')
  }

  if (
    typeof input?.content !== 'string' ||
    input.content.trim().length === 0
  ) {
    errors.push('Study plan content is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
