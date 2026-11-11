const PRIORITY_LABELS = { low: "Low", medium: "Medium", high: "High" };

export function formatPriority(priority) {
  return PRIORITY_LABELS[priority] ?? priority;
}

// due_date arrives as "YYYY-MM-DD". Parse it as a local calendar date so it
// is not shifted a day by the browser's timezone.
export function formatDueDate(dueDate) {
  if (!dueDate) {
    return "No due date";
  }

  const [year, month, day] = dueDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Today's date as "YYYY-MM-DD" in the user's local timezone.
export function todayDateString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// "YYYY-MM-DD" strings compare correctly as plain strings.
export function isOverdue(task, today = todayDateString()) {
  return !task.completed && task.due_date !== null && task.due_date < today;
}
