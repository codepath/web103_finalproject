const variants = {
  backlog: "backlog",
  in_progress: "progress",
  completed: "completed",
};
const labels = {
  backlog: "Backlog",
  in_progress: "In Progress",
  completed: "Completed",
};

// One toast per quest: "Saving…" turns into the result, and a newer update
// replaces an older one.
export const progressKey = (quest) => `progress-${quest.id}`;

// Shows the right toast after a successful progress save: the heading says
// what happened and the detail line names the quest. `fallbackTitle` is used
// when the status did not change (for example, only notes were edited).
export function toastProgress(
  toast,
  quest,
  previousStatus,
  progress,
  fallbackTitle,
) {
  const options = {
    key: progressKey(quest),
    variant: variants[progress.status],
  };
  if (progress.status === previousStatus && fallbackTitle)
    return toast.success(quest.title, { ...options, title: fallbackTitle });
  if (progress.status === "completed")
    return toast.xp(progress.xp_earned, quest.title, {
      ...options,
      title: "Quest complete",
    });
  return toast.success(quest.title, {
    ...options,
    title: `Moved to ${labels[progress.status]}`,
  });
}
