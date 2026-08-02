// pg parses DATE columns into JS Date objects at local midnight, while
// request bodies give plain "YYYY-MM-DD" strings (parsed elsewhere as UTC
// midnight if ever turned into a Date). Comparing those two forms directly
// with `new Date(a) < new Date(b)` can misjudge the same calendar date as
// earlier/later. Normalize both to a "YYYY-MM-DD" string first and compare
// those instead, since it sorts identically to chronological order.
const toDateOnly = (value) => {
  if (value instanceof Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return value;
};

const isDateBefore = (a, b) => toDateOnly(a) < toDateOnly(b);
const isDateAfter = (a, b) => toDateOnly(a) > toDateOnly(b);

export { isDateBefore, isDateAfter };
