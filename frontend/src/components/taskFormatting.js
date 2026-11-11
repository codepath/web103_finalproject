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
