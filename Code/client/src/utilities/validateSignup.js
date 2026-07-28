import { isValidEmail } from './validateLogin'

// Shape check only, for instant feedback before we hit the network. The server
// re-runs every one of these in usersController.createUser and owns the
// uniqueness checks, which the client can't do.
//
// Keep these bounds in step with the constants in that controller — if they
// drift, the user gets a different message depending on which side rejects.
const USERNAME_MIN = 3
const USERNAME_MAX = 50
const PASSWORD_MIN = 8
const PASSWORD_MAX = 72

const hasLegalCharacters = (username) => /^[A-Za-z0-9_-]+$/.test(username)

export const validateSignup = (email, username, password, confirmPassword) => {
  if (!isValidEmail(email)) {
    return 'Enter a valid email address (e.g. name@example.com).'
  }

  const trimmedUsername = username.trim()
  if (trimmedUsername.length < USERNAME_MIN || trimmedUsername.length > USERNAME_MAX) {
    return `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`
  }
  if (!hasLegalCharacters(trimmedUsername)) {
    return 'Username can only contain letters, numbers, hyphens and underscores.'
  }

  if (password.length < PASSWORD_MIN) {
    return `Password must be at least ${PASSWORD_MIN} characters.`
  }
  if (password.length > PASSWORD_MAX) {
    return `Password must be ${PASSWORD_MAX} characters or fewer.`
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.'
  }

  return null
}
