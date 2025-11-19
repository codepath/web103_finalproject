// Temporary in-memory storage for pages.
// This resets every time the server restarts.

let pages = [];

export function getPages() {
  return pages;
}

export function addPage(page) {
  pages.push(page);
}

export function getPagesByJournalId(journalId) {
  return pages.filter((p) => p.journalId === journalId);
}

export function getPageById(id) {
  return pages.find((p) => p.id === id);
}
