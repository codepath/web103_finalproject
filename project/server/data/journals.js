// Temporary in-memory storage for journals.
// This resets every time the server restarts.

let journals = [];

export function getJournals() {
  return journals;
}

export function addJournal(journal) {
  journals.push(journal);
}

export function getJournalById(id) {
  return journals.find((j) => j.id === id);
}
