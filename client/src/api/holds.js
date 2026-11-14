// Frontend API layer for the hold catalog. Components call these functions instead of
// building URLs themselves. Set VITE_API_URL to point at a deployed server.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Server rows are snake_case; the wall and footprint code read camelCase, so map once here.
export async function fetchHolds() {
  const response = await fetch(`${API_URL}/api/holds`)
  if (!response.ok) throw new Error(`Could not load holds (${response.status})`)
  const rows = await response.json()
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    holdType: row.hold_type,
    size: row.size,
    color: row.color,
    imageUrl: row.image_url,
  }))
}
