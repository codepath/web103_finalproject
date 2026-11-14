export function prettyDate(iso, opts = { weekday: "short", month: "short", day: "numeric" }) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, opts);
}

// 2 -> "2", 1.5 -> "1.5"
export const fmtQty = (n) => (Number.isInteger(n) ? n : Math.round(n * 100) / 100);
