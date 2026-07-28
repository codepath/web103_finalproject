// Shape check only, for instant feedback before we hit the network.
// The server verifies the credentials against the database — see
// usersController.login.
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

export const validateLogin = (email, password) => {
  if (!isValidEmail(email)) {
    return 'Enter a valid email address (e.g. name@example.com).'
  }
  if (!password || password.trim().length === 0) {
    return 'Enter your password.'
  }
  return null
}
