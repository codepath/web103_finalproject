
// ============================================
// PREPWISE SUPPORTED MEASUREMENT UNITS
// ============================================

export const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "pieces",
  "cloves",
  "slices",
  "bulb",
  "bunch",
  "sprigs",
  "pinch",
  "stalks",
];

// Compatible measurement conversions.

const BASE = {
  g: ["g", 1],
  kg: ["g", 1000],

  ml: ["ml", 1],
  l: ["ml", 1000],
  tsp: ["ml", 5],
  tbsp: ["ml", 15],
  cup: ["ml", 240],
};

// ============================================
// CONVERT COMPATIBLE UNITS
// ============================================

export function convert(quantity, from, to) {
  if (from === to) {
    return quantity;
  }

  const [baseFrom, f] = BASE[from] || [];

  const [baseTo, t] = BASE[to] || [];

  // Incompatible units cannot be converted
  // without additional ingredient information.

  if (!baseFrom || baseFrom !== baseTo) {
    return null;
  }

  return (quantity * f) / t;
}
