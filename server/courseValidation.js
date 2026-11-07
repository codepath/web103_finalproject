export function validateCourse(input) {
  const errors = []

  if (
    typeof input?.course_name !== 'string' ||
    input.course_name.trim().length === 0
  ) {
    errors.push('Course name is required')
  }

  if (
    !Number.isInteger(input?.ta_id) ||
    input.ta_id <= 0
  ) {
    errors.push('TA ID must be a positive integer')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
