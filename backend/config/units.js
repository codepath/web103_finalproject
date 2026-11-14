// The one list of units used for pantry items (and, later, recipes and shopping lists).
export const UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pieces"];

// Units that can be added together: [base unit, how many base units one of these is]

const BASE = {
  g: ["g", 1],
  kg: ["g", 1000],

  ml: ["ml", 1],
  l: ["ml", 1000],
  tsp: ["ml", 5],
  tbsp: ["ml", 15],
  cup: ["ml", 240]
};


// Converts a quantity to another unit of the same kind (e.g. 3 kg -> 3000 g).
// Returns null when the units can't be added together (e.g. cup and g).
export function convert(quantity, from, to) {
  if (from === to) return quantity;
  const [baseFrom, f] = BASE[from] || [];
  const [baseTo, t] = BASE[to] || [];
  if (!baseFrom || baseFrom !== baseTo) return null;
  return (quantity * f) / t;
}
