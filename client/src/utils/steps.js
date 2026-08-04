// recipes.instructions is a single TEXT column, so split it into steps on new lines
const toSteps = (instructions) => {
  if (!instructions) return []
  return instructions
    .split('\n')
    .map((step) => step.trim())
    .filter((step) => step.length > 0)
}

export default toSteps
