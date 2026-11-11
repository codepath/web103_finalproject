// Turns an ApiError from a create/update/delete into a message for the user.
// 400 responses carry the backend's validation message, which is already
// written for people (e.g. "Task title is required.").
export function describeTaskActionError(error, fallback) {
  if (error.status === 400) {
    return error.message;
  }
  if (error.status === 404) {
    return "Task not found. It may have been deleted.";
  }
  if (error.status === 0) {
    return "Unable to reach the server. Please try again.";
  }
  return fallback;
}
